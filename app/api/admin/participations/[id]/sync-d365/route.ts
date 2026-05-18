import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { buildD365CustomerPayload, createUpdateCustomer } from '@/lib/d365'
import { participations } from '@/lib/schema'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const participationId = Number.parseInt(id, 10)

    if (!participationId || Number.isNaN(participationId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const participation = await db.query.participations.findFirst({
      where: eq(participations.id, participationId),
      columns: {
        id: true,
        nome: true,
        email: true,
        telemovel: true,
        aceiteMarketing: true,
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'Participação não encontrada' }, { status: 404 })
    }

    const payload = buildD365CustomerPayload(participation)
    const result = await createUpdateCustomer(payload)

    if (result.ok) {
      try {
        await db
          .update(participations)
          .set({
            d365SyncStatus: 'success',
            d365AccountNumber: result.accountNumber ?? null,
            d365SyncError: null,
            d365SyncedAt: new Date(),
          })
          .where(eq(participations.id, participationId))
      } catch (statusUpdateError) {
        console.error('Failed to persist D365 success status', statusUpdateError)
      }

      return NextResponse.json({ success: true, accountNumber: result.accountNumber ?? null })
    }

    try {
      await db
        .update(participations)
        .set({
          d365SyncStatus: 'failed',
          d365SyncError: result.error,
        })
        .where(eq(participations.id, participationId))
    } catch (statusUpdateError) {
      console.error('Failed to persist D365 failed status', statusUpdateError)
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 502 })
  } catch (error) {
    console.error('Error resyncing participation to D365:', error)
    return NextResponse.json(
      { error: 'Erro ao sincronizar com Dynamics 365' },
      { status: 500 }
    )
  }
}

