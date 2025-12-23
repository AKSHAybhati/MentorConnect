import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  InputBase,
  Badge,
  Button,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled, alpha } from '@mui/material/styles';
import api from '../api';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 80,
  padding: theme.spacing(1),
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '& .MuiButton-startIcon': {
    margin: 0,
    marginBottom: theme.spacing(0.5),
  },
  textTransform: 'none',
  fontSize: '0.75rem',
  fontWeight: active ? 600 : 400,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Navbar = ({ onChatToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUnreadMessages();
      fetchNotifications();
      // Set up interval to check for new messages and notifications
      const interval = setInterval(() => {
        fetchUnreadMessages();
        fetchNotifications();
      }, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadMessages = async () => {
    try {
      const response = await api.get('/api/messages/unread-count');
      setUnreadMessages(response.data.count);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const [listRes, countRes] = await Promise.all([
        api.get('/api/notifications'),
        api.get('/api/notifications/unread-count')
      ]);
      setNotifications(listRes.data);
      setUnreadNotifications(countRes.data.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
    if (unreadNotifications > 0) {
      markAllNotificationsRead();
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const notificationCopy = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.sender.firstName} liked your post`;
      case 'comment':
        return `${notification.sender.firstName} commented on your post`;
      case 'connection_request':
        return `${notification.sender.firstName} sent you a connection request`;
      case 'connection_accepted':
        return `${notification.sender.firstName} accepted your request`;
      default:
        return notification.message;
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await api.put(`/api/notifications/${notification._id}/read`);
        setUnreadNotifications((prev) => Math.max(prev - 1, 0));
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
      }

      if (notification.type === 'like' || notification.type === 'comment') {
        navigate('/');
      } else if (notification.type === 'connection_request' || notification.type === 'connection_accepted') {
        navigate('/network');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      handleMenuClose();
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      setUnreadNotifications(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Search */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              cursor: 'pointer',
              color: 'primary.main',
              fontWeight: 700,
              mr: 2
            }}
            onClick={() => navigate('/home')}
          >
            SeniorConnect
          </Typography>

          <Search sx={{ ml: 2 }}>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search people, posts..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{ color: 'text.primary' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  navigate(`/network?search=${encodeURIComponent(searchTerm.trim())}`);
                }
              }}
            />
          </Search>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NavButton
            startIcon={<HomeIcon />}
            active={isActive('/home')}
            onClick={() => navigate('/home')}
          >
            Home
          </NavButton>

          <NavButton
            startIcon={<PeopleIcon />}
            active={isActive('/network')}
            onClick={() => navigate('/network')}
          >
            My Network
          </NavButton>

          <NavButton
            startIcon={
              <Badge badgeContent={unreadMessages} color="error">
                <MessageIcon />
              </Badge>
            }
            active={false}
            onClick={onChatToggle}
          >
            Messaging
          </NavButton>

          <NavButton
            startIcon={
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            }
            active={false}
            onClick={handleNotificationMenuOpen}
          >
            Notifications
          </NavButton>

          <NavButton
            startIcon={
              <Avatar
                src={user?.profilePicture}
                sx={{ width: 24, height: 24 }}
              >
                {user?.firstName?.[0]}
              </Avatar>
            }
            active={isActive('/profile')}
            onClick={handleProfileMenuOpen}
          >
            Me
          </NavButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { minWidth: 200, mt: 1 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={user?.profilePicture}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                {user?.firstName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.headline || 'Professional'}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => { navigate('/profile'); handleMenuClose(); }}
            >
              View Profile
            </Button>
          </Box>
          
          <MenuItem onClick={() => { navigate('/profile/edit'); handleMenuClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => { navigate('/connections'); handleMenuClose(); }}>
            <ListItemIcon>
              <PeopleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Connections</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { minWidth: 350, mt: 1, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          
          {loadingNotifications ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Loading notifications...
              </Typography>
            </Box>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem 
                key={notification._id} 
                onClick={() => handleNotificationClick(notification)}
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: notification.read ? 'transparent' : 'rgba(79,70,229,0.04)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar 
                    src={notification.sender?.profilePicture} 
                    sx={{ width: 40, height: 40, mr: 2 }}
                  >
                    {notification.sender?.firstName?.[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {notificationCopy(notification)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                No new notifications
              </Typography>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;