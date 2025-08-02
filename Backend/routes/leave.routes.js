const express = require('express');
const router = express.Router();
const leaveController = require('../Controllers/leave.controller');
const protect = require('../midldlewares/authMiddleware');
const adminOnly = require('../midldlewares/adminMiddleware');

// Employee submit leave
router.post('/request', protect, leaveController.submitLeaveRequest);
router.get('/my',protect, leaveController.getMyLeaveRequests);

// Admin view all leave requests
router.get('/all', protect, adminOnly, leaveController.getAllLeaveRequests);

// Admin update leave status (approve/reject)
router.put('/status/:id', protect, adminOnly, leaveController.updateLeaveStatus);
router.get("/approved-leaves-details", leaveController.getApprovedLeavesCount);

router.delete("/del/:id", leaveController.deleteLeave);  

module.exports = router;
