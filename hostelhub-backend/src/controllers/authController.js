const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password and role'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: (role === 'admin') ? 'admin' : 'student'
    });

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    console.log('✓ User registered:', user.email);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('\n🔐 LOGIN REQUEST');
    console.log('Email:', req.body.email);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    console.log('🔍 Finding user:', email.toLowerCase());
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✓ User found');

    // Check password
    console.log('🔐 Comparing passwords...');
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✓ Password correct');

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    console.log('✓✓✓ LOGIN SUCCESS:', user.email, '\n');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log('\n❌ LOGIN ERROR:', err.message, '\n');
    res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};

// Get current user profile
exports.getCurrentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Profile error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};
