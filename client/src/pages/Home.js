import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  CardActions,
  IconButton,
  Chip
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    checkReturningUser();
  }, []);

  const checkReturningUser = () => {
    // Check if user has logged in before (you can use localStorage or check user creation date)
    const lastLogin = localStorage.getItem('lastLogin');
    const now = new Date().getTime();
    
    if (lastLogin) {
      setIsReturningUser(true);
    }
    
    // Set current login time
    localStorage.setItem('lastLogin', now.toString());
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts', {
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
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        text: commentText
      });
      
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const isPostLiked = (post) => {
    return post.likes.some(like => 
      like.user === user._id || like.user === user.id || like.user._id === user._id
    );
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
      {/* Welcome Message */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {isReturningUser ? `Welcome back, ${user?.firstName}!` : `Welcome, ${user?.firstName}!`}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user?.userType === 'mentee' 
            ? "Share your journey and connect with mentors" 
            : "Share your insights and guide the next generation"
          }
        </Typography>
      </Box>

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
                <InputLabel>Post Type</InputLabel>
                <Select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  label="Post Type"
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
                startIcon={<SendIcon />}
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
              color={isPostLiked(post) ? 'primary' : 'inherit'}
              sx={{ borderRadius: 2 }}
            >
              {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
            </Button>
            
            <Button
              startIcon={<CommentIcon />}
              onClick={() => toggleComments(post._id)}
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

          {/* Comments Section */}
          {showComments[post._id] && (
            <Box sx={{ px: 3, pb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              
              {/* Add Comment */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar src={user?.profilePicture} sx={{ width: 32, height: 32 }}>
                  {user?.firstName?.[0]}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment(post._id);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <Button
                          size="small"
                          onClick={() => handleComment(post._id)}
                          disabled={!commentInputs[post._id]?.trim()}
                        >
                          Post
                        </Button>
                      )
                    }}
                  />
                </Box>
              </Box>

              {/* Comments List */}
              {post.comments.map((comment) => (
                <Box key={comment._id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={comment.user?.profilePicture} 
                    sx={{ width: 32, height: 32 }}
                  >
                    {comment.user?.firstName?.[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {comment.user?.firstName} {comment.user?.lastName}
                      </Typography>
                      <Typography variant="body2">
                        {comment.text}
                      </Typography>
                    </Paper>
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
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

export default Home;