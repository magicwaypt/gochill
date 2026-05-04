import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { participations } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    const participationId = parseInt(id)

    if (!participationId || isNaN(participationId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido. Deve ser: pending, approved, ou rejected' },
        { status: 400 }
      )
    }

    // Update the participation status
    await db
      .update(participations)
      .set({ status })
      .where(eq(participations.id, participationId))

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso'
    })

  } catch (error) {
    console.error('Error updating participation status:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}