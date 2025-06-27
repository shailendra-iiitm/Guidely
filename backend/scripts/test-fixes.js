// Test script to verify in-progress and rating fixes
const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('../models/user.model');
const BookingModel = require('../models/booking.model');
const guideService = require('../services/guide.service');

async function testInProgressAndRatingFixes() {
  try {
    // Connect to database
    const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/guidely';
    await mongoose.connect(DB_URL);
    console.log('Connected to database:', DB_URL);

    console.log('\n=== Testing In-Progress and Rating Fixes ===');
    
    // Test 1: Check bookings status and categorization
    console.log('\n1. Testing Booking Status Categorization:');
    const allBookings = await BookingModel.find({})
      .populate('service', 'name duration')
      .populate('user', 'name')
      .populate('guide', 'name')
      .sort({ dateAndTime: -1 })
      .limit(10);
    
    allBookings.forEach(booking => {
      console.log(`
Booking: ${booking.service?.name}
Status: ${booking.status}
Date: ${booking.dateAndTime.toLocaleString()}
Started: ${booking.sessionStartedAt ? booking.sessionStartedAt.toLocaleString() : 'Not started'}
Ended: ${booking.sessionEndedAt ? booking.sessionEndedAt.toLocaleString() : 'Not ended'}
Rating: ${booking.rating?.score ? `${booking.rating.score}/5` : 'Not rated'}
---`);
    });
    
    // Test 2: Check guide ratings in profiles
    console.log('\n2. Testing Guide Rating Display:');
    const guides = await UserModel.find({ role: 'guide' })
      .select('name profile.rating')
      .limit(5);
    
    console.log('\nGuide ratings in user profiles:');
    guides.forEach(guide => {
      const rating = guide.profile?.rating;
      console.log(`
Guide: ${guide.name}
Profile Rating: ${rating ? `${rating.average.toFixed(2)} (${rating.count} reviews, total: ${rating.total})` : 'No ratings'}
---`);
    });
    
    // Test 3: Check guide service response with ratings
    console.log('\n3. Testing Guide Service Response:');
    for (const guide of guides.slice(0, 3)) {
      const enrichedGuide = await guideService.getGuideById(guide._id);
      console.log(`
Guide: ${enrichedGuide.name}
Average Rating: ${enrichedGuide.averageRating || 'No rating'}
Rating Count: ${enrichedGuide.ratingCount || 0}
Total Sessions: ${enrichedGuide.totalSessions}
---`);
    }
    
    // Test 4: Check completed bookings vs in-progress
    console.log('\n4. Testing Status Distribution:');
    const statusCounts = await BookingModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\nBooking status distribution:');
    statusCounts.forEach(status => {
      console.log(`${status._id}: ${status.count} bookings`);
    });
    
    // Test 5: Check specific in-progress vs completed logic
    console.log('\n5. Testing In-Progress vs Completed Logic:');
    const now = new Date();
    const inProgressBookings = await BookingModel.find({ 
      status: 'in-progress' 
    }).populate('service', 'duration');
    
    console.log(`\nFound ${inProgressBookings.length} in-progress bookings:`);
    inProgressBookings.forEach(booking => {
      const sessionDuration = booking.service?.duration || 60;
      const startTime = booking.sessionStartedAt;
      const expectedEndTime = startTime ? new Date(startTime.getTime() + sessionDuration * 60000) : null;
      const shouldBeCompleted = expectedEndTime && now > expectedEndTime;
      
      console.log(`
Booking ID: ${booking._id}
Started: ${startTime ? startTime.toLocaleString() : 'Not started'}
Duration: ${sessionDuration} minutes
Expected End: ${expectedEndTime ? expectedEndTime.toLocaleString() : 'N/A'}
Should be completed: ${shouldBeCompleted ? 'YES' : 'NO'}
---`);
    });

  } catch (error) {
    console.error('Error testing fixes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

// Run the test
testInProgressAndRatingFixes();
