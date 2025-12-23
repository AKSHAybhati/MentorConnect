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
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Message as MessageIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    filterConnections();
  }, [connections, searchTerm]);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/api/connections/my-connections');
      setConnections(response.data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const filterConnections = () => {
    if (!searchTerm) {
      setFilteredConnections(connections);
      return;
    }

    const filtered = connections.filter(connection =>
      `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConnections(filtered);
  };

  const handleMenuOpen = (event, connection) => {
    setMenuAnchor(event.currentTarget);
    setSelectedConnection(connection);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedConnection(null);
  };

  const handleMessage = (connection) => {
    // This would open the chat sidebar with this connection
    handleMenuClose();
    // For now, navigate to messages page
    navigate('/messages');
  };

  const handleViewProfile = (connection) => {
    navigate(`/profile/${connection._id}`);
    handleMenuClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Connections
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {connections.length} connection{connections.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Connections Grid */}
      <Grid container spacing={3}>
        {filteredConnections.map((connection) => (
          <Grid item xs={12} sm={6} md={4} key={connection._id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={(e) => handleMenuOpen(e, connection)}
                >
                  <MoreVertIcon />
                </IconButton>

                <Avatar
                  src={connection.profilePicture}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                >
                  {connection.firstName[0]}
                </Avatar>

                <Typography variant="h6" gutterBottom>
                  {connection.firstName} {connection.lastName}
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {connection.headline || 'Professional'}
                </Typography>

                {connection.location && (
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
                    {connection.location}
                  </Typography>
                )}

                <Chip
                  label={connection.userType === 'mentor' ? 'Mentor' : 'Mentee'}
                  color={connection.userType === 'mentor' ? 'primary' : 'secondary'}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MessageIcon />}
                    onClick={() => handleMessage(connection)}
                  >
                    Message
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleViewProfile(connection)}
                  >
                    View Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredConnections.length === 0 && connections.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No connections found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search terms
          </Typography>
        </Box>
      )}

      {connections.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No connections yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start connecting with mentors and mentees to build your network
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/network')}
          >
            Find Connections
          </Button>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewProfile(selectedConnection)}>
          View Profile
        </MenuItem>
        <MenuItem onClick={() => handleMessage(selectedConnection)}>
          Send Message
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Connections;