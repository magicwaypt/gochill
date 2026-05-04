import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { participations, submissionAttempts } from '@/lib/schema'

const emptyAttemptSummary = {
  totalAttempts: 0,
  totalWithBoth: 0,
  totalWithTalaoOnly: 0,
  totalWithPhotoOnly: 0,
  totalRejected: 0,
  rejectedWithTalaoOnly: 0,
  rejectedWithPhotoOnly: 0,
  invalidReceiptAttempts: 0,
}

export async function GET() {
  try {
    const allParticipations = await db
      .select()
      .from(participations)
      .orderBy(desc(participations.createdAt))

    let attemptSummary = emptyAttemptSummary

    try {
      const allSubmissionAttempts = await db
        .select()
        .from(submissionAttempts)
        .orderBy(desc(submissionAttempts.createdAt))

      attemptSummary = {
        totalAttempts: allSubmissionAttempts.length,
        totalWithBoth: allSubmissionAttempts.filter((attempt) => attempt.hasTalao && attempt.hasFoto).length,
        totalWithTalaoOnly: allSubmissionAttempts.filter((attempt) => attempt.hasTalao && !attempt.hasFoto).length,
        totalWithPhotoOnly: allSubmissionAttempts.filter((attempt) => attempt.hasFoto && !attempt.hasTalao).length,
        totalRejected: allSubmissionAttempts.filter((attempt) => attempt.outcome === 'rejected').length,
        rejectedWithTalaoOnly: allSubmissionAttempts.filter(
          (attempt) => attempt.outcome === 'rejected' && attempt.hasTalao && !attempt.hasFoto
        ).length,
        rejectedWithPhotoOnly: allSubmissionAttempts.filter(
          (attempt) => attempt.outcome === 'rejected' && attempt.hasFoto && !attempt.hasTalao
        ).length,
        invalidReceiptAttempts: allSubmissionAttempts.filter(
          (attempt) => attempt.rejectionReason === 'invalid_receipt_shape'
        ).length,
      }
    } catch (error) {
      console.warn('Submission attempts stats unavailable, falling back to participations only:', error)
    }

    return NextResponse.json({
      participations: allParticipations,
      attemptSummary,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}