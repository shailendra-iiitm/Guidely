// Script to create a test user for API testing
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const UserModel = require('../models/user.model');
    
    // Check if test users already exist
    const existingLearner = await UserModel.findOne({ email: 'learner@test.com' });
    const existingGuide = await UserModel.findOne({ email: 'guide@test.com' });
    
    if (existingLearner) {
      console.log('✅ Test learner already exists:', existingLearner.email);
    } else {
      // Create test learner
      const hashedPassword = await bcryptjs.hash('test123', 8);
      const testLearner = new UserModel({
        name: 'Test Learner',
        email: 'learner@test.com',
        password: hashedPassword,
        role: 'learner',
        profile: {
          bio: 'Test learner for API testing',
          skills: ['JavaScript', 'React'],
          totalHours: 10,
          sessionsCompleted: 3
        }
      });
      
      await testLearner.save();
      console.log('✅ Test learner created:', testLearner.email);
    }
    
    if (existingGuide) {
      console.log('✅ Test guide already exists:', existingGuide.email);
    } else {
      // Create test guide
      const hashedPassword = await bcryptjs.hash('test123', 8);
      const testGuide = new UserModel({
        name: 'Test Guide',
        email: 'guide@test.com',
        password: hashedPassword,
        role: 'guide',
        profile: {
          bio: 'Test guide for API testing',
          expertise: ['JavaScript', 'React', 'Node.js'],
          hourlyRate: 100,
          rating: 4.8,
          totalHours: 50,
          sessionsCompleted: 15
        }
      });
      
      await testGuide.save();
      console.log('✅ Test guide created:', testGuide.email);
    }
    
    // List all users to see what's available
    const allUsers = await UserModel.find({}, 'name email role').limit(10);
    console.log('\n📋 Available users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Test user setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
  }
}

createTestUser();
