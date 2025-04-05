import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientType: {
    type: String,
    enum: ['GUILD', 'GROUP', 'USER'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const ChatMessage = mongoose.model('ChatMessage', chatSchema);

export default ChatMessage;