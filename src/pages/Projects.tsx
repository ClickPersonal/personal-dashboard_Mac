import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Euro, User, Filter, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AddProjectModal } from '@/components/modals/AddProjectModal'
import { projectService, clientService } from '@/lib/database'
import type { Project, Client } from '@/lib/supabase'
import { Link, useLocation } from 'react-router-dom'

export function Projects() {
  const location = useLocation()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

  // Determina il settore corrente dall'URL
  const getCurrentSector = () => {
    const path = location.pathname
    if (path.includes('/studio/')) return 'studio'
    if (path.includes('/prizm/')) return 'prizm'
    if (path.includes('/statale/')) return 'statale'
    return 'all'
  }

  const currentSector = getCurrentSector()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, statusFilter, areaFilter, currentSector])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projectsData, clientsData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll()
      ])
      setProjects(projectsData)
      setClients(clientsData)
    } catch (err) {
      setError('Errore nel caricamento dei progetti')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = projects

    // Filtra per settore corrente
    if (currentSector !== 'all') {
      filtered = filtered.filter(project => project.area === currentSector)
    }

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    if (areaFilter) {
      filtered = filtered.filter(project => project.area === areaFilter)
    }

    setFilteredProjects(filtered)
  }

  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev])
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo progetto?')) {
      return
    }

    try {
      await projectService.delete(projectId)
      setProjects(prev => prev.filter(project => project.id !== projectId))
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Errore durante l\'eliminazione del progetto')
    }
  }

  const handleFileUpload = (projectId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*,video/*,.pdf,.doc,.docx'
    
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files || files.length === 0) return

      setUploadingFiles(prev => new Set(prev).add(projectId))
      
      try {
        // Simula upload - in un'app reale useresti Supabase Storage
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        alert(`${files.length} file caricati con successo per il progetto!`)
      } catch (err) {
        console.error('Error uploading files:', err)
        alert('Errore durante il caricamento dei file')
      } finally {
        setUploadingFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(projectId)
          return newSet
        })
      }
    }
    
    input.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'review':
        return 'bg-yellow-100 text-yellow-800'
      case 'idea':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo'
      case 'completed':
        return 'Completato'
      case 'review':
        return 'In Revisione'
      case 'idea':
        return 'Idea'
      default:
        return status
    }
  }

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'studio':
        return 'bg-blue-100 text-blue-800'
      case 'prizm':
        return 'bg-purple-100 text-purple-800'
      case 'statale':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAreaText = (area: string) => {
    switch (area) {
      case 'studio':
        return 'Sokey Studio'
      case 'prizm':
        return 'Prizm'
      case 'statale':
        return 'Lavoro Statale'
      default:
        return area
    }
  }

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'Nessun cliente'
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : 'Cliente sconosciuto'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento progetti...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progetti</h1>
          <p className="text-gray-600">Gestisci i tuoi progetti e monitora i progressi</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Aggiungi Progetto
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cerca progetti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tutti gli status</option>
              <option value="idea">Idea</option>
              <option value="active">Attivo</option>
              <option value="review">In Revisione</option>
              <option value="completed">Completato</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tutte le aree</option>
              <option value="studio">Sokey Studio</option>
              <option value="prizm">Prizm</option>
              <option value="statale">Lavoro Statale</option>
            </select>
          </div>
          <Button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('')
              setAreaFilter('')
            }}
            variant="outline"
            className="w-full"
          >
            Reset Filtri
          </Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
          <div className="text-sm text-gray-600">Totale Progetti</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {projects.filter(p => p.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Progetti Attivi</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Progetti Completati</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {projects.filter(p => p.status === 'idea').length}
          </div>
          <div className="text-sm text-gray-600">Idee</div>
        </Card>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm || statusFilter || areaFilter ? 'Nessun progetto trovato per i filtri correnti.' : 'Nessun progetto presente.'}
          </div>
          {!searchTerm && !statusFilter && !areaFilter && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Aggiungi il primo progetto
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAreaColor(project.area)}`}>
                      {getAreaText(project.area)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Link
                    to={`/projects/${project.id}`}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFileUpload(project.id)}
                    className={`p-1 transition-colors ${
                      uploadingFiles.has(project.id)
                        ? 'text-green-600 animate-pulse'
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                    title={uploadingFiles.has(project.id) ? 'Caricamento in corso...' : 'Upload file'}
                    disabled={uploadingFiles.has(project.id)}
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="space-y-2">
                {project.client_id && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{getClientName(project.client_id)}</span>
                  </div>
                )}
                {project.budget && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Euro className="h-4 w-4 mr-2" />
                    <span>€{project.budget.toLocaleString('it-IT')}</span>
                    {project.margin && (
                      <span className="ml-2 text-green-600">({project.margin}% margine)</span>
                    )}
                  </div>
                )}
                {project.start_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Inizio: {new Date(project.start_date).toLocaleDateString('it-IT')}</span>
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Fine: {new Date(project.end_date).toLocaleDateString('it-IT')}</span>
                  </div>
                )}
              </div>

              {project.created_at && (
                <div className="mt-4 text-xs text-gray-500">
                  Creato il {new Date(project.created_at).toLocaleDateString('it-IT')}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddProject}
      />
    </div>
  )
}