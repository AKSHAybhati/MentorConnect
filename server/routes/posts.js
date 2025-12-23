const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const { createNotification } = require('./notifications');

const router = express.Router();

// Get all posts (feed)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName lastName profilePicture headline')
      .populate('comments.user', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image, postType } = req.body;

    const post = new Post({
      author: req.userId,
      content,
      image,
      postType
    });

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName profilePicture headline');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(like => like.user.toString() === req.userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: req.userId });
      
      // Create notification for like
      await createNotification(
        post.author,
        req.userId,
        'like',
        'liked your post',
        post._id
      );
    }

    await post.save();
    
    // Return populated post
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName profilePicture headline')
      .populate('comments.user', 'firstName lastName profilePicture');
    
    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.userId,
      text
    });

    await post.save();
    
    // Create notification for comment
    await createNotification(
      post.author,
      req.userId,
      'comment',
      'commented on your post',
      post._id
    );
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName profilePicture headline')
      .populate('comments.user', 'firstName lastName profilePicture');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;