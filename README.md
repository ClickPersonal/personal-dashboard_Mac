# Dashboard Personale Full-Stack

Una dashboard web modulare e completa per la gestione di attività business multi-area, sviluppata con React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Caratteristiche Principali

### 📊 Aree di Business
- **Sokey Studio**: Gestione agenzia foto/video e social media
- **Prizm**: Management startup in fase iniziale
- **Lavoro Statale**: Organizzazione turni e attività
- **Finanze**: Controllo economico aggregato per tutte le aree

### 🎨 Design e UX
- Interface moderna e responsive
- Tema dark/light con toggle
- Sidebar navigazione con icone colorate per area
- PWA installabile su dispositivi
- Ottimizzata per desktop e mobile

### 🔧 Tecnologie
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + CSS Variables
- **Backend**: Supabase (Database + Auth)
- **Grafici**: Recharts
- **Routing**: React Router DOM
- **State Management**: React Query
- **Deploy**: Vercel

## 📦 Installazione

### Prerequisiti
- Node.js 18+ 
- npm o yarn
- Account Supabase (gratuito)

### Setup Locale

1. **Clona il repository**
```bash
git clone <repository-url>
cd personal-dashboard
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura Supabase**
   - Crea un nuovo progetto su [supabase.com](https://supabase.com)
   - Vai su Settings > API
   - Copia URL e anon key

4. **Configura le variabili d'ambiente**
```bash
# Crea file .env.local
VITE_SUPABASE_URL=https://ggutuucydkoydxgfxiac.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndXR1dWN5ZGtveWR4Z2Z4aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTE5MzYsImV4cCI6MjA2NjcyNzkzNn0.4D7TcOXx-FKnbTo04qpAA2Iujue6PIIf9CVB1zWdFL8
```

5. **Avvia il server di sviluppo**
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 🗄️ Setup Database

### Schema Supabase

Esegui questi comandi SQL nel Supabase SQL Editor:

```sql
-- Tabella Clienti
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  company VARCHAR,
  email VARCHAR UNIQUE,
  phone VARCHAR,
  address TEXT,
  sector VARCHAR,
  status VARCHAR DEFAULT 'lead',
  communication_style TEXT,
  active_channels TEXT[],
  registration_date DATE DEFAULT CURRENT_DATE,
  last_contact DATE,
  total_value DECIMAL(10,2) DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  pain_points TEXT[],
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Progetti
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'planning',
  client_id UUID REFERENCES clients(id),
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  final_amount DECIMAL(10,2),
  costs DECIMAL(10,2) DEFAULT 0,
  area VARCHAR NOT NULL, -- 'studio', 'prizm', 'statale'
  services JSONB,
  deliverables JSONB,
  location VARCHAR,
  team TEXT[],
  equipment TEXT[],
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Task
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'todo',
  priority VARCHAR DEFAULT 'medium',
  category VARCHAR,
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  assignee VARCHAR,
  due_date DATE,
  completed_date DATE,
  area VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Transazioni
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR NOT NULL, -- 'income', 'expense'
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  area VARCHAR NOT NULL, -- 'studio', 'prizm', 'statale'
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR, -- 'monthly', 'quarterly', 'yearly'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Proposte
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  client_id UUID REFERENCES clients(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'draft',
  valid_until DATE,
  services JSONB,
  description TEXT,
  terms TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_area ON projects(area);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_area ON tasks(area);
CREATE INDEX idx_transactions_area ON transactions(area);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_proposals_client_id ON proposals(client_id);

-- RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Politiche RLS (esempio per accesso completo)
CREATE POLICY "Enable all operations for authenticated users" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON tasks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON transactions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON proposals
  FOR ALL USING (auth.role() = 'authenticated');
```

## 🚀 Deploy su Vercel

### Setup Automatico

1. **Connetti il repository a Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Importa il repository GitHub
   - Vercel rileverà automaticamente Vite

2. **Configura le variabili d'ambiente**
   - Nel dashboard Vercel, vai su Settings > Environment Variables
   - Aggiungi:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Il deploy avviene automaticamente ad ogni push su main
   - URL di produzione disponibile in pochi minuti

### Deploy Manuale

```bash
# Build di produzione
npm run build

# Deploy con Vercel CLI
npx vercel --prod
```

## 📱 PWA Setup

L'app è già configurata come PWA:

- **Manifest**: `/public/manifest.json`
- **Service Worker**: Configurato in Vite
- **Icone**: Multiple dimensioni in `/public/`
- **Installabile**: Su desktop e mobile

### Personalizzazione PWA

Modifica `vite.config.ts` per personalizzare:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  manifest: {
    name: 'Il Tuo Nome Dashboard',
    short_name: 'Dashboard',
    description: 'La tua descrizione',
    theme_color: '#1f2937',
    // ... altre opzioni
  }
})
```

## 🎯 Funzionalità per Area

### 🎬 Sokey Studio
- **CRM Clienti**: Anagrafica completa, storico interazioni
- **Proposte**: Preventivi dinamici con firma elettronica
- **Progetti**: Pipeline completa dalla pianificazione alla consegna
- **Produzione**: Upload materiali, revisioni, versioning
- **Consegna**: Download link, report finali
- **Manutenzione**: Abbonamenti, KPI social, rinnovi

### 🚀 Prizm
- **Task Management**: Sprint, deliverable, milestone
- **CRM Startup**: Investitori, partner, advisor
- **Validazione**: Interviste utenti, questionari, analytics
- **Roadmap**: Timeline Gantt interattiva
- **File Sharing**: Integrazione Figma, Drive, Notion
- **KPI Dashboard**: Metriche utenti, conversioni, feedback

### 🏛️ Lavoro Statale
- **Calendario**: Turni, ferie, straordinari
- **Note Mensili**: Documentazione con allegati
- **Storico**: Attività e eventi passati
- **Reminder**: Notifiche automatiche

### 💰 Finanze
- **Per Area**: Entrate/uscite separate per business
- **Overview**: Dashboard aggregata con cashflow
- **Analytics**: Margini, ROI, trend temporali
- **Export**: PDF e CSV per contabilità

## 🔐 Sicurezza

### Autenticazione
- **Supabase Auth**: Login sicuro
- **RLS**: Row Level Security attiva
- **JWT**: Token sicuri per API

### Ruoli
- **Admin**: Accesso completo (tu)
- **Collaboratore**: Accesso limitato (opzionale)
- **Cliente**: Solo area revisione progetti

### Backup
- **Automatico**: Supabase backup giornalieri
- **Export**: Funzioni di esportazione dati

## 🔔 Notifiche & Automazioni

### Setup Email (Opzionale)

Per abilitare notifiche email:

1. **Configura SMTP in Supabase**
   - Settings > Auth > SMTP Settings
   - Usa servizio come SendGrid, Mailgun, etc.

2. **Trigger Database**
```sql
-- Esempio: notifica scadenza progetto
CREATE OR REPLACE FUNCTION notify_project_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Logica notifica
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Integrazioni Esterne

- **Google Calendar**: API per sincronizzazione eventi
- **Google Drive**: Upload automatico file
- **Canva**: Integrazione design
- **Fatture in Cloud**: Sync fatturazione
- **Zapier**: Automazioni workflow

## 🛠️ Sviluppo

### Struttura Progetto

```
src/
├── components/          # Componenti riutilizzabili
│   ├── ui/             # UI components base
│   ├── Layout.tsx      # Layout principale
│   ├── Sidebar.tsx     # Navigazione
│   └── Header.tsx      # Header con tema toggle
├── pages/              # Pagine principali
│   ├── Dashboard.tsx   # Homepage
│   ├── SokeyStudio.tsx # Area Studio
│   ├── Prizm.tsx       # Area Startup
│   ├── LavoroStatale.tsx # Area Statale
│   ├── Finanze.tsx     # Area Finanze
│   ├── ClientDetail.tsx # Dettaglio cliente
│   └── ProjectDetail.tsx # Dettaglio progetto
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Gestione tema
├── lib/                # Utilities e config
│   ├── supabase.ts     # Config Supabase
│   └── utils.ts        # Funzioni utility
├── App.tsx             # App principale
└── main.tsx            # Entry point
```

### Comandi Utili

```bash
# Sviluppo
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

### Aggiungere Nuove Funzionalità

1. **Nuova pagina**: Crea in `/src/pages/`
2. **Nuovo componente**: Aggiungi in `/src/components/`
3. **Nuova rotta**: Modifica `App.tsx`
4. **Nuova tabella DB**: Aggiungi SQL in Supabase
5. **Nuovi tipi**: Estendi `/src/lib/supabase.ts`

## 📊 Monitoraggio

### Analytics
- **Vercel Analytics**: Automatico con deploy
- **Supabase Analytics**: Dashboard usage
- **Custom Events**: Tracciamento azioni utente

### Performance
- **Lighthouse**: Score 90+ su tutti i parametri
- **Core Web Vitals**: Ottimizzati
- **Bundle Size**: Analisi con `npm run build`

## 🆘 Troubleshooting

### Problemi Comuni

**Build fallisce**
```bash
# Pulisci cache
rm -rf node_modules package-lock.json
npm install
```

**Supabase non si connette**
- Verifica URL e chiavi in `.env.local`
- Controlla RLS policies
- Verifica network/firewall

**PWA non si installa**
- Verifica HTTPS (richiesto)
- Controlla manifest.json
- Testa su diversi browser

**Styling non funziona**
- Verifica Tailwind config
- Controlla CSS variables
- Pulisci cache browser

### Log e Debug

```bash
# Log Vercel
vercel logs

# Debug locale
npm run dev -- --debug

# Analisi bundle
npm run build -- --analyze
```

## 📞 Supporto

Per problemi o domande:

1. **Documentazione**: Controlla questo README
2. **Issues**: Apri issue su GitHub
3. **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
4. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

## 📄 Licenza

Progetto personale - Tutti i diritti riservati

---

**Dashboard creata con ❤️ per gestire il tuo business multi-area**

*Versione: 1.0.0*  
*Ultimo aggiornamento: Gennaio 2024*