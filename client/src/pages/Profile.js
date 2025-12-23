import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const { user } = useAuth();

  const isOwnProfile = !id || id === user?.id;

  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(user);
    } else {
      fetchUserProfile(id);
    }
  }, [id, user, isOwnProfile]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      setProfileUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleEditProfile = () => {
    setEditData({
      headline: profileUser.headline || '',
      summary: profileUser.summary || '',
      location: profileUser.location || '',
      skills: profileUser.skills?.join(', ') || '',
      mentorshipAreas: profileUser.mentorshipAreas?.join(', ') || '',
      careerGoals: profileUser.careerGoals?.join(', ') || ''
    });
    setEditDialog(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        ...editData,
        skills: editData.skills.split(',').map(s => s.trim()).filter(s => s),
        mentorshipAreas: editData.mentorshipAreas.split(',').map(s => s.trim()).filter(s => s),
        careerGoals: editData.careerGoals.split(',').map(s => s.trim()).filter(s => s)
      };

      const response = await api.put('/api/users/profile', updateData);
      setProfileUser(response.data);
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profileUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                src={profileUser.profilePicture}
                sx={{ width: 120, height: 120 }}
              >
                {profileUser.firstName[0]}
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {profileUser.firstName} {profileUser.lastName}
                </Typography>
                
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {profileUser.headline || 'Professional'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={profileUser.userType === 'mentor' ? 'Mentor' : 'Mentee'}
                    color={profileUser.userType === 'mentor' ? 'primary' : 'secondary'}
                  />
                  
                  {profileUser.isRetired && (
                    <Chip label="Retired Professional" color="success" />
                  )}
                  
                  {profileUser.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {profileUser.location}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {profileUser.summary || 'No summary provided yet.'}
                </Typography>

                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Skills & Expertise */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills & Expertise
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileUser.skills?.length > 0 ? (
                  profileUser.skills.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No skills listed yet
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Mentorship Areas / Career Goals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {profileUser.userType === 'mentor' ? 'Mentorship Areas' : 'Career Goals'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(profileUser.userType === 'mentor' ? profileUser.mentorshipAreas : profileUser.careerGoals)?.length > 0 ? (
                  (profileUser.userType === 'mentor' ? profileUser.mentorshipAreas : profileUser.careerGoals).map((item, index) => (
                    <Chip key={index} label={item} color="primary" />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    {profileUser.userType === 'mentor' ? 'No mentorship areas listed yet' : 'No career goals listed yet'}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Experience
              </Typography>
              {profileUser.experience?.length > 0 ? (
                <List>
                  {profileUser.experience.map((exp, index) => (
                    <ListItem key={index} divider={index < profileUser.experience.length - 1}>
                      <ListItemText
                        primary={exp.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {exp.company} • {exp.location}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                            </Typography>
                            {exp.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {exp.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No experience listed yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Education */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Education
              </Typography>
              {profileUser.education?.length > 0 ? (
                <List>
                  {profileUser.education.map((edu, index) => (
                    <ListItem key={index} divider={index < profileUser.education.length - 1}>
                      <ListItemText
                        primary={edu.degree}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {edu.school}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {edu.fieldOfStudy}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No education listed yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Headline"
                value={editData.headline || ''}
                onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Summary"
                value={editData.summary || ''}
                onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={editData.location || ''}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={editData.skills || ''}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                helperText="e.g. JavaScript, React, Node.js"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={profileUser.userType === 'mentor' ? 'Mentorship Areas (comma separated)' : 'Career Goals (comma separated)'}
                value={profileUser.userType === 'mentor' ? editData.mentorshipAreas || '' : editData.careerGoals || ''}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  [profileUser.userType === 'mentor' ? 'mentorshipAreas' : 'careerGoals']: e.target.value 
                })}
                helperText={profileUser.userType === 'mentor' ? 'e.g. Software Development, Career Guidance' : 'e.g. Senior Developer, Team Lead'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;