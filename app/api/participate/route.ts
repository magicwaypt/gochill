import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { participations, submissionAttempts } from '@/lib/schema'

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
    const telemovel = formData.get('telemovel') as string
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