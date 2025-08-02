const express = require("express");
const router = express.Router();
const attendanceController = require("../Controllers/attendanceController");
const protect = require('../midldlewares/authMiddleware');
const isAdmin = require('../midldlewares/adminMiddleware');



router.post("/add", protect, attendanceController.addAttendance); // All logged-in users can add
router.put("/update/:id", protect, isAdmin, attendanceController.updateAttendance); // Only admins
router.delete("/delete/:id", protect, isAdmin, attendanceController.deleteAttendance); // Only admins
router.get("/view", attendanceController.viewAttendanceByDate); // All users
router.get("/summary", attendanceController.getDailySummary); // All users
router.get("/yearly", attendanceController.getYearlyRecords); // All users


module.exports = router;
