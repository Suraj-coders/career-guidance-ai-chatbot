import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  messages: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

export const Chat = mongoose.model('Chat', chatSchema);
