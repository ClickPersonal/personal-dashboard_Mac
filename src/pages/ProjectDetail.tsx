import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Link as LinkIcon
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Project {
  id: string
  name: string
  description: string
  client_name: string
  type: string
  status: string
  budget: number
  margin: number
  start_date: string
  end_date: string
  progress: number
  created_at: string
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignee: string
  due_date: string
  project_id: string
  created_at: string
}

interface File {
  id: string
  name: string
  type: string
  size: string
  status: string
  upload_date: string
  project_id: string
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (id) {
      fetchProjectData()
    }
  }, [id])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (projectError) throw projectError
      setProject(projectData)

      // Fetch project tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false })

      if (tasksError) throw tasksError
      setTasks(tasksData || [])

      // Mock files data (replace with actual Supabase query when files table is ready)
      setFiles([
        {
          id: '1',
          name: 'Project Brief.pdf',
          type: 'pdf',
          size: '2.5 MB',
          status: 'Approvato',
          upload_date: '2024-01-15',
          project_id: id || ''
        },
        {
          id: '2',
          name: 'Design Mockups.fig',
          type: 'figma',
          size: '15.2 MB',
          status: 'In Revisione',
          upload_date: '2024-01-20',
          project_id: id || ''
        }
      ])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'attivo':
      case 'in corso':
        return 'bg-green-100 text-green-800'
      case 'in pausa':
        return 'bg-yellow-100 text-yellow-800'
      case 'completato':
        return 'bg-blue-100 text-blue-800'
      case 'annullato':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completato':
        return 'bg-green-100 text-green-800'
      case 'in corso':
        return 'bg-blue-100 text-blue-800'
      case 'in attesa':
        return 'bg-yellow-100 text-yellow-800'
      case 'bloccato':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'bg-red-100 text-red-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'bassa':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText
      case 'figma':
      case 'fig':
        return FileText
      default:
        return FileText
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-studio-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento progetto...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Errore</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna ai Progetti
          </Button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Progetto non trovato</h2>
          <p className="text-muted-foreground mb-4">Il progetto richiesto non esiste o è stato rimosso.</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna ai Progetti
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">{project.client_name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Modifica
          </Button>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(project.budget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Scadenza</p>
                <p className="text-xl font-semibold text-foreground">{formatDate(project.end_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="text-xl font-semibold text-foreground">{project.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Task</p>
                <p className="text-xl font-semibold text-foreground">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Progresso Progetto</h3>
              <span className="text-sm text-muted-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="tasks">Task ({tasks.length})</TabsTrigger>
          <TabsTrigger value="files">File ({files.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrizione Progetto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dettagli Progetto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium text-foreground">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Margine</p>
                    <p className="font-medium text-foreground">{project.margin}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Inizio</p>
                    <p className="font-medium text-foreground">{formatDate(project.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Fine</p>
                    <p className="font-medium text-foreground">{formatDate(project.end_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Recenti</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                    <Badge className={getTaskStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Nessun task trovato</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Task del Progetto</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nessun Task</h3>
                <p className="text-muted-foreground mb-4">Non ci sono task per questo progetto.</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crea il primo task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Priorità:</span>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Stato:</span>
                            <Badge className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">Assegnato a:</p>
                        <p className="text-muted-foreground">{task.assignee}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Scadenza:</p>
                        <p className="text-muted-foreground">{formatDate(task.due_date)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Creato:</p>
                        <p className="text-muted-foreground">{formatDate(task.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">File del Progetto</h2>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Carica File
            </Button>
          </div>
          
          {files.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nessun File</h3>
                <p className="text-muted-foreground mb-4">Non ci sono file per questo progetto.</p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Carica il primo file
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                            Caricato il {formatDate(file.upload_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Badge className={getStatusColor(file.status)}>
                          {file.status}
                        </Badge>
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
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Timeline del Progetto</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-studio-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Progetto Creato</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(project.created_at)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Il progetto è stato creato e configurato</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-studio-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Inizio Progetto</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(project.start_date)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Avvio ufficiale del progetto</p>
                  </div>
                </div>
                
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      task.status === 'completato' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(task.created_at)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Task {task.status} - Assegnato a {task.assignee}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectDetail