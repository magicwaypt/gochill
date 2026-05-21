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
import { formatLisbonDateTime, getLisbonDateKey } from "@/lib/lisbon-time"

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
  d365SyncStatus: string
  d365AccountNumber: string | null
  d365SyncError: string | null
  d365SyncedAt: string | null
  createdAt: string
}

export function AdminDashboard() {
  const ITEMS_PER_PAGE = 50
  const [participations, setParticipations] = useState<Participation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null)
  const [noteDraft, setNoteDraft] = useState("")
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isSyncingD365, setIsSyncingD365] = useState<Record<number, boolean>>({})
  const [isBulkSyncingD365, setIsBulkSyncingD365] = useState(false)

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

  const syncParticipationToD365 = async (id: number) => {
    setIsSyncingD365((current) => ({ ...current, [id]: true }))

    try {
      const response = await fetch(`/api/admin/participations/${id}/sync-d365`, {
        method: 'POST',
      })

      const payload = await response.json().catch(() => null)

      if (response.ok && payload?.success) {
        setParticipations((current) =>
          current.map((p) =>
            p.id === id
              ? {
                  ...p,
                  d365SyncStatus: 'success',
                  d365AccountNumber: payload.accountNumber ?? p.d365AccountNumber ?? null,
                  d365SyncError: null,
                  d365SyncedAt: new Date().toISOString(),
                }
              : p
          )
        )
        return
      }

      setParticipations((current) =>
        current.map((p) =>
          p.id === id
            ? {
                ...p,
                d365SyncStatus: 'failed',
                d365SyncError: payload?.error || 'd365_sync_failed',
              }
            : p
        )
      )

      alert(payload?.error || 'Erro ao sincronizar com Dynamics 365')
    } catch (error) {
      console.error('Error syncing participation to D365:', error)
      alert('Erro ao sincronizar com Dynamics 365')
    } finally {
      setIsSyncingD365((current) => ({ ...current, [id]: false }))
    }
  }

  const filteredParticipations = participations.filter(participation => {
    const matchesSearch = participation.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participation.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || participation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredParticipations.length / ITEMS_PER_PAGE))
  const paginatedParticipations = filteredParticipations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalParticipations = participations.length
  const totalApproved = participations.filter(p => p.status === 'approved').length
  const totalRejected = participations.filter(p => p.status === 'rejected').length
  const totalPending = participations.filter(p => p.status === 'pending').length
  const todayLisbonKey = getLisbonDateKey(new Date())
  const todayParticipations = participations.filter(
    (p) => getLisbonDateKey(p.createdAt) === todayLisbonKey
  ).length

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

  const exportParticipations = () => {
    const link = document.createElement('a')
    link.href = getClientAdminHref('/api/admin/participations/export')
    link.click()
  }

  const syncAllToD365 = async () => {
    setIsBulkSyncingD365(true)

    try {
      const response = await fetch('/api/admin/participations/sync-d365', {
        method: 'POST',
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        alert(payload?.error || 'Erro ao sincronizar participações com Dynamics 365')
        return
      }

      await fetchParticipations()

      alert(
        `Sync D365 concluído: ${payload?.succeeded ?? 0} sucesso, ${payload?.failed ?? 0} falhas (total ${payload?.attempted ?? 0}).`
      )
    } catch (error) {
      console.error('Error bulk syncing participations to D365:', error)
      alert('Erro ao sincronizar participações com Dynamics 365')
    } finally {
      setIsBulkSyncingD365(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={syncAllToD365}
                disabled={isBulkSyncingD365}
              >
                {isBulkSyncingD365 ? 'A sincronizar...' : 'Sincronizar todos (D365)'}
              </Button>
              <Button type="button" onClick={exportParticipations} className="sm:self-start">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
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
                  <TableHead>D365</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Fotos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedParticipations.map((participation) => (
                  <TableRow key={participation.id}>
                    <TableCell className="font-medium">#{participation.id}</TableCell>
                    <TableCell>{participation.nome}</TableCell>
                    <TableCell>{participation.email}</TableCell>
                    <TableCell>{participation.telemovel}</TableCell>
                    <TableCell>
                      {formatLisbonDateTime(participation.createdAt)}
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            participation.d365SyncStatus === 'success'
                              ? 'default'
                              : participation.d365SyncStatus === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {participation.d365SyncStatus === 'success'
                            ? 'OK'
                            : participation.d365SyncStatus === 'failed'
                            ? 'Falhou'
                            : 'Pendente'}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => syncParticipationToD365(participation.id)}
                          disabled={Boolean(isSyncingD365[participation.id])}
                        >
                          {isSyncingD365[participation.id] ? 'A sincronizar...' : 'Re-sync'}
                        </Button>
                      </div>
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

          {filteredParticipations.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                A mostrar {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredParticipations.length)}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredParticipations.length)} de {filteredParticipations.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-slate-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Seguinte
                </Button>
              </div>
            </div>
          )}

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
