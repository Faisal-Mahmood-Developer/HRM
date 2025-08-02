// 📁 controllers/attendanceController.js
const Attendance = require("../models/Attendance");

// Utility function to normalize dates
const normalizeDate = (date) => {
  return new Date(date).toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

exports.addAttendance = async (req, res) => {
  const { empId, name, date, status } = req.body;

  try {
    const normalizedDate = normalizeDate(date);
        // ⛔ Prevent admin from adding their own attendance
    if (req.user && req.user.isAdmin && req.user.empId === empId) {
      return res.status(403).json({ msg: "Admins cannot add their own attendance" });
    }

    // Check if attendance already exists for the empId on the normalized date
    const exists = await Attendance.findOne({ empId, date: normalizedDate });
    if (exists) {
      return res.status(400).json({ msg: "Attendance already exists for this employee and date" });
    }

    const attendance = new Attendance({
      empId,
      name,
      date: normalizedDate,
      status,
    });

    await attendance.save();
    res.json({ msg: "Attendance added successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.viewAttendanceByDate = async (req, res) => {
  const { date } = req.query; // format: YYYY-MM-DD
  try {
    const normalizedDate = normalizeDate(date);
    const records = await Attendance.find({ date: normalizedDate });
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getDailySummary = async (req, res) => {
  const { date } = req.query;

  try {
    const normalizedDate = normalizeDate(date);
    const records = await Attendance.find({ date: normalizedDate });

    const summary = {
      total: records.length,
      present: records.filter(r => ['Online', 'Present'].includes(r.status)).length,
      offline: records.filter(r => r.status === 'Offline').length,
      wfh: records.filter(r => r.status === 'Work from Home').length
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    if (req.body.date) {
      req.body.date = normalizeDate(req.body.date);
    }

    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Updated successfully", record });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📌 GET Work from Home records only (Leave removed)
exports.getYearlyRecords = async (req, res) => {
  const { empId } = req.query;

  if (!empId) {
    return res.status(400).json({ msg: "empId is required" });
  }

  try {
    const currentYear = new Date().getFullYear();
    const start = `${currentYear}-01-01`;
    const end = `${currentYear}-12-31`;

    const records = await Attendance.find({
      empId,
      date: { $gte: start, $lte: end },
      status: "Work from Home"
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
