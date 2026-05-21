import { NextRequest, NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import * as XLSX from 'xlsx'

import { db } from '@/lib/db'
import { createPublicParticipationFileUrl } from '@/lib/public-participation-files'
import { participations } from '@/lib/schema'

const formatBoolean = (value: boolean) => (value ? 'Sim' : 'Não')

const formatDateTimeLisbon = (value: Date | string | number) => {
  const date = new Date(value)
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

const formatStatus = (status: string) => {
  if (status === 'approved') {
    return 'Aprovada'
  }

  if (status === 'rejected') {
    return 'Rejeitada'
  }

  return 'Pendente'
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin
    const allParticipations = await db
      .select()
      .from(participations)
      .orderBy(desc(participations.createdAt))

    const rows = allParticipations.map((participation) => ({
      ID: participation.id,
      Nome: participation.nome,
      Email: participation.email,
      Telemovel: participation.telemovel,
      Notas: participation.notes || '',
      Status: formatStatus(participation.status),
      AceiteMaior18: formatBoolean(participation.aceiteMaior18),
      AceiteTermos: formatBoolean(participation.aceiteTermos),
      AceitePrivacidade: formatBoolean(participation.aceitePrivacidade),
      AceiteMarketing: formatBoolean(participation.aceiteMarketing),
      TemTalao: formatBoolean(Boolean(participation.talaoBlob)),
      TemFoto: formatBoolean(Boolean(participation.fotoBlob)),
      TalaoUrl: participation.talaoBlob
        ? createPublicParticipationFileUrl({
            origin,
            participationId: participation.id,
            fileType: 'talao',
          })
        : '',
      FotoUrl: participation.fotoBlob
        ? createPublicParticipationFileUrl({
            origin,
            participationId: participation.id,
            fileType: 'foto',
          })
        : '',
      DataCriacao: formatDateTimeLisbon(participation.createdAt),
    }))

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(rows)

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participacoes')

    const workbookBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    })

    return new NextResponse(workbookBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="participacoes-gochill.xlsx"',
      },
    })
  } catch (error) {
    console.error('Error exporting participations:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar participações' },
      { status: 500 }
    )
  }
}
