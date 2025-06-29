# 🚀 Istruzioni di Setup - Dashboard Personale

## ⚠️ Prerequisiti Mancanti

Il tuo sistema macOS non ha ancora installato Node.js e npm, necessari per eseguire la dashboard.

## 📦 Installazione Node.js

### Opzione 1: Installer Ufficiale (Raccomandato)

1. **Scarica Node.js**
   - Vai su [nodejs.org](https://nodejs.org/)
   - Scarica la versione **LTS** (Long Term Support)
   - Scegli il file `.pkg` per macOS

2. **Installa**
   - Apri il file `.pkg` scaricato
   - Segui la procedura guidata
   - Riavvia il terminale

3. **Verifica installazione**
   ```bash
   node --version
   npm --version
   ```

### Opzione 2: Homebrew (Se preferisci)

1. **Installa Homebrew**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Installa Node.js**
   ```bash
   brew install node
   ```

### Opzione 3: NVM (Node Version Manager)

1. **Installa NVM**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Riavvia terminale e installa Node.js**
   ```bash
   nvm install --lts
   nvm use --lts
   ```

## 🏃‍♂️ Avvio della Dashboard

Dopo aver installato Node.js:

1. **Naviga nella cartella del progetto**
   ```bash
   cd /Users/roberto/Desktop/personal-dashboard
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura Supabase**
   - Crea account su [supabase.com](https://supabase.com)
   - Crea nuovo progetto
   - Copia URL e anon key da Settings > API
   - Crea file `.env.local`:
   ```bash
   echo "VITE_SUPABASE_URL=your_supabase_url_here" > .env.local
   echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here" >> .env.local
   ```

4. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

5. **Apri nel browser**
   - La dashboard sarà disponibile su `http://localhost:5173`

## 🗄️ Setup Database

1. **Accedi a Supabase**
   - Vai nel tuo progetto Supabase
   - Clicca su "SQL Editor"

2. **Esegui lo schema SQL**
   - Copia tutto il contenuto della sezione "Schema Supabase" dal `README.md`
   - Incolla nell'editor SQL
   - Clicca "Run"

3. **Verifica tabelle create**
   - Vai su "Table Editor"
   - Dovresti vedere: clients, projects, tasks, transactions, proposals

## 🚀 Deploy su Vercel

1. **Crea account Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Registrati con GitHub

2. **Connetti repository**
   - Clicca "New Project"
   - Importa da GitHub
   - Seleziona il repository della dashboard

3. **Configura variabili ambiente**
   - In Vercel, vai su Settings > Environment Variables
   - Aggiungi:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Clicca "Deploy"
   - Attendi completamento
   - Ricevi URL di produzione

## 📱 Installazione PWA

Dopo il deploy:

1. **Su Desktop**
   - Apri la dashboard in Chrome/Edge
   - Clicca sull'icona "Installa" nella barra degli indirizzi
   - Conferma installazione

2. **Su Mobile**
   - Apri in Safari/Chrome mobile
   - Menu > "Aggiungi alla schermata Home"
   - Conferma

## ✅ Checklist Completamento

- [ ] Node.js installato
- [ ] Dipendenze installate (`npm install`)
- [ ] Account Supabase creato
- [ ] Database schema eseguito
- [ ] File `.env.local` configurato
- [ ] Server locale funzionante (`npm run dev`)
- [ ] Account Vercel creato
- [ ] Repository connesso a Vercel
- [ ] Variabili ambiente configurate su Vercel
- [ ] Deploy completato
- [ ] PWA installata

## 🆘 Risoluzione Problemi

### Node.js non si installa
- Verifica di avere i permessi di amministratore
- Prova con sudo se necessario
- Riavvia il terminale dopo l'installazione

### npm install fallisce
```bash
# Pulisci cache
npm cache clean --force

# Riprova
npm install
```

### Supabase non si connette
- Verifica URL e chiavi in `.env.local`
- Controlla che non ci siano spazi extra
- Riavvia il server locale

### Deploy Vercel fallisce
- Verifica che tutte le variabili ambiente siano configurate
- Controlla i log di build in Vercel
- Assicurati che il repository sia pubblico o che Vercel abbia accesso

## 📞 Supporto

Se hai problemi:

1. **Controlla la documentazione**
   - `README.md` per dettagli tecnici
   - Questo file per setup iniziale

2. **Verifica prerequisiti**
   - Node.js versione 18+
   - Account Supabase attivo
   - Repository GitHub (per Vercel)

3. **Test step-by-step**
   - Segui ogni passaggio in ordine
   - Non saltare la configurazione database
   - Verifica ogni comando nel terminale

---

**🎯 Obiettivo: Dashboard funzionante e accessibile via URL Vercel entro il budget di €250**

*Una volta completato il setup, avrai una dashboard completa per gestire Sokey Studio, Prizm, Lavoro Statale e Finanze!*