import express from 'express';
import Leaderboard from '../models/Leaderboard.js';
import auth from '../middleware/auth.js';
import Guild from '../models/Guild.js';

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get leaderboard with quest stats
router.get('/', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate('user', 'username avatar')
      .populate('guild', 'name')
      .sort({ score: -1 })
      .limit(100);
      
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaderboard/me
// @desc    Get current user's leaderboard position with quest stats
router.get('/me', auth, async (req, res) => {
  try {
    const entry = await Leaderboard.findOne({ user: req.user.id })
      .populate('user', 'username avatar')
      .populate('guild', 'name');
      
    if (!entry) {
      return res.status(404).json({ message: 'Not ranked yet' });
    }
    
    // Get rank position
    const rank = await Leaderboard.countDocuments({ score: { $gt: entry.score } }) + 1;
    
    res.json({ 
      ...entry.toObject(), 
      rank,
      questStats: {
        completed: entry.questsCompleted,
        authored: entry.authoredQuests
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
