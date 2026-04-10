console.log('Testing route imports...');
let failed = false;

try {
  const authRoutes = require('./src/routes/auth');
  console.log('✓ authRoutes imported:', typeof authRoutes);
} catch (e) { console.error('✗ authRoutes:', e.message); failed = true; }

try {
  const studentRoutes = require('./src/routes/students');
  console.log('✓ studentRoutes imported:', typeof studentRoutes);
} catch (e) {console.error('✗ studentRoutes:', e.message); failed = true; }

try {
  const roomRoutes = require('./src/routes/rooms');
  console.log('✓ roomRoutes imported:', typeof roomRoutes);
} catch (e) { console.error('✗ roomRoutes:', e.message); failed = true; }

try {
  const complaintRoutes = require('./src/routes/complaints');
  console.log('✓ complaintRoutes imported:', typeof complaintRoutes);
} catch (e) { console.error('✗ complaintRoutes:', e.message); failed = true; }

try {
  const noticeRoutes = require('./src/routes/notices');
  console.log('✓ noticeRoutes imported:', typeof noticeRoutes);
} catch (e) { console.error('✗ noticeRoutes:', e.message); failed = true; }

try {
  const menuRoutes = require('./src/routes/menu');
  console.log('✓ menuRoutes imported:', typeof menuRoutes);
} catch (e) { console.error('✗ menuRoutes:', e.message); failed = true; }

try {
  const feeAttendanceRoutes = require('./src/routes/feeAttendance');
  console.log('✓ feeAttendanceRoutes imported:', typeof feeAttendanceRoutes);
} catch (e) { console.error('✗ feeAttendanceRoutes:', e.message); failed = true; }

if (!failed) console.log('\n✓ All routes imported successfully!');
else process.exit(1);
