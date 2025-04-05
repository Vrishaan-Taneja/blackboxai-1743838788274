import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/chat
// @desc    Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { content, recipientType, recipientId } = req.body;
    
    const message = new ChatMessage({
      content,
      recipientType,
      recipientId,
      sender: req.user.id
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/:type/:id
// @desc    Get messages for a recipient
router.get('/:type/:id', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      recipientType: req.params.type.toUpperCase(),
      recipientId: req.params.id
    }).sort({ timestamp: 1 }).populate('sender', 'username');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;