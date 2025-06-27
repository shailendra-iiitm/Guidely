// Simple rating test simulation
const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('../models/user.model');
const BookingModel = require('../models/booking.model');

async function testRatingUpdate() {
  try {
    // Connect to database
    const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/guidely';
    await mongoose.connect(DB_URL);
    console.log('Connected to database');

    // Find a completed booking
    const booking = await BookingModel.findOne({ 
      status: 'completed' 
    }).populate('guide').populate('user');
    
    if (!booking) {
      console.log('No completed bookings found');
      return;
    }
    
    console.log('\n=== Testing Rating Update ===');
    console.log('Booking ID:', booking._id);
    console.log('Guide:', booking.guide?.name);
    console.log('User:', booking.user?.name);
    
    // Simulate the rating process
    const testRating = 5;
    
    // Update booking rating (like the API does)
    booking.rating = {
      score: testRating,
      comment: "Test rating",
      ratedAt: new Date()
    };
    await booking.save();
    console.log('✅ Booking rating saved');
    
    // Update guide profile (like the API should do)
    if (booking.guide && booking.guide._id) {
      const guide = await UserModel.findById(booking.guide._id);
      
      if (guide) {
        console.log('Guide before update:', JSON.stringify(guide.profile?.rating || 'none'));
        
        // Initialize if needed
        if (!guide.profile) guide.profile = {};
        if (!guide.profile.rating) guide.profile.rating = { average: 0, count: 0, total: 0 };
        
        // Update
        guide.profile.rating.total += testRating;
        guide.profile.rating.count += 1;
        guide.profile.rating.average = guide.profile.rating.total / guide.profile.rating.count;
        
        console.log('Guide after calculation:', guide.profile.rating);
        
        // Save using findByIdAndUpdate
        const updatedGuide = await UserModel.findByIdAndUpdate(
          guide._id,
          { $set: { 'profile.rating': guide.profile.rating } },
          { new: true }
        );
        
        console.log('✅ Guide rating updated:', updatedGuide.profile?.rating);
        
        // Verify by fetching again
        const verifyGuide = await UserModel.findById(guide._id);
        console.log('✅ Verification:', verifyGuide.profile?.rating);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected');
  }
}

testRatingUpdate();
