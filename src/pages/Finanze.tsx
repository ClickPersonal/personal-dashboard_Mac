import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown, Calendar, Euro, Download, BarChart3, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Transaction, Project } from '@/lib/supabase'

export function Finanze() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Form states
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    area: 'studio' as 'studio' | 'prizm' | 'statale',
    project_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, typeFilter, categoryFilter, areaFilter, dateFilter, selectedPeriod])

  const loadData = async () => {
    try {
      setLoading(true)
      // Simulated data loading - replace with actual Supabase calls
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 2500,
          category: 'Consulenza',
          description: 'Sviluppo sito web cliente ABC',
          date: '2024-01-15',
          area: 'studio',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          type: 'expense',
          amount: 150,
          category: 'Software',
          description: 'Licenza Adobe Creative Suite',
          date: '2024-01-10',
          area: 'studio',
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-10T09:00:00Z'
        },
        {
          id: '3',
          type: 'income',
          amount: 1800,
          category: 'Progetto',
          description: 'Pagamento milestone progetto XYZ',
          date: '2024-01-20',
          area: 'prizm',
          created_at: '2024-01-20T14:00:00Z',
          updated_at: '2024-01-20T14:00:00Z'
        }
      ]
      setTransactions(mockTransactions)
    } catch (err) {
      setError('Errore nel caricamento delle transazioni')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        (transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      )
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(transaction => transaction.type === typeFilter)
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(transaction => transaction.category === categoryFilter)
    }

    // Area filter
    if (areaFilter) {
      filtered = filtered.filter(transaction => transaction.area === areaFilter)
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      const filterMonth = filterDate.getMonth()
      const filterYear = filterDate.getFullYear()
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        return transactionDate.getMonth() === filterMonth && transactionDate.getFullYear() === filterYear
      })
    }

    // Period filter
    const now = new Date()
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo)
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(t => new Date(t.date) >= monthAgo)
    } else if (selectedPeriod === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(t => new Date(t.date) >= yearAgo)
    }

    setFilteredTransactions(filtered)
  }

  const handleCreateTransaction = async () => {
    try {
      // Simulate API call
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setTransactions(prev => [newTransaction, ...prev])
      setShowCreateModal(false)
      resetForm()
    } catch (err) {
      console.error('Error creating transaction:', err)
    }
  }

  const handleEditTransaction = async () => {
    if (!editingTransaction) return
    
    try {
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        ...formData,
        updated_at: new Date().toISOString()
      }
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t))
      setShowEditModal(false)
      setEditingTransaction(null)
      resetForm()
    } catch (err) {
      console.error('Error updating transaction:', err)
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa transazione?')) {
      return
    }

    try {
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId))
    } catch (err) {
      console.error('Error deleting transaction:', err)
    }
  }

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date,
      area: transaction.area,
      project_id: transaction.project_id || ''
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'income',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      area: 'studio',
      project_id: ''
    })
  }

  // Calculate statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalIncome - totalExpenses

  // Get unique categories and areas for filters
  const categories = [...new Set(transactions.map(t => t.category))].sort()
  const areas = ['studio', 'prizm', 'statale']

  // Category breakdown
  const categoryBreakdown = categories.map(category => {
    const categoryTransactions = filteredTransactions.filter(t => t.category === category)
    const income = categoryTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = categoryTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return { category, income, expenses, net: income - expenses }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento dati finanziari...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finanze</h1>
          <p className="text-gray-600">Gestione completa delle finanze aziendali</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuova Transazione
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

      {/* Period Selector */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Periodo:</span>
          {['week', 'month', 'quarter', 'year', 'all'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'week' && 'Settimana'}
              {period === 'month' && 'Mese'}
              {period === 'quarter' && 'Trimestre'}
              {period === 'year' && 'Anno'}
              {period === 'all' && 'Tutto'}
            </button>
          ))}
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">€{totalIncome.toLocaleString('it-IT')}</div>
              <div className="text-sm text-gray-600">Entrate Totali</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">€{totalExpenses.toLocaleString('it-IT')}</div>
              <div className="text-sm text-gray-600">Uscite Totali</div>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${
                netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                €{netProfit.toLocaleString('it-IT')}
              </div>
              <div className="text-sm text-gray-600">Profitto Netto</div>
            </div>
            <Euro className={`h-8 w-8 ${
              netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{filteredTransactions.length}</div>
              <div className="text-sm text-gray-600">Transazioni</div>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cerca transazioni..."
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
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le aree</option>
            {areas.map(area => (
              <option key={area} value={area}>
                {area === 'studio' && 'Studio'}
                {area === 'prizm' && 'Prizm'}
                {area === 'statale' && 'Statale'}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setSearchTerm('')
                setTypeFilter('')
                setCategoryFilter('')
                setAreaFilter('')
                setDateFilter('')
              }}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              variant="outline"
              className="px-3"
            >
              {viewMode === 'table' ? <Eye className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analisi per Categoria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBreakdown.map(({ category, income, expenses, net }) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entrate:</span>
                    <span className="text-green-600 font-medium">€{income.toLocaleString('it-IT')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uscite:</span>
                    <span className="text-red-600 font-medium">€{expenses.toLocaleString('it-IT')}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="text-gray-900 font-medium">Netto:</span>
                    <span className={`font-bold ${
                      net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      €{net.toLocaleString('it-IT')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            {searchTerm || typeFilter || categoryFilter || areaFilter || dateFilter
              ? 'Nessuna transazione trovata per i filtri correnti.'
              : 'Nessuna transazione presente.'}
          </div>
          {!searchTerm && !typeFilter && !categoryFilter && !areaFilter && !dateFilter && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Aggiungi la prima transazione
            </Button>
          )}
        </Card>
      ) : viewMode === 'table' ? (
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
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
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
                      <div className="font-medium">{transaction.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.area === 'studio' ? 'bg-blue-100 text-blue-800' :
                        transaction.area === 'prizm' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {transaction.area === 'studio' && 'Studio'}
                        {transaction.area === 'prizm' && 'Prizm'}
                        {transaction.area === 'statale' && 'Statale'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toLocaleString('it-IT')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                        >
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('it-IT')}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(transaction)}
                    className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {transaction.category}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.area === 'studio' ? 'bg-blue-100 text-blue-800' :
                  transaction.area === 'prizm' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {transaction.area === 'studio' && 'Studio'}
                  {transaction.area === 'prizm' && 'Prizm'}
                  {transaction.area === 'statale' && 'Statale'}
                </span>
              </div>
              <div className={`text-xl font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toLocaleString('it-IT')}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Transaction Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Nuova Transazione</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Entrata</option>
                  <option value="expense">Uscita</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Importo</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Es. Consulenza, Software, Marketing..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descrizione dettagliata..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value as 'studio' | 'prizm' | 'statale'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="studio">Studio</option>
                  <option value="prizm">Prizm</option>
                  <option value="statale">Statale</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleCreateTransaction}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Crea Transazione
              </Button>
              <Button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                variant="outline"
                className="flex-1"
              >
                Annulla
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Modifica Transazione</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Entrata</option>
                  <option value="expense">Uscita</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Importo</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Es. Consulenza, Software, Marketing..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descrizione dettagliata..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value as 'studio' | 'prizm' | 'statale'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="studio">Studio</option>
                  <option value="prizm">Prizm</option>
                  <option value="statale">Statale</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleEditTransaction}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Salva Modifiche
              </Button>
              <Button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingTransaction(null)
                  resetForm()
                }}
                variant="outline"
                className="flex-1"
              >
                Annulla
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finanze