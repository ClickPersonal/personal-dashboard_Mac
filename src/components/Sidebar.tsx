import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Camera,
  Lightbulb,
  Building2,
  Euro,
  Users,
  FolderOpen,
  Calendar,
  TrendingUp,
  CheckSquare,
  FileText,
  CreditCard,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  currentPath: string
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    color: 'text-gray-600 hover:text-gray-900',
    bgColor: 'hover:bg-gray-100',
  },
  {
    name: 'Gestione',
    href: '/management',
    icon: FolderOpen,
    color: 'text-blue-600 hover:text-blue-700',
    bgColor: 'hover:bg-blue-50',
    subItems: [
      { name: 'Clienti', href: '/clients', icon: Users },
      { name: 'Progetti', href: '/projects', icon: FolderOpen },
      { name: 'Task', href: '/tasks', icon: CheckSquare },
      { name: 'Proposte', href: '/proposals', icon: FileText },
      { name: 'Transazioni', href: '/transactions', icon: CreditCard },
    ],
  },
  {
    name: 'Sokey Studio',
    href: '/studio',
    icon: Camera,
    color: 'text-studio-600 hover:text-studio-700',
    bgColor: 'hover:bg-studio-50',
  },
  {
    name: 'Prizm',
    href: '/prizm',
    icon: Lightbulb,
    color: 'text-prizm-600 hover:text-prizm-700',
    bgColor: 'hover:bg-prizm-50',
  },
  {
    name: 'Lavoro Statale',
    href: '/statale',
    icon: Building2,
    color: 'text-statale-600 hover:text-statale-700',
    bgColor: 'hover:bg-statale-50',
  },
  {
    name: 'Finanze',
    href: '/finanze',
    icon: Euro,
    color: 'text-finanze-600 hover:text-finanze-700',
    bgColor: 'hover:bg-finanze-50',
  },
]

export default function Sidebar({ isOpen, currentPath }: SidebarProps) {
  return (
    <div
      className={cn(
        'bg-card border-r border-border sidebar-transition flex flex-col',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-studio-500 to-prizm-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Personal Hub</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <div key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : `${item.color} ${item.bgColor}`,
                  !isOpen && 'justify-center'
                )}
                title={!isOpen ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium truncate">{item.name}</span>
                )}
              </Link>

              {/* Sub-items */}
              {item.subItems && isOpen && (currentPath.startsWith('/clients') || currentPath.startsWith('/projects') || currentPath.startsWith('/tasks') || currentPath.startsWith('/proposals') || currentPath.startsWith('/transactions') ? item.name === 'Gestione' : isActive) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon
                    const isSubActive = currentPath === subItem.href

                    return (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={cn(
                          'flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                          isSubActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {isOpen ? (
          <div className="text-xs text-muted-foreground">
            <p>© 2024 Personal Dashboard</p>
            <p>v1.0.0</p>
          </div>
        ) : (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">PD</span>
          </div>
        )}
      </div>
    </div>
  )
}