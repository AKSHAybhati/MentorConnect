import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Autocomplete,
  Slider,
  Switch,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'mentee',
    // Common fields
    headline: '',
    location: '',
    summary: '',
    skills: [],
    // Mentee specific
    careerGoals: [],
    experienceLevel: 'entry',
    lookingFor: [],
    // Mentor specific
    mentorshipAreas: [],
    yearsOfExperience: 5,
    isRetired: false,
    availability: 'medium',
    mentorshipStyle: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const steps = ['Basic Info', 'User Type', 'Profile Details'];

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

  const mentorshipStyles = [
    'Structured Sessions', 'Casual Conversations', 'Project-Based', 'Goal-Oriented',
    'Industry Networking', 'Skill Workshops', 'Career Planning', 'Problem Solving'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 2 }}>
                What best describes you?
              </FormLabel>
              <RadioGroup
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <Paper sx={{ p: 2, mb: 2, border: formData.userType === 'mentee' ? '2px solid #1976d2' : '1px solid #e0e0e0' }}>
                  <FormControlLabel
                    value="mentee"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6">Mentee - I'm seeking guidance</Typography>
                        <Typography variant="body2" color="textSecondary">
                          I'm early in my career or looking to transition and want to learn from experienced professionals
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
                <Paper sx={{ p: 2, border: formData.userType === 'mentor' ? '2px solid #1976d2' : '1px solid #e0e0e0' }}>
                  <FormControlLabel
                    value="mentor"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6">Mentor - I want to guide others</Typography>
                        <Typography variant="body2" color="textSecondary">
                          I have experience and knowledge to share with the next generation of professionals
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Professional Headline"
                  name="headline"
                  placeholder={formData.userType === 'mentee' ? 'e.g., Aspiring Software Developer' : 'e.g., Senior Software Engineer with 15+ years experience'}
                  value={formData.headline}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={skillOptions}
                  value={formData.skills}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, skills: newValue });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skills & Expertise"
                      placeholder="Select your skills"
                    />
                  )}
                />
              </Grid>

              {formData.userType === 'mentee' ? (
                <>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={careerGoalOptions}
                      value={formData.careerGoals}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, careerGoals: newValue });
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip color="primary" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Career Goals"
                          placeholder="What are you aiming for?"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel>Experience Level</FormLabel>
                      <RadioGroup
                        row
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="entry" control={<Radio />} label="Entry Level (0-2 years)" />
                        <FormControlLabel value="mid" control={<Radio />} label="Mid Level (3-5 years)" />
                        <FormControlLabel value="senior" control={<Radio />} label="Senior (5+ years)" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={mentorshipAreas}
                      value={formData.mentorshipAreas}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, mentorshipAreas: newValue });
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip color="secondary" label={option} {...getTagProps({ index })} />
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
                    <Typography gutterBottom>Years of Experience: {formData.yearsOfExperience}</Typography>
                    <Slider
                      value={formData.yearsOfExperience}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, yearsOfExperience: newValue });
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
                          onChange={(e) => setFormData({ ...formData, isRetired: e.target.checked })}
                        />
                      }
                      label="I am retired and have more time to mentor"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={mentorshipStyles}
                      value={formData.mentorshipStyle}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, mentorshipStyle: newValue });
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" color="primary" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Preferred Mentorship Style"
                          placeholder="How do you like to mentor?"
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Brief Summary"
                  name="summary"
                  placeholder={formData.userType === 'mentee' 
                    ? 'Tell us about your background and what you hope to achieve...' 
                    : 'Share your experience and what you can offer to mentees...'
                  }
                  value={formData.summary}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Join SeniorConnect
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Connect, Learn, and Grow Together
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword)) ||
                    (activeStep === 1 && !formData.userType)
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
          
          <Box textAlign="center" sx={{ mt: 3 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              type="button"
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;