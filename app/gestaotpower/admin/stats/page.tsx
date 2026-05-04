"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Users, Image as ImageIcon, Clock, Award } from "lucide-react"

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
  createdAt: string
}

export default function AdminStatsPage() {
  const [participations, setParticipations] = useState<Participation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParticipations()
  }, [])

  const fetchParticipations = async () => {
    try {
      const response = await fetch('/api/admin/participations')
      if (response.ok) {
        const data = await response.json()
        setParticipations(data)
      }
    } catch (error) {
      console.error('Error fetching participations:', error)
    } finally {
      setLoading(false)
    }
  }

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

  // Calculate statistics
  const totalParticipations = participations.length
  const totalWithPhotos = participations.filter(p => p.fotoBlob && p.talaoBlob).length
  const totalWithTalaoOnly = participations.filter(p => p.talaoBlob && !p.fotoBlob).length
  const totalWithPhotoOnly = participations.filter(p => p.fotoBlob && !p.talaoBlob).length
  const totalMarketingConsent = participations.filter(p => p.aceiteMarketing).length
  const totalApproved = participations.filter(p => p.status === 'approved').length
  const totalRejected = participations.filter(p => p.status === 'rejected').length
  const totalPending = participations.filter(p => p.status === 'pending').length

  // Daily statistics for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toDateString()
  }).reverse()

  const dailyStats = last7Days.map(date => {
    const count = participations.filter(p =>
      new Date(p.createdAt).toDateString() === date
    ).length
    return { date, count }
  })

  // Participation by hour
  const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
    const count = participations.filter(p =>
      new Date(p.createdAt).getHours() === hour
    ).length
    return { hour, count }
  })

  const maxHourlyParticipation = Math.max(...hourlyStats.map(h => h.count))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Estatísticas do Passatempo</h1>
        <Badge variant="secondary" className="text-sm">
          Atualizado em tempo real
        </Badge>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipations}</div>
            <p className="text-xs text-muted-foreground">
              +{participations.filter(p => {
                const today = new Date()
                const participationDate = new Date(p.createdAt)
                return participationDate.toDateString() === today.toDateString()
              }).length} hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participações Completas</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalWithPhotos}</div>
            <p className="text-xs text-muted-foreground">
              {totalParticipations > 0 ? Math.round((totalWithPhotos / totalParticipations) * 100) : 0}% do total
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
            <p className="text-xs text-muted-foreground">
              Até 3 de junho de 2026
            </p>
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

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation Types */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Participação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completas (Talão + Foto)</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${totalParticipations > 0 ? (totalWithPhotos / totalParticipations) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{totalWithPhotos}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Apenas Talão</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${totalParticipations > 0 ? (totalWithTalaoOnly / totalParticipations) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{totalWithTalaoOnly}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Apenas Foto</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${totalParticipations > 0 ? (totalWithPhotoOnly / totalParticipations) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{totalWithPhotoOnly}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado das Validações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Aprovadas</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${totalParticipations > 0 ? (totalApproved / totalParticipations) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{totalApproved}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Rejeitadas</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${totalParticipations > 0 ? (totalRejected / totalParticipations) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{totalRejected}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Pendentes</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${totalParticipations > 0 ? (totalPending / totalParticipations) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{totalPending}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Participações por Hora do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {hourlyStats.map((hour) => (
              <div key={hour.hour} className="text-center">
                <div className="text-xs text-slate-600 mb-1">
                  {hour.hour.toString().padStart(2, '0')}h
                </div>
                <div className="relative">
                  <div
                    className="bg-slate-200 rounded-t w-full transition-all duration-300"
                    style={{ height: '60px' }}
                  ></div>
                  <div
                    className="bg-purple-500 rounded-t w-full absolute bottom-0 transition-all duration-300"
                    style={{
                      height: `${maxHourlyParticipation > 0 ? (hour.count / maxHourlyParticipation) * 60 : 0}px`
                    }}
                  ></div>
                </div>
                <div className="text-xs font-medium mt-1">{hour.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}