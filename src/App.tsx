import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile';
import Skills from './pages/admin/Skills';
import Portfolio from './pages/admin/Portfolio';
import ImageManagement from './pages/admin/ImageManagement';
import Messages from './pages/admin/Messages';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <div className="App">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              
              {/* Admin Auth Routes */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/skills" element={
                <ProtectedRoute>
                  <Skills />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/portfolio" element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/images" element={
                <ProtectedRoute>
                  <ImageManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              </Routes>

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'hsl(var(--b1))',
                    color: 'hsl(var(--bc))',
                    border: '1px solid hsl(var(--b3))',
                  },
                  success: {
                    iconTheme: {
                      primary: 'hsl(var(--su))',
                      secondary: 'white',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'hsl(var(--er))',
                      secondary: 'white',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;