import React, { useState, useEffect } from 'react'
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
  areaDistribution: Array<{
    name: string;
    value: number;
    color: string;
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Users,
  FolderOpen,
  Calendar,
  Euro,
  Camera,
  Lightbulb,

} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Default data structure
const defaultRevenueData = [
  { month: 'Gen', studio: 0, prizm: 0, statale: 0 },
  { month: 'Feb', studio: 0, prizm: 0, statale: 0 },
  { month: 'Mar', studio: 0, prizm: 0, statale: 0 },
  { month: 'Apr', studio: 0, prizm: 0, statale: 0 },
  { month: 'Mag', studio: 0, prizm: 0, statale: 0 },
  { month: 'Giu', studio: 0, prizm: 0, statale: 0 },
]

const defaultAreaDistribution = [
  { name: 'Sokey Studio', value: 0, color: '#f97316' },
  { name: 'Prizm', value: 0, color: '#3b82f6' },
  { name: 'Lavoro Statale', value: 0, color: '#22c55e' },
]



export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        areaDistribution: (data as any).areaDistribution || defaultAreaDistribution,
        monthlyTrend: (data as any).monthlyTrend || []
      })
    } catch (err) {
      setError('Errore nel caricamento dei dati dashboard')
      console.error(err)
    } finally {
      setLoading(false)
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
  const areaDistribution = dashboardData?.areaDistribution || defaultAreaDistribution
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
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Questo mese
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Report
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

        {/* Area Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuzione Ricavi</CardTitle>
            <CardDescription>
              Percentuale di contributo per ogni area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={areaDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {areaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
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