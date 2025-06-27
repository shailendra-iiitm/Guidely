// Test booking endpoint
const axios = require('axios');

async function testBooking() {
  try {
    // First, test if the server is running
    console.log('Testing server connection...');
    const serverTest = await axios.get('http://localhost:9000/');
    console.log('Server response:', serverTest.data);

    // Test booking routes test endpoint
    console.log('\nTesting booking test endpoint...');
    const bookingTest = await axios.get('http://localhost:9000/api/v1/booking/test');
    console.log('Booking test response:', bookingTest.data);

    // Test database connection by checking if we can query bookings
    console.log('\nTesting database query...');
    
    // Note: This would require authentication, but let's see what error we get
    try {
      const bookingsResponse = await axios.get('http://localhost:9000/api/v1/booking/');
      console.log('Bookings response:', bookingsResponse.data);
    } catch (authError) {
      console.log('Expected auth error (this is normal):', authError.response?.status, authError.response?.data?.message);
    }

    console.log('\nServer is running correctly!');
  } catch (error) {
    console.error('Error testing server:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

// Test booking model directly
async function testBookingModel() {
  try {
    console.log('\n=== Testing Booking Model ===');
    
    // Connect to MongoDB
    const mongoose = require('mongoose');
    const config = require('./config');
    
    await mongoose.connect(config.mongo.url);
    console.log('Connected to MongoDB');
    
    const BookingModel = require('./models/booking.model');
    
    // Check existing bookings
    const existingBookings = await BookingModel.find({}).populate('service').populate('user').populate('guide');
    console.log(`Found ${existingBookings.length} existing bookings`);
    
    if (existingBookings.length > 0) {
      console.log('Sample booking:');
      const sample = existingBookings[0];
      console.log({
        id: sample._id,
        status: sample.status,
        service: sample.service?.name || 'No service',
        user: sample.user?.name || 'No user',
        guide: sample.guide?.name || 'No guide',
        dateTime: sample.dateAndTime,
        price: sample.price
      });
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error testing booking model:', error);
  }
}

// Run both tests
async function runAllTests() {
  await testBooking();
  await testBookingModel();
}

runAllTests();
