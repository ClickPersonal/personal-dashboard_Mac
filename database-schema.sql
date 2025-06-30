-- Personal Dashboard Database Schema for Supabase
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security
-- Note: JWT secret is configured automatically by Supabase

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  sector VARCHAR(100),
  active_channels TEXT[], -- Array of communication channels
  communication_style VARCHAR(100),
  notes TEXT,
  pain_points TEXT[], -- Array of pain points
  status VARCHAR(20) CHECK (status IN ('lead', 'prospect', 'active', 'loyal')) DEFAULT 'lead',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('photo', 'video', 'wedding', 'baptism', 'social_media')) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('idea', 'active', 'review', 'completed')) DEFAULT 'idea',
  budget DECIMAL(10,2),
  margin DECIMAL(5,2), -- Percentage
  start_date DATE,
  end_date DATE,
  description TEXT,
  area VARCHAR(20) CHECK (area IN ('studio', 'prizm', 'statale')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date DATE,
  assigned_to VARCHAR(255),
  area VARCHAR(20) CHECK (area IN ('studio', 'prizm', 'statale')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  area VARCHAR(20) CHECK (area IN ('studio', 'prizm', 'statale')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  services TEXT[] NOT NULL, -- Array of services
  amount DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  terms TEXT,
  status VARCHAR(20) CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')) DEFAULT 'draft',
  sent_date DATE,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_area ON projects(area);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_area ON tasks(area);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_area ON transactions(area);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_proposals_client_id ON proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO clients (name, company, email, phone, sector, status, active_channels, pain_points) VALUES
('Marco Rossi', 'Rossi Wedding', 'marco@rossiwedding.it', '+39 333 1234567', 'Wedding', 'active', ARRAY['email', 'whatsapp'], ARRAY['budget_constraints', 'timeline_pressure']),
('Laura Bianchi', 'TechCorp SRL', 'laura@techcorp.it', '+39 333 7654321', 'Technology', 'prospect', ARRAY['email', 'linkedin'], ARRAY['brand_visibility', 'social_media_presence']),
('Giuseppe Verdi', 'Verdi Catering', 'giuseppe@verdicatering.it', '+39 333 9876543', 'Food & Beverage', 'loyal', ARRAY['phone', 'email'], ARRAY['seasonal_fluctuations']);

INSERT INTO projects (name, type, status, budget, margin, area, client_id, description) VALUES
('Matrimonio Rossi', 'wedding', 'active', 5000.00, 65.00, 'studio', (SELECT id FROM clients WHERE name = 'Marco Rossi'), 'Matrimonio completo con foto e video'),
('Social Media TechCorp', 'social_media', 'active', 2500.00, 70.00, 'studio', (SELECT id FROM clients WHERE name = 'Laura Bianchi'), 'Gestione social media per 6 mesi'),
('MVP Prizm', 'video', 'review', 15000.00, 45.00, 'prizm', NULL, 'Sviluppo MVP per startup Prizm');

INSERT INTO tasks (title, description, status, priority, area, project_id) VALUES
('Sopralluogo location', 'Verificare la location per il matrimonio', 'completed', 'high', 'studio', (SELECT id FROM projects WHERE name = 'Matrimonio Rossi')),
('Editing foto', 'Post-produzione delle foto del matrimonio', 'in_progress', 'high', 'studio', (SELECT id FROM projects WHERE name = 'Matrimonio Rossi')),
('Creazione contenuti', 'Sviluppo contenuti per social TechCorp', 'todo', 'medium', 'studio', (SELECT id FROM projects WHERE name = 'Social Media TechCorp')),
('User testing', 'Test con utenti per MVP Prizm', 'in_progress', 'high', 'prizm', (SELECT id FROM projects WHERE name = 'MVP Prizm'));

INSERT INTO transactions (type, amount, category, description, date, area, project_id) VALUES
('income', 2500.00, 'Anticipo matrimonio', 'Anticipo 50% matrimonio Rossi', '2024-01-10', 'studio', (SELECT id FROM projects WHERE name = 'Matrimonio Rossi')),
('expense', 300.00, 'Attrezzatura', 'Noleggio luci aggiuntive', '2024-01-12', 'studio', (SELECT id FROM projects WHERE name = 'Matrimonio Rossi')),
('income', 1250.00, 'Social Media', 'Primo mese TechCorp', '2024-01-15', 'studio', (SELECT id FROM projects WHERE name = 'Social Media TechCorp')),
('income', 2800.00, 'Stipendio', 'Stipendio gennaio', '2024-01-01', 'statale', NULL);

INSERT INTO proposals (title, services, amount, status, client_id, terms) VALUES
('Proposta Matrimonio Premium', ARRAY['Fotografo matrimonio', 'Video matrimonio', 'Album fotografico', 'Editing avanzato'], 5000.00, 'accepted', (SELECT id FROM clients WHERE name = 'Marco Rossi'), 'Pagamento 50% anticipo, 50% a consegna'),
('Gestione Social Media', ARRAY['Content creation', 'Post scheduling', 'Community management', 'Analytics report'], 2500.00, 'sent', (SELECT id FROM clients WHERE name = 'Laura Bianchi'), 'Contratto 6 mesi, pagamento mensile');

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - in production you'd want more restrictive policies)
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on proposals" ON proposals FOR ALL USING (true);