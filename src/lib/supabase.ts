import { createClient } from '@supabase/supabase-js'

// These would normally come from environment variables
// For demo purposes, using placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Client {
  id: string
  name: string
  company?: string
  email?: string
  phone?: string
  sector?: string
  active_channels?: string[]
  communication_style?: string
  notes?: string
  pain_points?: string[]
  status: 'lead' | 'prospect' | 'active' | 'loyal'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  client_id?: string
  name: string
  type: 'photo' | 'video' | 'wedding' | 'baptism' | 'social_media'
  status: 'idea' | 'active' | 'review' | 'completed'
  budget?: number
  margin?: number
  start_date?: string
  end_date?: string
  description?: string
  area: 'studio' | 'prizm' | 'statale'
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id?: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  assigned_to?: string
  area: 'studio' | 'prizm' | 'statale'
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  project_id?: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: string
  area: 'studio' | 'prizm' | 'statale'
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  client_id: string
  project_id?: string
  title: string
  services: string[]
  amount: number
  discount?: number
  terms?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  sent_date?: string
  valid_until?: string
  created_at: string
  updated_at: string
}