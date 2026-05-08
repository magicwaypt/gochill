import { NextRequest, NextResponse } from 'next/server'

import { INVALID_RECEIPT_MESSAGE } from '@/lib/participation-validation'
import { validateReceiptImage } from '@/lib/receipt-validation'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const talaoEntry = formData.get('talao')
    const talaoFile = talaoEntry instanceof File && talaoEntry.size > 0 ? talaoEntry : null

    if (!talaoFile) {
      return NextResponse.json(
        {
          code: 'missing_receipt_image',
          error: 'Seleciona uma imagem de talão ou fatura.',
        },
        { status: 400 }
      )
    }

    if (!talaoFile.type.startsWith('image/')) {
      return NextResponse.json(
        {
          code: 'invalid_receipt_type',
          error: 'O talão ou fatura tem de ser enviado como imagem.',
        },
        { status: 400 }
      )
    }

    const validationResult = await validateReceiptImage(talaoFile)

    if (validationResult.status === 'unavailable') {
      return NextResponse.json(
        {
          code: 'receipt_validation_unavailable',
          error: 'Não foi possível validar o talão neste momento. Tenta novamente dentro de instantes.',
        },
        { status: 503 }
      )
    }

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          code: 'invalid_receipt_image',
          error: INVALID_RECEIPT_MESSAGE,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error validating receipt image:', error)
    return NextResponse.json(
      {
        code: 'receipt_validation_failed',
        error: 'Não foi possível validar o talão neste momento. Tenta novamente.',
      },
      { status: 500 }
    )
  }
}