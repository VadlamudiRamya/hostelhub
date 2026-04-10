const Menu = require('../models/Menu');

exports.getAllMenuItems = async (req, res) => {
  try {
    const menu = await Menu.find().sort({ day: 1 });
    res.json({
      success: true,
      count: menu.length,
      data: menu
    });
  } catch (err) {
    console.error('Get all menu items error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { day, breakfast, lunch, snacks, dinner } = req.body;

    // Validation
    if (!day) {
      return res.status(400).json({ 
        success: false,
        message: 'Day is required' 
      });
    }

    const validDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid day. Must be a valid weekday' 
      });
    }

    const menu = await Menu.findOneAndUpdate(
      { day },
      { breakfast, lunch, snacks, dinner, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Menu for ${day} updated successfully`,
      data: menu
    });
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.getTodayMenu = async (req, res) => {
  try {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const today = days[new Date().getDay()];
    const item = await Menu.findOne({ day: today });
    
    res.json({
      success: true,
      day: today,
      data: item || { message: 'No menu set for today' }
    });
  } catch (err) {
    console.error('Get today menu error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};