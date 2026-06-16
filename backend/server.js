require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Score = require('./models/Score');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ── AUTH MIDDLEWARE ──────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── AUTH ROUTES ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, avatar } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const existing = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (existing) return res.status(409).json({ error: 'Username already taken' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, avatar: avatar || '🎮' });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { username: user.username, avatar: user.avatar, badges: user.badges, loginStreak: user.loginStreak, mastery: user.mastery } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    // Update login streak
    const now = new Date();
    const last = new Date(user.lastLogin);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) user.loginStreak += 1;
    else if (diffDays > 1) user.loginStreak = 1;
    user.lastLogin = now;
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username: user.username, avatar: user.avatar, badges: user.badges, loginStreak: user.loginStreak, mastery: user.mastery, customQuestions: user.customQuestions } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── USER PROFILE ─────────────────────────────────────────────
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BADGES ───────────────────────────────────────────────────
app.post('/api/user/badges', authMiddleware, async (req, res) => {
  try {
    const { badge } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.badges.includes(badge)) {
      user.badges.push(badge);
      await user.save();
    }
    res.json({ badges: user.badges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── MASTERY ──────────────────────────────────────────────────
app.post('/api/user/mastery', authMiddleware, async (req, res) => {
  try {
    const { category, pct } = req.body;
    const user = await User.findById(req.user.id);
    const key = category.toLowerCase().replace(' markup','').replace(' styling','').replace(' engines','').replace(' web core','general').trim();
    const catMap = { 'html': 'html', 'css': 'css', 'javascript': 'javascript', 'general': 'general' };
    const field = catMap[key] || 'general';
    user.mastery[field] = Math.round((user.mastery[field] + pct) / 2);
    await user.save();
    res.json({ mastery: user.mastery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CUSTOM QUESTIONS ─────────────────────────────────────────
app.get('/api/user/questions', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.customQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/questions', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const q = { ...req.body, id: `custom_${Date.now()}`, isCustom: true };
    user.customQuestions.push(q);
    await user.save();
    res.status(201).json(user.customQuestions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/user/questions/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.customQuestions = user.customQuestions.filter(q => q.id !== req.params.id);
    await user.save();
    res.json(user.customQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LEADERBOARD ──────────────────────────────────────────────
app.get('/api/leaderboard', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    const scores = await Score.find(filter).sort({ pct: -1, elapsed: 1 }).limit(12);
    const avgResult = await Score.aggregate([{ $match: filter }, { $group: { _id: null, avg: { $avg: '$pct' } } }]);
    const avg = avgResult.length ? Math.round(avgResult[0].avg) : 0;
    res.json({ scores, avg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const entry = await Score.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/leaderboard', async (req, res) => {
  try {
    await Score.deleteMany({});
    res.json({ message: 'Leaderboard cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DASHBOARD & HISTORY ──────────────────────────────────────
app.get('/api/dashboard/:name', async (req, res) => {
  try {
    const name = new RegExp(`^${req.params.name}$`, 'i');
    const records = await Score.find({ name });
    if (!records.length) return res.json(null);
    const best = Math.max(...records.map(r => r.pct));
    const avg = Math.round(records.reduce((s, r) => s + r.pct, 0) / records.length);
    const catCount = records.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
    const favCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0][0];
    res.json({ total: records.length, best, avg, favCat, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history/:name', async (req, res) => {
  try {
    const records = await Score.find({ name: new RegExp(`^${req.params.name}$`, 'i') }).sort({ timestamp: -1 }).limit(5);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
