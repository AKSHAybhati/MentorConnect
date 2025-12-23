const express = require('express');
const Connection = require('../models/Connection');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { createNotification } = require('./notifications');

const router = express.Router();

// Send connection request
router.post('/request', auth, async (req, res) => {
  try {
    const { recipientId, connectionType, message } = req.body;

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: recipientId },
        { requester: recipientId, recipient: req.userId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    const connection = new Connection({
      requester: req.userId,
      recipient: recipientId,
      connectionType,
      message
    });

    await connection.save();
    
    const populatedConnection = await Connection.findById(connection._id)
      .populate('requester', 'firstName lastName profilePicture headline')
      .populate('recipient', 'firstName lastName profilePicture headline');

    // Notify recipient of new request
    await createNotification(
      recipientId,
      req.userId,
      'connection_request',
      'sent you a connection request',
      null,
      connection._id
    );

    res.status(201).json(populatedConnection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get connection requests (received)
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.userId,
      status: 'pending'
    })
    .populate('requester', 'firstName lastName profilePicture headline userType')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept/Decline connection request
router.put('/:id/respond', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    
    const connection = await Connection.findById(req.params.id);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = status;
    await connection.save();

    // If accepted, add to both users' connections
    if (status === 'accepted') {
      await User.findByIdAndUpdate(connection.requester, {
        $addToSet: { connections: connection.recipient }
      });
      await User.findByIdAndUpdate(connection.recipient, {
        $addToSet: { connections: connection.requester }
      });

      await createNotification(
        connection.requester,
        connection.recipient,
        'connection_accepted',
        'accepted your connection request',
        null,
        connection._id
      );
    }

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's connections
router.get('/my-connections', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('connections', 'firstName lastName profilePicture headline userType location');
    
    res.json(user.connections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;