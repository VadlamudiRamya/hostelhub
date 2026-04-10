const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

router.use(protect, adminOnly);

router.route('/')
  .get(getAllNotices)
  .post(createNotice);

router.route('/:id')
  .put(updateNotice)
  .delete(deleteNotice);

module.exports = router;