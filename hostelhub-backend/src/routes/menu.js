const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllMenuItems,
  updateMenuItem,
  getTodayMenu
} = require('../controllers/menuController');

// Public route for students
router.get('/today', getTodayMenu);

// Admin routes
router.use(protect, adminOnly);

router.route('/')
  .get(getAllMenuItems);

router.put('/', updateMenuItem);   // upsert by day

module.exports = router;