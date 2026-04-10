const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: String,           // denormalized for faster display
  category: String,
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);