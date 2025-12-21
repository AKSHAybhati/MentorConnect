import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    connectionRequests: true,
    messageNotifications: true,
    profileVisibility: true,
    showOnlineStatus: true
  });
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    showNotification('Settings saved successfully!', 'success');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Manage your account preferences and privacy settings
      </Typography>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive push notifications in browser"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleSettingChange('pushNotifications')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Connection Requests"
                    secondary="Get notified when someone wants to connect"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.connectionRequests}
                      onChange={handleSettingChange('connectionRequests')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Message Notifications"
                    secondary="Get notified about new messages"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.messageNotifications}
                      onChange={handleSettingChange('messageNotifications')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VisibilityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Privacy</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Profile Visibility"
                    secondary="Make your profile visible to other users"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.profileVisibility}
                      onChange={handleSettingChange('profileVisibility')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Show Online Status"
                    secondary="Let others see when you're online"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.showOnlineStatus}
                      onChange={handleSettingChange('showOnlineStatus')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Security */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Account Security</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Change Password"
                    secondary="Update your account password"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">
                      Change
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">
                      Enable
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6" color="error">
                  Danger Zone
                </Typography>
              </Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                These actions are irreversible. Please be careful.
              </Alert>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Delete Account"
                    secondary="Permanently delete your account and all data"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" color="error" size="small">
                      Delete Account
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSaveSettings}
              size="large"
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;