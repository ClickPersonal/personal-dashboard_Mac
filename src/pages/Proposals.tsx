import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, FileText, Calendar, DollarSign, Filter, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AddProposalModal } from '@/components/modals/AddProposalModal'
import { proposalService, clientService } from '@/lib/database'
import type { Proposal, Client } from '@/lib/supabase'

export function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProposals()
  }, [proposals, searchTerm, statusFilter, clientFilter, dateFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [proposalsData, clientsData] = await Promise.all([
        proposalService.getAll(),
        clientService.getAll()
      ])
      setProposals(proposalsData)
      setClients(clientsData)
    } catch (err) {
      setError('Errore nel caricamento delle proposte')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterProposals = () => {
    let filtered = proposals

    if (searchTerm) {
      filtered = filtered.filter(proposal =>
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(proposal => proposal.status === statusFilter)
    }

    if (clientFilter) {
      filtered = filtered.filter(proposal => proposal.client_id === clientFilter)
    }

    if (dateFilter) {
      const today = new Date()
      const filterDate = new Date(dateFilter)
      
      switch (dateFilter) {
        case 'expired':
          filtered = filtered.filter(proposal => 
            proposal.valid_until && new Date(proposal.valid_until) < today
          )
          break
        case 'expiring_soon':
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(proposal => 
            proposal.valid_until && 
            new Date(proposal.valid_until) >= today && 
            new Date(proposal.valid_until) <= nextWeek
          )
          break
        case 'this_month':
          filtered = filtered.filter(proposal => {
            if (!proposal.created_at) return false
            const proposalDate = new Date(proposal.created_at)
            return proposalDate.getMonth() === today.getMonth() && 
                   proposalDate.getFullYear() === today.getFullYear()
          })
          break
      }
    }

    setFilteredProposals(filtered)
  }

  const handleAddProposal = (newProposal: Proposal) => {
    setProposals(prev => [newProposal, ...prev])
  }

  const handleDeleteProposal = async (proposalId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa proposta?')) {
      return
    }

    try {
      await proposalService.delete(proposalId)
      setProposals(prev => prev.filter(proposal => proposal.id !== proposalId))
    } catch (err) {
      console.error('Error deleting proposal:', err)
      alert('Errore durante l\'eliminazione della proposta')
    }
  }

  const handleUpdateStatus = async (proposal: Proposal, newStatus: string) => {
    try {
      const updatedProposal = await proposalService.update(proposal.id, { status: newStatus })
      setProposals(prev => prev.map(p => p.id === proposal.id ? updatedProposal : p))
    } catch (err) {
      console.error('Error updating proposal status:', err)
      alert('Errore durante l\'aggiornamento dello status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Bozza'
      case 'sent':
        return 'Inviata'
      case 'accepted':
        return 'Accettata'
      case 'rejected':
        return 'Rifiutata'
      case 'expired':
        return 'Scaduta'
      default:
        return status
    }
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : 'Cliente sconosciuto'
  }

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false
    return new Date(validUntil) < new Date()
  }

  const isExpiringSoon = (validUntil?: string) => {
    if (!validUntil) return false
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const validDate = new Date(validUntil)
    return validDate >= today && validDate <= nextWeek
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getTotalValue = () => {
    return filteredProposals.reduce((sum, proposal) => sum + proposal.amount, 0)
  }

  const getAcceptedValue = () => {
    return filteredProposals
      .filter(p => p.status === 'accepted')
      .reduce((sum, proposal) => sum + proposal.amount, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento proposte...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposte</h1>
          <p className="text-gray-600">Gestisci le tue proposte commerciali e monitora lo stato</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuova Proposta
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cerca proposte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti gli status</option>
            <option value="draft">Bozza</option>
            <option value="sent">Inviata</option>
            <option value="accepted">Accettata</option>
            <option value="rejected">Rifiutata</option>
            <option value="expired">Scaduta</option>
          </select>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i clienti</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i periodi</option>
            <option value="this_month">Questo mese</option>
            <option value="expiring_soon">In scadenza</option>
            <option value="expired">Scadute</option>
          </select>
          <Button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('')
              setClientFilter('')
              setDateFilter('')
            }}
            variant="outline"
            className="w-full"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{proposals.length}</div>
          <div className="text-sm text-gray-600">Totale Proposte</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {proposals.filter(p => p.status === 'accepted').length}
          </div>
          <div className="text-sm text-gray-600">Accettate</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {proposals.filter(p => p.status === 'sent').length}
          </div>
          <div className="text-sm text-gray-600">In Attesa</div>
        </Card>
        <Card className="p-4">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(getTotalValue())}
          </div>
          <div className="text-sm text-gray-600">Valore Totale</div>
        </Card>
        <Card className="p-4">
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(getAcceptedValue())}
          </div>
          <div className="text-sm text-gray-600">Valore Accettato</div>
        </Card>
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm || statusFilter || clientFilter || dateFilter ? 'Nessuna proposta trovata per i filtri correnti.' : 'Nessuna proposta presente.'}
          </div>
          {!searchTerm && !statusFilter && !clientFilter && !dateFilter && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Crea la prima proposta
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className={`p-6 hover:shadow-lg transition-shadow ${
              isExpired(proposal.valid_until) ? 'border-red-200 bg-red-50' :
              isExpiringSoon(proposal.valid_until) ? 'border-yellow-200 bg-yellow-50' : ''
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {proposal.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {getStatusText(proposal.status)}
                    </span>
                    {isExpired(proposal.valid_until) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Scaduta
                      </span>
                    )}
                    {isExpiringSoon(proposal.valid_until) && !isExpired(proposal.valid_until) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        In scadenza
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProposal(proposal.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {proposal.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {proposal.description}
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cliente:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getClientName(proposal.client_id)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Importo:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(proposal.amount)}
                  </span>
                </div>

                {proposal.valid_until && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Valida fino:
                    </span>
                    <span className={`text-sm font-medium ${
                      isExpired(proposal.valid_until) ? 'text-red-600' :
                      isExpiringSoon(proposal.valid_until) ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {new Date(proposal.valid_until).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {proposal.status === 'draft' && (
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(proposal, 'sent')}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Invia
                  </Button>
                </div>
              )}

              {proposal.status === 'sent' && (
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(proposal, 'accepted')}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Accetta
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(proposal, 'rejected')}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Rifiuta
                  </Button>
                </div>
              )}

              {proposal.terms && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500 mb-1">Termini:</div>
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {proposal.terms}
                  </div>
                </div>
              )}

              {proposal.created_at && (
                <div className="mt-4 text-xs text-gray-500">
                  Creata il {new Date(proposal.created_at).toLocaleDateString('it-IT')}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Proposal Modal */}
      <AddProposalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddProposal}
      />
    </div>
  )
}