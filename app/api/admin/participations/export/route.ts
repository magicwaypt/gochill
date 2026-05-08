import { NextRequest, NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import * as XLSX from 'xlsx'

import { db } from '@/lib/db'
import { participations } from '@/lib/schema'

const formatBoolean = (value: boolean) => (value ? 'Sim' : 'Não')

const formatStatus = (status: string) => {
  if (status === 'approved') {
    return 'Aprovada'
  }

  if (status === 'rejected') {
    return 'Rejeitada'
  }

  return 'Pendente'
}

export async function GET() {
  try {
    const origin = arguments[0] instanceof Request ? new URL(arguments[0].url).origin : ''
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
      TalaoUrl: participation.talaoBlob ? `${origin}/api/admin/participations/${participation.id}/files/talao` : '',
      FotoUrl: participation.fotoBlob ? `${origin}/api/admin/participations/${participation.id}/files/foto` : '',
      DataCriacao: new Date(participation.createdAt).toISOString(),
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