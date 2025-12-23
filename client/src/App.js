import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ChatSidebar from './components/ChatSidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Network from './pages/Network';
import Messages from './pages/Messages';
import Mentors from './pages/Mentors';
import Connections from './pages/Connections';
import Settings from './pages/Settings';
import Landing from './pages/Landing';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    secondary: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    background: {
      default: '#e0f2fe',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#1f2937',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em', color: '#1e293b' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em', color: '#1e293b' },
    h3: { fontWeight: 600, letterSpacing: '-0.025em', color: '#1e293b' },
    h4: { fontWeight: 600, letterSpacing: '-0.025em', color: '#1e293b' },
    h5: { fontWeight: 600, color: '#1e293b' },
    h6: { fontWeight: 600, color: '#1e293b' },
    body1: { color: '#334155', lineHeight: 1.6 },
    body2: { color: '#64748b', lineHeight: 1.5 },
    button: { fontWeight: 500, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#1d4ed8',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1e3a8a',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#64748b',
          '&:hover': {
            borderColor: '#1d4ed8',
            backgroundColor: 'rgba(29, 78, 216, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
          border: '1px solid #f1f5f9',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f1f5f9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #f1f5f9',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4f46e5',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          backgroundColor: '#e2e8f0',
          color: '#64748b',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function MainLayout({ children }) {
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onChatToggle={() => setChatSidebarOpen(!chatSidebarOpen)} />
      <div style={{ 
        marginRight: chatSidebarOpen ? 350 : 0,
        transition: 'margin-right 0.3s ease'
      }}>
        {children}
      </div>
      <ChatSidebar 
        open={chatSidebarOpen} 
        onClose={() => setChatSidebarOpen(false)} 
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile/:id?" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile/edit" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfileEdit />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/connections" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Connections />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/network" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Network />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Messages />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/mentors" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Mentors />
                    </MainLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;