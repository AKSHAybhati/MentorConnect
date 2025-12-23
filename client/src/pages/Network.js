import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const Network = () => {
  const [tabValue, setTabValue] = useState(0);
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConnections();
    fetchConnectionRequests();
  }, []);

  useEffect(() => {
    const term = searchParams.get('search') || '';
    setSearchTerm(term);
  }, [searchParams]);

  useEffect(() => {
    // Fetch suggested users after connections and requests are loaded
    if (connections.length >= 0 && connectionRequests.length >= 0) {
      fetchSuggestedUsers();
    }
  }, [connections, connectionRequests]);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/api/connections/my-connections');
      setConnections(response.data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await api.get('/api/connections/requests');
      setConnectionRequests(response.data);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await api.get('/api/users');
      
      // Filter out self, existing connections, and pending requests
      const connectedUserIds = connections.map(conn => conn._id);
      const pendingUserIds = connectionRequests.map(req => req.requester._id);
      const excludeIds = [...connectedUserIds, ...pendingUserIds, user?._id, user?.id];
      
      const filteredUsers = response.data.filter(u => u._id && !excludeIds.includes(u._id));
      setSuggestedUsers(filteredUsers.slice(0, 20));
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const matchesSearch = (u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(term) ||
      (u.headline || '').toLowerCase().includes(term) ||
      (u.location || '').toLowerCase().includes(term) ||
      (u.skills || []).some(s => s?.toLowerCase().includes(term)) ||
      (u.interests || []).some(s => s?.toLowerCase().includes(term)) ||
      (u.mentorshipAreas || []).some(s => s?.toLowerCase().includes(term)) ||
      (u.careerGoals || []).some(s => s?.toLowerCase().includes(term))
    );
  };

  const handleConnectionResponse = async (requestId, status) => {
    try {
      await api.put(`/api/connections/${requestId}/respond`, {
        status
      });
      
      // Refresh data
      fetchConnectionRequests();
      if (status === 'accepted') {
        fetchConnections();
      }
    } catch (error) {
      console.error('Error responding to connection request:', error);
    }
  };

  const sendConnectionRequest = async (userId) => {
    try {
      await api.post('/api/connections/request', {
        recipientId: userId,
        connectionType: 'networking',
        message: 'I would like to connect with you on SeniorConnect.'
      });
      
      // Remove from suggested users
      setSuggestedUsers(suggestedUsers.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error sending connection request:', error);
      // Show error message to user
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Network
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Connections (${connections.length})`} />
          <Tab label={`Requests (${connectionRequests.length})`} />
          <Tab label="Discover" />
        </Tabs>
      </Box>

      {/* Connections Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {connections.filter(matchesSearch).map((connection) => (
            <Grid item xs={12} sm={6} md={4} key={connection._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={connection.profilePicture}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      {connection.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {connection.firstName} {connection.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {connection.headline}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip
                    label={connection.userType === 'mentor' ? 'Mentor' : 'Mentee'}
                    color={connection.userType === 'mentor' ? 'primary' : 'secondary'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  
                  {connection.location && (
                    <Typography variant="body2" color="textSecondary">
                      {connection.location}
                    </Typography>
                  )}
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/profile/${connection._id}`)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {connections.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No connections yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Start connecting with mentors and mentees to build your network
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Connection Requests Tab */}
      {tabValue === 1 && (
        <List>
          {connectionRequests.filter((r) => matchesSearch(r.requester)).map((request) => (
            <ListItem key={request._id} divider>
              <ListItemAvatar>
                <Avatar src={request.requester.profilePicture}>
                  {request.requester.firstName[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${request.requester.firstName} ${request.requester.lastName}`}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {request.requester.headline}
                    </Typography>
                    <Chip
                      label={request.requester.userType === 'mentor' ? 'Mentor' : 'Mentee'}
                      color={request.requester.userType === 'mentor' ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ mt: 1, mr: 1 }}
                    />
                    <Chip
                      label={request.connectionType}
                      variant="outlined"
                      size="small"
                    />
                    {request.message && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{request.message}"
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={() => handleConnectionResponse(request._id, 'accepted')}
                  sx={{ mr: 1 }}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={() => handleConnectionResponse(request._id, 'declined')}
                >
                  Decline
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          
          {connectionRequests.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PersonAddIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No pending requests
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Connection requests will appear here
              </Typography>
            </Box>
          )}
        </List>
      )}

      {/* Discover Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {suggestedUsers.filter(matchesSearch).map((suggestedUser) => (
            <Grid item xs={12} sm={6} md={4} key={suggestedUser._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={suggestedUser.profilePicture}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      {suggestedUser.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {suggestedUser.firstName} {suggestedUser.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {suggestedUser.headline}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip
                    label={suggestedUser.userType === 'mentor' ? 'Mentor' : 'Mentee'}
                    color={suggestedUser.userType === 'mentor' ? 'primary' : 'secondary'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  
                  {suggestedUser.location && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {suggestedUser.location}
                    </Typography>
                  )}
                  
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => sendConnectionRequest(suggestedUser._id)}
                  >
                    Connect
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {suggestedUsers.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No suggestions available
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Check back later for new connection suggestions
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Network;