import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'
import {
  Plus,
  Search,
  Filter,
  Users,
  FolderOpen,
  Calendar,
  Camera,
  Video,
  Heart,
  Baby,
  Share2,
  Eye,
  Edit,
  MoreHorizontal,
  Phone,
  Mail,

} from 'lucide-react'

// Mock data - in real app this would come from Supabase
const clients = [
  {
    id: '1',
    name: 'Marco Rossi',
    company: 'Rossi Wedding',
    email: 'marco@rossiwedding.it',
    phone: '+39 333 1234567',
    sector: 'Matrimoni',
    status: 'active',
    activeChannels: ['Instagram', 'Facebook'],
    lastContact: '2024-01-10',
    totalValue: 15000,
    projects: 3,
  },
  {
    id: '2',
    name: 'Laura Bianchi',
    company: 'TechCorp',
    email: 'laura@techcorp.com',
    phone: '+39 333 2345678',
    sector: 'Corporate',
    status: 'prospect',
    activeChannels: ['LinkedIn', 'Email'],
    lastContact: '2024-01-08',
    totalValue: 8500,
    projects: 1,
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    company: 'Famiglia Verdi',
    email: 'giuseppe@email.com',
    phone: '+39 333 3456789',
    sector: 'Family',
    status: 'lead',
    activeChannels: ['WhatsApp'],
    lastContact: '2024-01-05',
    totalValue: 2500,
    projects: 1,
  },
]

const projects = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Marco Rossi',
    name: 'Matrimonio Rossi-Bianchi',
    type: 'wedding',
    status: 'active',
    budget: 8000,
    margin: 65,
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    progress: 45,
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Laura Bianchi',
    name: 'Corporate TechCorp',
    type: 'corporate',
    status: 'review',
    budget: 5500,
    margin: 70,
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    progress: 85,
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Giuseppe Verdi',
    name: 'Battesimo Sofia',
    type: 'baptism',
    status: 'idea',
    budget: 1500,
    margin: 60,
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    progress: 10,
  },
]

const proposals = [
  {
    id: '1',
    clientName: 'Anna Neri',
    title: 'Servizio Fotografico Matrimonio',
    amount: 6500,
    status: 'sent',
    sentDate: '2024-01-08',
    validUntil: '2024-01-22',
  },
  {
    id: '2',
    clientName: 'Roberto Blu',
    title: 'Video Aziendale + Social',
    amount: 4200,
    status: 'draft',
    sentDate: null,
    validUntil: '2024-01-30',
  },
]

const getProjectIcon = (type: string) => {
  switch (type) {
    case 'wedding':
      return Heart
    case 'baptism':
      return Baby
    case 'corporate':
      return FolderOpen
    case 'social_media':
      return Share2
    case 'video':
      return Video
    default:
      return Camera
  }
}

const getProjectTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    wedding: 'Matrimonio',
    baptism: 'Battesimo',
    corporate: 'Corporate',
    social_media: 'Social Media',
    video: 'Video',
    photo: 'Fotografia',
  }
  return labels[type] || type
}

export default function SokeyStudio() {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'projects' | 'proposals'>('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: 'Clienti Attivi',
      value: clients.filter(c => c.status === 'active').length.toString(),
      total: clients.length,
      icon: Users,
      color: 'text-studio-600',
      bgColor: 'bg-studio-50',
    },
    {
      title: 'Progetti in Corso',
      value: projects.filter(p => p.status === 'active').length.toString(),
      total: projects.length,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Proposte Inviate',
      value: proposals.filter(p => p.status === 'sent').length.toString(),
      total: proposals.length,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Valore Pipeline',
      value: formatCurrency(clients.reduce((sum, c) => sum + c.totalValue, 0)),
      total: null,
      icon: Camera,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sokey Studio</h1>
          <p className="text-muted-foreground mt-1">
            Gestione clienti, progetti e proposte per l'agenzia foto/video
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          
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
                    {stat.total && (
                      <p className="text-sm text-muted-foreground mt-1">
                        su {stat.total} totali
                      </p>
                    )}
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

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Panoramica', icon: Camera },
            { id: 'clients', label: 'Clienti', icon: Users },
            { id: 'projects', label: 'Progetti', icon: FolderOpen },
            { id: 'proposals', label: 'Proposte', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-studio-500 text-studio-600'
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
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Progetti Recenti</CardTitle>
              <CardDescription>Ultimi progetti in lavorazione</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => {
                  const Icon = getProjectIcon(project.type)
                  
                  return (
                    <div key={project.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-lg bg-studio-50">
                        <Icon className="w-4 h-4 text-studio-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.clientName} • {getProjectTypeLabel(project.type)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-16 bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-studio-500 h-1.5 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clienti</CardTitle>
              <CardDescription>Clienti per valore totale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients
                  .sort((a, b) => b.totalValue - a.totalValue)
                  .slice(0, 3)
                  .map((client) => (
                    <div key={client.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-studio-500 to-studio-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {client.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {client.company} • {client.sector}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(client.totalValue)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca clienti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Cliente
            </Button>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients
              .filter(client => 
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.company?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((client) => (
                <Card key={client.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-studio-500 to-studio-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">{client.company}</p>
                        </div>
                      </div>
                      <button className="p-1 rounded-lg hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(client.totalValue)}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
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

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tutti i Progetti</CardTitle>
              <CardDescription>Gestione completa dei progetti fotografici e video</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progetto</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Budget</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progresso</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scadenza</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const Icon = getProjectIcon(project.type)
                      
                      return (
                        <tr key={project.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-studio-50">
                                <Icon className="w-4 h-4 text-studio-600" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{project.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-foreground">{project.clientName}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              {getProjectTypeLabel(project.type)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{formatCurrency(project.budget)}</p>
                              <p className="text-sm text-muted-foreground">Margine: {project.margin}%</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-studio-500 h-2 rounded-full" 
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {project.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-foreground">{formatDate(project.endDate)}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Link to={`/studio/project/${project.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
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

      {activeTab === 'proposals' && (
        <div className="space-y-6">
          {/* Proposals */}
          <Card>
            <CardHeader>
              <CardTitle>Proposte e Preventivi</CardTitle>
              <CardDescription>Gestione proposte commerciali e preventivi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{proposal.title}</h3>
                      <p className="text-sm text-muted-foreground">Cliente: {proposal.clientName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatCurrency(proposal.amount)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                        {proposal.sentDate && (
                          <span className="text-sm text-muted-foreground">
                            Inviata: {formatDate(proposal.sentDate)}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Valida fino: {formatDate(proposal.validUntil)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizza
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