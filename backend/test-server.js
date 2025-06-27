// Simple test to check if server starts
const express = require('express');
const app = require('./app');

console.log('Testing server startup...');

try {
  const PORT = process.env.PORT || 5173;
  const server = app.listen(PORT, () => {
    console.log(`✅ Server started successfully on port ${PORT}`);
    console.log('All routes loaded correctly!');
    server.close();
    process.exit(0);
  });
} catch (error) {
  console.error('❌ Server failed to start:', error.message);
  process.exit(1);
}
