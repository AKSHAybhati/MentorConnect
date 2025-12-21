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

const theme = createTheme({
  palette: {
    primary: {
      main: '#3182ce',
      light: '#63b3ed',
      dark: '#2c5282',
    },
    secondary: {
      main: '#805ad5',
      light: '#b794f6',
      dark: '#553c9a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2d3748',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
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