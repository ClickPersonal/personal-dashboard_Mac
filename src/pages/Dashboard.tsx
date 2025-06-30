import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { analyticsService } from '@/lib/database'
interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  activeClients: number;
  averageMargin: number;
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    icon: any;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    area: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  monthlyRevenue: Array<{
    month: string;
    studio: number;
    prizm: number;
    statale: number;
  }>;

  monthlyTrend: Array<{
    month: string;
    total: number;
  }>;
}
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  FolderOpen,
  Euro,
  Download,


} from 'lucide-react'

// Default data structure
const defaultRevenueData = [
  { month: 'Gen', studio: 0, prizm: 0, statale: 0 },
  { month: 'Feb', studio: 0, prizm: 0, statale: 0 },
  { month: 'Mar', studio: 0, prizm: 0, statale: 0 },
  { month: 'Apr', studio: 0, prizm: 0, statale: 0 },
  { month: 'Mag', studio: 0, prizm: 0, statale: 0 },
  { month: 'Giu', studio: 0, prizm: 0, statale: 0 },
]





export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFilter, setDateFilter] = useState('month')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getDashboardStats()
      setDashboardData({
        totalRevenue: data.totalRevenue,
        activeProjects: data.activeProjects,
        activeClients: data.activeClients,
        averageMargin: data.avgMargin,
        recentActivities: (data as any).recentActivities || [],
        upcomingTasks: (data as any).upcomingTasks || [],
        monthlyRevenue: (data as any).monthlyRevenue || defaultRevenueData,

        monthlyTrend: (data as any).monthlyTrend || []
      })
    } catch (err) {
      setError('Errore nel caricamento dei dati dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generatePDFReport = () => {
    try {
      const reportDate = new Date().toLocaleDateString('it-IT')
      const reportTime = new Date().toLocaleTimeString('it-IT')
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Report Dashboard - ${reportDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: bold; color: #1f2937; }
            .subtitle { font-size: 16px; color: #6b7280; margin-top: 10px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 20px; font-weight: bold; color: #374151; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: #f9fafb; }
            .stat-label { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
            .activities { margin-top: 20px; }
            .activity { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .activity:last-child { border-bottom: none; }
            .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">REPORT DASHBOARD</div>
            <div class="subtitle">Periodo: ${dateFilter === 'month' ? 'Questo mese' : dateFilter === 'week' ? 'Questa settimana' : 'Oggi'}</div>
            <div class="subtitle">Generato il ${reportDate} alle ${reportTime}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Statistiche Principali</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Ricavi Totali</div>
                <div class="stat-value">€${dashboardData?.totalRevenue?.toLocaleString('it-IT') || '0'}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Clienti Attivi</div>
                <div class="stat-value">${dashboardData?.activeClients || '0'}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Progetti Attivi</div>
                <div class="stat-value">${dashboardData?.activeProjects || '0'}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Margine Medio</div>
                <div class="stat-value">${dashboardData?.averageMargin || '0'}%</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Attività Recenti</div>
            <div class="activities">
              ${dashboardData?.recentActivities?.map(activity => `
                <div class="activity">
                  <strong>${activity.title}:</strong> ${activity.description}
                  <br><small style="color: #6b7280;">${activity.time}</small>
                </div>
              `).join('') || '<div class="activity">Nessuna attività recente</div>'}
            </div>
          </div>
          
          <div class="footer">
            <p>Report generato automaticamente dal sistema di gestione</p>
          </div>
        </body>
        </html>
      `
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      alert('Report generato! In produzione questo sarebbe un PDF.')
      
    } catch (err) {
      console.error('Error generating report:', err)
      alert('Errore durante la generazione del report')
    }
  }

  const stats = [
    {
      title: 'Ricavi Totali',
      value: dashboardData ? formatCurrency(dashboardData.totalRevenue) : '€0',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Euro,
      color: 'text-finanze-600',
      bgColor: 'bg-finanze-50',
    },
    {
      title: 'Progetti Attivi',
      value: dashboardData?.activeProjects?.toString() || '0',
      change: '+3',
      trend: 'up' as const,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Clienti Attivi',
      value: dashboardData?.activeClients?.toString() || '0',
      change: '+2',
      trend: 'up' as const,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Margine Medio',
      value: dashboardData ? `${dashboardData.averageMargin}%` : '0%',
      change: '-2.1%',
      trend: 'down' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentActivities = dashboardData?.recentActivities || []
  const upcomingTasks = dashboardData?.upcomingTasks || []
  const revenueData = dashboardData?.monthlyRevenue || defaultRevenueData

  const monthlyTrend = dashboardData?.monthlyTrend || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {error}
        <Button 
          onClick={loadDashboardData} 
          className="ml-4 bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          Riprova
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notifiche - Sezione rimossa temporaneamente */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Panoramica generale delle tue attività
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Oggi</option>
            <option value="week">Questa settimana</option>
            <option value="month">Questo mese</option>
            <option value="year">Quest'anno</option>
          </select>
          <Button onClick={generatePDFReport}>
            <Download className="w-4 h-4 mr-2" />
            Esporta Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.trend === 'up'
          
          return (
            <Card key={stat.title} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ricavi per Area</CardTitle>
            <CardDescription>
              Confronto mensile dei ricavi per ogni area di business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="studio" fill="#f97316" name="Sokey Studio" />
                <Bar dataKey="prizm" fill="#3b82f6" name="Prizm" />
                <Bar dataKey="statale" fill="#22c55e" name="Lavoro Statale" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trend Mensile</CardTitle>
            <CardDescription>
              Andamento totale dei ricavi negli ultimi 6 mesi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Prossime Scadenze</CardTitle>
            <CardDescription>
              Task e progetti in scadenza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.dueDate} • {task.area}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Attività Recenti</CardTitle>
          <CardDescription>
            Ultime azioni e aggiornamenti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}