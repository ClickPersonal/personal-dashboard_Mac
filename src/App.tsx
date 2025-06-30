import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
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
import { Clients } from './pages/Clients'
import { Projects } from './pages/Projects'
import { Transactions } from './pages/Transactions'
import { Tasks } from './pages/Tasks'
import { Proposals } from './pages/Proposals'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Sokey Studio Routes */}
              <Route path="/studio" element={<ProtectedRoute><SokeyStudio /></ProtectedRoute>} />
              <Route path="/studio/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/studio/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
              <Route path="/studio/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/studio/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/studio/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/studio/proposals" element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
              
              {/* Prizm Routes */}
              <Route path="/prizm" element={<ProtectedRoute><Prizm /></ProtectedRoute>} />
              <Route path="/prizm/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/prizm/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/prizm/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              
              {/* Lavoro Statale Routes */}
              <Route path="/statale" element={<ProtectedRoute><LavoroStatale /></ProtectedRoute>} />
              <Route path="/statale/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/statale/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/statale/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              
              {/* Finanze Routes */}
              <Route path="/finanze" element={<ProtectedRoute><Finanze /></ProtectedRoute>} />
              <Route path="/finanze/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/finanze/reports" element={<ProtectedRoute><Finanze /></ProtectedRoute>} />
              <Route path="/supabase-test" element={<ProtectedRoute><SupabaseTest /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App