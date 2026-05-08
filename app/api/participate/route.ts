import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { INVALID_RECEIPT_MESSAGE, isValidTelemovel, normalizeTelemovel } from '@/lib/participation-validation'
import { participations, submissionAttempts } from '@/lib/schema'
import { validateReceiptImage } from '@/lib/receipt-validation'

export async function POST(request: NextRequest) {
  let hasTalao = false
  let hasFoto = false

  const logSubmissionAttempt = async (outcome: 'accepted' | 'rejected', rejectionReason?: string) => {
    try {
      await db.insert(submissionAttempts).values({
        hasTalao,
        hasFoto,
        outcome,
        rejectionReason,
      })
    } catch (loggingError) {
      console.error('Error logging submission attempt:', loggingError)
    }
  }

  try {
    const formData = await request.formData()

    const talaoEntry = formData.get('talao')
    const fotoEntry = formData.get('foto')

    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const telemovel = normalizeTelemovel((formData.get('telemovel') as string) || '')
    const talaoFile = talaoEntry instanceof File && talaoEntry.size > 0 ? talaoEntry : null
    const fotoFile = fotoEntry instanceof File && fotoEntry.size > 0 ? fotoEntry : null
    const aceiteMaior18 = formData.get('aceiteMaior18') === 'true'
    const aceiteTermos = formData.get('aceiteTermos') === 'true'
    const aceitePrivacidade = formData.get('aceitePrivacidade') === 'true'
    const aceiteMarketing = formData.get('aceiteMarketing') === 'true'

    hasTalao = talaoFile !== null
    hasFoto = fotoFile !== null

    // Validate required fields
    if (!nome || !email || !telemovel || !talaoFile || !fotoFile || !aceiteMaior18 || !aceiteTermos || !aceitePrivacidade) {
      await logSubmissionAttempt('rejected', 'missing_required_fields')
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    if (!isValidTelemovel(telemovel)) {
      await logSubmissionAttempt('rejected', 'invalid_phone_number')
      return NextResponse.json(
        {
          code: 'invalid_phone_number',
          error: 'O número de telemóvel deve ter exatamente 9 algarismos.',
        },
        { status: 400 }
      )
    }

    if (!talaoFile.type.startsWith('image/')) {
      await logSubmissionAttempt('rejected', 'invalid_receipt_type')
      return NextResponse.json(
        {
          code: 'invalid_receipt_type',
          error: 'O talão ou fatura tem de ser enviado como imagem.',
        },
        { status: 400 }
      )
    }

    if (!fotoFile.type.startsWith('image/')) {
      await logSubmissionAttempt('rejected', 'invalid_photo_type')
      return NextResponse.json(
        {
          code: 'invalid_photo_type',
          error: 'A fotografia com Go Chill tem de ser enviada como imagem.',
        },
        { status: 400 }
      )
    }

    const receiptValidation = await validateReceiptImage(talaoFile)

    if (receiptValidation.status === 'unavailable') {
      await logSubmissionAttempt('rejected', 'receipt_validation_unavailable')
      return NextResponse.json(
        {
          code: 'receipt_validation_unavailable',
          error: 'Não foi possível validar o talão neste momento. Tenta novamente dentro de instantes.',
        },
        { status: 503 }
      )
    }

    if (!receiptValidation.isValid) {
      await logSubmissionAttempt('rejected', 'invalid_receipt_image')
      return NextResponse.json(
        {
          code: 'invalid_receipt_image',
          error: INVALID_RECEIPT_MESSAGE,
        },
        { status: 400 }
      )
    }

    // Convert files to base64
    const talaoBuffer = await talaoFile.arrayBuffer()
    const talaoBase64 = Buffer.from(talaoBuffer).toString('base64')

    const fotoBuffer = await fotoFile.arrayBuffer()
    const fotoBase64 = Buffer.from(fotoBuffer).toString('base64')

    // Insert into database
    await db.insert(participations).values({
      nome,
      email,
      telemovel,
      talaoBlob: talaoBase64,
      fotoBlob: fotoBase64,
      aceiteMaior18,
      aceiteTermos,
      aceitePrivacidade,
      aceiteMarketing,
    })

    await logSubmissionAttempt('accepted')

    return NextResponse.json({ success: true, message: 'Participação registada com sucesso!' })

  } catch (error) {
    console.error('Error saving participation:', error)
    await logSubmissionAttempt('rejected', 'server_error')
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}