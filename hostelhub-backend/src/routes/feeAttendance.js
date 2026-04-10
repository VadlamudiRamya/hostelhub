const express = require('express');
const router = express.Router();
const {
  getAttendance,
  getFeeStatus,
  updateFeeStatus,
  updateAttendance,
  getFeeReport,
  getAttendanceReport
} = require('../controllers/feeAttendanceController');

const { protect, adminOnly } = require('../middleware/auth');

// Student can get their own attendance (requires auth)
router.get('/attendance/:studentId', protect, getAttendance);
router.get('/fees/:studentId', protect, getFeeStatus);

// Admin routes
router.use(protect, adminOnly);

router.put('/attendance/:studentId', updateAttendance);
router.put('/fees/:studentId', updateFeeStatus);
router.get('/report/fees', getFeeReport);
router.get('/report/attendance', getAttendanceReport);

module.exports = router;
