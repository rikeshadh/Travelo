const express = require('express');
const router = express.Router();
const SupportMessage = require('../models/SupportMessage');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// ================= Chat Endpoints =================

// @route   GET /api/chat/messages
// @desc    Retrieve chat history (either user's own or target user for admins)
router.get('/messages', protect, async (req, res) => {
  try {
    const targetUserId = req.query.userId || req.user.id;
    
    // If requesting someone else's messages, verify request user is admin
    if (targetUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await SupportMessage.find({ userId: targetUserId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chat/send
// @desc    Send a support message
router.post('/send', protect, async (req, res) => {
  const { message, targetUserId } = req.body; // targetUserId used by admins replying to a user
  try {
    const chatUserId = req.user.role === 'admin' ? targetUserId : req.user.id;
    if (!chatUserId) {
      return res.status(400).json({ message: 'Missing target user ID' });
    }

    // Determine sender name
    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    const messageRecord = await SupportMessage.create({
      userId: chatUserId,
      userName: req.user.name,
      message,
      sender
    });

    // Notify user if admin replied
    if (sender === 'admin') {
      await Notification.create({
        userId: chatUserId,
        message: 'Support: You have a new message from our customer service agent!',
        link: '/support'
      });
    }

    res.status(201).json(messageRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/chat/admin/conversations
// @desc    List all unique users that have sent messages (Admin support view)
router.get('/admin/conversations', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const convos = await SupportMessage.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
          lastMessage: { $first: '$message' },
          lastUpdated: { $first: '$createdAt' }
      }},
      { $sort: { lastUpdated: -1 } }
    ]);

    res.json(convos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= Notification Endpoints =================

// @route   GET /api/chat/notifications
// @desc    Get user's notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(15);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/chat/notifications/:id
// @desc    Mark notification as read
router.put('/notifications/:id', protect, async (req, res) => {
  try {
    const notify = await Notification.findById(req.params.id);
    if (!notify) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notify.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notify.read = true;
    await notify.save();
    res.json(notify);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
