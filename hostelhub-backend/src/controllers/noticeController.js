const Notice = require('../models/Notice');

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (err) {
    console.error('Get all notices error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, priority, message } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and message are required' 
      });
    }

    const validPriorities = ['normal', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid priority level' 
      });
    }

    const notice = new Notice({
      title,
      priority: priority || 'normal',
      message,
      date: new Date()
    });

    await notice.save();
    
    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice
    });
  } catch (err) {
    console.error('Create notice error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({ 
        success: false,
        message: 'Notice not found' 
      });
    }

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: notice
    });
  } catch (err) {
    console.error('Update notice error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ 
        success: false,
        message: 'Notice not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Notice deleted successfully' 
    });
  } catch (err) {
    console.error('Delete notice error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};