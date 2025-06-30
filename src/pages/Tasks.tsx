import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, CheckSquare, Clock, Flag, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AddTaskModal } from '@/components/modals/AddTaskModal'
import { taskService, projectService } from '@/lib/database'
import type { Task, Project } from '@/lib/supabase'

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter, assigneeFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(tasksData)
      setProjects(projectsData)
    } catch (err) {
      setError('Errore nel caricamento dei task')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    if (projectFilter) {
      filtered = filtered.filter(task => task.project_id === projectFilter)
    }

    if (assigneeFilter) {
      filtered = filtered.filter(task => task.assigned_to?.toLowerCase().includes(assigneeFilter.toLowerCase()))
    }

    setFilteredTasks(filtered)
  }

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo task?')) {
      return
    }

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Errore durante l\'eliminazione del task')
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    try {
      const updatedTask = await taskService.update(task.id, { status: newStatus as 'todo' | 'in_progress' | 'completed' })
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t))
    } catch (err) {
      console.error('Error updating task status:', err)
      alert('Errore durante l\'aggiornamento del task')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'review':
        return 'bg-yellow-100 text-yellow-800'
      case 'done':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'Da Fare'
      case 'in_progress':
        return 'In Corso'
      case 'review':
        return 'In Revisione'
      case 'done':
        return 'Completato'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-orange-600'
      case 'urgent':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Bassa'
      case 'medium':
        return 'Media'
      case 'high':
        return 'Alta'
      case 'urgent':
        return 'Urgente'
      default:
        return priority
    }
  }

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Progetto sconosciuto'
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const isDueToday = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate).toDateString() === new Date().toDateString()
  }

  // Get unique assignees for filter
  const assignees = [...new Set(tasks.map(t => t.assigned_to).filter(Boolean))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Caricamento task...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task</h1>
          <p className="text-gray-600">Gestisci le tue attività e monitora i progressi</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Aggiungi Task
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cerca task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti gli status</option>
            <option value="todo">Da Fare</option>
            <option value="in_progress">In Corso</option>
            <option value="review">In Revisione</option>
            <option value="done">Completato</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le priorità</option>
            <option value="low">Bassa</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i progetti</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti gli assegnatari</option>
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
          <Button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('')
              setPriorityFilter('')
              setProjectFilter('')
              setAssigneeFilter('')
            }}
            variant="outline"
            className="w-full"
          >
            Reset
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-gray-600">Totale Task</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {tasks.filter(t => t.status === 'todo').length}
          </div>
          <div className="text-sm text-gray-600">Da Fare</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {tasks.filter(t => t.status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">In Corso</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completati</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {tasks.filter(t => t.due_date && isOverdue(t.due_date)).length}
          </div>
          <div className="text-sm text-gray-600">In Ritardo</div>
        </Card>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm || statusFilter || priorityFilter || projectFilter || assigneeFilter ? 'Nessun task trovato per i filtri correnti.' : 'Nessun task presente.'}
          </div>
          {!searchTerm && !statusFilter && !priorityFilter && !projectFilter && !assigneeFilter && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Aggiungi il primo task
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={`p-6 hover:shadow-lg transition-shadow ${
              task.due_date && isOverdue(task.due_date) ? 'border-red-200 bg-red-50' :
              task.due_date && isDueToday(task.due_date) ? 'border-yellow-200 bg-yellow-50' : ''
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`p-1 rounded transition-colors ${
                        task.status === 'completed' 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <CheckSquare className={`h-5 w-5 ${task.status === 'completed' ? 'fill-current' : ''}`} />
                    </button>
                    <h3 className={`text-lg font-semibold ${
                      task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      <Flag className="h-3 w-3 mr-1" />
                      {getPriorityText(task.priority)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="space-y-2">
                {getProjectName(task.project_id) && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Progetto:</span> {getProjectName(task.project_id)}
                  </div>
                )}
                {task.assigned_to && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Assegnato a:</span> {task.assigned_to}
                  </div>
                )}
                {task.due_date && (
                  <div className={`text-sm flex items-center gap-1 ${
                    isOverdue(task.due_date) ? 'text-red-600' :
                    isDueToday(task.due_date) ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Scadenza:</span> {new Date(task.due_date).toLocaleDateString('it-IT')}
                    {isOverdue(task.due_date) && <span className="ml-1 text-xs">(In ritardo)</span>}
                    {isDueToday(task.due_date) && <span className="ml-1 text-xs">(Oggi)</span>}
                  </div>
                )}
                {task.estimated_hours && (
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Stima:</span> {task.estimated_hours}h
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.created_at && (
                <div className="mt-4 text-xs text-gray-500">
                  Creato il {new Date(task.created_at).toLocaleDateString('it-IT')}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddTask}
      />
    </div>
  )
}