// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ────────────────────────────────────────────────
// Import routes
// ────────────────────────────────────────────────
const authRoutes          = require('./routes/auth');
const studentRoutes       = require('./routes/students');
const roomRoutes          = require('./routes/rooms');
const complaintRoutes     = require('./routes/complaints');
const noticeRoutes        = require('./routes/notices');
const menuRoutes          = require('./routes/menu');
const feeAttendanceRoutes = require('./routes/feeAttendance');

const app = express();
const path = require('path');

// ────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',      // Frontend served from same backend
    'http://localhost:5173',      // Vite default
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173',
    // Add your production frontend domain later
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (HTML, CSS, JS from parent directory)
app.use(express.static(path.join(__dirname, '../../')));

// Request logger (very helpful during development)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// ────────────────────────────────────────────────
// MongoDB connection (2024–2025 style – no deprecated options)
// ────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Modern safe defaults (optional but recommended)
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      family: 4,                      // Force IPv4 (helps on some Windows + Wi-Fi setups)
      // retryWrites: true,           // already default in SRV strings
    });

    console.log(`MongoDB connected → ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error(err.message);
    // In production you might want retry logic here instead of exit
    process.exit(1);
  }
};

connectDB();

// ────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────

// Health check / root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "HostelHub Backend API",
    status: "running",
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API version prefix
app.use('/api/auth',      authRoutes);
app.use('/api/students',  studentRoutes);
app.use('/api/rooms',     roomRoutes);
app.use('/api/complaints',complaintRoutes);
app.use('/api/notices',   noticeRoutes);
app.use('/api/menu',      menuRoutes);
app.use('/api/fee-attendance', feeAttendanceRoutes);

// Serve index.html for frontend routing (SPA) - must use middleware, not get()
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:');
  console.error(err.stack || err);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ────────────────────────────────────────────────
// Start server
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('───────────────────────────────────────────────');
  console.log(`  HostelHub Backend`);
  console.log(`  Listening on:  http://localhost:${PORT}`);
  console.log(`  Environment:   ${process.env.NODE_ENV || 'development'}`);
  console.log(`  MongoDB URI:   ${process.env.MONGO_URI?.replace(/\/\/.*@/, '//<credentials>@') || 'not set'}`);
  console.log('───────────────────────────────────────────────');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received → shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received → exiting');
  process.exit(0);
});