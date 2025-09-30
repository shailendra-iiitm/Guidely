require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./models/user.model');

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/guidely';

async function checkApprovedGuides() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check guides with different verification statuses
    const allGuides = await UserModel.find({ role: "guide" }).lean();
    console.log('=== All Guides Analysis ===');
    console.log('Total guides:', allGuides.length);
    
    // Analyze verification statuses
    const statusCounts = {};
    allGuides.forEach(guide => {
      const status = guide.guideVerification?.status || 'no-verification-field';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\nVerification Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    // Show sample approved guides if any
    const approvedGuides = allGuides.filter(guide => guide.guideVerification?.status === 'approved');
    console.log('\nApproved guides:', approvedGuides.length);
    
    if (approvedGuides.length > 0) {
      console.log('\nSample approved guide:');
      console.log({
        name: approvedGuides[0].name,
        verified: approvedGuides[0].verified,
        guideVerification: approvedGuides[0].guideVerification
      });
    }
    
    // Check what guides would be returned by current query
    const currentQueryResults = await UserModel.find({ 
      role: "guide", 
      verified: true,
      "guideVerification.status": "approved"
    }).lean();
    console.log('\nCurrent query results:', currentQueryResults.length);
    
    // Check what guides would be returned by relaxed query
    const relaxedQueryResults = await UserModel.find({ 
      role: "guide", 
      verified: true
    }).lean();
    console.log('Relaxed query results (just verified):', relaxedQueryResults.length);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

checkApprovedGuides();