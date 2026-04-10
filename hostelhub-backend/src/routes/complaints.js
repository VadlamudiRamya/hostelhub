const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');

// Admin routes
router.use(protect, adminOnly);

router.route('/')
  .get(getAllComplaints)
  .post(createComplaint);

router.route('/:id')
  .get(getComplaintById)
  .delete(deleteComplaint);

router.put('/:id/status', updateComplaintStatus);

module.exports = router;