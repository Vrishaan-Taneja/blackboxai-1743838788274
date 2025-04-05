import express from 'express';
import Guild from '../models/Guild.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/guilds
// @desc    Create a new guild
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const leader = req.user.id;

    // Check if user is already in a guild
    const user = await User.findById(leader);
    if (user.guild) {
      return res.status(400).json({ message: 'You are already in a guild' });
    }

    // Create guild with leader as first member
    const guild = new Guild({
      name,
      description,
      leader,
      members: [leader]
    });

    await guild.save();

    res.status(201).json(guild);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/guilds
// @desc    Get all guilds
router.get('/', async (req, res) => {
  try {
    const guilds = await Guild.find()
      .populate('leader', 'username')
      .populate('members', 'username');
    res.json(guilds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/guilds/:id/join
// @desc    Join a guild
router.post('/:id/join', auth, async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    // Check if user is already in a guild
    const user = await User.findById(req.user.id);
    if (user.guild) {
      return res.status(400).json({ message: 'You are already in a guild' });
    }

    // Add user to guild members
    if (!guild.members.includes(req.user.id)) {
      guild.members.push(req.user.id);
      await guild.save();
    }

    // Update user's guild reference
    user.guild = guild._id;
    await user.save();

    res.json(guild);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/guilds/:id/leave
// @desc    Leave a guild
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    // Remove user from guild members
    guild.members = guild.members.filter(
      memberId => memberId.toString() !== req.user.id
    );

    // Handle guild leader leaving
    if (guild.leader.toString() === req.user.id) {
      if (guild.members.length > 0) {
        // Assign new leader
        guild.leader = guild.members[0];
      } else {
        // Delete guild if no members left
        await guild.remove();
        return res.json({ message: 'Guild disbanded' });
      }
    }

    await guild.save();

    // Update user's guild reference
    await User.findByIdAndUpdate(req.user.id, { $unset: { guild: 1 } });

    res.json(guild);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/guilds/:id/roles
// @desc    Assign or update a role
router.post('/:id/roles', auth, async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    // Only leader can assign roles
    if (guild.leader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the guild leader can assign roles' });
    }

    const { userId, role } = req.body;

    // Check if user is in guild
    if (!guild.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this guild' });
    }

    // Update or add role
    const existingRoleIndex = guild.roles.findIndex(r => r.userId.toString() === userId);
    if (existingRoleIndex >= 0) {
      guild.roles[existingRoleIndex].role = role;
    } else {
      guild.roles.push({ userId, role });
    }

    await guild.save();
    res.json(guild);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/guilds/:id/roles/:userId
// @desc    Remove a role assignment
router.delete('/:id/roles/:userId', auth, async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ message: 'Guild not found' });
    }

    // Only leader can remove roles
    if (guild.leader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the guild leader can remove roles' });
    }

    guild.roles = guild.roles.filter(r => r.userId.toString() !== req.params.userId);
    await guild.save();
    res.json(guild);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
