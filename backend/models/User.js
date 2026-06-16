const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, trim: true },
  password:    { type: String, required: true },
  avatar:      { type: String, default: '🎮' },
  badges:      { type: [String], default: [] },
  loginStreak: { type: Number, default: 1 },
  lastLogin:   { type: Date, default: Date.now },
  customQuestions: { type: Array, default: [] },
  mastery: {
    html:       { type: Number, default: 0 },
    css:        { type: Number, default: 0 },
    javascript: { type: Number, default: 0 },
    general:    { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
