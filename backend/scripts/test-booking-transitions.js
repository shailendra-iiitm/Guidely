// Test script to create and test booking status transitions
require('dotenv').config();
const mongoose = require('mongoose');
const BookingModel = require('../models/booking.model');
const bookingService = require('../services/booking.service');

async function testBookingTransitions() {
  try {
    // Connect to database
    const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/guidely';
    await mongoose.connect(DB_URL);
    console.log('Connected to database');

    // Find or create a test booking
    let testBooking = await BookingModel.findOne({ 
      status: { $in: ['confirmed', 'upcoming', 'in-progress'] }
    }).populate('service', 'name duration');

    if (!testBooking) {
      console.log('No suitable test booking found. Please create a booking first.');
      return;
    }

    console.log('Found test booking:', {
      id: testBooking._id,
      status: testBooking.status,
      dateTime: testBooking.dateAndTime,
      service: testBooking.service?.name,
      duration: testBooking.service?.duration,
      sessionStartedAt: testBooking.sessionStartedAt,
      sessionEndedAt: testBooking.sessionEndedAt
    });

    // If booking is confirmed/upcoming, simulate starting it
    if (['confirmed', 'upcoming'].includes(testBooking.status)) {
      console.log('\n=== Simulating session start ===');
      const updated = await bookingService.updateBookingById(testBooking._id, {
        status: 'in-progress',
        sessionStartedAt: new Date()
      });
      console.log('Session started, new status:', updated.status);
      testBooking = updated;
    }

    // Show current status
    console.log('\n=== Current booking state ===');
    console.log('Status:', testBooking.status);
    console.log('Session started at:', testBooking.sessionStartedAt);
    console.log('Expected duration:', testBooking.service?.duration, 'minutes');

    if (testBooking.sessionStartedAt && testBooking.service?.duration) {
      const expectedEndTime = new Date(testBooking.sessionStartedAt.getTime() + testBooking.service.duration * 60000);
      console.log('Expected end time:', expectedEndTime);
      console.log('Current time:', new Date());
      console.log('Session should be completed:', new Date() > expectedEndTime);
    }

    // Run status updates
    console.log('\n=== Running status updates ===');
    const updateResult = await bookingService.updateBookingStatuses();
    console.log('Update results:', updateResult);

    // Check final state
    const finalBooking = await BookingModel.findById(testBooking._id).populate('service', 'name duration');
    console.log('\n=== Final booking state ===');
    console.log('Status:', finalBooking.status);
    console.log('Session started at:', finalBooking.sessionStartedAt);
    console.log('Session ended at:', finalBooking.sessionEndedAt);

  } catch (error) {
    console.error('Error testing booking transitions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

// Run the test
testBookingTransitions();
