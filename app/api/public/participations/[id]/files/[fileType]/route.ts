import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import {
	isPublicParticipationFileType,
	isValidPublicParticipationFileToken,
} from '@/lib/public-participation-files'
import { participations } from '@/lib/schema'

const getFilePayload = (fileType: 'talao' | 'foto', participation: { talaoBlob: string | null; fotoBlob: string | null }) => {
	if (fileType === 'talao') {
		return {
			base64: participation.talaoBlob,
			filename: 'talao.jpg',
		}
	}

	return {
		base64: participation.fotoBlob,
		filename: 'foto.jpg',
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; fileType: string }> }
) {
	try {
		const { id, fileType } = await params
		const participationId = Number.parseInt(id, 10)
		const expiresAt = Number.parseInt(request.nextUrl.searchParams.get('expires') ?? '', 10)
		const token = request.nextUrl.searchParams.get('token') ?? ''

		if (!participationId || Number.isNaN(participationId)) {
			return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
		}

		if (!isPublicParticipationFileType(fileType)) {
			return NextResponse.json({ error: 'Tipo de ficheiro inválido' }, { status: 400 })
		}

		if (!isValidPublicParticipationFileToken({ participationId, fileType, expiresAt, token })) {
			return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 401 })
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

		if (!filePayload.base64) {
			return NextResponse.json({ error: 'Ficheiro não disponível' }, { status: 404 })
		}

		const fileBuffer = Buffer.from(filePayload.base64, 'base64')

		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'image/jpeg',
				'Content-Disposition': `inline; filename="participacao-${participationId}-${filePayload.filename}"`,
				'Cache-Control': 'public, max-age=3600',
				'X-Robots-Tag': 'noindex, nofollow',
			},
		})
	} catch (error) {
		console.error('Error serving public participation file:', error)
		return NextResponse.json(
			{ error: 'Erro ao obter ficheiro da participação' },
			{ status: 500 }
		)
	}
}