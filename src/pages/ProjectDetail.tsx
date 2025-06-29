import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate, formatCurrency, getStatusColor, calculateMargin, calculateROI } from '@/lib/utils'
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera,
  Video,
  Users,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Plus,
  Star,
  Play,
  Pause,
  RotateCcw,
  Send,
  Archive,
  Share,
  Link as LinkIcon,
  Image,
  Film,
  Palette,
  Globe,
} from 'lucide-react'

// Mock data - in a real app, this would come from an API
const projectData = {
  id: '1',
  name: 'Matrimonio Laura & Giuseppe',
  type: 'Matrimonio',
  status: 'completed',
  client: {
    id: '1',
    name: 'Marco Rossi',
    company: 'Rossi Events',
    email: 'marco@rossievents.com',
    phone: '+39 333 1234567'
  },
  description: 'Servizio fotografico e video per matrimonio in villa storica. Include cerimonia, ricevimento e servizio con drone per riprese aeree.',
  startDate: '2023-09-15',
  endDate: '2023-09-16',
  budget: 4500,
  finalAmount: 4200,
  costs: 800,
  margin: 3400,
  marginPercentage: 80.95,
  roi: 425,
  services: [
    { name: 'Fotografia', price: 2500, included: true },
    { name: 'Video', price: 1500, included: true },
    { name: 'Drone', price: 500, included: true },
    { name: 'Album Premium', price: 300, included: false },
    { name: 'Stampe Extra', price: 200, included: false }
  ],
  deliverables: {
    photos: 150,
    videos: 3,
    edited: 120,
    raw: 30
  },
  location: 'Villa San Martino, Arcore (MB)',
  team: ['Roberto (Fotografo)', 'Sara (Video)', 'Marco (Drone)'],
  equipment: ['Canon R5', 'Sony FX3', 'DJI Mini 3 Pro', 'Luci LED'],
  timeline: [
    { time: '14:00', event: 'Preparazione sposa', status: 'completed' },
    { time: '15:30', event: 'Preparazione sposo', status: 'completed' },
    { time: '16:30', event: 'Cerimonia civile', status: 'completed' },
    { time: '17:30', event: 'Servizio fotografico', status: 'completed' },
    { time: '19:00', event: 'Aperitivo', status: 'completed' },
    { time: '20:30', event: 'Cena e festa', status: 'completed' },
    { time: '00:00', event: 'Fine servizio', status: 'completed' }
  ],
  notes: 'Condizioni meteo perfette, clienti molto soddisfatti. Richiesta album aggiuntivo per i genitori.',
  rating: 5,
  createdAt: '2023-08-10',
  updatedAt: '2023-09-20'
}

const tasks = [
  {
    id: '1',
    title: 'Sopralluogo location',
    description: 'Visita alla villa per pianificare le riprese',
    status: 'completed',
    assignee: 'Roberto',
    dueDate: '2023-08-20',
    completedDate: '2023-08-18',
    priority: 'high',
    category: 'planning'
  },
  {
    id: '2',
    title: 'Preparazione attrezzatura',
    description: 'Controllo e preparazione di tutta la strumentazione',
    status: 'completed',
    assignee: 'Team',
    dueDate: '2023-09-14',
    completedDate: '2023-09-14',
    priority: 'high',
    category: 'preparation'
  },
  {
    id: '3',
    title: 'Shooting matrimonio',
    description: 'Servizio fotografico e video durante l\'evento',
    status: 'completed',
    assignee: 'Team',
    dueDate: '2023-09-16',
    completedDate: '2023-09-16',
    priority: 'critical',
    category: 'production'
  },
  {
    id: '4',
    title: 'Post-produzione foto',
    description: 'Editing e ritocco delle foto selezionate',
    status: 'completed',
    assignee: 'Roberto',
    dueDate: '2023-09-25',
    completedDate: '2023-09-23',
    priority: 'high',
    category: 'post-production'
  },
  {
    id: '5',
    title: 'Montaggio video',
    description: 'Editing del video highlight del matrimonio',
    status: 'completed',
    assignee: 'Sara',
    dueDate: '2023-09-30',
    completedDate: '2023-09-28',
    priority: 'high',
    category: 'post-production'
  },
  {
    id: '6',
    title: 'Consegna finale',
    description: 'Upload su cloud e invio link al cliente',
    status: 'completed',
    assignee: 'Roberto',
    dueDate: '2023-10-01',
    completedDate: '2023-09-30',
    priority: 'medium',
    category: 'delivery'
  }
]

const files = [
  {
    id: '1',
    name: 'Matrimonio_Laura_Giuseppe_Highlights.mp4',
    type: 'video',
    size: '2.1 GB',
    uploadDate: '2023-09-28',
    status: 'approved',
    url: '#',
    thumbnail: '/api/placeholder/150/100',
    category: 'final'
  },
  {
    id: '2',
    name: 'Cerimonia_Foto_Selezionate.zip',
    type: 'photos',
    size: '890 MB',
    uploadDate: '2023-09-23',
    status: 'approved',
    url: '#',
    thumbnail: '/api/placeholder/150/100',
    category: 'final'
  },
  {
    id: '3',
    name: 'Riprese_Drone_Raw.zip',
    type: 'video',
    size: '1.5 GB',
    uploadDate: '2023-09-20',
    status: 'review',
    url: '#',
    thumbnail: '/api/placeholder/150/100',
    category: 'raw'
  },
  {
    id: '4',
    name: 'Album_Preview.pdf',
    type: 'document',
    size: '45 MB',
    uploadDate: '2023-09-25',
    status: 'approved',
    url: '#',
    thumbnail: '/api/placeholder/150/100',
    category: 'preview'
  }
]

const comments = [
  {
    id: '1',
    author: 'Marco Rossi',
    role: 'Cliente',
    date: '2023-09-29',
    content: 'Siamo rimasti senza parole! Il video è fantastico e le foto sono perfette. Grazie di cuore per aver catturato ogni momento speciale.',
    rating: 5
  },
  {
    id: '2',
    author: 'Roberto',
    role: 'Fotografo',
    date: '2023-09-28',
    content: 'Consegnato il video finale. Ho aggiunto alcune transizioni extra e la colonna sonora che avevamo discusso.',
    rating: null
  },
  {
    id: '3',
    author: 'Laura Bianchi',
    role: 'Sposa',
    date: '2023-09-25',
    content: 'Le foto sono bellissime! Potreste aggiungere anche quella con i nonni durante il brindisi? Era un momento molto importante per noi.',
    rating: null
  },
  {
    id: '4',
    author: 'Roberto',
    role: 'Fotografo',
    date: '2023-09-25',
    content: 'Certamente! Ho aggiunto la foto con i nonni nella selezione finale. Trovate tutto nella cartella aggiornata.',
    rating: null
  }
]

const getTaskIcon = (category: string) => {
  switch (category) {
    case 'planning': return Calendar
    case 'preparation': return CheckCircle
    case 'production': return Camera
    case 'post-production': return Edit
    case 'delivery': return Send
    default: return FileText
  }
}

const getTaskColor = (category: string) => {
  switch (category) {
    case 'planning': return 'bg-blue-50 text-blue-700'
    case 'preparation': return 'bg-green-50 text-green-700'
    case 'production': return 'bg-purple-50 text-purple-700'
    case 'post-production': return 'bg-orange-50 text-orange-700'
    case 'delivery': return 'bg-pink-50 text-pink-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'video': return Film
    case 'photos': return Image
    case 'document': return FileText
    default: return FileText
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-50 text-red-700'
    case 'high': return 'bg-orange-50 text-orange-700'
    case 'medium': return 'bg-yellow-50 text-yellow-700'
    case 'low': return 'bg-green-50 text-green-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'files' | 'timeline' | 'comments'>('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/sokey-studio">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna ai Progetti
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{projectData.name}</h1>
            <p className="text-muted-foreground mt-1">{projectData.type} • {projectData.location}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Condividi
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Modifica
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(projectData.budget)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Importo Finale</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(projectData.finalAmount)}
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
                <p className="text-sm font-medium text-muted-foreground">Margine</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {projectData.marginPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {projectData.roi}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <DollarSign className="w-6 h-6 text-orange-600" />
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
                        i < projectData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
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
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Panoramica', icon: Eye },
            { id: 'tasks', label: 'Task', icon: CheckCircle },
            { id: 'files', label: 'File', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'comments', label: 'Commenti', icon: MessageSquare },
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
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dettagli Progetto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Descrizione</p>
                <p className="text-sm text-muted-foreground">{projectData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Data Inizio</p>
                  <p className="text-sm text-muted-foreground">{formatDate(projectData.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Data Fine</p>
                  <p className="text-sm text-muted-foreground">{formatDate(projectData.endDate)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Stato</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(projectData.status)}`}>
                  {projectData.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Team</p>
                <div className="space-y-1">
                  {projectData.team.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Attrezzatura</p>
                <div className="flex flex-wrap gap-2">
                  {projectData.equipment.map((item, index) => (
                    <span key={index} className="px-2 py-1 rounded-full text-xs bg-studio-50 text-studio-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-studio-50">
                  <User className="w-6 h-6 text-studio-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{projectData.client.name}</p>
                  <p className="text-sm text-muted-foreground">{projectData.client.company}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{projectData.client.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{projectData.client.phone}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Link to={`/clients/${projectData.client.id}`}>
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizza Cliente
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Services & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Servizi e Prezzi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectData.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className={`w-4 h-4 ${
                        service.included ? 'text-green-600' : 'text-gray-300'
                      }`} />
                      <span className={`text-sm ${
                        service.included ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {service.name}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      service.included ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Totale Progetto</span>
                  <span className="font-bold text-lg text-foreground">
                    {formatCurrency(projectData.finalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle>Deliverable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-studio-50">
                  <Camera className="w-8 h-8 text-studio-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{projectData.deliverables.photos}</p>
                  <p className="text-sm text-muted-foreground">Foto Totali</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50">
                  <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{projectData.deliverables.videos}</p>
                  <p className="text-sm text-muted-foreground">Video</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50">
                  <Edit className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{projectData.deliverables.edited}</p>
                  <p className="text-sm text-muted-foreground">Foto Elaborate</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50">
                  <Archive className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{projectData.deliverables.raw}</p>
                  <p className="text-sm text-muted-foreground">File Raw</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Task del Progetto</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Task
            </Button>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task) => {
              const TaskIcon = getTaskIcon(task.category)
              
              return (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${getTaskColor(task.category)}`}>
                        <TaskIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{task.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground mb-1">Assegnato a:</p>
                            <p className="text-muted-foreground">{task.assignee}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Scadenza:</p>
                            <p className="text-muted-foreground">{formatDate(task.dueDate)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Completato:</p>
                            <p className="text-muted-foreground">
                              {task.completedDate ? formatDate(task.completedDate) : 'In corso'}
                            </p>
                          </div>
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

      {activeTab === 'files' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">File del Progetto</h2>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Carica File
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              
              return (
                <Card key={file.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="p-3 rounded-lg bg-studio-50">
                        <FileIcon className="w-6 h-6 text-studio-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Caricato il {formatDate(file.uploadDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                        {file.status}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizza
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Timeline del Progetto</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {projectData.timeline.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full ${
                        event.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">{event.event}</h3>
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {event.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Commenti e Feedback</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Commento
            </Button>
          </div>
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-studio-50">
                      <User className="w-5 h-5 text-studio-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{comment.author}</h3>
                          <p className="text-sm text-muted-foreground">{comment.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{formatDate(comment.date)}</p>
                          {comment.rating && (
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < comment.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}