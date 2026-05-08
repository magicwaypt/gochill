import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { participations } from '@/lib/schema'

const getFilePayload = (fileType: string, participation: { talaoBlob: string | null; fotoBlob: string | null }) => {
  if (fileType === 'talao') {
    return {
      base64: participation.talaoBlob,
      filename: 'talao.jpg',
    }
  }

  if (fileType === 'foto') {
    return {
      base64: participation.fotoBlob,
      filename: 'foto.jpg',
    }
  }

  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileType: string }> }
) {
  try {
    const { id, fileType } = await params
    const participationId = Number.parseInt(id, 10)

    if (!participationId || Number.isNaN(participationId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const participation = await db.query.participations.findFirst({
      where: eq(participations.id, participationId),
      columns: {
        talaoBlob: true,
        fotoBlob: true,
      },
    })

    if (!participation) {
      return NextResponse.json({ error: 'Participação não encontrada' }, { status: 404 })
    }

    const filePayload = getFilePayload(fileType, participation)

    if (!filePayload) {
      return NextResponse.json({ error: 'Tipo de ficheiro inválido' }, { status: 400 })
    }

    if (!filePayload.base64) {
      return NextResponse.json({ error: 'Ficheiro não disponível' }, { status: 404 })
    }

    const fileBuffer = Buffer.from(filePayload.base64, 'base64')

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="participacao-${participationId}-${filePayload.filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error serving participation file:', error)
    return NextResponse.json(
      { error: 'Erro ao obter ficheiro da participação' },
      { status: 500 }
    )
  }
}