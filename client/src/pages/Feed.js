import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Chip,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Send as SendIcon
} from '@mui/icons-material';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('general');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/posts', {
        content: newPost,
        postType
      });
      
      setPosts([response.data, ...posts]);
      setNewPost('');
      setPostType('general');
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'mentorship-offer': return 'success';
      case 'mentorship-request': return 'primary';
      case 'career-advice': return 'warning';
      default: return 'default';
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case 'mentorship-offer': return 'Offering Mentorship';
      case 'mentorship-request': return 'Seeking Mentor';
      case 'career-advice': return 'Career Advice';
      default: return 'General';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Feed
      </Typography>

      {/* Create Post */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar src={user?.profilePicture}>
            {user?.firstName?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts, insights, or ask for advice..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="mentorship-offer">Offering Mentorship</MenuItem>
                  <MenuItem value="mentorship-request">Seeking Mentor</MenuItem>
                  <MenuItem value="career-advice">Career Advice</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleCreatePost}
                disabled={loading || !newPost.trim()}
                sx={{ borderRadius: 2 }}
              >
                Share
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Posts Feed */}
      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={post.author.profilePicture} sx={{ mr: 2 }}>
                {post.author.firstName[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  {post.author.firstName} {post.author.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {post.author.headline} • {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Chip
                label={getPostTypeLabel(post.postType)}
                color={getPostTypeColor(post.postType)}
                size="small"
              />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {post.content}
            </Typography>
            
            {post.image && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={post.image}
                  alt="Post content"
                  style={{ 
                    width: '100%', 
                    maxHeight: 400, 
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
              </Box>
            )}
          </CardContent>
          
          <Divider />
          
          <CardActions sx={{ px: 3, py: 2 }}>
            <Button
              startIcon={<ThumbUpIcon />}
              onClick={() => handleLike(post._id)}
              color={post.likes.some(like => like.user === user.id) ? 'primary' : 'inherit'}
              sx={{ borderRadius: 2 }}
            >
              {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
            </Button>
            
            <Button
              startIcon={<CommentIcon />}
              sx={{ borderRadius: 2 }}
            >
              {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
            </Button>
            
            <Button
              startIcon={<ShareIcon />}
              sx={{ borderRadius: 2 }}
            >
              Share
            </Button>
          </CardActions>
        </Card>
      ))}

      {posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Be the first to share something with the community!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Feed;