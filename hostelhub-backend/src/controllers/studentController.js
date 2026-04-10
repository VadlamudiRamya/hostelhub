const Student = require('../models/Student');
const Room = require('../models/Room');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    console.error('Get all students error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid student ID format' 
      });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, course, roomNo, feesStatus, attendance } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Name and email are required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }

    // Optional: check if room exists and has capacity
    if (roomNo) {
      const room = await Room.findOne({ roomNo });
      if (!room) {
        return res.status(400).json({ 
          success: false,
          message: 'Room does not exist' 
        });
      }
      if (room.occupied >= room.capacity) {
        return res.status(400).json({ 
          success: false,
          message: 'Room is already full' 
        });
      }
    }

    const student = new Student({
      name,
      email,
      phone,
      course,
      roomNo,
      feesStatus: feesStatus || 'Pending',
      attendance: attendance || 100
    });

    await student.save();

    // Optional: increment room occupied count
    if (roomNo) {
      await Room.findOneAndUpdate({ roomNo }, { $inc: { occupied: 1 } });
    }

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    console.error('Create student error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const { name, email, phone, course, roomNo, feesStatus, attendance } = req.body;

    // Handle room change (decrease old, increase new if changed)
    if (roomNo && roomNo !== student.roomNo) {
      if (student.roomNo) {
        await Room.findOneAndUpdate({ roomNo: student.roomNo }, { $inc: { occupied: -1 } });
      }
      const newRoom = await Room.findOne({ roomNo });
      if (!newRoom) return res.status(400).json({ message: 'New room does not exist' });
      if (newRoom.occupied >= newRoom.capacity) {
        return res.status(400).json({ message: 'New room is full' });
      }
      await Room.findOneAndUpdate({ roomNo }, { $inc: { occupied: 1 } });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.course = course || student.course;
    student.roomNo = roomNo !== undefined ? roomNo : student.roomNo;
    student.feesStatus = feesStatus || student.feesStatus;
    student.attendance = attendance !== undefined ? attendance : student.attendance;

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.roomNo) {
      await Room.findOneAndUpdate({ roomNo: student.roomNo }, { $inc: { occupied: -1 } });
    }

    await student.deleteOne();
    res.json({ message: 'Student removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    if (attendance < 0 || attendance > 100) {
      return res.status(400).json({ message: 'Attendance must be between 0 and 100' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { attendance },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { feesStatus: req.body.feesStatus },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};