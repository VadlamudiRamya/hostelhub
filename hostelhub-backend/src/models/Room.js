const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true, unique: true },
  type: { type: String, enum: ['AC', 'Non-AC'], required: true },
  capacity: { type: Number, required: true, min: 1 },
  occupied: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);