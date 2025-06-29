import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import SokeyStudio from './pages/SokeyStudio'
import Prizm from './pages/Prizm'
import LavoroStatale from './pages/LavoroStatale'
import Finanze from './pages/Finanze'
import ClientDetail from './pages/ClientDetail'
import ProjectDetail from './pages/ProjectDetail'
import SupabaseTest from './pages/SupabaseTest'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/studio" element={<ProtectedRoute><SokeyStudio /></ProtectedRoute>} />
            <Route path="/studio/client/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
            <Route path="/studio/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/prizm" element={<ProtectedRoute><Prizm /></ProtectedRoute>} />
            <Route path="/prizm/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/statale" element={<ProtectedRoute><LavoroStatale /></ProtectedRoute>} />
            <Route path="/finanze" element={<ProtectedRoute><Finanze /></ProtectedRoute>} />
            <Route path="/supabase-test" element={<ProtectedRoute><SupabaseTest /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App