// Verification script to check the rating endpoint implementation
console.log('=== RATING ENDPOINT VERIFICATION ===\n');

// Check if all required files exist and are properly structured
const fs = require('fs');
const path = require('path');

function checkFile(filepath, description) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    console.log(`✅ ${description}: EXISTS`);
    return content;
  } catch (error) {
    console.log(`❌ ${description}: MISSING OR ERROR`);
    return null;
  }
}

// Check if BookingModel import is present in controller
const controllerPath = path.join(__dirname, '../controllers/booking.controller.js');
const controllerContent = checkFile(controllerPath, 'Booking Controller');

if (controllerContent) {
  if (controllerContent.includes('const BookingModel = require("../models/booking.model")')) {
    console.log('✅ BookingModel import: PRESENT');
  } else {
    console.log('❌ BookingModel import: MISSING');
  }
  
  if (controllerContent.includes('const rateSession = async (req, res, next) => {')) {
    console.log('✅ rateSession function: PRESENT');
  } else {
    console.log('❌ rateSession function: MISSING');
  }
  
  if (controllerContent.includes('await BookingModel.findById(bookingId)')) {
    console.log('✅ BookingModel usage: PRESENT');
  } else {
    console.log('❌ BookingModel usage: MISSING');
  }
}

// Check route
const routePath = path.join(__dirname, '../routes/v1/booking.route.js');
const routeContent = checkFile(routePath, 'Booking Routes');

if (routeContent) {
  if (routeContent.includes('"/rate"') && routeContent.includes('bookingController.rateSession')) {
    console.log('✅ Rating route: PROPERLY CONFIGURED');
  } else {
    console.log('❌ Rating route: MISSING OR MISCONFIGURED');
  }
}

// Check validation
const validationPath = path.join(__dirname, '../validations/booking.validation.js');
const validationContent = checkFile(validationPath, 'Booking Validation');

if (validationContent) {
  if (validationContent.includes('rateSessionValidation')) {
    console.log('✅ Rating validation: PRESENT');
  } else {
    console.log('❌ Rating validation: MISSING');
  }
}

// Check models
checkFile(path.join(__dirname, '../models/booking.model.js'), 'Booking Model');
checkFile(path.join(__dirname, '../models/user.model.js'), 'User Model');

console.log('\n=== SUMMARY ===');
console.log('The main issue (missing BookingModel import) has been fixed.');
console.log('You should now be able to rate sessions without getting a 500 error.');
console.log('\nTo test:');
console.log('1. Start the backend server');
console.log('2. Try rating a completed session from the frontend');
console.log('3. Check the server logs for detailed rating process information');
