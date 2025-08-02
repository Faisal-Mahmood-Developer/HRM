const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true
  },
  name: {
    type: String,      // <-- Add this field
    required: true
  },
  type: {
    type: String,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
