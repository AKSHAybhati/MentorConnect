import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  Paper,
  Badge,
  Divider,
  Button,
  Collapse
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import VideoCall from './VideoCall';

const ChatSidebar = ({ open, onClose }) => {
  const [connections, setConnections] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [callType, setCallType] = useState('video');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { socket, sendMessage } = useSocket();

  useEffect(() => {
    if (open) {
      fetchConnections();
    }
  }, [open]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        if (selectedChat && 
            (message.sender === selectedChat._id || 
             message.receiver === selectedChat._id)) {
          setMessages(prev => [...prev, message]);
        }
      });

      socket.on('user-online', (userId) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      socket.on('user-offline', (userId) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });
    }
  }, [socket, selectedChat]);

  const fetchConnections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/connections/my-connections');
      setConnections(response.data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        receiverId: selectedChat._id,
        content: newMessage
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // Send via socket for real-time delivery
      sendMessage(selectedChat._id, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startCall = (type) => {
    setCallType(type);
    setVideoCallOpen(true);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        variant="persistent"
        sx={{
          width: 350,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 350,
            boxSizing: 'border-box',
            mt: 8, // Account for navbar height
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Messages</Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {!selectedChat ? (
            // Connections List
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List>
                {connections.map((connection) => (
                  <ListItem
                    key={connection._id}
                    button
                    onClick={() => setSelectedChat(connection)}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        variant="dot"
                        color="success"
                        invisible={!isUserOnline(connection._id)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <Avatar src={connection.profilePicture}>
                          {connection.firstName[0]}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${connection.firstName} ${connection.lastName}`}
                      secondary={connection.headline}
                      secondaryTypographyProps={{
                        noWrap: true,
                        variant: 'caption'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              
              {connections.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="textSecondary">
                    No connections yet. Start connecting with mentors and mentees to begin messaging.
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            // Chat Interface
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => setSelectedChat(null)}
                      sx={{ mr: 1 }}
                    >
                      <ExpandLess />
                    </IconButton>
                    <Badge
                      variant="dot"
                      color="success"
                      invisible={!isUserOnline(selectedChat._id)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar src={selectedChat.profilePicture} sx={{ width: 32, height: 32, mr: 1 }}>
                        {selectedChat.firstName[0]}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="subtitle2">
                        {selectedChat.firstName} {selectedChat.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {isUserOnline(selectedChat._id) ? 'Online' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <IconButton size="small" onClick={() => startCall('audio')}>
                      <CallIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => startCall('video')}>
                      <VideoCallIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                {messages.map((message) => (
                  <Box
                    key={message._id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender._id === user.id ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Paper
                      sx={{
                        maxWidth: '75%',
                        p: 1.5,
                        backgroundColor: message.sender._id === user.id ? 'primary.main' : 'grey.100',
                        color: message.sender._id === user.id ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          textAlign: 'right'
                        }}
                      >
                        {formatMessageTime(message.createdAt)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Video Call Dialog */}
      {selectedChat && (
        <VideoCall
          open={videoCallOpen}
          onClose={() => setVideoCallOpen(false)}
          recipientUser={selectedChat}
          callType={callType}
        />
      )}
    </>
  );
};

export default ChatSidebar;