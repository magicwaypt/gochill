import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { submissionAttempts } from '@/lib/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const hasTalao = body?.hasTalao === true
    const hasFoto = body?.hasFoto === true
    const outcome = body?.outcome === 'accepted' ? 'accepted' : 'rejected'
    const rejectionReason = typeof body?.rejectionReason === 'string' ? body.rejectionReason : null

    await db.insert(submissionAttempts).values({
      hasTalao,
      hasFoto,
      outcome,
      rejectionReason,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging submission attempt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}