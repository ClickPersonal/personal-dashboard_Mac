import { supabase } from './supabase'
import type { Client, Project, Task, Transaction, Proposal } from './supabase'

// Client operations
export const clientService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Project operations
export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*),
        tasks(*),
        transactions(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByArea(area: 'studio' | 'prizm' | 'statale'): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('area', area)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Task operations
export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByArea(area: 'studio' | 'prizm' | 'statale'): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('area', area)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Transaction operations
export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        project:projects(*)
      `)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByArea(area: 'studio' | 'prizm' | 'statale'): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('area', area)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        project:projects(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Proposal operations
export const proposalService = {
  async getAll(): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        client:clients(*),
        project:projects(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByClient(clientId: string): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        client:clients(*),
        project:projects(*)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(proposal: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposal)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Analytics and dashboard data
export const analyticsService = {
  async getDashboardStats() {
    // Get total revenue
    const { data: revenueData } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('type', 'income')
    
    const totalRevenue = revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0

    // Get active projects count
    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get active clients count
    const { count: activeClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'loyal'])

    // Calculate average margin
    const { data: projectsWithMargin } = await supabase
      .from('projects')
      .select('margin')
      .not('margin', 'is', null)
    
    const avgMargin = projectsWithMargin?.length 
      ? projectsWithMargin.reduce((sum, p) => sum + (p.margin || 0), 0) / projectsWithMargin.length
      : 0

    return {
      totalRevenue,
      activeProjects: activeProjects || 0,
      activeClients: activeClients || 0,
      avgMargin
    }
  },

  async getRevenueByArea() {
    const { data } = await supabase
      .from('transactions')
      .select('amount, area, date')
      .eq('type', 'income')
      .gte('date', new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
    
    return data || []
  },

  async getRecentActivities() {
    // This would combine recent projects, tasks, transactions, etc.
    // For now, return recent projects
    const { data: recentProjects } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    return recentProjects?.map(project => ({
      id: project.id,
      type: 'project',
      title: `Nuovo progetto: ${project.name}`,
      description: project.client?.name || 'Cliente non specificato',
      time: new Date(project.created_at).toLocaleDateString('it-IT'),
      area: project.area
    })) || []
  }
}