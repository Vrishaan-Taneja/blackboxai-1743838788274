import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  score: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  questsCompleted: {
    type: Number,
    default: 0
  },
  guild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild'
  },
  authoredQuests: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for sorting
leaderboardSchema.index({ score: -1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;