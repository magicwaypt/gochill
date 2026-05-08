"use client"

import { useEffect, useState } from "react"
import { Award, Clock, Image as ImageIcon, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Participation {
  id: number
  nome: string
  email: string
  telemovel: string
  talaoBlob: string | null
  fotoBlob: string | null
  aceiteMaior18: boolean
  aceiteTermos: boolean
  aceitePrivacidade: boolean
  aceiteMarketing: boolean
  status: string
  createdAt: string
}

interface AttemptSummary {
  totalAttempts: number
  successfulAttempts: number
  totalRejected: number
  invalidReceiptAttempts: number
  receiptValidationUnavailableAttempts: number
  otherRejectedAttempts: number
}

interface AdminStatsResponse {
  participations: Participation[]
  attemptSummary: AttemptSummary
}

export function AdminStats() {
  const [participations, setParticipations] = useState<Participation[]>([])
  const [attemptSummary, setAttemptSummary] = useState<AttemptSummary>({
    totalAttempts: 0,
    successfulAttempts: 0,
    totalRejected: 0,
    invalidReceiptAttempts: 0,
    receiptValidationUnavailableAttempts: 0,
    otherRejectedAttempts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data: AdminStatsResponse = await response.json()
          setParticipations(data.participations)
          setAttemptSummary(data.attemptSummary)
        }
      } catch (error) {
        console.error('Error fetching participations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchParticipations()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">A carregar estatísticas...</p>
        </div>
      </div>
    )
  }

  const totalParticipations = participations.length
  const useAttemptSummary = attemptSummary.totalAttempts > 0
  const attemptStatsTotal = useAttemptSummary ? attemptSummary.totalAttempts : totalParticipations
  const successfulAttempts = useAttemptSummary ? attemptSummary.successfulAttempts : totalParticipations
  const invalidReceiptAttempts = attemptSummary.invalidReceiptAttempts
  const receiptValidationUnavailableAttempts = attemptSummary.receiptValidationUnavailableAttempts
  const otherRejectedAttempts = attemptSummary.otherRejectedAttempts
  const totalMarketingConsent = participations.filter((participation) => participation.aceiteMarketing).length
  const totalApproved = participations.filter((participation) => participation.status === 'approved').length
  const totalRejected = participations.filter((participation) => participation.status === 'rejected').length
  const totalPending = participations.filter((participation) => participation.status === 'pending').length

  const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
    const count = participations.filter(
      (participation) => new Date(participation.createdAt).getHours() === hour
    ).length
    return { hour, count }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Estatísticas do Passatempo</h1>
        <Badge variant="secondary" className="text-sm">
          Atualizado em tempo real
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipations}</div>
            <p className="text-xs text-muted-foreground">
              +
              {
                participations.filter((participation) => {
                  const today = new Date()
                  return new Date(participation.createdAt).toDateString() === today.toDateString()
                }).length
              }{' '}
              hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talões Rejeitados</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{invalidReceiptAttempts}</div>
            <p className="text-xs text-muted-foreground">
              {attemptStatsTotal > 0 ? Math.round((invalidReceiptAttempts / attemptStatsTotal) * 100) : 0}% das tentativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consentimento Marketing</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalMarketingConsent}</div>
            <p className="text-xs text-muted-foreground">
              {totalParticipations > 0 ? Math.round((totalMarketingConsent / totalParticipations) * 100) : 0}% aceitaram
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado do Passatempo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">ATIVO</div>
            <p className="text-xs text-muted-foreground">Até 3 de junho de 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalApproved + totalRejected}</div>
            <p className="text-xs text-muted-foreground">
              {totalApproved} aprovadas, {totalRejected} rejeitadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tentativas de Submissão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500">
              Mostra tentativas registadas no sistema antes da criação da participação.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm">Submissões com sucesso</span>
              <div className="flex items-center gap-2">
                <div className="w-20 rounded-full bg-slate-200 h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${attemptStatsTotal > 0 ? (successfulAttempts / attemptStatsTotal) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-sm font-medium">{successfulAttempts}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Rejeitadas por talão</span>
              <div className="flex items-center gap-3">
                {receiptValidationUnavailableAttempts > 0 ? (
                  <div className="text-right">
                    <span className="block text-xs text-amber-700">
                      {receiptValidationUnavailableAttempts} sem validação AI
                    </span>
                  </div>
                ) : null}
                <div className="w-20 rounded-full bg-slate-200 h-2">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${attemptStatsTotal > 0 ? (invalidReceiptAttempts / attemptStatsTotal) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-sm font-medium">{invalidReceiptAttempts}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Outras rejeições</span>
              <div className="flex items-center gap-3">
                {attemptSummary.totalRejected > 0 ? (
                  <span className="text-xs text-orange-700">{attemptSummary.totalRejected} rejeições no total</span>
                ) : null}
                <div className="w-20 rounded-full bg-slate-200 h-2">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: `${attemptStatsTotal > 0 ? (otherRejectedAttempts / attemptStatsTotal) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-sm font-medium">{otherRejectedAttempts}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado das Validações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Aprovadas</span>
              <span className="text-sm font-medium">{totalApproved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Rejeitadas</span>
              <span className="text-sm font-medium">{totalRejected}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pendentes</span>
              <span className="text-sm font-medium">{totalPending}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participações por Hora do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {hourlyStats.map((hourStat) => (
              <div key={hourStat.hour} className="rounded-lg border border-slate-200 p-3 text-center">
                <div className="text-sm text-slate-500">{String(hourStat.hour).padStart(2, '0')}h</div>
                <div className="text-lg font-semibold text-slate-900">{hourStat.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}