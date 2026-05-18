import { eq, or } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { buildD365CustomerPayload, createUpdateCustomer } from '@/lib/d365'
import { participations } from '@/lib/schema'

export async function POST(_request: NextRequest) {
  try {
    const candidates = await db.query.participations.findMany({
      where: or(
        eq(participations.d365SyncStatus, 'pending'),
        eq(participations.d365SyncStatus, 'failed')
      ),
      columns: {
        id: true,
        nome: true,
        email: true,
        telemovel: true,
        aceiteMarketing: true,
        d365SyncStatus: true,
      },
    })

    let attempted = 0
    let succeeded = 0
    let failed = 0

    for (const participation of candidates) {
      attempted += 1

      try {
        const payload = buildD365CustomerPayload(participation)
        const result = await createUpdateCustomer(payload)

        if (result.ok) {
          succeeded += 1
          try {
            await db
              .update(participations)
              .set({
                d365SyncStatus: 'success',
                d365AccountNumber: result.accountNumber ?? null,
                d365SyncError: null,
                d365SyncedAt: new Date(),
              })
              .where(eq(participations.id, participation.id))
          } catch (statusUpdateError) {
            console.error('Failed to persist D365 success status', statusUpdateError)
          }
        } else {
          failed += 1
          try {
            await db
              .update(participations)
              .set({
                d365SyncStatus: 'failed',
                d365SyncError: result.error,
              })
              .where(eq(participations.id, participation.id))
          } catch (statusUpdateError) {
            console.error('Failed to persist D365 failed status', statusUpdateError)
          }
        }
      } catch (error) {
        failed += 1
        console.error('Bulk D365 sync crashed', error)
        try {
          await db
            .update(participations)
            .set({
              d365SyncStatus: 'failed',
              d365SyncError: error instanceof Error ? `${error.name}:${error.message}` : 'd365_unknown_error',
            })
            .where(eq(participations.id, participation.id))
        } catch (statusUpdateError) {
          console.error('Failed to persist D365 crash status', statusUpdateError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalCandidates: candidates.length,
      attempted,
      succeeded,
      failed,
    })
  } catch (error) {
    console.error('Error bulk syncing participations to D365:', error)
    return NextResponse.json(
      { error: 'Erro ao sincronizar participações com Dynamics 365' },
      { status: 500 }
    )
  }
}

