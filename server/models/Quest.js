import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['adventure', 'hackathon', 'design', 'finance'],
    required: true
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  prizePool: {
    type: Number,
    default: 0
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completed: {
      type: Boolean,
      default: false
    },
    submittedAt: Date
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: function() { return this.featured; }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Validate featured quests have prize pool
questSchema.pre('save', function(next) {
  if (this.featured && this.prizePool <= 0) {
    throw new Error('Featured quests must have a prize pool');
  }
  next();
});

// Update user points when quest is completed
questSchema.post('findOneAndUpdate', async function(doc) {
  if (doc.participants.some(p => p.completed)) {
    const completedParticipants = doc.participants
      .filter(p => p.completed)
      .map(p => p.user);
      
    await mongoose.model('User').updateMany(
      { _id: { $in: completedParticipants } },
      { $inc: { points: doc.reward } }
    );
  }
});

const Quest = mongoose.model('Quest', questSchema);

export default Quest;