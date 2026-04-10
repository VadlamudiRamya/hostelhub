const Room = require('../models/Room');
const Student = require('../models/Student');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNo: 1 });
    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (err) {
    console.error('Get all rooms error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomNo, type, capacity } = req.body;

    // Validation
    if (!roomNo || !type || !capacity) {
      return res.status(400).json({ 
        success: false,
        message: 'roomNo, type, and capacity are required' 
      });
    }

    if (!['AC', 'Non-AC'].includes(type)) {
      return res.status(400).json({ 
        success: false,
        message: 'Type must be either "AC" or "Non-AC"' 
      });
    }

    if (capacity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Capacity must be at least 1' 
      });
    }

    const existing = await Room.findOne({ roomNo });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'Room number already exists' 
      });
    }

    const room = new Room({ roomNo, type, capacity, occupied: 0 });
    await room.save();
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (err) {
    console.error('Update room error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }

    // Prevent deletion if occupied
    if (room.occupied > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete occupied room' 
      });
    }

    await room.deleteOne();
    res.json({ 
      success: true,
      message: 'Room deleted successfully' 
    });
  } catch (err) {
    console.error('Delete room error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};