import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { taskService } from '@/lib/database'
import type { Task } from '@/lib/supabase'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Task[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
    // Aggiorna le notifiche ogni 30 secondi
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const tasks = await taskService.getAll()
      
      // Filtra task urgenti o in scadenza
      const urgentTasks = tasks.filter(task => {
        if (task.status === 'completed') return false
        
        // Task ad alta priorità
        if (task.priority === 'high') return true
        
        // Task in scadenza (entro 24 ore)
        if (task.due_date) {
          const dueDate = new Date(task.due_date)
          const now = new Date()
          const timeDiff = dueDate.getTime() - now.getTime()
          const hoursDiff = timeDiff / (1000 * 3600)
          return hoursDiff <= 24 && hoursDiff > 0
        }
        
        return false
      })
      
      setNotifications(urgentTasks)
    } catch (err) {
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (taskId: string) => {
    setNotifications(prev => prev.filter(task => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const timeDiff = date.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)
    
    if (hoursDiff < 1) {
      return 'Scade tra meno di 1 ora'
    } else if (hoursDiff < 24) {
      return `Scade tra ${Math.floor(hoursDiff)} ore`
    } else {
      return date.toLocaleDateString('it-IT')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifiche</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Caricamento...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nessuna notifica
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Bassa'} priorità
                          </span>
                          {task.due_date && (
                            <span className="text-gray-500">
                              • {formatDueDate(task.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => markAsRead(task.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setNotifications([])} 
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Segna tutte come lette
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}