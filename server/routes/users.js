const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users with filters
router.get('/', auth, async (req, res) => {
  try {
    const { userType, skills, location, search } = req.query;
    let query = {};

    if (userType) query.userType = userType;
    if (location) query.location = new RegExp(location, 'i');
    if (skills) query.skills = { $in: skills.split(',') };
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { headline: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'firstName lastName profilePicture headline');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get mentors (for mentees)
router.get('/mentors/available', auth, async (req, res) => {
  try {
    const { skills, location } = req.query;
    let query = { userType: 'mentor', availability: { $ne: 'low' } };

    if (skills) query.mentorshipAreas = { $in: skills.split(',') };
    if (location) query.location = new RegExp(location, 'i');

    // Get current user's connections to exclude them
    const currentUser = await User.findById(req.userId).select('connections');
    const connectedUserIds = currentUser.connections || [];
    
    // Also exclude users with pending connection requests
    const pendingConnections = await require('../models/Connection').find({
      $or: [
        { requester: req.userId, status: 'pending' },
        { recipient: req.userId, status: 'pending' }
      ]
    });
    
    const pendingUserIds = pendingConnections.map(conn => 
      conn.requester.toString() === req.userId ? conn.recipient : conn.requester
    );

    // Exclude connected and pending users, and the current user
    query._id = { 
      $nin: [...connectedUserIds, ...pendingUserIds, req.userId] 
    };

    const mentors = await User.find(query)
      .select('-password')
      .sort({ yearsOfExperience: -1 })
      .limit(10);

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check connection status with a user
router.get('/connection-status/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if already connected
    const currentUser = await User.findById(req.userId).select('connections');
    const isConnected = currentUser.connections.includes(userId);
    
    if (isConnected) {
      return res.json({ status: 'connected' });
    }
    
    // Check for pending connection
    const Connection = require('../models/Connection');
    const pendingConnection = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: userId, status: 'pending' },
        { requester: userId, recipient: req.userId, status: 'pending' }
      ]
    });
    
    if (pendingConnection) {
      return res.json({ 
        status: 'pending',
        isRequester: pendingConnection.requester.toString() === req.userId
      });
    }
    
    res.json({ status: 'none' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;