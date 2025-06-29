import { Menu, Sun, Moon, Bell, Search, User } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca progetti, clienti..."
              className="pl-10 pr-4 py-2 w-64 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3 relative group">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">{user?.email || 'Utente'}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <button className="w-8 h-8 bg-gradient-to-br from-studio-500 to-prizm-500 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow group-hover:ring-2 group-hover:ring-primary relative">
              <User className="w-4 h-4 text-white" />
            </button>
            <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 shadow-lg rounded p-2 min-w-[120px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <button onClick={handleLogout} className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}