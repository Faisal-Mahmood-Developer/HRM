const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: {
    type: String,
    enum: ["Present", "Leave", "Work from Home"],
    default: "Present"
  }
});

// ✅ Enforce uniqueness on empId + date
attendanceSchema.index({ empId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
