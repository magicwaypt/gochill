import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { participations } from '@/lib/schema'
import { desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // For now, no authentication check - in production you'd want proper auth
    const allParticipations = await db
      .select()
      .from(participations)
      .orderBy(desc(participations.createdAt))

    return NextResponse.json(allParticipations)
  } catch (error) {
    console.error('Error fetching participations:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}