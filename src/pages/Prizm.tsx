import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate, getStatusColor } from '@/lib/utils'
import {
  Plus,
  Search,
  Filter,
  Lightbulb,
  Users,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Edit,
  Eye,
} from 'lucide-react'

// Mock data
const kpis = [
  {
    title: 'Utenti Registrati',
    value: '1,247',
    change: '+23%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Interviste Completate',
    value: '89',
    change: '+12',
    trend: 'up',
    icon: MessageSquare,
  },
  {
    title: 'Milestone Raggiunte',
    value: '7/12',
    change: '+2',
    trend: 'up',
    icon: Target,
  },
  {
    title: 'Feedback Score',
    value: '4.2/5',
    change: '+0.3',
    trend: 'up',
    icon: TrendingUp,
  },
]

const projects = [
  {
    id: '1',
    name: 'MVP Development',
    description: 'Sviluppo del prodotto minimo vitale',
    status: 'active',
    priority: 'high',
    progress: 75,
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    tasks: 24,
    completedTasks: 18,
  },
  {
    id: '2',
    name: 'User Research',
    description: 'Ricerca e validazione utenti target',
    status: 'active',
    priority: 'medium',
    progress: 60,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    tasks: 12,
    completedTasks: 7,
  },
  {
    id: '3',
    name: 'Market Analysis',
    description: 'Analisi competitiva e di mercato',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2023-12-01',
    endDate: '2024-01-01',
    tasks: 8,
    completedTasks: 8,
  },
]

const tasks = [
  {
    id: '1',
    title: 'Implementare sistema di autenticazione',
    description: 'OAuth2 + JWT per login sicuro',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-20',
    assignedTo: 'Roberto',
    project: 'MVP Development',
  },
  {
    id: '2',
    title: 'Condurre 10 interviste utenti',
    description: 'Validazione del problema e della soluzione',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-01-25',
    assignedTo: 'Roberto',
    project: 'User Research',
  },
  {
    id: '3',
    title: 'Design wireframes dashboard',
    description: 'Mockup interfaccia utente principale',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-01-15',
    assignedTo: 'Roberto',
    project: 'MVP Development',
  },
]

const contacts = [
  {
    id: '1',
    name: 'Marco Investitore',
    role: 'Angel Investor',
    company: 'TechFund',
    email: 'marco@techfund.com',
    phone: '+39 333 1111111',
    lastContact: '2024-01-10',
    status: 'warm',
    notes: 'Interessato al settore, vuole vedere traction',
    tags: ['investor', 'angel'],
  },
  {
    id: '2',
    name: 'Laura Mentor',
    role: 'Startup Advisor',
    company: 'Innovation Hub',
    email: 'laura@innovhub.com',
    phone: '+39 333 2222222',
    lastContact: '2024-01-08',
    status: 'active',
    notes: 'Mentoring su go-to-market strategy',
    tags: ['advisor', 'mentor'],
  },
  {
    id: '3',
    name: 'Giuseppe Partner',
    role: 'Tech Partner',
    company: 'DevCorp',
    email: 'giuseppe@devcorp.com',
    phone: '+39 333 3333333',
    lastContact: '2024-01-05',
    status: 'prospect',
    notes: 'Possibile partnership tecnologica',
    tags: ['partner', 'tech'],
  },
]

const interviews = [
  {
    id: '1',
    interviewee: 'Anna Rossi',
    role: 'Product Manager',
    date: '2024-01-12',
    duration: 45,
    status: 'completed',
    insights: ['Problema confermato', 'Disposta a pagare €50/mese', 'Preferisce integrazione Slack'],
    painPoints: ['Troppi tool disconnessi', 'Perdita di tempo in sync'],
    rating: 4,
  },
  {
    id: '2',
    interviewee: 'Marco Bianchi',
    role: 'Team Lead',
    date: '2024-01-15',
    duration: 30,
    status: 'completed',
    insights: ['Soluzione interessante', 'Preoccupato per sicurezza', 'Vuole trial gratuito'],
    painPoints: ['Comunicazione team', 'Tracking progetti'],
    rating: 3,
  },
  {
    id: '3',
    interviewee: 'Sofia Verdi',
    role: 'Startup Founder',
    date: '2024-01-18',
    duration: 60,
    status: 'scheduled',
    insights: [],
    painPoints: [],
    rating: null,
  },
]

const milestones = [
  {
    id: '1',
    title: 'MVP Completato',
    description: 'Prima versione funzionante del prodotto',
    dueDate: '2024-03-01',
    status: 'in_progress',
    progress: 75,
    deliverables: ['App web funzionante', 'API backend', 'Database setup'],
  },
  {
    id: '2',
    title: 'Primi 100 Utenti',
    description: 'Raggiungere 100 utenti registrati',
    dueDate: '2024-04-01',
    status: 'todo',
    progress: 0,
    deliverables: ['Landing page', 'Campagna marketing', 'Onboarding flow'],
  },
  {
    id: '3',
    title: 'Validazione Mercato',
    description: 'Conferma product-market fit',
    dueDate: '2024-02-01',
    status: 'completed',
    progress: 100,
    deliverables: ['50 interviste utenti', 'Analisi competitiva', 'Business model'],
  },
]

export default function Prizm() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'tasks' | 'contacts' | 'research' | 'roadmap'>('overview')
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prizm</h1>
          <p className="text-muted-foreground mt-1">
            Gestione startup: progetti, validazione, roadmap e KPI
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Task
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
                      {kpi.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-prizm-50">
                    <Icon className="w-6 h-6 text-prizm-600" />
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
            { id: 'overview', label: 'Panoramica', icon: Lightbulb },
            { id: 'projects', label: 'Progetti', icon: FileText },
            { id: 'tasks', label: 'Task', icon: CheckCircle },
            { id: 'contacts', label: 'Contatti', icon: Users },
            { id: 'research', label: 'Ricerca', icon: MessageSquare },
            { id: 'roadmap', label: 'Roadmap', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-prizm-500 text-prizm-600'
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
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Progetti Attivi</CardTitle>
              <CardDescription>Progetti in corso di sviluppo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.filter(p => p.status === 'active').map((project) => (
                  <div key={project.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-prizm-500 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {project.completedTasks}/{project.tasks} task
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Task Recenti</CardTitle>
              <CardDescription>Attività in scadenza</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.slice(0, 4).map((task) => {
                  const isOverdue = new Date(task.dueDate) < new Date()
                  
                  return (
                    <div key={task.id} className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in_progress' ? 'bg-blue-500' :
                        isOverdue ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.project} • Scadenza: {formatDate(task.dueDate)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Ultime Interviste</CardTitle>
              <CardDescription>Feedback e insights utenti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviews.slice(0, 3).map((interview) => (
                  <div key={interview.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{interview.interviewee}</p>
                        <p className="text-sm text-muted-foreground">{interview.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{formatDate(interview.date)}</p>
                        {interview.rating && (
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${
                                  i < interview.rating! ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {interview.insights.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Key Insights:</p>
                        <ul className="text-xs text-foreground space-y-1">
                          {interview.insights.slice(0, 2).map((insight, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-prizm-500 rounded-full" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Roadmap Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Prossime Milestone</CardTitle>
              <CardDescription>Obiettivi e deliverable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.filter(m => m.status !== 'completed').slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{milestone.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(milestone.dueDate)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-prizm-500 h-1.5 rounded-full" 
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {milestone.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tutti i Progetti</CardTitle>
              <CardDescription>Gestione completa dei progetti startup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Periodo</p>
                        <p className="font-medium text-foreground">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progresso</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-prizm-500 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Task</p>
                        <p className="font-medium text-foreground">
                          {project.completedTasks}/{project.tasks} completati
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Dettagli
                      </Button>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Task
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Task</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progetto</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Priorità</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scadenza</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assegnato</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks
                      .filter(task => 
                        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.project.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((task) => {
                        const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'
                        
                        return (
                          <tr key={task.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-foreground">{task.title}</p>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-prizm-50 text-prizm-700">
                                {task.project}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
                                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-foreground'}>
                                  {formatDate(task.dueDate)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-foreground">{task.assignedTo}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
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

      {activeTab === 'contacts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-prizm-500 to-prizm-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <p className="text-sm text-muted-foreground">{contact.company}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">Ultimo contatto:</span>
                      <span className="text-foreground">{formatDate(contact.lastContact)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Note:</p>
                    <p className="text-sm text-foreground">{contact.notes}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {contact.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Dettagli
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interviste Utenti</CardTitle>
              <CardDescription>Validazione e feedback dal mercato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {interviews.map((interview) => (
                  <div key={interview.id} className="p-6 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{interview.interviewee}</h3>
                        <p className="text-muted-foreground">{interview.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{formatDate(interview.date)}</p>
                        <p className="text-sm text-muted-foreground">{interview.duration} min</p>
                        {interview.rating && (
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-full ${
                                  i < interview.rating! ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {interview.insights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">Key Insights:</h4>
                        <ul className="space-y-1">
                          {interview.insights.map((insight, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-foreground">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {interview.painPoints.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">Pain Points:</h4>
                        <ul className="space-y-1">
                          {interview.painPoints.map((pain, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span className="text-foreground">{pain}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Dettagli
                        </Button>
                        <Button size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifica
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap & Milestone</CardTitle>
              <CardDescription>Pianificazione strategica e obiettivi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="p-6 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Scadenza</p>
                        <p className="font-medium text-foreground">{formatDate(milestone.dueDate)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Progresso</span>
                        <span className="text-sm text-muted-foreground">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-prizm-500 h-2 rounded-full" 
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">Deliverable:</h4>
                      <ul className="space-y-1">
                        {milestone.deliverables.map((deliverable, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              milestone.status === 'completed' ? 'bg-green-500' :
                              milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                            }`} />
                            <span className="text-foreground">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Dettagli
                      </Button>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}