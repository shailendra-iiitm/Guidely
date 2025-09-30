require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./models/user.model');

const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017/guidely';

async function migrateGuideVerification() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all guides that don't have guideVerification field or have incomplete structure
    const guidesToUpdate = await UserModel.find({ 
      role: "guide",
      $or: [
        { guideVerification: { $exists: false } },
        { "guideVerification.status": { $exists: false } }
      ]
    });
    
    console.log(`Found ${guidesToUpdate.length} guides that need verification field initialization`);
    
    for (const guide of guidesToUpdate) {
      console.log(`Updating guide: ${guide.name} (${guide.email})`);
      
      // Initialize guideVerification field with proper structure
      guide.guideVerification = {
        status: "approved", // Set existing guides as approved since they were already verified
        documents: {
          identity: { url: "", publicId: "", uploadedAt: null },
          qualification: { url: "", publicId: "", uploadedAt: null },
          experience: { url: "", publicId: "", uploadedAt: null },
          consolidatedDocument: { url: "", publicId: "", uploadedAt: null }
        },
        submittedAt: new Date(), // Set current date as submitted
        reviewedAt: new Date(),  // Set current date as reviewed
        reviewedBy: null,        // No specific reviewer
        reviewComments: "Legacy guide - auto-approved during migration"
      };
      
      // Save the updated guide
      await guide.save();
    }
    
    console.log(`✅ Migration completed! Updated ${guidesToUpdate.length} guides`);
    
    // Verify the results
    const verificationCheck = await UserModel.find({ 
      role: "guide", 
      verified: true,
      "guideVerification.status": "approved"
    }).lean();
    
    console.log(`✅ Verification: ${verificationCheck.length} approved guides now available`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Migration error:', error);
    mongoose.disconnect();
  }
}

migrateGuideVerification();