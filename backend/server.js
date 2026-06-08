require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Score = require('./models/Score');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// GET leaderboard - top 12 sorted by pct desc, elapsed asc
app.get('/api/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find().sort({ pct: -1, elapsed: 1 }).limit(12);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new score
app.post('/api/leaderboard', async (req, res) => {
  try {
    const entry = await Score.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE all scores
app.delete('/api/leaderboard', async (req, res) => {
  try {
    await Score.deleteMany({});
    res.json({ message: 'Leaderboard cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
