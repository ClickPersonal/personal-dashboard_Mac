import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
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

// Mock data - in real app this would come from Supabase
const revenueData = [
  { month: 'Gen', studio: 4500, prizm: 1200, statale: 2800 },
  { month: 'Feb', studio: 5200, prizm: 1800, statale: 2800 },
  { month: 'Mar', studio: 4800, prizm: 2200, statale: 2800 },
  { month: 'Apr', studio: 6100, prizm: 2800, statale: 2800 },
  { month: 'Mag', studio: 5800, prizm: 3200, statale: 2800 },
  { month: 'Giu', studio: 7200, prizm: 3800, statale: 2800 },
]

const areaDistribution = [
  { name: 'Sokey Studio', value: 45, color: '#f97316' },
  { name: 'Prizm', value: 25, color: '#3b82f6' },
  { name: 'Lavoro Statale', value: 30, color: '#22c55e' },
]

const monthlyTrend = [
  { month: 'Gen', total: 8500 },
  { month: 'Feb', total: 9800 },
  { month: 'Mar', total: 9800 },
  { month: 'Apr', total: 11700 },
  { month: 'Mag', total: 11800 },
  { month: 'Giu', total: 13800 },
]

const stats = [
  {
    title: 'Ricavi Totali',
    value: '€67,900',
    change: '+12.5%',
    trend: 'up',
    icon: Euro,
    color: 'text-finanze-600',
    bgColor: 'bg-finanze-50',
  },
  {
    title: 'Progetti Attivi',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: FolderOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Clienti Attivi',
    value: '18',
    change: '+2',
    trend: 'up',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Margine Medio',
    value: '68%',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'project',
    title: 'Nuovo progetto matrimonio',
    description: 'Matrimonio Rossi - 15 Luglio',
    time: '2 ore fa',
    area: 'studio',
    icon: Camera,
  },
  {
    id: 2,
    type: 'client',
    title: 'Nuovo cliente acquisito',
    description: 'Azienda TechCorp per servizi social',
    time: '4 ore fa',
    area: 'studio',
    icon: Users,
  },
  {
    id: 3,
    type: 'task',
    title: 'Milestone completata',
    description: 'MVP Prizm - Validazione utenti',
    time: '1 giorno fa',
    area: 'prizm',
    icon: Lightbulb,
  },
  {
    id: 4,
    type: 'finance',
    title: 'Fattura pagata',
    description: 'Servizio fotografico €2,500',
    time: '2 giorni fa',
    area: 'studio',
    icon: Euro,
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: 'Consegna foto matrimonio Bianchi',
    dueDate: '2024-01-15',
    priority: 'high',
    area: 'studio',
  },
  {
    id: 2,
    title: 'Intervista utenti Prizm',
    dueDate: '2024-01-16',
    priority: 'medium',
    area: 'prizm',
  },
  {
    id: 3,
    title: 'Aggiornamento turni gennaio',
    dueDate: '2024-01-18',
    priority: 'low',
    area: 'statale',
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
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