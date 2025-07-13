const express = require("express");
const router = express.Router();
const attendanceController = require("../Controllers/attendanceController");

router.post("/add", attendanceController.addAttendance);
router.get("/view", attendanceController.viewAttendanceByDate);
router.get("/summary", attendanceController.getDailySummary);
router.put("/update/:id", attendanceController.updateAttendance);
router.delete("/delete/:id", attendanceController.deleteAttendance);
router.get("/leaves/all", attendanceController.getAllLeaves); 
router.get("/yearly", attendanceController.getYearlyRecords);

module.exports = router;
