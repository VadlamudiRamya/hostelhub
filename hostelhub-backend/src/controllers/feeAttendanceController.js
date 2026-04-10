const Student = require('../models/Student');

// Get attendance for a specific student
exports.getAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }
    
    res.json({
      success: true,
      attendance: student.attendance,
      studentName: student.name,
      studentId: student._id
    });
  } catch (err) {
    console.error('Get attendance error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Get fee status for a specific student
exports.getFeeStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }
    
    res.json({
      success: true,
      feesStatus: student.feesStatus,
      studentName: student.name,
      studentId: student._id,
      feeAmount: student.feesStatus === 'Pending' ? 8500 : 0
    });
  } catch (err) {
    console.error('Get fee status error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Update fee status
exports.updateFeeStatus = async (req, res) => {
  try {
    const { feesStatus } = req.body;
    
    if (!['Paid', 'Pending'].includes(feesStatus)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid fee status. Must be "Paid" or "Pending"' 
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      { feesStatus },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    res.json({
      success: true,
      message: 'Fee status updated successfully',
      student
    });
  } catch (err) {
    console.error('Update fee status error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    
    if (attendance === undefined || attendance === null) {
      return res.status(400).json({ 
        success: false,
        message: 'Attendance value is required' 
      });
    }

    if (attendance < 0 || attendance > 100) {
      return res.status(400).json({ 
        success: false,
        message: 'Attendance must be between 0 and 100' 
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      { attendance },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      student
    });
  } catch (err) {
    console.error('Update attendance error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Get fee standing for all students (admin only)
exports.getFeeReport = async (req, res) => {
  try {
    const students = await Student.find().select('name email feesStatus');
    
    const report = {
      total: students.length,
      paid: students.filter(s => s.feesStatus === 'Paid').length,
      pending: students.filter(s => s.feesStatus === 'Pending').length,
      totalDue: students.filter(s => s.feesStatus === 'Pending').length * 8500,
      students
    };

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Get fee report error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Get attendance report for all students (admin only)
exports.getAttendanceReport = async (req, res) => {
  try {
    const students = await Student.find().select('name email attendance');
    
    const report = {
      total: students.length,
      average: students.length > 0 
        ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(2)
        : 0,
      students
    };

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Get attendance report error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};
