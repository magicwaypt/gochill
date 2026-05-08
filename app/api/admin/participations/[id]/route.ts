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
    const { status, notes } = await request.json()
    const participationId = parseInt(id)

    if (!participationId || isNaN(participationId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    if (status !== undefined && !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido. Deve ser: pending, approved, ou rejected' },
        { status: 400 }
      )
    }

    if (notes !== undefined && notes !== null && typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Notas inválidas' },
        { status: 400 }
      )
    }

    const updates: { status?: string; notes?: string | null } = {}

    if (status !== undefined) {
      updates.status = status
    }

    if (notes !== undefined) {
      const normalizedNotes = typeof notes === 'string' ? notes.trim() : ''
      updates.notes = normalizedNotes.length > 0 ? normalizedNotes : null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nada para atualizar' },
        { status: 400 }
      )
    }

    await db
      .update(participations)
      .set(updates)
      .where(eq(participations.id, participationId))

    return NextResponse.json({
      success: true,
      message: 'Participação atualizada com sucesso'
    })

  } catch (error) {
    console.error('Error updating participation status:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}