import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  TextField,
  IconButton,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Call as CallIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import VideoCall from '../components/VideoCall';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [callType, setCallType] = useState('video');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { socket, sendMessage } = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        if (selectedConversation && 
            (message.sender === selectedConversation.user._id || 
             message.receiver === selectedConversation.user._id)) {
          setMessages(prev => [...prev, message]);
        }
        // Update conversations list
        fetchConversations();
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
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
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
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        receiverId: selectedConversation.user._id,
        content: newMessage
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      
      // Send via socket for real-time delivery
      sendMessage(selectedConversation.user._id, newMessage);
      
      // Update conversations
      fetchConversations();
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

  const startVideoCall = (type = 'video') => {
    setCallType(type);
    setVideoCallOpen(true);
    setMenuAnchor(null);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.user._id}
                  button
                  selected={selectedConversation?.user._id === conversation.user._id}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={conversation.unreadCount}
                      color="error"
                      invisible={conversation.unreadCount === 0}
                    >
                      <Badge
                        variant="dot"
                        color="success"
                        invisible={!isUserOnline(conversation.user._id)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <Avatar src={conversation.user.profilePicture}>
                          {conversation.user.firstName[0]}
                        </Avatar>
                      </Badge>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${conversation.user.firstName} ${conversation.user.lastName}`}
                    secondary={
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {conversation.lastMessage.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              
              {conversations.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No conversations yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start connecting with mentors and mentees to begin messaging
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge
                        variant="dot"
                        color="success"
                        invisible={!isUserOnline(selectedConversation.user._id)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <Avatar src={selectedConversation.user.profilePicture} sx={{ mr: 2 }}>
                          {selectedConversation.user.firstName[0]}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="h6">
                          {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {isUserOnline(selectedConversation.user._id) ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <IconButton onClick={() => startVideoCall('audio')}>
                        <CallIcon />
                      </IconButton>
                      <IconButton onClick={() => startVideoCall('video')}>
                        <VideoCallIcon />
                      </IconButton>
                      <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                        <MoreVertIcon />
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
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: message.sender._id === user.id ? 'primary.main' : 'grey.200',
                          color: message.sender._id === user.id ? 'white' : 'text.primary',
                          position: 'relative'
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
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <IconButton size="small">
                      <AttachFileIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EmojiIcon />
                    </IconButton>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        },
                        '&:disabled': {
                          backgroundColor: 'grey.300'
                        }
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}>
                <Typography variant="h6" color="textSecondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => startVideoCall('audio')}>
          <CallIcon sx={{ mr: 1 }} />
          Voice Call
        </MenuItem>
        <MenuItem onClick={() => startVideoCall('video')}>
          <VideoCallIcon sx={{ mr: 1 }} />
          Video Call
        </MenuItem>
      </Menu>

      {/* Video Call Dialog */}
      {selectedConversation && (
        <VideoCall
          open={videoCallOpen}
          onClose={() => setVideoCallOpen(false)}
          recipientUser={selectedConversation.user}
          callType={callType}
        />
      )}
    </Container>
  );
};

export default Messages;