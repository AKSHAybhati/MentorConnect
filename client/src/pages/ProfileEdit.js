import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Chip,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Slider,
  Divider,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    summary: '',
    location: '',
    skills: [],
    mentorshipAreas: [],
    careerGoals: [],
    yearsOfExperience: 5,
    isRetired: false,
    availability: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user, refreshUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Data Science', 'Machine Learning',
    'Product Management', 'Marketing', 'Sales', 'Finance', 'Leadership', 'Strategy',
    'Design', 'UX/UI', 'Project Management', 'Entrepreneurship', 'Consulting'
  ];

  const mentorshipAreas = [
    'Career Guidance', 'Technical Skills', 'Leadership Development', 'Entrepreneurship',
    'Industry Insights', 'Networking', 'Interview Preparation', 'Skill Development',
    'Work-Life Balance', 'Professional Growth'
  ];

  const careerGoalOptions = [
    'Senior Developer', 'Team Lead', 'Product Manager', 'Startup Founder',
    'Data Scientist', 'UX Designer', 'Marketing Manager', 'Sales Director',
    'Consultant', 'Executive', 'Industry Expert', 'Thought Leader'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        headline: user.headline || '',
        summary: user.summary || '',
        location: user.location || '',
        skills: user.skills || [],
        mentorshipAreas: user.mentorshipAreas || [],
        careerGoals: user.careerGoals || [],
        yearsOfExperience: user.yearsOfExperience || 5,
        isRetired: user.isRetired || false,
        availability: user.availability || 'medium'
      });
      setImagePreview(user.profilePicture);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // This would typically upload to a service like Cloudinary
      // For now, we'll just return the preview URL
      return imagePreview;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updateData = { ...formData };
      
      // Upload image if changed
      if (imageFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          updateData.profilePicture = imageUrl;
        }
      }

      await api.put('/api/users/profile', updateData);
      
      // Refresh user data in context
      await refreshUser();
      
      showNotification('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile. Please try again.', 'error');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Update your information to help others connect with you
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Picture */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={imagePreview || user?.profilePicture}
                  sx={{ width: 120, height: 120 }}
                >
                  {formData.firstName?.[0]}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'primary.dark' }
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Click the camera icon to change your profile picture
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Professional Headline"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer | Mentor"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State/Country"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Tell others about your background, experience, and what you can offer..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills & Expertise
              </Typography>
              <Autocomplete
                multiple
                options={skillOptions}
                value={formData.skills}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, skills: newValue }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Add your skills"
                    helperText="Select skills that represent your expertise"
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Role-specific Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {user?.userType === 'mentor' ? 'Mentorship Information' : 'Career Goals'}
              </Typography>
              
              {user?.userType === 'mentor' ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={mentorshipAreas}
                      value={formData.mentorshipAreas}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, mentorshipAreas: newValue }));
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip color="primary" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Mentorship Areas"
                          placeholder="What can you help with?"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      Years of Experience: {formData.yearsOfExperience}
                    </Typography>
                    <Slider
                      value={formData.yearsOfExperience}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({ ...prev, yearsOfExperience: newValue }));
                      }}
                      min={1}
                      max={50}
                      marks={[
                        { value: 1, label: '1' },
                        { value: 10, label: '10' },
                        { value: 25, label: '25' },
                        { value: 50, label: '50+' }
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isRetired}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            isRetired: e.target.checked 
                          }))}
                        />
                      }
                      label="I am retired and have more time to mentor"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Availability</FormLabel>
                      <RadioGroup
                        row
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <Autocomplete
                  multiple
                  options={careerGoalOptions}
                  value={formData.careerGoals}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({ ...prev, careerGoals: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip color="secondary" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Career Goals"
                      placeholder="What are you aiming for?"
                      helperText="Select your career aspirations"
                    />
                  )}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileEdit;