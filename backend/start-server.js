// Simple server test
console.log('Starting server...');

try {
  require('./index.js');
} catch (error) {
  console.error('Error starting server:', error);
}
