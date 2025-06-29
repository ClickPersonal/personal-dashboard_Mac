import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import {
  Plus,
  Calendar,
  Clock,
  FileText,
  Bell,
  Camera,
  Download,
  Upload,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  MapPin,
  Users,
  Briefcase,
  Coffee,
  Car,
  Home,
} from 'lucide-react'

// Mock data
const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

const shifts = [
  {
    id: '1',
    date: '2024-01-15',
    startTime: '08:00',
    endTime: '16:00',
    type: 'normale',
    location: 'Ufficio Centrale',
    department: 'Amministrazione',
    notes: 'Riunione di team alle 14:00',
    overtime: 0,
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-01-16',
    startTime: '08:00',
    endTime: '18:00',
    type: 'straordinario',
    location: 'Ufficio Centrale',
    department: 'Amministrazione',
    notes: 'Chiusura bilancio mensile',
    overtime: 2,
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-01-17',
    startTime: '09:00',
    endTime: '17:00',
    type: 'normale',
    location: 'Sede Distaccata',
    department: 'Servizi',
    notes: 'Controlli di routine',
    overtime: 0,
    status: 'scheduled',
  },
  {
    id: '4',
    date: '2024-01-18',
    startTime: '00:00',
    endTime: '00:00',
    type: 'ferie',
    location: '-',
    department: '-',
    notes: 'Giorno di ferie programmato',
    overtime: 0,
    status: 'approved',
  },
]

const monthlyNotes = [
  {
    id: '1',
    month: '2024-01',
    title: 'Gennaio 2024 - Resoconto',
    content: 'Mese intenso con la chiusura del bilancio annuale. Completati tutti i controlli di routine e partecipato a 3 corsi di formazione.',
    attachments: [
      { name: 'Certificato_Corso_Sicurezza.pdf', type: 'pdf', size: '2.1 MB' },
      { name: 'Foto_Evento_Formazione.jpg', type: 'image', size: '1.8 MB' },
    ],
    createdAt: '2024-01-31',
    tags: ['formazione', 'bilancio', 'controlli'],
  },
  {
    id: '2',
    month: '2023-12',
    title: 'Dicembre 2023 - Attività',
    content: 'Preparazione documenti per il nuovo anno. Aggiornamento procedure interne e coordinamento con altri dipartimenti.',
    attachments: [
      { name: 'Procedure_Aggiornate.docx', type: 'document', size: '856 KB' },
    ],
    createdAt: '2023-12-30',
    tags: ['procedure', 'coordinamento'],
  },
]

const activities = [
  {
    id: '1',
    date: '2024-01-15',
    time: '09:30',
    type: 'meeting',
    title: 'Riunione Dipartimentale',
    description: 'Discussione nuove procedure e obiettivi Q1',
    participants: ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi'],
    location: 'Sala Conferenze A',
    duration: 90,
    outcome: 'Approvate nuove linee guida per i controlli',
  },
  {
    id: '2',
    date: '2024-01-14',
    time: '14:00',
    type: 'training',
    title: 'Corso Sicurezza sul Lavoro',
    description: 'Aggiornamento annuale obbligatorio',
    participants: ['Tutto il personale'],
    location: 'Aula Magna',
    duration: 240,
    outcome: 'Certificazione rinnovata',
  },
  {
    id: '3',
    date: '2024-01-12',
    time: '10:00',
    type: 'inspection',
    title: 'Controllo Documentazione',
    description: 'Verifica conformità pratiche Q4 2023',
    participants: ['Roberto', 'Ispettore Esterno'],
    location: 'Archivio Centrale',
    duration: 180,
    outcome: 'Tutto conforme, nessuna irregolarità',
  },
  {
    id: '4',
    date: '2024-01-10',
    time: '11:30',
    type: 'administrative',
    title: 'Aggiornamento Database',
    description: 'Inserimento nuovi dati e correzioni',
    participants: ['Roberto'],
    location: 'Ufficio',
    duration: 120,
    outcome: 'Database aggiornato con 150 nuove voci',
  },
]

const reminders = [
  {
    id: '1',
    title: 'Aggiornamento Turni Febbraio',
    description: 'Inserire i turni per il mese di febbraio nel sistema',
    dueDate: '2024-01-25',
    priority: 'high',
    type: 'deadline',
    status: 'pending',
    recurring: 'monthly',
  },
  {
    id: '2',
    title: 'Corso Aggiornamento Professionale',
    description: 'Partecipazione obbligatoria al corso di 8 ore',
    dueDate: '2024-02-15',
    priority: 'medium',
    type: 'training',
    status: 'pending',
    recurring: 'yearly',
  },
  {
    id: '3',
    title: 'Consegna Relazione Mensile',
    description: 'Preparare e consegnare il report delle attività',
    dueDate: '2024-01-30',
    priority: 'high',
    type: 'report',
    status: 'pending',
    recurring: 'monthly',
  },
  {
    id: '4',
    title: 'Rinnovo Certificazioni',
    description: 'Verificare scadenze e rinnovare certificazioni necessarie',
    dueDate: '2024-03-01',
    priority: 'medium',
    type: 'certification',
    status: 'pending',
    recurring: 'yearly',
  },
]

const stats = [
  {
    title: 'Ore Lavorate (Mese)',
    value: '168',
    target: '160',
    icon: Clock,
    color: 'statale',
  },
  {
    title: 'Straordinari',
    value: '12',
    target: '8',
    icon: AlertCircle,
    color: 'statale',
  },
  {
    title: 'Giorni Ferie Usati',
    value: '3',
    target: '22',
    icon: Coffee,
    color: 'statale',
  },
  {
    title: 'Corsi Completati',
    value: '2',
    target: '4',
    icon: CheckCircle,
    color: 'statale',
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'meeting': return Users
    case 'training': return Briefcase
    case 'inspection': return Eye
    case 'administrative': return FileText
    default: return FileText
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'meeting': return 'bg-blue-50 text-blue-700'
    case 'training': return 'bg-green-50 text-green-700'
    case 'inspection': return 'bg-orange-50 text-orange-700'
    case 'administrative': return 'bg-purple-50 text-purple-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-50 text-red-700 border-red-200'
    case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'low': return 'bg-green-50 text-green-700 border-green-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export default function LavoroStatale() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'notes' | 'activities' | 'reminders'>('overview')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lavoro Statale</h1>
          <p className="text-muted-foreground mt-1">
            Gestione turni, attività e documentazione lavoro pubblico
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Turno
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isOverTarget = parseInt(stat.value) > parseInt(stat.target)
          
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
                    <p className="text-sm text-muted-foreground mt-1">
                      Target: {stat.target}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-statale-50">
                    <Icon className={`w-6 h-6 ${
                      isOverTarget ? 'text-red-600' : 'text-statale-600'
                    }`} />
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
            { id: 'overview', label: 'Panoramica', icon: Home },
            { id: 'calendar', label: 'Calendario', icon: Calendar },
            { id: 'notes', label: 'Note Mensili', icon: FileText },
            { id: 'activities', label: 'Storico Attività', icon: Clock },
            { id: 'reminders', label: 'Promemoria', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-statale-500 text-statale-600'
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
          {/* Prossimi Turni */}
          <Card>
            <CardHeader>
              <CardTitle>Prossimi Turni</CardTitle>
              <CardDescription>Turni programmati per questa settimana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shifts.filter(s => s.status === 'scheduled').slice(0, 3).map((shift) => (
                  <div key={shift.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          shift.type === 'normale' ? 'bg-green-500' :
                          shift.type === 'straordinario' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">
                            {formatDate(shift.date)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-statale-50 text-statale-700">
                        {shift.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{shift.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{shift.department}</span>
                      </div>
                    </div>
                    {shift.notes && (
                      <p className="text-sm text-foreground mt-2">{shift.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Promemoria Urgenti */}
          <Card>
            <CardHeader>
              <CardTitle>Promemoria Urgenti</CardTitle>
              <CardDescription>Scadenze e attività prioritarie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders.filter(r => r.priority === 'high').slice(0, 3).map((reminder) => {
                  const isOverdue = new Date(reminder.dueDate) < new Date()
                  
                  return (
                    <div key={reminder.id} className={`p-4 border rounded-lg ${
                      isOverdue ? 'border-red-200 bg-red-50' : 'border-border'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{reminder.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.description}
                          </p>
                        </div>
                        {isOverdue && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </span>
                        <span className={`text-sm font-medium ${
                          isOverdue ? 'text-red-600' : 'text-foreground'
                        }`}>
                          {formatDate(reminder.dueDate)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Attività Recenti */}
          <Card>
            <CardHeader>
              <CardTitle>Attività Recenti</CardTitle>
              <CardDescription>Ultime attività registrate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 4).map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  
                  return (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.date)} • {activity.time} • {activity.duration} min
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Note del Mese */}
          <Card>
            <CardHeader>
              <CardTitle>Note del Mese Corrente</CardTitle>
              <CardDescription>Appunti e documentazione</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyNotes.filter(note => note.month === currentMonth).length > 0 ? (
                <div className="space-y-4">
                  {monthlyNotes.filter(note => note.month === currentMonth).map((note) => (
                    <div key={note.id} className="p-4 border border-border rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">{note.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{note.content}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {note.attachments.length} allegati
                        </span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Visualizza
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Nessuna nota per questo mese</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi Nota
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-foreground">Mese:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Turno
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orario</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sede</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Dipartimento</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Straordinari</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stato</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map((shift) => (
                      <tr key={shift.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">
                            {formatDate(shift.date)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">
                            {shift.type === 'ferie' ? '-' : `${shift.startTime} - ${shift.endTime}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shift.type === 'normale' ? 'bg-green-50 text-green-700' :
                            shift.type === 'straordinario' ? 'bg-orange-50 text-orange-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {shift.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">{shift.location}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">{shift.department}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            shift.overtime > 0 ? 'text-orange-600' : 'text-foreground'
                          }`}>
                            {shift.overtime}h
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shift.status === 'completed' ? 'bg-green-50 text-green-700' :
                            shift.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                            {shift.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-foreground">Mese:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Nota
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {monthlyNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{note.title}</CardTitle>
                      <CardDescription>Creato il {formatDate(note.createdAt)}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifica
                      </Button>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Esporta
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{note.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-statale-50 text-statale-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {note.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Allegati ({note.attachments.length})</h4>
                      <div className="space-y-2">
                        {note.attachments.map((attachment, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-muted">
                                {attachment.type === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                                {attachment.type === 'image' && <Camera className="w-4 h-4 text-green-600" />}
                                {attachment.type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{attachment.name}</p>
                                <p className="text-sm text-muted-foreground">{attachment.size}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storico Attività</CardTitle>
              <CardDescription>Cronologia completa delle attività lavorative</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  
                  return (
                    <div key={activity.id} className="p-6 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{activity.title}</h3>
                            <p className="text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{formatDate(activity.date)} • {activity.time}</span>
                              <span>{activity.duration} minuti</span>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Partecipanti:</h4>
                          <ul className="space-y-1">
                            {activity.participants.map((participant, i) => (
                              <li key={i} className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">{participant}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Risultato:</h4>
                          <p className="text-sm text-foreground">{activity.outcome}</p>
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
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Promemoria e Scadenze</h2>
              <p className="text-muted-foreground">Gestione reminder automatici e manuali</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Promemoria
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reminders.map((reminder) => {
              const isOverdue = new Date(reminder.dueDate) < new Date()
              const isDueSoon = new Date(reminder.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              
              return (
                <Card key={reminder.id} className={`card-hover ${
                  isOverdue ? 'border-red-200 bg-red-50' :
                  isDueSoon ? 'border-yellow-200 bg-yellow-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{reminder.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{reminder.description}</p>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                            {reminder.priority}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            {reminder.type}
                          </span>
                          {reminder.recurring && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {reminder.recurring}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className={`text-sm font-medium ${
                            isOverdue ? 'text-red-600' :
                            isDueSoon ? 'text-yellow-600' : 'text-foreground'
                          }`}>
                            Scadenza: {formatDate(reminder.dueDate)}
                          </span>
                          {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completa
                      </Button>
                      <Button size="sm" className="flex-1">
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