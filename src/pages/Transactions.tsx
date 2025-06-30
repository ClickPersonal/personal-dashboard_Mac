import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown, Calendar, Euro, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AddTransactionModal } from '@/components/modals/AddTransactionModal'
import { transactionService, projectService } from '@/lib/database'
import type { Transaction, Project } from '@/lib/supabase'

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  // clients state removed - not used in current implementation
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  // Status filter removed - status property not available in Transaction interface
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, typeFilter, categoryFilter, dateFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [transactionsData, projectsData] = await Promise.all([
        transactionService.getAll(),
        projectService.getAll()
      ])
      setTransactions(transactionsData)
      setProjects(projectsData)
    } catch (err) {
      setError('Errore nel caricamento delle transazioni')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        (transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      )
    }

    if (typeFilter) {
      filtered = filtered.filter(transaction => transaction.type === typeFilter)
    }

    // Status filter removed - status property not available in Transaction interface

    if (categoryFilter) {
      filtered = filtered.filter(transaction => transaction.category === categoryFilter)
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      const filterMonth = filterDate.getMonth()
      const filterYear = filterDate.getFullYear()
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        return transactionDate.getMonth() === filterMonth && transactionDate.getFullYear() === filterYear
      })
    }

    setFilteredTransactions(filtered)
  }

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev])
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa transazione?')) {
      return
    }

    try {
      await transactionService.delete(transactionId)
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId))
    } catch (err) {
      console.error('Error deleting transaction:', err)
      alert('Errore durante l\'eliminazione della transazione')
    }
  }

  // Status functions removed - status property not available in Transaction interface

  // getClientName function removed - not used in current implementation

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Progetto sconosciuto'
  }

  // Calculate statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalIncome - totalExpenses

  // Pending amount calculation removed - status property not available
  const pendingAmount = 0

  // Get unique categories for filter
  const categories = [...new Set(transactions.map(t => t.category))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento transazioni...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transazioni</h1>
          <p className="text-gray-600">Gestisci entrate e uscite finanziarie</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Aggiungi Transazione
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i tipi</option>
            <option value="income">Entrate</option>
            <option value="expense">Uscite</option>
          </select>
          {/* Status filter removed - status property not available in Transaction interface */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le categorie</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={() => {
              setSearchTerm('')
              setTypeFilter('')
              setCategoryFilter('')
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">€{totalIncome.toLocaleString('it-IT')}</div>
              <div className="text-sm text-gray-600">Entrate</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">€{totalExpenses.toLocaleString('it-IT')}</div>
              <div className="text-sm text-gray-600">Uscite</div>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{netProfit.toLocaleString('it-IT')}
              </div>
              <div className="text-sm text-gray-600">Profitto Netto</div>
            </div>
            <Euro className={`h-8 w-8 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">€{pendingAmount.toLocaleString('it-IT')}</div>
              <div className="text-sm text-gray-600">In Attesa</div>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm || typeFilter || categoryFilter || dateFilter ? 'Nessuna transazione trovata per i filtri correnti.' : 'Nessuna transazione presente.'}
          </div>
          {!searchTerm && !typeFilter && !categoryFilter && !dateFilter && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Aggiungi la prima transazione
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrizione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Progetto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        {/* Invoice number not available in Transaction interface */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toLocaleString('it-IT')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {transaction.type === 'income' ? 'Entrata' : 'Uscita'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        {getProjectName(transaction.project_id) && (
                          <div className="text-sm">{getProjectName(transaction.project_id)}</div>
                        )}
                        {getProjectName(transaction.project_id) && (
                          <div className="text-xs text-gray-500">{getProjectName(transaction.project_id)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1">
                        <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddTransaction}
      />
    </div>
  )
}