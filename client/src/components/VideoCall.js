import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Avatar,
  Button,
  Paper
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon
} from '@mui/icons-material';

const VideoCall = ({ open, onClose, recipientUser, callType = 'video' }) => {
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleVideo = () => setVideoEnabled(!videoEnabled);
  const toggleAudio = () => setAudioEnabled(!audioEnabled);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          height: '60vh', 
          backgroundColor: '#1a1a1a',
          borderRadius: 2
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', height: '100%' }}>
        {/* Video Placeholder */}
        <Box sx={{ 
          position: 'relative', 
          height: '100%', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Avatar
              src={recipientUser?.profilePicture}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            >
              {recipientUser?.firstName?.[0]}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {recipientUser?.firstName} {recipientUser?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {callType === 'video' ? 'Video Call' : 'Voice Call'}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.6 }}>
              Video calling will be available soon
            </Typography>
          </Box>
        </Box>

        {/* Call Controls */}
        <Box sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: 4,
          p: 1
        }}>
          <IconButton
            onClick={toggleAudio}
            sx={{
              backgroundColor: audioEnabled ? 'rgba(255,255,255,0.1)' : '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: audioEnabled ? 'rgba(255,255,255,0.2)' : '#d32f2f'
              }
            }}
          >
            {audioEnabled ? <MicIcon /> : <MicOffIcon />}
          </IconButton>

          {callType === 'video' && (
            <IconButton
              onClick={toggleVideo}
              sx={{
                backgroundColor: videoEnabled ? 'rgba(255,255,255,0.1)' : '#f44336',
                color: 'white',
                '&:hover': {
                  backgroundColor: videoEnabled ? 'rgba(255,255,255,0.2)' : '#d32f2f'
                }
              }}
            >
              {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
          )}

          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: '#d32f2f'
              }
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;