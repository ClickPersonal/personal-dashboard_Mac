import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Input } from '../components/ui/input'
import { 
  Plus, 
  Search, 
 
  DollarSign, 
  Users, 
  Clock, 
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle
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

const SokeyStudio = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei progetti')
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

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

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'web development':
        return '🌐'
      case 'mobile app':
        return '📱'
      case 'design':
        return '🎨'
      case 'consulting':
        return '💼'
      default:
        return '📋'
    }
  }

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0)
  const activeProjects = projects.filter(p => p.status.toLowerCase() === 'attivo' || p.status.toLowerCase() === 'in corso')
  const completedProjects = projects.filter(p => p.status.toLowerCase() === 'completato')
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-studio-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento progetti...</p>
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
          <Button onClick={fetchProjects}>
            Riprova
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sokey Studio</h1>
          <p className="text-muted-foreground">Gestisci tutti i progetti del tuo studio</p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Progetto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Budget Totale</p>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Progetti Attivi</p>
                <p className="text-xl font-semibold text-foreground">{activeProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completati</p>
                <p className="text-xl font-semibold text-foreground">{completedProjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-studio-600" />
              <div>
                <p className="text-sm text-muted-foreground">Progresso Medio</p>
                <p className="text-xl font-semibold text-foreground">{averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cerca progetti o clienti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            Tutti
          </Button>
          <Button
            variant={filterStatus === 'attivo' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('attivo')}
            size="sm"
          >
            Attivi
          </Button>
          <Button
            variant={filterStatus === 'completato' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completato')}
            size="sm"
          >
            Completati
          </Button>
          <Button
            variant={filterStatus === 'in pausa' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('in pausa')}
            size="sm"
          >
            In Pausa
          </Button>
        </div>
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {projects.length === 0 ? 'Nessun Progetto' : 'Nessun Risultato'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {projects.length === 0 
                ? 'Non hai ancora creato nessun progetto. Inizia creando il tuo primo progetto.'
                : 'Nessun progetto corrisponde ai criteri di ricerca.'}
            </p>
            {projects.length === 0 && (
              <Button onClick={() => navigate('/projects/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Crea il primo progetto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
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
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(project.type)}</span>
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{project.client_name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-foreground">{project.type}</p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{formatCurrency(project.budget)}</p>
                    <p className="text-sm text-muted-foreground">Margine: {project.margin}%</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 w-20" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-foreground">{formatDate(project.end_date)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
                            // Handle delete
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SokeyStudio