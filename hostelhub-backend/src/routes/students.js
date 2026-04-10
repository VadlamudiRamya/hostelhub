const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateAttendance,
  updateFeeStatus
} = require('../controllers/studentController');

const { protect, adminOnly } = require('../middleware/auth');

// All routes protected + admin only (except possibly get own profile later)
router.use(protect, adminOnly);

router.route('/')
  .get(getAllStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.put('/:id/attendance', updateAttendance);
router.put('/:id/fees', updateFeeStatus);

module.exports = router;