import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  FileText,
  DollarSign,
  Camera,
  Video,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Plus,
  Eye,
  Download,
} from 'lucide-react'

// Mock data - in a real app, this would come from an API
const clientData = {
  id: '1',
  name: 'Marco Rossi',
  company: 'Rossi Events',
  email: 'marco@rossievents.com',
  phone: '+39 333 1234567',
  address: 'Via Roma 123, Milano, MI 20121',
  sector: 'Eventi e Matrimoni',
  status: 'cliente_attivo',
  communicationStyle: 'Formale, preferisce email',
  activeChannels: ['Instagram', 'Facebook', 'Website'],
  registrationDate: '2023-06-15',
  lastContact: '2024-01-10',
  totalValue: 15600,
  projectsCount: 4,
  rating: 5,
  notes: 'Cliente molto soddisfatto, sempre puntuale nei pagamenti. Organizza eventi di alto livello.',
  painPoints: [
    'Difficoltà nella gestione social media',
    'Necessità di contenuti video professionali',
    'Coordinamento con fornitori esterni'
  ],
  preferences: {
    budget: 'Alto (€3000-5000)',
    timeline: 'Flessibile',
    style: 'Elegante e raffinato',
    deliveryMethod: 'Cloud + USB'
  }
}

const projects = [
  {
    id: '1',
    name: 'Matrimonio Laura & Giuseppe',
    type: 'Matrimonio',
    status: 'completed',
    startDate: '2023-09-15',
    endDate: '2023-09-16',
    budget: 4500,
    finalAmount: 4200,
    services: ['Fotografia', 'Video', 'Drone'],
    deliverables: 150,
    rating: 5,
    notes: 'Matrimonio in villa, condizioni meteo perfette'
  },
  {
    id: '2',
    name: 'Evento Aziendale Q4',
    type: 'Corporate',
    status: 'completed',
    startDate: '2023-12-10',
    endDate: '2023-12-10',
    budget: 2800,
    finalAmount: 2800,
    services: ['Fotografia', 'Social Media'],
    deliverables: 80,
    rating: 4,
    notes: 'Evento di fine anno, focus su team building'
  },
  {
    id: '3',
    name: 'Shooting Prodotti 2024',
    type: 'Commercial',
    status: 'in_progress',
    startDate: '2024-01-08',
    endDate: '2024-01-20',
    budget: 3500,
    finalAmount: null,
    services: ['Fotografia', 'Post-produzione'],
    deliverables: 200,
    rating: null,
    notes: 'Catalogo prodotti primavera/estate'
  },
  {
    id: '4',
    name: 'Campagna Social Q1',
    type: 'Social Media',
    status: 'proposal',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    budget: 5500,
    finalAmount: null,
    services: ['Social Media', 'Content Creation'],
    deliverables: 90,
    rating: null,
    notes: 'Gestione completa social per 3 mesi'
  }
]

const interactions = [
  {
    id: '1',
    date: '2024-01-10',
    type: 'call',
    title: 'Chiamata di follow-up',
    description: 'Discussione nuovi progetti Q1 2024',
    duration: 30,
    outcome: 'Interessato a campagna social, invierò proposta',
    nextAction: 'Preparare proposta social media',
    nextActionDate: '2024-01-15'
  },
  {
    id: '2',
    date: '2024-01-05',
    type: 'email',
    title: 'Invio materiali shooting',
    description: 'Consegna foto prodotti elaborate',
    duration: null,
    outcome: 'Cliente soddisfatto della qualità',
    nextAction: null,
    nextActionDate: null
  },
  {
    id: '3',
    date: '2023-12-15',
    type: 'meeting',
    title: 'Incontro di briefing',
    description: 'Pianificazione shooting prodotti 2024',
    duration: 90,
    outcome: 'Definiti obiettivi e timeline',
    nextAction: 'Conferma date shooting',
    nextActionDate: '2023-12-20'
  }
]

const proposals = [
  {
    id: '1',
    title: 'Campagna Social Media Q1 2024',
    date: '2024-01-12',
    amount: 5500,
    status: 'sent',
    validUntil: '2024-01-26',
    services: ['Gestione Social', 'Content Creation', 'Advertising'],
    description: 'Gestione completa social media per 3 mesi'
  },
  {
    id: '2',
    title: 'Video Promozionale Aziendale',
    date: '2023-11-20',
    amount: 3200,
    status: 'accepted',
    validUntil: '2023-12-04',
    services: ['Video Production', 'Post-produzione', 'Motion Graphics'],
    description: 'Video corporate per presentazione aziendale'
  }
]

const getInteractionIcon = (type: string) => {
  switch (type) {
    case 'call': return Phone
    case 'email': return Mail
    case 'meeting': return Users
    case 'message': return MessageSquare
    default: return MessageSquare
  }
}

const getInteractionColor = (type: string) => {
  switch (type) {
    case 'call': return 'bg-blue-50 text-blue-700'
    case 'email': return 'bg-green-50 text-green-700'
    case 'meeting': return 'bg-purple-50 text-purple-700'
    case 'message': return 'bg-orange-50 text-orange-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

const getProjectIcon = (type: string) => {
  switch (type) {
    case 'Matrimonio': return Users
    case 'Corporate': return Building
    case 'Commercial': return Camera
    case 'Social Media': return MessageSquare
    default: return FileText
  }
}

export default function ClientDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'interactions' | 'proposals'>('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/sokey-studio">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna ai Clienti
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{clientData.name}</h1>
            <p className="text-muted-foreground mt-1">{clientData.company}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contatta
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Modifica
          </Button>
        </div>
      </div>

      {/* Client Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valore Totale</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(clientData.totalValue)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progetti</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {clientData.projectsCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < clientData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ultimo Contatto</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {formatDate(clientData.lastContact)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Panoramica', icon: Eye },
            { id: 'projects', label: 'Progetti', icon: FileText },
            { id: 'interactions', label: 'Interazioni', icon: MessageSquare },
            { id: 'proposals', label: 'Proposte', icon: DollarSign },
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
          {/* Client Details */}
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{clientData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefono</p>
                    <p className="font-medium text-foreground">{clientData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Indirizzo</p>
                    <p className="font-medium text-foreground">{clientData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Settore</p>
                    <p className="font-medium text-foreground">{clientData.sector}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente dal</p>
                    <p className="font-medium text-foreground">{formatDate(clientData.registrationDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Stato</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(clientData.status)}`}>
                  {clientData.status.replace('_', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Communication & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Comunicazione & Preferenze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Stile Comunicativo</p>
                <p className="text-sm text-muted-foreground">{clientData.communicationStyle}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Canali Attivi</p>
                <div className="flex flex-wrap gap-2">
                  {clientData.activeChannels.map((channel) => (
                    <span key={channel} className="px-2 py-1 rounded-full text-xs bg-studio-50 text-studio-700">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Preferenze Budget</p>
                <p className="text-sm text-muted-foreground">{clientData.preferences.budget}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Stile Preferito</p>
                <p className="text-sm text-muted-foreground">{clientData.preferences.style}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Modalità Consegna</p>
                <p className="text-sm text-muted-foreground">{clientData.preferences.deliveryMethod}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Pain Points */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Note e Pain Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Note Generali</p>
                <p className="text-sm text-muted-foreground">{clientData.notes}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Pain Points Identificati</p>
                <ul className="space-y-2">
                  {clientData.painPoints.map((point, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Progetti Cliente</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Progetto
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => {
              const ProjectIcon = getProjectIcon(project.type)
              
              return (
                <Card key={project.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-studio-50">
                          <ProjectIcon className="w-6 h-6 text-studio-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                          <p className="text-muted-foreground">{project.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">{project.notes}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Periodo</p>
                        <p className="font-medium text-foreground">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(project.budget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Importo Finale</p>
                        <p className="font-medium text-foreground">
                          {project.finalAmount ? formatCurrency(project.finalAmount) : 'In corso'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Deliverable</p>
                        <p className="font-medium text-foreground">
                          {project.deliverables} file
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Servizi</p>
                        <div className="flex flex-wrap gap-1">
                          {project.services.map((service) => (
                            <span key={service} className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                              {service}
                            </span>
                          ))}
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
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'interactions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Storico Interazioni</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Interazione
            </Button>
          </div>
          
          <div className="space-y-4">
            {interactions.map((interaction) => {
              const InteractionIcon = getInteractionIcon(interaction.type)
              
              return (
                <Card key={interaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${getInteractionColor(interaction.type)}`}>
                        <InteractionIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{interaction.title}</h3>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{formatDate(interaction.date)}</p>
                            {interaction.duration && (
                              <p className="text-xs text-muted-foreground">{interaction.duration} min</p>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{interaction.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Risultato:</p>
                            <p className="text-sm text-muted-foreground">{interaction.outcome}</p>
                          </div>
                          {interaction.nextAction && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-1">Prossima Azione:</p>
                              <p className="text-sm text-muted-foreground">{interaction.nextAction}</p>
                              {interaction.nextActionDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Entro: {formatDate(interaction.nextActionDate)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Proposte e Preventivi</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Proposta
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {proposals.map((proposal) => {
              const isExpired = new Date(proposal.validUntil) < new Date()
              
              return (
                <Card key={proposal.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{proposal.title}</h3>
                        <p className="text-muted-foreground">{proposal.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(proposal.amount)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Data Invio</p>
                        <p className="font-medium text-foreground">{formatDate(proposal.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valida fino al</p>
                        <p className={`font-medium ${
                          isExpired ? 'text-red-600' : 'text-foreground'
                        }`}>
                          {formatDate(proposal.validUntil)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Servizi</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proposal.services.slice(0, 2).map((service) => (
                            <span key={service} className="px-2 py-1 rounded-full text-xs bg-studio-50 text-studio-700">
                              {service}
                            </span>
                          ))}
                          {proposal.services.length > 2 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                              +{proposal.services.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizza
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}