const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  pct:        { type: Number, required: true },
  score:      { type: Number, required: true },
  total:      { type: Number, required: true },
  grade:      { type: String, required: true },
  category:   { type: String, required: true },
  difficulty: { type: String, required: true },
  elapsed:    { type: Number, required: true },
  timestamp:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
