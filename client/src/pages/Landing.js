import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  People as PeopleIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  VideoCall as VideoCallIcon,
  Security as SecurityIcon,
  RocketLaunch as RocketIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <PeopleIcon color="primary" />,
    title: 'Mentor matching',
    description: 'Connect mentors and mentees with purposeful matching and clear profiles.',
  },
  {
    icon: <MessageIcon color="primary" />,
    title: 'Messaging that feels live',
    description: 'Chat with your network in real time, including quick replies and status.',
  },
  {
    icon: <NotificationsIcon color="primary" />,
    title: 'Smart notifications',
    description: 'Stay on top of requests, comments, and likes with tidy, actionable alerts.',
  },
  {
    icon: <VideoCallIcon color="primary" />,
    title: 'Calls built in',
    description: 'Spin up video calls directly from your conversations—no extra tools needed.',
  },
  {
    icon: <SecurityIcon color="primary" />,
    title: 'Secure by default',
    description: 'Protected sessions, JWT auth, and role-aware access keep data safe.',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #fde047 0%, #0ea5e9 45%, #0ea5e9 100%)', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StarIcon sx={{ color: '#ec4899' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>SeniorConnect</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigate('/login')} sx={{ color: '#0f172a', fontWeight: 700 }}>
              Login
            </Button>
            <Button variant="contained" onClick={() => navigate('/register')} sx={{ backgroundColor: '#ec4899', fontWeight: 700 }}>
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
        {/* Hero */}
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              label="Mentorship • Networking • Growth"
              color="secondary"
              sx={{ mb: 2, fontWeight: 700, backgroundColor: '#fbbf24', color: '#0f172a' }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2, lineHeight: 1.1 }}>
              Bright, bold, and built for real connections.
            </Typography>
            <Typography variant="h6" sx={{ color: '#0f172a', opacity: 0.8, mb: 4 }}>
              Find mentors and mentees fast, manage requests, chat instantly, and launch video calls—
              all wrapped in a vibrant interface that keeps you energized.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" size="large" onClick={() => navigate('/register')} sx={{ backgroundColor: '#ec4899', fontWeight: 800 }}>
                Create Account
              </Button>
              <Button variant="outlined" size="large" color="inherit" onClick={() => navigate('/login')} sx={{ borderColor: '#0f172a', color: '#0f172a', fontWeight: 700 }}>
                Login
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 3, color: 'rgba(255,255,255,0.7)' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PeopleIcon fontSize="small" />
                <Typography variant="body2">Mentor / Mentee roles</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <NotificationsIcon fontSize="small" />
                <Typography variant="body2">Actionable alerts</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <VideoCallIcon fontSize="small" />
                <Typography variant="body2">1-click video calls</Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ec4899 0%, #fbbf24 60%, #0ea5e9 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                color: '#0f172a'
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <RocketIcon sx={{ color: '#0f172a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Launch into your network
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ color: '#0f172a', opacity: 0.9 }}>
                    Bright, energetic, and ready for action. Review requests, chat live, and jump on calls without leaving the app.
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  {[
                    'Mentor matching with clear roles',
                    'Connection requests & approvals',
                    'Real-time chat + notifications',
                    'Built-in video calling',
                    'Secure JWT sessions'
                  ].map((item) => (
                    <Stack key={item} direction="row" spacing={1} alignItems="center">
                      <StarIcon fontSize="small" sx={{ color: '#0f172a' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button variant="contained" fullWidth size="large" onClick={() => navigate('/register')} sx={{ backgroundColor: '#0f172a', color: 'white', fontWeight: 800 }}>
                  Start free
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Features grid */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
            Built for meaningful connections
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Everything you need to start conversations, nurture mentorships, and stay in sync.
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Steps */}
        <Box sx={{ mt: 10, mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
            Get started in minutes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Three simple steps to find mentors, share goals, and stay connected.
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Create your profile', description: 'Set your role, goals, and availability.' },
              { title: 'Send requests', description: 'Connect with mentors or mentees that fit your needs.' },
              { title: 'Chat & call', description: 'Message instantly or hop on a video call to move faster.' },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={step.title}>
                <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', height: '100%' }}>
                  <Chip label={`0${index + 1}`} color="primary" variant="outlined" sx={{ mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(90deg, #fde047 0%, #ec4899 50%, #0ea5e9 100%)',
            color: '#0f172a',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                Ready to light up your mentorship journey?
              </Typography>
              <Typography variant="body1" sx={{ color: '#0f172a', opacity: 0.85 }}>
                Join SeniorConnect and start meaningful conversations today.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="inherit" onClick={() => navigate('/register')} sx={{ backgroundColor: '#0f172a', color: 'white', fontWeight: 800 }}>
                  Sign Up
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/login')} sx={{ borderColor: '#0f172a', color: '#0f172a', fontWeight: 700 }}>
                  Login
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Landing;

