import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, calculateMargin, calculateROI } from '@/lib/utils'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  Upload,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Target,
  Briefcase,
  Building,
  Home,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'

// Mock data
const areas = [
  { id: 'studio', name: 'Sokey Studio', color: '#8B5CF6' },
  { id: 'prizm', name: 'Prizm', color: '#06B6D4' },
  { id: 'statale', name: 'Lavoro Statale', color: '#10B981' },
]

const transactions = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Servizio fotografico matrimonio',
    amount: 1500,
    type: 'income',
    area: 'studio',
    category: 'Fotografia',
    client: 'Marco & Laura',
    status: 'completed',
    invoiceNumber: 'INV-2024-001',
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Acquisto attrezzatura fotografica',
    amount: -800,
    type: 'expense',
    area: 'studio',
    category: 'Attrezzature',
    client: null,
    status: 'paid',
    invoiceNumber: null,
  },
  {
    id: '3',
    date: '2024-01-12',
    description: 'Consulenza sviluppo MVP',
    amount: 2500,
    type: 'income',
    area: 'prizm',
    category: 'Consulenza',
    client: 'TechStart Inc',
    status: 'completed',
    invoiceNumber: 'INV-2024-002',
  },
  {
    id: '4',
    date: '2024-01-10',
    description: 'Stipendio mensile',
    amount: 2800,
    type: 'income',
    area: 'statale',
    category: 'Stipendio',
    client: 'Ente Pubblico',
    status: 'received',
    invoiceNumber: null,
  },
  {
    id: '5',
    date: '2024-01-08',
    description: 'Abbonamento software editing',
    amount: -50,
    type: 'expense',
    area: 'studio',
    category: 'Software',
    client: null,
    status: 'paid',
    invoiceNumber: null,
  },
  {
    id: '6',
    date: '2024-01-05',
    description: 'Hosting e dominio',
    amount: -120,
    type: 'expense',
    area: 'prizm',
    category: 'Infrastruttura',
    client: null,
    status: 'paid',
    invoiceNumber: null,
  },
]

const monthlyData = [
  { month: 'Gen', studio: 4200, prizm: 1800, statale: 2800, expenses: -2100 },
  { month: 'Feb', studio: 3800, prizm: 2200, statale: 2800, expenses: -1900 },
  { month: 'Mar', studio: 5100, prizm: 1500, statale: 2800, expenses: -2400 },
  { month: 'Apr', studio: 4600, prizm: 2800, statale: 2800, expenses: -2200 },
  { month: 'Mag', studio: 3900, prizm: 3200, statale: 2800, expenses: -2000 },
  { month: 'Giu', studio: 5400, prizm: 2100, statale: 2800, expenses: -2600 },
]

const cashflowData = [
  { month: 'Gen', income: 8800, expenses: 2100, net: 6700 },
  { month: 'Feb', income: 8800, expenses: 1900, net: 6900 },
  { month: 'Mar', income: 9400, expenses: 2400, net: 7000 },
  { month: 'Apr', income: 10200, expenses: 2200, net: 8000 },
  { month: 'Mag', income: 9900, expenses: 2000, net: 7900 },
  { month: 'Giu', income: 10300, expenses: 2600, net: 7700 },
]

const areaDistribution = [
  { name: 'Sokey Studio', value: 45, amount: 26700, color: '#8B5CF6' },
  { name: 'Prizm', value: 25, amount: 14800, color: '#06B6D4' },
  { name: 'Lavoro Statale', value: 30, amount: 16800, color: '#10B981' },
]

const categoryExpenses = [
  { name: 'Attrezzature', value: 35, amount: 4200, color: '#EF4444' },
  { name: 'Software', value: 20, amount: 2400, color: '#F59E0B' },
  { name: 'Marketing', value: 15, amount: 1800, color: '#8B5CF6' },
  { name: 'Infrastruttura', value: 20, amount: 2400, color: '#06B6D4' },
  { name: 'Altro', value: 10, amount: 1200, color: '#6B7280' },
]

const kpis = [
  {
    title: 'Entrate Totali',
    value: 58300,
    change: 12.5,
    trend: 'up',
    icon: TrendingUp,
    color: 'green',
  },
  {
    title: 'Spese Totali',
    value: 12000,
    change: -8.2,
    trend: 'down',
    icon: TrendingDown,
    color: 'red',
  },
  {
    title: 'Utile Netto',
    value: 46300,
    change: 18.7,
    trend: 'up',
    icon: DollarSign,
    color: 'green',
  },
  {
    title: 'ROI Medio',
    value: 285,
    change: 15.3,
    trend: 'up',
    icon: Target,
    suffix: '%',
    color: 'blue',
  },
]

const getAreaIcon = (areaId: string) => {
  switch (areaId) {
    case 'studio': return Briefcase
    case 'prizm': return Building
    case 'statale': return Home
    default: return DollarSign
  }
}

const getAreaColor = (areaId: string) => {
  switch (areaId) {
    case 'studio': return 'studio'
    case 'prizm': return 'prizm'
    case 'statale': return 'statale'
    default: return 'gray'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'received':
    case 'paid':
      return 'bg-green-50 text-green-700'
    case 'pending':
      return 'bg-yellow-50 text-yellow-700'
    case 'overdue':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

export default function Finanze() {
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'prizm' | 'statale' | 'transactions'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState('all')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesArea = selectedArea === 'all' || transaction.area === selectedArea
    return matchesSearch && matchesArea
  })

  const getAreaStats = (areaId: string) => {
    const areaTransactions = transactions.filter(t => t.area === areaId)
    const income = areaTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = Math.abs(areaTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))
    const net = income - expenses
    const margin = calculateMargin(income, expenses)
    const roi = calculateROI(net, expenses)
    
    return { income, expenses, net, margin, roi }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finanze</h1>
          <p className="text-muted-foreground mt-1">
            Gestione finanziaria completa per tutte le aree di business
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuova Transazione
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          
          return (
            <Card key={kpi.title} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {kpi.suffix === '%' ? `${kpi.value}${kpi.suffix}` : formatCurrency(kpi.value)}
                    </p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    kpi.color === 'green' ? 'bg-green-50' :
                    kpi.color === 'red' ? 'bg-red-50' :
                    kpi.color === 'blue' ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      kpi.color === 'green' ? 'text-green-600' :
                      kpi.color === 'red' ? 'text-red-600' :
                      kpi.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Panoramica', icon: PieChart },
            { id: 'studio', label: 'Sokey Studio', icon: Briefcase },
            { id: 'prizm', label: 'Prizm', icon: Building },
            { id: 'statale', label: 'Lavoro Statale', icon: Home },
            { id: 'transactions', label: 'Transazioni', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cashflow Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Andamento Cashflow</CardTitle>
              <CardDescription>Entrate, uscite e utile netto mensile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflowData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stackId="1" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Entrate"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="2" 
                      stroke="#EF4444" 
                      fill="#EF4444" 
                      fillOpacity={0.6}
                      name="Spese"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Utile Netto"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Area Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuzione per Area</CardTitle>
              <CardDescription>Contributo di ogni area al fatturato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={areaDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {areaDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% (${formatCurrency(props.payload.amount)})`,
                        name
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {areaDistribution.map((area) => (
                  <div key={area.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: area.color }}
                      />
                      <span className="text-sm text-foreground">{area.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(area.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({area.value}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categorie di Spesa</CardTitle>
              <CardDescription>Distribuzione delle spese per categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryExpenses}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% (${formatCurrency(props.payload.amount)})`,
                        name
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryExpenses.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-foreground">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(category.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({category.value}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Confronto Mensile per Area</CardTitle>
              <CardDescription>Performance finanziaria di ogni area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Bar dataKey="studio" fill="#8B5CF6" name="Sokey Studio" />
                    <Bar dataKey="prizm" fill="#06B6D4" name="Prizm" />
                    <Bar dataKey="statale" fill="#10B981" name="Lavoro Statale" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Spese" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Area-specific tabs */}
      {(activeTab === 'studio' || activeTab === 'prizm' || activeTab === 'statale') && (
        <div className="space-y-6">
          {(() => {
            const areaStats = getAreaStats(activeTab)
            const areaInfo = areas.find(a => a.id === activeTab)!
            const AreaIcon = getAreaIcon(activeTab)
            
            return (
              <>
                {/* Area Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Entrate</p>
                          <p className="text-2xl font-bold text-green-600 mt-1">
                            {formatCurrency(areaStats.income)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Spese</p>
                          <p className="text-2xl font-bold text-red-600 mt-1">
                            {formatCurrency(areaStats.expenses)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-50">
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Utile Netto</p>
                          <p className="text-2xl font-bold text-foreground mt-1">
                            {formatCurrency(areaStats.net)}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg bg-${getAreaColor(activeTab)}-50`}>
                          <AreaIcon className={`w-6 h-6 text-${getAreaColor(activeTab)}-600`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ROI</p>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            {areaStats.roi}%
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Area Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transazioni {areaInfo.name}</CardTitle>
                    <CardDescription>Storico movimenti finanziari</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions
                        .filter(t => t.area === activeTab)
                        .slice(0, 10)
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg ${
                                transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                              }`}>
                                {transaction.type === 'income' ? (
                                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{transaction.description}</p>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>{formatDate(transaction.date)}</span>
                                  <span>•</span>
                                  <span>{transaction.category}</span>
                                  {transaction.client && (
                                    <>
                                      <span>•</span>
                                      <span>{transaction.client}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )
          })()}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca transazioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="input-field"
            >
              <option value="all">Tutte le aree</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtri
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descrizione</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Area</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Importo</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      const areaInfo = areas.find(a => a.id === transaction.area)!
                      
                      return (
                        <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <span className="text-foreground">{formatDate(transaction.date)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{transaction.description}</p>
                              {transaction.invoiceNumber && (
                                <p className="text-sm text-muted-foreground">{transaction.invoiceNumber}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getAreaColor(transaction.area)}-50 text-${getAreaColor(transaction.area)}-700`}>
                              {areaInfo.name}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-foreground">{transaction.category}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-foreground">{transaction.client || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-bold ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}