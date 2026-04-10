const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/', getAllRooms);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
