import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AddClientModal } from '@/components/modals/AddClientModal'
import { clientService } from '@/lib/database'
import type { Client } from '@/lib/supabase'
import { Link } from 'react-router-dom'

export function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchTerm])

  const loadClients = async () => {
    try {
      setLoading(true)
      const clientsData = await clientService.getAll()
      setClients(clientsData)
    } catch (err) {
      setError('Errore nel caricamento dei clienti')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    if (!searchTerm) {
      setFilteredClients(clients)
      return
    }

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredClients(filtered)
  }

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev])
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo cliente?')) {
      return
    }

    try {
      await clientService.delete(clientId)
      setClients(prev => prev.filter(client => client.id !== clientId))
    } catch (err) {
      console.error('Error deleting client:', err)
      alert('Errore durante l\'eliminazione del cliente')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'potential':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo'
      case 'inactive':
        return 'Inattivo'
      case 'potential':
        return 'Potenziale'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento clienti...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienti</h1>
          <p className="text-gray-600">Gestisci i tuoi clienti e le loro informazioni</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Aggiungi Cliente
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cerca clienti per nome, email, azienda o telefono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
          <div className="text-sm text-gray-600">Totale Clienti</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {clients.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Clienti Attivi</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {clients.filter(c => c.status === 'prospect').length}
          </div>
          <div className="text-sm text-gray-600">Clienti Potenziali</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {clients.filter(c => c.status === 'lead').length}
          </div>
          <div className="text-sm text-gray-600">Clienti Inattivi</div>
        </Card>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm ? 'Nessun cliente trovato per la ricerca corrente.' : 'Nessun cliente presente.'}
          </div>
          {!searchTerm && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Aggiungi il primo cliente
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {client.name}
                  </h3>
                  {client.company && (
                    <p className="text-sm text-gray-600 mb-2">{client.company}</p>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {getStatusText(client.status)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Link
                    to={`/clients/${client.id}`}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                      {client.email}
                    </a>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{client.address}</span>
                  </div>
                )}
              </div>

              {client.pain_points && client.pain_points.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Pain Points:</div>
                  <div className="flex flex-wrap gap-1">
                    {client.pain_points.slice(0, 3).map((point, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
                      >
                        {point}
                      </span>
                    ))}
                    {client.pain_points.length > 3 && (
                      <span className="text-xs text-gray-500">+{client.pain_points.length - 3} altri</span>
                    )}
                  </div>
                </div>
              )}

              {client.created_at && (
                <div className="mt-4 text-xs text-gray-500">
                  Cliente dal {new Date(client.created_at).toLocaleDateString('it-IT')}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddClient}
      />
    </div>
  )
}