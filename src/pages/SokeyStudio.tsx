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
  Dialog

} from 'lucide-react'

import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
  // Stato per la modifica e cancellazione clienti
  const [editClient, setEditClient] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editClientData, setEditClientData] = useState({ name: '', company: '', email: '', phone: '', sector: '', status: '', activeChannels: [], lastContact: '', totalValue: 0, projects: 0 })
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteClientId, setDeleteClientId] = useState(null)
  const [deletingClient, setDeletingClient] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Stato per la CRUD progetti
  const [editProject, setEditProject] = useState(null)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [editProjectData, setEditProjectData] = useState({ clientId: '', clientName: '', name: '', type: '', status: '', budget: 0, margin: 0, startDate: '', endDate: '', progress: 0 })
  const [savingProjectEdit, setSavingProjectEdit] = useState(false)
  const [editProjectError, setEditProjectError] = useState('')
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)
  const [deleteProjectId, setDeleteProjectId] = useState(null)
  const [deletingProject, setDeletingProject] = useState(false)
  const [deleteProjectError, setDeleteProjectError] = useState('')
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [createProjectData, setCreateProjectData] = useState({ clientId: '', clientName: '', name: '', type: '', status: '', budget: 0, margin: 0, startDate: '', endDate: '', progress: 0 })
  const [creatingProject, setCreatingProject] = useState(false)
  const [createProjectError, setCreateProjectError] = useState('')

  // Stato per la CRUD proposte
  const [editProposal, setEditProposal] = useState(null)
  const [showEditProposalModal, setShowEditProposalModal] = useState(false)
  const [editProposalData, setEditProposalData] = useState({ clientName: '', title: '', amount: 0, status: '', sentDate: '', validUntil: '' })
  const [savingProposalEdit, setSavingProposalEdit] = useState(false)
  const [editProposalError, setEditProposalError] = useState('')
  const [showDeleteProposalModal, setShowDeleteProposalModal] = useState(false)
  const [deleteProposalId, setDeleteProposalId] = useState(null)
  const [deletingProposal, setDeletingProposal] = useState(false)
  const [deleteProposalError, setDeleteProposalError] = useState('')
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(false)
  const [createProposalData, setCreateProposalData] = useState({ clientName: '', title: '', amount: 0, status: '', sentDate: '', validUntil: '' })
  const [creatingProposal, setCreatingProposal] = useState(false)
  const [createProposalError, setCreateProposalError] = useState('')

  // Funzioni CRUD proposte
  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [errorProposals, setErrorProposals] = useState("");

  const fetchProposals = async () => {
    setLoadingProposals(true);
    setErrorProposals("");
    const { data, error } = await supabase.from('proposals').select('*');
    if (error) setErrorProposals(error.message);
    setProposals(data || []);
    setLoadingProposals(false);
  };

  const handleOpenCreateProposal = () => {
    setCreateProposalData({ clientName: '', title: '', amount: 0, status: '', sentDate: '', validUntil: '' });
    setCreateProposalError('');
    setShowCreateProposalModal(true);
  };

  const handleCreateProposal = async () => {
    setCreatingProposal(true);
    setCreateProposalError('');
    const { clientName, title, amount, status, sentDate, validUntil } = createProposalData;
    const { error } = await supabase.from('proposals').insert([{ clientName, title, amount, status, sentDate, validUntil }]);
    if (error) {
      setCreateProposalError(error.message);
      setCreatingProposal(false);
      return;
    }
    setShowCreateProposalModal(false);
    setCreatingProposal(false);
    fetchProposals();
  };

  const handleOpenEditProposal = (proposal: any) => {
    setEditProposalData({ ...proposal });
    setEditProposalError('');
    setShowEditProposalModal(true);
  };

  const handleSaveEditProposal = async () => {
    setSavingProposalEdit(true);
    setEditProposalError('');
    const { id, clientName, title, amount, status, sentDate, validUntil } = editProposalData;
    const { error } = await supabase.from('proposals').update({ clientName, title, amount, status, sentDate, validUntil }).eq('id', id);
    if (error) {
      setEditProposalError(error.message);
      setSavingProposalEdit(false);
      return;
    }
    setShowEditProposalModal(false);
    setSavingProposalEdit(false);
    fetchProposals();
  };

  const handleOpenDeleteProposal = (id: any) => {
    setDeleteProposalId(id);
    setDeleteProposalError('');
    setShowDeleteProposalModal(true);
  };

  const handleDeleteProposal = async () => {
    setDeletingProposal(true);
    setDeleteProposalError('');
    const { error } = await supabase.from('proposals').delete().eq('id', deleteProposalId);
    if (error) {
      setDeleteProposalError(error.message);
      setDeletingProposal(false);
      return;
    }
    setShowDeleteProposalModal(false);
    setDeletingProposal(false);
    fetchProposals();
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // Stato per la CRUD task
  // Stato per la CRUD file
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState("");
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [createFileData, setCreateFileData] = useState({ name: "", type: "", size: "", status: "", uploadDate: "" });
  const [creatingFile, setCreatingFile] = useState(false);
  const [createFileError, setCreateFileError] = useState("");
  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [editFileData, setEditFileData] = useState({ id: null, name: "", type: "", size: "", status: "", uploadDate: "" });
  const [savingFileEdit, setSavingFileEdit] = useState(false);
  const [editFileError, setEditFileError] = useState("");
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null);
  const [deletingFile, setDeletingFile] = useState(false);
  const [deleteFileError, setDeleteFileError] = useState("");

  // Funzioni CRUD file
  const fetchFiles = async () => {
    setLoadingFiles(true);
    setErrorFiles("");
    const { data, error } = await supabase.from('files').select('*');
    if (error) setErrorFiles(error.message);
    setFiles(data || []);
    setLoadingFiles(false);
  };

  const handleOpenCreateFile = () => {
    setCreateFileData({ name: "", type: "", size: "", status: "", uploadDate: "" });
    setCreateFileError("");
    setShowCreateFileModal(true);
  };

  const handleCreateFile = async () => {
    setCreatingFile(true);
    setCreateFileError("");
    const { name, type, size, status, uploadDate } = createFileData;
    const { error } = await supabase.from('files').insert([{ name, type, size, status, uploadDate }]);
    if (error) {
      setCreateFileError(error.message);
      setCreatingFile(false);
      return;
    }
    setShowCreateFileModal(false);
    setCreatingFile(false);
    fetchFiles();
  };

  const handleOpenEditFile = (file: any) => {
    setEditFileData({ ...file });
    setEditFileError("");
    setShowEditFileModal(true);
  };

  const handleSaveEditFile = async () => {
    setSavingFileEdit(true);
    setEditFileError("");
    const { id, name, type, size, status, uploadDate } = editFileData;
    const { error } = await supabase.from('files').update({ name, type, size, status, uploadDate }).eq('id', id);
    if (error) {
      setEditFileError(error.message);
      setSavingFileEdit(false);
      return;
    }
    setShowEditFileModal(false);
    setSavingFileEdit(false);
    fetchFiles();
  };

  const handleOpenDeleteFile = (id: any) => {
    setDeleteFileId(id);
    setDeleteFileError("");
    setShowDeleteFileModal(true);
  };

  const handleDeleteFile = async () => {
    setDeletingFile(true);
    setDeleteFileError("");
    const { error } = await supabase.from('files').delete().eq('id', deleteFileId);
    if (error) {
      setDeleteFileError(error.message);
      setDeletingFile(false);
      return;
    }
    setShowDeleteFileModal(false);
    setDeletingFile(false);
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [errorTasks, setErrorTasks] = useState("")
  const [editTask, setEditTask] = useState(null)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [editTaskData, setEditTaskData] = useState({ title: '', description: '', project: '', assignedTo: '', priority: '', status: '', dueDate: '' })
  const [savingTaskEdit, setSavingTaskEdit] = useState(false)
  const [editTaskError, setEditTaskError] = useState('')
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [deleteTaskId, setDeleteTaskId] = useState(null)
  const [deletingTask, setDeletingTask] = useState(false)
  const [deleteTaskError, setDeleteTaskError] = useState('')
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [createTaskData, setCreateTaskData] = useState({ title: '', description: '', project: '', assignedTo: '', priority: '', status: '', dueDate: '' })
  const [creatingTask, setCreatingTask] = useState(false)
  const [createTaskError, setCreateTaskError] = useState('')

   // Funzione per aprire la modale di modifica
   const handleOpenEditClient = (client) => {
     setEditClient(client)
     setEditClientData({ ...client })
     setShowEditModal(true)
     setEditError('')
   }
   // Funzione per salvare la modifica
   const handleSaveEditClient = async () => {
     setSavingEdit(true)
     setEditError('')
     const { id, ...updateData } = editClientData
     const { error } = await supabase.from('clients').update(updateData).eq('id', id)
     setSavingEdit(false)
     if (error) {
       setEditError(error.message)
       return
     }
     setShowEditModal(false)
     setEditClient(null)
     fetchClients && fetchClients()
   }

   // Funzioni CRUD per task
   const handleOpenEditTask = (task) => {
     setEditTask(task)
     setEditTaskData({ ...task })
     setShowEditTaskModal(true)
     setEditTaskError('')
   }
   const handleSaveEditTask = async () => {
     setSavingTaskEdit(true)
     setEditTaskError('')
     const { id, ...updateData } = editTaskData
     const { error } = await supabase.from('tasks').update(updateData).eq('id', id)
     setSavingTaskEdit(false)
     if (error) {
       setEditTaskError(error.message)
       return
     }
     setShowEditTaskModal(false)
     setEditTask(null)
     fetchTasks && fetchTasks()
   }
   const handleOpenDeleteTask = (taskId) => {
     setDeleteTaskId(taskId)
     setShowDeleteTaskModal(true)
     setDeleteTaskError('')
   }
   const handleDeleteTask = async () => {
     setDeletingTask(true)
     setDeleteTaskError('')
     const { error } = await supabase.from('tasks').delete().eq('id', deleteTaskId)
     setDeletingTask(false)
     if (error) {
       setDeleteTaskError(error.message)
       return
     }
     setShowDeleteTaskModal(false)
     setDeleteTaskId(null)
     fetchTasks && fetchTasks()
   }
   const handleOpenCreateTask = () => {
     setShowCreateTaskModal(true)
     setCreateTaskData({ title: '', description: '', project: '', assignedTo: '', priority: '', status: '', dueDate: '' })
     setCreateTaskError('')
   }
   const handleCreateTask = async () => {
     setCreatingTask(true)
     setCreateTaskError('')
     const { error } = await supabase.from('tasks').insert([createTaskData])
     setCreatingTask(false)
     if (error) {
       setCreateTaskError(error.message)
       return
     }
     setShowCreateTaskModal(false)
     fetchTasks && fetchTasks()
   }

   // Funzioni CRUD per progetti
   const handleOpenEditProject = (project) => {
     setEditProject(project)
     setEditProjectData({ ...project })
     setShowEditProjectModal(true)
     setEditProjectError('')
   }
   const handleSaveEditProject = async () => {
     setSavingProjectEdit(true)
     setEditProjectError('')
     const { id, ...updateData } = editProjectData
     const { error } = await supabase.from('projects').update(updateData).eq('id', id)
     setSavingProjectEdit(false)
     if (error) {
       setEditProjectError(error.message)
       return
     }
     setShowEditProjectModal(false)
     setEditProject(null)
     fetchProjects && fetchProjects()
   }
   const handleOpenDeleteProject = (projectId) => {
     setDeleteProjectId(projectId)
     setShowDeleteProjectModal(true)
     setDeleteProjectError('')
   }
   const handleDeleteProject = async () => {
     setDeletingProject(true)
     setDeleteProjectError('')
     const { error } = await supabase.from('projects').delete().eq('id', deleteProjectId)
     setDeletingProject(false)
     if (error) {
       setDeleteProjectError(error.message)
       return
     }
     setShowDeleteProjectModal(false)
     setDeleteProjectId(null)
     fetchProjects && fetchProjects()
   }
   const handleOpenCreateProject = () => {
     setShowCreateProjectModal(true)
     setCreateProjectData({ clientId: '', clientName: '', name: '', type: '', status: '', budget: 0, margin: 0, startDate: '', endDate: '', progress: 0 })
     setCreateProjectError('')
   }
   const handleCreateProject = async () => {
     setCreatingProject(true)
     setCreateProjectError('')
     const { error } = await supabase.from('projects').insert([createProjectData])
     setCreatingProject(false)
     if (error) {
       setCreateProjectError(error.message)
       return
     }
     setShowCreateProjectModal(false)
     fetchProjects && fetchProjects()
   }
   // Funzione per aprire la conferma eliminazione
   const handleOpenDeleteClient = (clientId) => {
     setDeleteClientId(clientId)
     setShowDeleteModal(true)
     setDeleteError('')
   }
   // Funzione per eliminare il cliente
   const handleDeleteClient = async () => {
     setDeletingClient(true)
     setDeleteError('')
     const { error } = await supabase.from('clients').delete().eq('id', deleteClientId)
     setDeletingClient(false)
     if (error) {
       setDeleteError(error.message)
       return
     }
     setShowDeleteModal(false)
     setDeleteClientId(null)
     fetchClients && fetchClients()
   }

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
          {/* Modali Proposte */}
          {showCreateProposalModal && (
            <Dialog open={showCreateProposalModal} onOpenChange={setShowCreateProposalModal}>
              <Dialog.Content>
                <Dialog.Title>Nuova Proposta</Dialog.Title>
                <div className="space-y-2">
                  <input className="input" placeholder="Cliente" value={createProposalData.clientName} onChange={e => setCreateProposalData({ ...createProposalData, clientName: e.target.value })} />
                  <input className="input" placeholder="Titolo" value={createProposalData.title} onChange={e => setCreateProposalData({ ...createProposalData, title: e.target.value })} />
                  <input className="input" placeholder="Importo" type="number" value={createProposalData.amount} onChange={e => setCreateProposalData({ ...createProposalData, amount: Number(e.target.value) })} />
                  <input className="input" placeholder="Stato" value={createProposalData.status} onChange={e => setCreateProposalData({ ...createProposalData, status: e.target.value })} />
                  <input className="input" placeholder="Data Invio" type="date" value={createProposalData.sentDate} onChange={e => setCreateProposalData({ ...createProposalData, sentDate: e.target.value })} />
                  <input className="input" placeholder="Valida fino" type="date" value={createProposalData.validUntil} onChange={e => setCreateProposalData({ ...createProposalData, validUntil: e.target.value })} />
                  {createProposalError && <div className="text-red-500 text-sm">{createProposalError}</div>}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="default" loading={creatingProposal} className="flex-1" onClick={handleCreateProposal}>Crea</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreateProposalModal(false)}>Annulla</Button>
                </div>
              </Dialog.Content>
            </Dialog>
          )}
          {showEditProposalModal && (
            <Dialog open={showEditProposalModal} onOpenChange={setShowEditProposalModal}>
              <Dialog.Content>
                <Dialog.Title>Modifica Proposta</Dialog.Title>
                <div className="space-y-2">
                  <input className="input" placeholder="Cliente" value={editProposalData.clientName} onChange={e => setEditProposalData({ ...editProposalData, clientName: e.target.value })} />
                  <input className="input" placeholder="Titolo" value={editProposalData.title} onChange={e => setEditProposalData({ ...editProposalData, title: e.target.value })} />
                  <input className="input" placeholder="Importo" type="number" value={editProposalData.amount} onChange={e => setEditProposalData({ ...editProposalData, amount: Number(e.target.value) })} />
                  <input className="input" placeholder="Stato" value={editProposalData.status} onChange={e => setEditProposalData({ ...editProposalData, status: e.target.value })} />
                  <input className="input" placeholder="Data Invio" type="date" value={editProposalData.sentDate} onChange={e => setEditProposalData({ ...editProposalData, sentDate: e.target.value })} />
                  <input className="input" placeholder="Valida fino" type="date" value={editProposalData.validUntil} onChange={e => setEditProposalData({ ...editProposalData, validUntil: e.target.value })} />
                  {editProposalError && <div className="text-red-500 text-sm">{editProposalError}</div>}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="default" loading={savingProposalEdit} className="flex-1" onClick={handleSaveEditProposal}>Salva</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditProposalModal(false)}>Annulla</Button>
                </div>
              </Dialog.Content>
            </Dialog>
          )}
          {showDeleteProposalModal && (
            <Dialog open={showDeleteProposalModal} onOpenChange={setShowDeleteProposalModal}>
              <Dialog.Content>
                <Dialog.Title>Elimina Proposta</Dialog.Title>
                <p>Sei sicuro di voler eliminare questa proposta? L'operazione non è reversibile.</p>
                {deleteProposalError && <div className="text-red-500 text-sm">{deleteProposalError}</div>}
                <div className="flex space-x-2 mt-4">
                  <Button variant="destructive" loading={deletingProposal} className="flex-1" onClick={handleDeleteProposal}>Elimina</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowDeleteProposalModal(false)}>Annulla</Button>
                </div>
              </Dialog.Content>
            </Dialog>
          )}
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
          {loadingClients ? (
            <div className="py-8 text-center text-muted-foreground">Caricamento clienti...</div>
          ) : errorClients ? (
            <div className="py-8 text-center text-red-500">Errore: {errorClients}</div>
          ) : clients.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nessun cliente trovato.</div>
          ) : (
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
                      <Button size="sm" className="flex-1" onClick={() => handleOpenEditClient(client)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleOpenDeleteClient(client.id)}>
                        Elimina
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          )}

        {/* Modale Modifica Cliente */}
        {showEditModal && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <Dialog.Content>
              <Dialog.Title>Modifica Cliente</Dialog.Title>
              <form onSubmit={e => { e.preventDefault(); handleSaveEditClient(); }} className="space-y-4">
                <input type="text" className="input-field w-full" placeholder="Nome" value={editClientData.name} onChange={e => setEditClientData({ ...editClientData, name: e.target.value })} required />
                <input type="text" className="input-field w-full" placeholder="Azienda" value={editClientData.company} onChange={e => setEditClientData({ ...editClientData, company: e.target.value })} />
                <input type="email" className="input-field w-full" placeholder="Email" value={editClientData.email} onChange={e => setEditClientData({ ...editClientData, email: e.target.value })} />
                <input type="text" className="input-field w-full" placeholder="Telefono" value={editClientData.phone} onChange={e => setEditClientData({ ...editClientData, phone: e.target.value })} />
                <input type="text" className="input-field w-full" placeholder="Settore" value={editClientData.sector} onChange={e => setEditClientData({ ...editClientData, sector: e.target.value })} />
                <input type="text" className="input-field w-full" placeholder="Stato" value={editClientData.status} onChange={e => setEditClientData({ ...editClientData, status: e.target.value })} />
                <input type="number" className="input-field w-full" placeholder="Valore Totale" value={editClientData.totalValue} onChange={e => setEditClientData({ ...editClientData, totalValue: Number(e.target.value) })} />
                {editError && <div className="text-red-500 text-sm">{editError}</div>}
                <div className="flex space-x-2 mt-4">
                  <Button type="submit" loading={savingEdit} className="flex-1">Salva</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>Annulla</Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog>
        )}
        {/* Modale Conferma Eliminazione */}
        {showDeleteModal && (
          <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <Dialog.Content>
              <Dialog.Title>Elimina Cliente</Dialog.Title>
              <p>Sei sicuro di voler eliminare questo cliente? L'operazione non è reversibile.</p>
              {deleteError && <div className="text-red-500 text-sm">{deleteError}</div>}
              <div className="flex space-x-2 mt-4">
                <Button variant="destructive" loading={deletingClient} className="flex-1" onClick={handleDeleteClient}>Elimina</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Annulla</Button>
              </div>
            </Dialog.Content>
          </Dialog>
        )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Projects Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tutti i Progetti</CardTitle>
                  <CardDescription>Gestione completa dei progetti fotografici e video</CardDescription>
                </div>
                <Button variant="default" onClick={handleOpenCreateProject}>
                  <Plus className="w-4 h-4 mr-2" /> Nuovo Progetto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingProjects ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento progetti...</div>
              ) : errorProjects ? (
                <div className="py-8 text-center text-red-500">Errore: {errorProjects}</div>
              ) : projects.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessun progetto trovato.</div>
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
                    {projects.map((project) => {
                      const Icon = getProjectIcon(project.type)
                      return (
                        <tr key={project.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
  <Progress value={project.progress} />
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
    <Button size="sm" variant="outline" onClick={() => handleOpenEditProject(project)}>
      <Edit className="w-4 h-4" />
    </Button>
    <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteProject(project.id)}>
      Elimina
    </Button>
  </div>
</td>
</tr>">
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
                              <Button size="sm" variant="outline" onClick={() => handleOpenEditProject(project)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteProject(project.id)}>
                                Elimina
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              )}
            </CardContent>
          </Card>
        {/* Modale Creazione Progetto */}
        {showCreateProjectModal && (
          <Dialog open={showCreateProjectModal} onOpenChange={setShowCreateProjectModal}>
            <Dialog.Content>
              <Dialog.Title>Nuovo Progetto</Dialog.Title>
              <div className="space-y-2">
                <input className="input" placeholder="Nome Progetto" value={createProjectData.name} onChange={e => setCreateProjectData({ ...createProjectData, name: e.target.value })} />
                <input className="input" placeholder="Cliente" value={createProjectData.clientName} onChange={e => setCreateProjectData({ ...createProjectData, clientName: e.target.value })} />
                <input className="input" placeholder="Tipo" value={createProjectData.type} onChange={e => setCreateProjectData({ ...createProjectData, type: e.target.value })} />
                <input className="input" placeholder="Stato" value={createProjectData.status} onChange={e => setCreateProjectData({ ...createProjectData, status: e.target.value })} />
                <input className="input" placeholder="Budget" type="number" value={createProjectData.budget} onChange={e => setCreateProjectData({ ...createProjectData, budget: Number(e.target.value) })} />
                <input className="input" placeholder="Margine" type="number" value={createProjectData.margin} onChange={e => setCreateProjectData({ ...createProjectData, margin: Number(e.target.value) })} />
                <input className="input" placeholder="Data Inizio" type="date" value={createProjectData.startDate} onChange={e => setCreateProjectData({ ...createProjectData, startDate: e.target.value })} />
                <input className="input" placeholder="Data Fine" type="date" value={createProjectData.endDate} onChange={e => setCreateProjectData({ ...createProjectData, endDate: e.target.value })} />
                <input className="input" placeholder="Progresso (%)" type="number" value={createProjectData.progress} onChange={e => setCreateProjectData({ ...createProjectData, progress: Number(e.target.value) })} />
                {createProjectError && <div className="text-red-500 text-sm">{createProjectError}</div>}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="default" loading={creatingProject} className="flex-1" onClick={handleCreateProject}>Crea</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateProjectModal(false)}>Annulla</Button>
              </div>
            </Dialog.Content>
          </Dialog>
        )}
        {/* Modale Modifica Progetto */}
        {showEditProjectModal && (
          <Dialog open={showEditProjectModal} onOpenChange={setShowEditProjectModal}>
            <Dialog.Content>
              <Dialog.Title>Modifica Progetto</Dialog.Title>
              <div className="space-y-2">
                <input className="input" placeholder="Nome Progetto" value={editProjectData.name} onChange={e => setEditProjectData({ ...editProjectData, name: e.target.value })} />
                <input className="input" placeholder="Cliente" value={editProjectData.clientName} onChange={e => setEditProjectData({ ...editProjectData, clientName: e.target.value })} />
                <input className="input" placeholder="Tipo" value={editProjectData.type} onChange={e => setEditProjectData({ ...editProjectData, type: e.target.value })} />
                <input className="input" placeholder="Stato" value={editProjectData.status} onChange={e => setEditProjectData({ ...editProjectData, status: e.target.value })} />
                <input className="input" placeholder="Budget" type="number" value={editProjectData.budget} onChange={e => setEditProjectData({ ...editProjectData, budget: Number(e.target.value) })} />
                <input className="input" placeholder="Margine" type="number" value={editProjectData.margin} onChange={e => setEditProjectData({ ...editProjectData, margin: Number(e.target.value) })} />
                <input className="input" placeholder="Data Inizio" type="date" value={editProjectData.startDate} onChange={e => setEditProjectData({ ...editProjectData, startDate: e.target.value })} />
                <input className="input" placeholder="Data Fine" type="date" value={editProjectData.endDate} onChange={e => setEditProjectData({ ...editProjectData, endDate: e.target.value })} />
                <input className="input" placeholder="Progresso (%)" type="number" value={editProjectData.progress} onChange={e => setEditProjectData({ ...editProjectData, progress: Number(e.target.value) })} />
                {editProjectError && <div className="text-red-500 text-sm">{editProjectError}</div>}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="default" loading={savingProjectEdit} className="flex-1" onClick={handleSaveEditProject}>Salva</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowEditProjectModal(false)}>Annulla</Button>
              </div>
            </Dialog.Content>
          </Dialog>
        )}
        {/* Modale Conferma Eliminazione Progetto */}
        {showDeleteProjectModal && (
          <Dialog open={showDeleteProjectModal} onOpenChange={setShowDeleteProjectModal}>
            <Dialog.Content>
              <Dialog.Title>Elimina Progetto</Dialog.Title>
              <p>Sei sicuro di voler eliminare questo progetto? L'operazione non è reversibile.</p>
              {deleteProjectError && <div className="text-red-500 text-sm">{deleteProjectError}</div>}
              <div className="flex space-x-2 mt-4">
                <Button variant="destructive" loading={deletingProject} className="flex-1" onClick={handleDeleteProject}>Elimina</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteProjectModal(false)}>Annulla</Button>
              </div>
            </Dialog.Content>
          </Dialog>
        )}
        </div>
      )

      {/* Sezione Task */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tutti i Task</CardTitle>
                  <CardDescription>Gestione completa dei task</CardDescription>
                </div>
                <Button variant="default" onClick={handleOpenCreateTask}>
                  <Plus className="w-4 h-4 mr-2" /> Nuovo Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento task...</div>
              ) : errorTasks ? (
                <div className="py-8 text-center text-red-500">Errore: {errorTasks}</div>
              ) : tasks.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessun task trovato.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Titolo</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descrizione</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progetto</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assegnato a</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Priorità</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Scadenza</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{task.title}</td>
                          <td className="py-3 px-4">{task.description}</td>
                          <td className="py-3 px-4">{task.project}</td>
                          <td className="py-3 px-4">{task.assignedTo}</td>
                          <td className="py-3 px-4">{task.priority}</td>
                          <td className="py-3 px-4">{task.status}</td>
                          <td className="py-3 px-4">{formatDate(task.dueDate)}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleOpenEditTask(task)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteTask(task.id)}>
                                Elimina
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Modali Task */}
           {showCreateTaskModal && (
             <Dialog open={showCreateTaskModal} onOpenChange={setShowCreateTaskModal}>
               <Dialog.Content>
                 <Dialog.Title>Nuovo Task</Dialog.Title>
                 <div className="space-y-2">
                   <input className="input" placeholder="Titolo" value={createTaskData.title} onChange={e => setCreateTaskData({ ...createTaskData, title: e.target.value })} />
                   <input className="input" placeholder="Descrizione" value={createTaskData.description} onChange={e => setCreateTaskData({ ...createTaskData, description: e.target.value })} />
                   <input className="input" placeholder="Progetto" value={createTaskData.project} onChange={e => setCreateTaskData({ ...createTaskData, project: e.target.value })} />
                   <input className="input" placeholder="Assegnato a" value={createTaskData.assignedTo} onChange={e => setCreateTaskData({ ...createTaskData, assignedTo: e.target.value })} />
                   <input className="input" placeholder="Priorità" value={createTaskData.priority} onChange={e => setCreateTaskData({ ...createTaskData, priority: e.target.value })} />
                   <input className="input" placeholder="Stato" value={createTaskData.status} onChange={e => setCreateTaskData({ ...createTaskData, status: e.target.value })} />
                   <input className="input" placeholder="Scadenza" type="date" value={createTaskData.dueDate} onChange={e => setCreateTaskData({ ...createTaskData, dueDate: e.target.value })} />
                   {createTaskError && <div className="text-red-500 text-sm">{createTaskError}</div>}
                 </div>
                 <div className="flex space-x-2 mt-4">
                   <Button variant="default" loading={creatingTask} className="flex-1" onClick={handleCreateTask}>Crea</Button>
                   <Button variant="outline" className="flex-1" onClick={() => setShowCreateTaskModal(false)}>Annulla</Button>
                 </div>
               </Dialog.Content>
             </Dialog>
           )}
           {showEditTaskModal && (
             <Dialog open={showEditTaskModal} onOpenChange={setShowEditTaskModal}>
               <Dialog.Content>
                 <Dialog.Title>Modifica Task</Dialog.Title>
                 <div className="space-y-2">
                   <input className="input" placeholder="Titolo" value={editTaskData.title} onChange={e => setEditTaskData({ ...editTaskData, title: e.target.value })} />
                   <input className="input" placeholder="Descrizione" value={editTaskData.description} onChange={e => setEditTaskData({ ...editTaskData, description: e.target.value })} />
                   <input className="input" placeholder="Progetto" value={editTaskData.project} onChange={e => setEditTaskData({ ...editTaskData, project: e.target.value })} />
                   <input className="input" placeholder="Assegnato a" value={editTaskData.assignedTo} onChange={e => setEditTaskData({ ...editTaskData, assignedTo: e.target.value })} />
                   <input className="input" placeholder="Priorità" value={editTaskData.priority} onChange={e => setEditTaskData({ ...editTaskData, priority: e.target.value })} />
                   <input className="input" placeholder="Stato" value={editTaskData.status} onChange={e => setEditTaskData({ ...editTaskData, status: e.target.value })} />
                   <input className="input" placeholder="Scadenza" type="date" value={editTaskData.dueDate} onChange={e => setEditTaskData({ ...editTaskData, dueDate: e.target.value })} />
                   {editTaskError && <div className="text-red-500 text-sm">{editTaskError}</div>}
                 </div>
                 <div className="flex space-x-2 mt-4">
                   <Button variant="default" loading={savingTaskEdit} className="flex-1" onClick={handleSaveEditTask}>Salva</Button>
                   <Button variant="outline" className="flex-1" onClick={() => setShowEditTaskModal(false)}>Annulla</Button>
                 </div>
               </Dialog.Content>
             </Dialog>
           )}
           {showDeleteTaskModal && (
             <Dialog open={showDeleteTaskModal} onOpenChange={setShowDeleteTaskModal}>
               <Dialog.Content>
                 <Dialog.Title>Elimina Task</Dialog.Title>
                 <p>Sei sicuro di voler eliminare questo task? L'operazione non è reversibile.</p>
                 {deleteTaskError && <div className="text-red-500 text-sm">{deleteTaskError}</div>}
                 <div className="flex space-x-2 mt-4">
                   <Button variant="destructive" loading={deletingTask} className="flex-1" onClick={handleDeleteTask}>Elimina</Button>
                   <Button variant="outline" className="flex-1" onClick={() => setShowDeleteTaskModal(false)}>Annulla</Button>
                 </div>
               </Dialog.Content>
             </Dialog>
           )}
         </div>
       )

      {/* Sezione File */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File</CardTitle>
              <CardDescription>Gestione file del sistema</CardDescription>
              <Button onClick={handleOpenCreateFile} className="mt-2">Nuovo File</Button>
            </CardHeader>
            <CardContent>
              {loadingFiles ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento file...</div>
              ) : errorFiles ? (
                <div className="py-8 text-center text-red-500">Errore: {errorFiles}</div>
              ) : files.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessun file trovato.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nome</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Dimensione</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Caricato il</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr key={file.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{file.name}</td>
                          <td className="py-3 px-4">{file.type}</td>
                          <td className="py-3 px-4">{file.size}</td>
                          <td className="py-3 px-4">{file.status}</td>
                          <td className="py-3 px-4">{formatDate(file.uploadDate)}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleOpenEditFile(file)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteFile(file.id)}>
                                Elimina
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Modali File */}
          {showCreateFileModal && (
            <Dialog open={showCreateFileModal} onOpenChange={setShowCreateFileModal}>
              <Dialog.Content>
                <Dialog.Title>Nuovo File</Dialog.Title>
                <div className="space-y-2">
                  <input className="input" placeholder="Nome" value={createFileData.name} onChange={e => setCreateFileData({ ...createFileData, name: e.target.value })} />
                  <input className="input" placeholder="Tipo" value={createFileData.type} onChange={e => setCreateFileData({ ...createFileData, type: e.target.value })} />
                  <input className="input" placeholder="Dimensione" value={createFileData.size} onChange={e => setCreateFileData({ ...createFileData, size: e.target.value })} />
                  <input className="input" placeholder="Stato" value={createFileData.status} onChange={e => setCreateFileData({ ...createFileData, status: e.target.value })} />
                  <input className="input" placeholder="Data di caricamento" type="date" value={createFileData.uploadDate} onChange={e => setCreateFileData({ ...createFileData, uploadDate: e.target.value })} />
                  {createFileError && <div className="text-red-500 text-sm">{createFileError}</div>}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="default" loading={creatingFile} className="flex-1" onClick={handleCreateFile}>Crea</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreateFileModal(false)}>Annulla</Button>
                </div>
              </Dialog.Content>
            </Dialog>
          )}
          {showEditFileModal && (
            <Dialog open={showEditFileModal} onOpenChange={setShowEditFileModal}>
              <Dialog.Content>
                <Dialog.Title>Modifica File</Dialog.Title>
                <div className="space-y-2">
                  <input className="input" placeholder="Nome" value={editFileData.name} onChange={e => setEditFileData({ ...editFileData, name: e.target.value })} />
                  <input className="input" placeholder="Tipo" value={editFileData.type} onChange={e => setEditFileData({ ...editFileData, type: e.target.value })} />
                  <input className="input" placeholder="Dimensione" value={editFileData.size} onChange={e => setEditFileData({ ...editFileData, size: e.target.value })} />
                  <input className="input" placeholder="Stato" value={editFileData.status} onChange={e => setEditFileData({ ...editFileData, status: e.target.value })} />
                  <input className="input" placeholder="Data di caricamento" type="date" value={editFileData.uploadDate} onChange={e => setEditFileData({ ...editFileData, uploadDate: e.target.value })} />
                  {editFileError && <div className="text-red-500 text-sm">{editFileError}</div>}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="default" loading={savingFileEdit} className="flex-1" onClick={handleSaveEditFile}>Salva</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditFileModal(false)}>Annulla</Button>
                </div>
              </Dialog.Content>
            </Dialog>
          )}
          {showDeleteFileModal && (
            <Dialog open={showDeleteFileModal} onOpenChange={setShowDeleteFileModal}>
              <Dialog.Content>
                <Dialog.Title>Elimina File</Dialog.Title>
                <p>Sei sicuro di voler eliminare questo file? L'operazione non è reversibile.</p>
                {deleteFileError && <div className="text-red-500 text-sm">{deleteFileError}</div>}
                <div className="flex space-x-2 mt-4">
                  <Button variant="destructive" loading={deletingFile} className="flex-1" onClick={handleDeleteFile}>Elimina</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowDeleteFileModal(false)}>Annulla</Button>
                </div>
              </Dialog.Content>
            </Dialog>
          )}
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="space-y-6">
          {/* Proposals */}
          <Card>
            <CardHeader>
              <CardTitle>Proposte e Preventivi</CardTitle>
              <CardDescription>Gestione proposte commerciali e preventivi</CardDescription>
              <Button onClick={handleOpenCreateProposal} className="mt-2">Nuova Proposta</Button>
            </CardHeader>
            <CardContent>
              {loadingProposals ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento proposte...</div>
              ) : errorProposals ? (
                <div className="py-8 text-center text-red-500">Errore: {errorProposals}</div>
              ) : proposals.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessuna proposta trovata.</div>
              ) : (
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
                      <Button size="sm" variant="outline" onClick={() => handleOpenEditProposal(proposal)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteProposal(proposal.id)}>
                        Elimina
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

  useEffect(() => {
    async function fetchClients() {
      setLoadingClients(true)
      setErrorClients("")
      const { data, error } = await supabase.from('clients').select('*')
      if (error) setErrorClients(error.message)
      setClients(data || [])
      setLoadingClients(false)
    }
    fetchClients()
  }, [])

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true)
      setErrorProjects("")
      const { data, error } = await supabase.from('projects').select('*')
      if (error) setErrorProjects(error.message)
      setProjects(data || [])
      setLoadingProjects(false)
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    async function fetchProposals() {
      setLoadingProposals(true)
      setErrorProposals("")
      const { data, error } = await supabase.from('proposals').select('*')
      if (error) setErrorProposals(error.message)
      setProposals(data || [])
      setLoadingProposals(false)
    }
    fetchProposals()
  }, [])

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
          {loadingClients ? (
            <div className="py-8 text-center text-muted-foreground">Caricamento clienti...</div>
          ) : errorClients ? (
            <div className="py-8 text-center text-red-500">Errore: {errorClients}</div>
          ) : clients.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nessun cliente trovato.</div>
          ) : (
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
          )}
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
              {loadingProjects ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento progetti...</div>
              ) : errorProjects ? (
                <div className="py-8 text-center text-red-500">Errore: {errorProjects}</div>
              ) : projects.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessun progetto trovato.</div>
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
              )}
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
              {loadingProposals ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento proposte...</div>
              ) : errorProposals ? (
                <div className="py-8 text-center text-red-500">Errore: {errorProposals}</div>
              ) : proposals.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessuna proposta trovata.</div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

  useEffect(() => {
    async function fetchClients() {
      setLoadingClients(true)
      setErrorClients("")
      const { data, error } = await supabase.from('clients').select('*')
      if (error) setErrorClients(error.message)
      setClients(data || [])
      setLoadingClients(false)
    }
    fetchClients()
  }, [])

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true)
      setErrorProjects("")
      const { data, error } = await supabase.from('projects').select('*')
      if (error) setErrorProjects(error.message)
      setProjects(data || [])
      setLoadingProjects(false)
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    async function fetchProposals() {
      setLoadingProposals(true)
      setErrorProposals("")
      const { data, error } = await supabase.from('proposals').select('*')
      if (error) setErrorProposals(error.message)
      setProposals(data || [])
      setLoadingProposals(false)
    }
    fetchProposals()
  }, [])

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
          {loadingClients ? (
            <div className="py-8 text-center text-muted-foreground">Caricamento clienti...</div>
          ) : errorClients ? (
            <div className="py-8 text-center text-red-500">Errore: {errorClients}</div>
          ) : clients.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Nessun cliente trovato.</div>
          ) : (
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
          )}
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
              {loadingProjects ? (
                <div className="py-8 text-center text-muted-foreground">Caricamento progetti...</div>
              ) : errorProjects ? (
                <div className="py-8 text-center text-red-500">Errore: {errorProjects}</div>
              ) : projects.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">Nessun progetto trovato.</div>
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
                          <td className="py-3 px-4