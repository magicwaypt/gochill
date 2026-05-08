"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Download, Users, Calendar, Award, Clock, FileSpreadsheet, StickyNote } from "lucide-react"

import { getClientAdminHref } from "@/lib/admin-auth"

interface Participation {
  id: number
  nome: string
  email: string
  telemovel: string
  notes: string | null
  talaoBlob: string | null
  fotoBlob: string | null
  aceiteMaior18: boolean
  aceiteTermos: boolean
  aceitePrivacidade: boolean
  aceiteMarketing: boolean
  status: string
  createdAt: string
}

export function AdminDashboard() {
  const [participations, setParticipations] = useState<Participation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null)
  const [noteDraft, setNoteDraft] = useState("")
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

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

  const filteredParticipations = participations.filter(participation => {
    const matchesSearch = participation.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participation.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || participation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalParticipations = participations.length
  const totalApproved = participations.filter(p => p.status === 'approved').length
  const totalRejected = participations.filter(p => p.status === 'rejected').length
  const totalPending = participations.filter(p => p.status === 'pending').length
  const todayParticipations = participations.filter(p => {
    const today = new Date().toDateString()
    return new Date(p.createdAt).toDateString() === today
  }).length

  const openImageModal = (imageBlob: string) => {
    setSelectedImage(imageBlob)
    setImageModalOpen(true)
  }

  const openNotesModal = (participation: Participation) => {
    setSelectedParticipation(participation)
    setNoteDraft(participation.notes || "")
    setNotesModalOpen(true)
  }

  const updateParticipationStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/participations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Update local state
        setParticipations(participations.map(p =>
          p.id === id ? { ...p, status } : p
        ))
      } else {
        alert('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const saveParticipationNotes = async () => {
    if (!selectedParticipation) {
      return
    }

    setIsSavingNotes(true)

    try {
      const response = await fetch(`/api/admin/participations/${selectedParticipation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: noteDraft }),
      })

      if (!response.ok) {
        alert('Erro ao guardar notas')
        return
      }

      const normalizedNotes = noteDraft.trim()

      setParticipations((currentParticipations) =>
        currentParticipations.map((participation) =>
          participation.id === selectedParticipation.id
            ? { ...participation, notes: normalizedNotes || null }
            : participation
        )
      )
      setNotesModalOpen(false)
      setSelectedParticipation(null)
      setNoteDraft("")
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Erro ao guardar notas')
    } finally {
      setIsSavingNotes(false)
    }
  }

  const downloadImage = (imageBlob: string, filename: string) => {
    const link = document.createElement('a')
    link.href = `data:image/jpeg;base64,${imageBlob}`
    link.download = filename
    link.click()
  }

  const exportParticipations = async () => {
    if (isExporting) {
      return
    }

    setIsExporting(true)

    try {
      const XLSX = await import('xlsx')
      const rows = participations.map((participation) => ({
        ID: participation.id,
        Nome: participation.nome,
        Email: participation.email,
        Telemovel: participation.telemovel,
        Notas: participation.notes || '',
        Status:
          participation.status === 'approved'
            ? 'Aprovada'
            : participation.status === 'rejected'
              ? 'Rejeitada'
              : 'Pendente',
        AceiteMaior18: participation.aceiteMaior18 ? 'Sim' : 'Não',
        AceiteTermos: participation.aceiteTermos ? 'Sim' : 'Não',
        AceitePrivacidade: participation.aceitePrivacidade ? 'Sim' : 'Não',
        AceiteMarketing: participation.aceiteMarketing ? 'Sim' : 'Não',
        TemTalao: participation.talaoBlob ? 'Sim' : 'Não',
        TemFoto: participation.fotoBlob ? 'Sim' : 'Não',
        TalaoUrl: participation.talaoBlob
          ? getClientAdminHref(`/api/admin/participations/${participation.id}/files/talao`)
          : '',
        FotoUrl: participation.fotoBlob
          ? getClientAdminHref(`/api/admin/participations/${participation.id}/files/foto`)
          : '',
        DataCriacao: new Date(participation.createdAt).toISOString(),
      }))

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(rows)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Participacoes')

      const fileBuffer = XLSX.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
      })

      const blob = new Blob([fileBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = 'participacoes-gochill.xlsx'
      link.click()
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Error exporting participations:', error)
      alert('Erro ao exportar Excel')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">A carregar participações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
            <p className="text-xs text-muted-foreground">
              Rejeitadas manualmente no backoffice
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayParticipations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalApproved}</div>
            <p className="text-xs text-muted-foreground">
              {totalParticipations > 0 ? Math.round((totalApproved / totalParticipations) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardam validação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Participações</CardTitle>
            <Button type="button" onClick={exportParticipations} className="sm:self-start" disabled={isExporting}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              {isExporting ? 'A exportar...' : 'Exportar Excel'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telemóvel</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Fotos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipations.map((participation) => (
                  <TableRow key={participation.id}>
                    <TableCell className="font-medium">#{participation.id}</TableCell>
                    <TableCell>{participation.nome}</TableCell>
                    <TableCell>{participation.email}</TableCell>
                    <TableCell>{participation.telemovel}</TableCell>
                    <TableCell>
                      {new Date(participation.createdAt).toLocaleDateString('pt-PT')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          participation.status === 'approved' ? 'default' :
                          participation.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {participation.status === 'approved' ? 'Aprovado' :
                         participation.status === 'rejected' ? 'Rejeitado' :
                         'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[220px] align-top">
                      <button
                        type="button"
                        onClick={() => openNotesModal(participation)}
                        className="w-full text-left"
                      >
                        <p className="line-clamp-3 text-sm text-slate-600">
                          {participation.notes || 'Sem notas'}
                        </p>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {participation.talaoBlob && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openImageModal(participation.talaoBlob!)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Talão
                          </Button>
                        )}
                        {participation.fotoBlob && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openImageModal(participation.fotoBlob!)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Foto
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {participation.status !== 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateParticipationStatus(participation.id, 'approved')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            ✓ Aprovar
                          </Button>
                        )}
                        {participation.status !== 'rejected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateParticipationStatus(participation.id, 'rejected')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            ✗ Rejeitar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openNotesModal(participation)}
                        >
                          <StickyNote className="h-4 w-4 mr-1" />
                          Notas
                        </Button>
                        {participation.talaoBlob && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadImage(participation.talaoBlob!, `talao_${participation.id}.jpg`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {participation.fotoBlob && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadImage(participation.fotoBlob!, `foto_${participation.id}.jpg`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredParticipations.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nenhuma participação encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualizar Imagem</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Participation"
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedParticipation ? `Notas da submissão #${selectedParticipation.id}` : 'Notas da submissão'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                {selectedParticipation ? `${selectedParticipation.nome} • ${selectedParticipation.email}` : ''}
              </p>
              <Textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder="Adicionar notas internas sobre esta submissão"
                className="min-h-32"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNotesModalOpen(false)
                  setSelectedParticipation(null)
                  setNoteDraft("")
                }}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={saveParticipationNotes} disabled={isSavingNotes}>
                {isSavingNotes ? 'A guardar...' : 'Guardar notas'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}