// Test script to check booking status updates
const mongoose = require('mongoose');
require('dotenv').config();
const bookingService = require('../services/booking.service');

async function testStatusUpdates() {
  try {
    // Connect to database
    const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/guidely';
    await mongoose.connect(DB_URL);
    console.log('Connected to database:', DB_URL);

    // Run the status update function
    console.log('\n=== Running booking status updates ===');
    const result = await bookingService.updateBookingStatuses();
    
    console.log('\nStatus update results:', result);
    
    // Get some sample bookings to check statuses
    console.log('\n=== Sample bookings after update ===');
    const BookingModel = require('../models/booking.model');
    const sampleBookings = await BookingModel.find({})
      .populate('service', 'name duration')
      .populate('user', 'name')
      .populate('guide', 'name')
      .sort({ dateAndTime: -1 })
      .limit(10);
    
    sampleBookings.forEach(booking => {
      console.log(`
Booking ID: ${booking._id}
Status: ${booking.status}
Date/Time: ${booking.dateAndTime}
Service: ${booking.service?.name} (${booking.service?.duration} min)
User: ${booking.user?.name}
Guide: ${booking.guide?.name}
Session Started: ${booking.sessionStartedAt || 'Not started'}
Session Ended: ${booking.sessionEndedAt || 'Not ended'}
---`);
    });

  } catch (error) {
    console.error('Error testing status updates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

// Run the test
testStatusUpdates();
