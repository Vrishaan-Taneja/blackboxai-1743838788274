import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  roles: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['LEADER', 'ADMIN', 'MEMBER'], default: 'MEMBER' }
  }],
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Validate minimum members (10)
guildSchema.pre('save', function(next) {
  if (this.members.length < 10) {
    throw new Error('A guild must have at least 10 members');
  }
  next();
});

// Update user's guild reference when added to members
guildSchema.post('save', async function(doc) {
  await mongoose.model('User').updateMany(
    { _id: { $in: doc.members } },
    { $set: { guild: doc._id } }
  );
});

const Guild = mongoose.model('Guild', guildSchema);

export default Guild;