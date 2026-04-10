const express = require('express');
const router = express.Router();
const { login, register, getCurrentProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', protect, getCurrentProfile);

module.exports = router;