const mongoose = require("mongoose");
const config = require("./config");
const authService = require("./services/auth.service");

const initializeAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.DB_URL);
    console.log("Connected to MongoDB");

    // Create admin user
    const admin = await authService.createAdminUser();
    
    console.log("✅ Admin user initialized successfully!");
    console.log("📧 Email: admin@guidely.com");
    console.log("🔐 Password: Admin@123");
    console.log("⚠️  Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing admin:", error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initializeAdmin();
}

module.exports = { initializeAdmin };