import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  interests: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Student = mongoose.model('Student', studentSchema);