import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: it })
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Client status
    lead: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    prospect: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    loyal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    
    // Project status
    idea: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    review: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    
    // Task status
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    
    // Proposal status
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    expired: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    
    // Priority
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

export function getAreaColor(area: string): string {
  const areaColors: Record<string, string> = {
    studio: 'text-studio-600 bg-studio-50 dark:bg-studio-900 dark:text-studio-300',
    prizm: 'text-prizm-600 bg-prizm-50 dark:bg-prizm-900 dark:text-prizm-300',
    statale: 'text-statale-600 bg-statale-50 dark:bg-statale-900 dark:text-statale-300',
    finanze: 'text-finanze-600 bg-finanze-50 dark:bg-finanze-900 dark:text-finanze-300',
  }
  
  return areaColors[area] || 'text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-300'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function calculateMargin(revenue: number, costs: number): number {
  if (revenue === 0) return 0
  return ((revenue - costs) / revenue) * 100
}

export function calculateROI(profit: number, investment: number): number {
  if (investment === 0) return 0
  return (profit / investment) * 100
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}