const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  breakfast: String,
  lunch: String,
  snacks: String,
  dinner: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', menuSchema);