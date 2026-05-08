import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { participations, submissionAttempts } from '@/lib/schema'

const emptyAttemptSummary = {
  totalAttempts: 0,
  successfulAttempts: 0,
  totalRejected: 0,
  invalidReceiptAttempts: 0,
  receiptValidationUnavailableAttempts: 0,
  otherRejectedAttempts: 0,
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

      const totalRejected = allSubmissionAttempts.filter((attempt) => attempt.outcome === 'rejected').length
      const invalidReceiptAttempts = allSubmissionAttempts.filter((attempt) =>
        attempt.rejectionReason === 'invalid_receipt_image' ||
        attempt.rejectionReason === 'invalid_receipt_shape' ||
        attempt.rejectionReason === 'invalid_receipt_type'
      ).length
      const receiptValidationUnavailableAttempts = allSubmissionAttempts.filter(
        (attempt) => attempt.rejectionReason === 'receipt_validation_unavailable'
      ).length

      attemptSummary = {
        totalAttempts: allSubmissionAttempts.length,
        successfulAttempts: allSubmissionAttempts.filter((attempt) => attempt.outcome === 'accepted').length,
        totalRejected,
        invalidReceiptAttempts,
        receiptValidationUnavailableAttempts,
        otherRejectedAttempts: Math.max(
          totalRejected - invalidReceiptAttempts - receiptValidationUnavailableAttempts,
          0
        ),
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