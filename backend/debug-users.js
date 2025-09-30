require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./models/user.model');

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/guidely';

async function debugUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check all users
    const allUsers = await UserModel.find({}).lean();
    console.log('Total users:', allUsers.length);
    
    // Check guides specifically
    const guidesOnly = await UserModel.find({ role: "guide" }).lean();
    console.log('Users with role "guide":', guidesOnly.length);
    
    // Check verified guides
    const verifiedGuides = await UserModel.find({ role: "guide", verified: true }).lean();
    console.log('Verified guides:', verifiedGuides.length);
    
    // Check guides with approved verification
    const approvedGuides = await UserModel.find({ 
      role: "guide", 
      verified: true,
      "guideVerification.status": "approved"
    }).lean();
    console.log('Approved guides:', approvedGuides.length);
    
    // Show sample guide data if any exist
    if (guidesOnly.length > 0) {
      console.log('\nSample guide data:');
      console.log(JSON.stringify(guidesOnly[0], null, 2));
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

debugUsers();