const Complaint = require('../models/Complaint');

exports.getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const complaints = await Complaint.find(filter)
      .sort({ date: -1 })
      .populate('student', 'name email');
    
    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (err) {
    console.error('Get all complaints error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('student', 'name');
    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: 'Complaint not found' 
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (err) {
    console.error('Get complaint error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const { category, message, studentId } = req.body;
    
    // Validation
    if (!message || !category) {
      return res.status(400).json({ 
        success: false,
        message: 'Category and message are required' 
      });
    }

    // Use authenticated user's ID or provided studentId (for admin creating on behalf)
    const student = studentId || req.user.id;

    const complaint = new Complaint({
      student,
      studentName: req.body.studentName || 'Unknown Student',
      category: category || 'General',
      message,
      date: new Date()
    });

    await complaint.save();
    
    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: complaint
    });
  } catch (err) {
    console.error('Create complaint error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Resolved'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be "Pending" or "Resolved"' 
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: 'Complaint not found' 
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (err) {
    console.error('Update complaint status error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ 
        success: false,
        message: 'Complaint not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Complaint deleted successfully' 
    });
  } catch (err) {
    console.error('Delete complaint error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};