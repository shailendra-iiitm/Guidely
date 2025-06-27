// Debug script to test rating functionality
const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('../models/user.model');
const BookingModel = require('../models/booking.model');

async function debugRatingIssue() {
  try {
    // Connect to database
    const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/guidely';
    await mongoose.connect(DB_URL);
    console.log('Connected to database:', DB_URL);

    console.log('\n=== Debug Rating Issue ===');
    
    // 1. Find a completed booking that can be rated
    console.log('\n1. Looking for completed bookings...');
    const completedBookings = await BookingModel.find({ 
      status: 'completed',
      'rating.score': { $exists: false } // Not yet rated
    })
    .populate('guide', 'name profile')
    .populate('user', 'name')
    .populate('service', 'name')
    .limit(5);
    
    console.log(`Found ${completedBookings.length} completed unrated bookings`);
    
    completedBookings.forEach((booking, index) => {
      console.log(`
${index + 1}. Booking ID: ${booking._id}
   Service: ${booking.service?.name}
   Guide: ${booking.guide?.name}
   User: ${booking.user?.name}
   Current Rating: ${booking.rating?.score || 'Not rated'}
   Guide Profile Rating: ${booking.guide?.profile?.rating?.average || 'No rating'} (${booking.guide?.profile?.rating?.count || 0} reviews)
   ---`);
    });
    
    // 2. Check guide profiles and their rating structure
    console.log('\n2. Checking guide profiles...');
    const guides = await UserModel.find({ role: 'guide' })
      .select('name profile')
      .limit(10);
    
    guides.forEach((guide, index) => {
      console.log(`
${index + 1}. Guide: ${guide.name}
   Profile exists: ${!!guide.profile}
   Rating exists: ${!!guide.profile?.rating}
   Rating data: ${guide.profile?.rating ? JSON.stringify(guide.profile.rating) : 'None'}
   ---`);
    });
    
    // 3. Test manual rating update on first guide
    if (guides.length > 0) {
      console.log('\n3. Testing manual rating update...');
      const testGuide = guides[0];
      console.log(`Testing with guide: ${testGuide.name}`);
      
      // Initialize profile if needed
      if (!testGuide.profile) {
        testGuide.profile = {};
        console.log('Initialized profile object');
      }
      
      // Initialize rating if needed
      if (!testGuide.profile.rating) {
        testGuide.profile.rating = { average: 0, count: 0, total: 0 };
        console.log('Initialized rating object');
      }
      
      // Add a test rating
      const testRating = 4;
      testGuide.profile.rating.total += testRating;
      testGuide.profile.rating.count += 1;
      testGuide.profile.rating.average = testGuide.profile.rating.total / testGuide.profile.rating.count;
      
      console.log(`Before save: ${JSON.stringify(testGuide.profile.rating)}`);
      
      // Mark as modified and save
      testGuide.markModified('profile');
      await testGuide.save();
      
      // Verify the save
      const updatedGuide = await UserModel.findById(testGuide._id).select('name profile');
      console.log(`After save: ${JSON.stringify(updatedGuide.profile?.rating)}`);
    }
    
    // 4. Check recent bookings with ratings
    console.log('\n4. Checking recent rated bookings...');
    const ratedBookings = await BookingModel.find({
      'rating.score': { $exists: true }
    })
    .populate('guide', 'name profile')
    .populate('user', 'name')
    .populate('service', 'name')
    .sort({ 'rating.ratedAt': -1 })
    .limit(5);
    
    console.log(`Found ${ratedBookings.length} rated bookings`);
    
    ratedBookings.forEach((booking, index) => {
      console.log(`
${index + 1}. Booking ID: ${booking._id}
   Service: ${booking.service?.name}
   Guide: ${booking.guide?.name}
   Rating: ${booking.rating?.score}/5
   Comment: ${booking.rating?.comment || 'No comment'}
   Rated At: ${booking.rating?.ratedAt}
   Guide Profile Rating: ${booking.guide?.profile?.rating?.average || 'No rating'} (${booking.guide?.profile?.rating?.count || 0} reviews)
   ---`);
    });

  } catch (error) {
    console.error('Error debugging rating:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

// Run the debug
debugRatingIssue();
