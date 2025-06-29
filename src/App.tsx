import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SokeyStudio from './pages/SokeyStudio'
import Prizm from './pages/Prizm'
import LavoroStatale from './pages/LavoroStatale'
import Finanze from './pages/Finanze'
import ClientDetail from './pages/ClientDetail'
import ProjectDetail from './pages/ProjectDetail'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/studio" element={<SokeyStudio />} />
            <Route path="/studio/client/:id" element={<ClientDetail />} />
            <Route path="/studio/project/:id" element={<ProjectDetail />} />
            <Route path="/prizm" element={<Prizm />} />
            <Route path="/prizm/project/:id" element={<ProjectDetail />} />
            <Route path="/statale" element={<LavoroStatale />} />
            <Route path="/finanze" element={<Finanze />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App