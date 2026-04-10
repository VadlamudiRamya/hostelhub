const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  course: String,
  roomNo: String,
  feesStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  },
  attendance: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);