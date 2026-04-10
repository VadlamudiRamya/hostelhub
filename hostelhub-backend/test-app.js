console.log('Attempting to load app.js...');
try {
  require('./src/app.js');
  console.log('✓ app.js loaded successfully');
} catch (e) {
  console.error('✗ Error loading app.js:');
  console.error('Message:', e.message);
  console.error('Stack:', e.stack);
}
