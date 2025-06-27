// Test script to verify rating and achievement functionality
const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('../models/user.model');
const BookingModel = require('../models/booking.model');

async function testRatingAndAchievements() {
  try {
    // Connect to database
    const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/guidely';
    await mongoose.connect(DB_URL);
    console.log('Connected to database:', DB_URL);

    console.log('\n=== Testing Rating and Achievement System ===');
    
    // Find some sample users
    const guides = await UserModel.find({ role: 'guide' }).limit(3);
    const learners = await UserModel.find({ role: 'learner' }).limit(3);
    
    console.log(`\nFound ${guides.length} guides and ${learners.length} learners`);
    
    // Display guide ratings
    console.log('\n=== Guide Ratings ===');
    guides.forEach(guide => {
      const rating = guide.profile?.rating || { average: 0, count: 0 };
      console.log(`Guide: ${guide.name}`);
      console.log(`  Rating: ${rating.average.toFixed(2)} (${rating.count} reviews)`);
      console.log(`  Profile: ${guide.profile?.title || 'No title'}`);
    });
    
    // Display learner achievements
    console.log('\n=== Learner Achievements ===');
    learners.forEach(learner => {
      const achievements = learner.profile?.achievements || [];
      console.log(`Learner: ${learner.name}`);
      console.log(`  Achievements: ${achievements.length}`);
      achievements.forEach((achievement, index) => {
        console.log(`    ${index + 1}. ${achievement.title} - ${achievement.description}`);
        console.log(`       Earned: ${achievement.earnedAt.toLocaleDateString()}`);
      });
    });
    
    // Find some sample completed bookings with ratings
    console.log('\n=== Sample Rated Bookings ===');
    const ratedBookings = await BookingModel.find({
      'rating.score': { $exists: true }
    })
    .populate('user', 'name')
    .populate('guide', 'name')
    .populate('service', 'name')
    .limit(5);
    
    ratedBookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.service?.name}`);
      console.log(`   Learner: ${booking.user?.name}`);
      console.log(`   Guide: ${booking.guide?.name}`);
      console.log(`   Rating: ${booking.rating.score}/5`);
      console.log(`   Comment: ${booking.rating.comment || 'No comment'}`);
      console.log(`   Date: ${booking.dateAndTime.toLocaleDateString()}`);
    });
    
    // Find bookings with achievements
    console.log('\n=== Sample Bookings with Achievements ===');
    const achievementBookings = await BookingModel.find({
      achievements: { $exists: true, $ne: [] }
    })
    .populate('user', 'name')
    .populate('guide', 'name')
    .populate('service', 'name')
    .limit(5);
    
    achievementBookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.service?.name}`);
      console.log(`   Learner: ${booking.user?.name}`);
      console.log(`   Guide: ${booking.guide?.name}`);
      console.log(`   Achievements in booking: ${booking.achievements.length}`);
      booking.achievements.forEach((achievement, idx) => {
        console.log(`     ${idx + 1}. ${achievement.title} - ${achievement.description}`);
      });
    });

  } catch (error) {
    console.error('Error testing rating and achievements:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

// Run the test
testRatingAndAchievements();
