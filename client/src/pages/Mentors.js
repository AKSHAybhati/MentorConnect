import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [connectionDialog, setConnectionDialog] = useState({ open: false, mentor: null });
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
    // Check connection status for each mentor
    if (mentors.length > 0) {
      checkConnectionStatuses();
    }
  }, [mentors, searchTerm, skillFilter, locationFilter]);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/mentors/available');
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.headline?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (skillFilter) {
      filtered = filtered.filter(mentor =>
        mentor.mentorshipAreas?.includes(skillFilter)
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(mentor =>
        mentor.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredMentors(filtered);
  };

  const checkConnectionStatuses = async () => {
    const statuses = {};
    for (const mentor of mentors) {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/connection-status/${mentor._id}`);
        statuses[mentor._id] = response.data;
      } catch (error) {
        console.error('Error checking connection status:', error);
        statuses[mentor._id] = { status: 'none' };
      }
    }
    setConnectionStatuses(statuses);
  };

  const handleConnectRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/connections/request', {
        recipientId: connectionDialog.mentor._id,
        connectionType: 'mentorship',
        message: connectionMessage
      });
      
      setConnectionDialog({ open: false, mentor: null });
      setConnectionMessage('');
      
      // Update connection status
      setConnectionStatuses(prev => ({
        ...prev,
        [connectionDialog.mentor._id]: { status: 'pending', isRequester: true }
      }));
      
      showNotification('Connection request sent successfully!', 'success');
    } catch (error) {
      console.error('Error sending connection request:', error);
      showNotification('Failed to send connection request. Please try again.', 'error');
    }
  };

  const openConnectionDialog = (mentor) => {
    setConnectionDialog({ open: true, mentor });
    setConnectionMessage(`Hi ${mentor.firstName}, I'm interested in connecting with you for mentorship guidance. I'd love to learn from your experience in ${mentor.mentorshipAreas?.[0] || 'your field'}.`);
  };

  const getConnectionButtonProps = (mentor) => {
    const status = connectionStatuses[mentor._id];
    
    if (!status || status.status === 'none') {
      return {
        text: 'Connect for Mentorship',
        color: 'primary',
        variant: 'contained',
        disabled: false,
        onClick: () => openConnectionDialog(mentor)
      };
    }
    
    if (status.status === 'pending') {
      return {
        text: status.isRequester ? 'Request Sent' : 'Respond to Request',
        color: 'secondary',
        variant: 'outlined',
        disabled: status.isRequester,
        onClick: status.isRequester ? null : () => navigate('/network')
      };
    }
    
    if (status.status === 'connected') {
      return {
        text: 'Connected ✓',
        color: 'success',
        variant: 'outlined',
        disabled: true,
        onClick: null
      };
    }
    
    return {
      text: 'Connect for Mentorship',
      color: 'primary',
      variant: 'contained',
      disabled: false,
      onClick: () => openConnectionDialog(mentor)
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Find Mentors
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Connect with experienced professionals who can guide your career journey
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search mentors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name, title, or expertise..."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="City, state, or country..."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Skill Area</InputLabel>
            <Select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              label="Skill Area"
            >
              <MenuItem value="">All Skills</MenuItem>
              <MenuItem value="Software Development">Software Development</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Product Management">Product Management</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Entrepreneurship">Entrepreneurship</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Mentors Grid */}
      <Grid container spacing={3}>
        {filteredMentors.map((mentor) => (
          <Grid item xs={12} md={6} lg={4} key={mentor._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={mentor.profilePicture}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    {mentor.firstName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {mentor.firstName} {mentor.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {mentor.headline}
                    </Typography>
                  </Box>
                </Box>

                {mentor.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {mentor.location}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="textSecondary">
                    {mentor.yearsOfExperience}+ years experience
                  </Typography>
                </Box>

                {mentor.isRetired && (
                  <Chip
                    label="Retired Professional"
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {mentor.summary || 'Experienced professional ready to share knowledge and guide the next generation.'}
                </Typography>

                {mentor.mentorshipAreas && mentor.mentorshipAreas.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Expertise:
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {mentor.mentorshipAreas.slice(0, 3).map((area, index) => (
                        <Chip
                          key={index}
                          label={area}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon fontSize="small" sx={{ color: 'gold', mr: 0.5 }} />
                  <Typography variant="body2">
                    Availability: {mentor.availability}
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                {(() => {
                  const buttonProps = getConnectionButtonProps(mentor);
                  return (
                    <Button
                      fullWidth
                      variant={buttonProps.variant}
                      color={buttonProps.color}
                      onClick={buttonProps.onClick}
                      disabled={buttonProps.disabled || user?.userType !== 'mentee'}
                    >
                      {buttonProps.text}
                    </Button>
                  );
                })()}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredMentors.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No mentors found matching your criteria
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search filters
          </Typography>
        </Box>
      )}

      {/* Connection Request Dialog */}
      <Dialog
        open={connectionDialog.open}
        onClose={() => setConnectionDialog({ open: false, mentor: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Connect with {connectionDialog.mentor?.firstName} {connectionDialog.mentor?.lastName}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={connectionMessage}
            onChange={(e) => setConnectionMessage(e.target.value)}
            placeholder="Introduce yourself and explain why you'd like to connect..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectionDialog({ open: false, mentor: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleConnectRequest}
            variant="contained"
            disabled={!connectionMessage.trim()}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Mentors;