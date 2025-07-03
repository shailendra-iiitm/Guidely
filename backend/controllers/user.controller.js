const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const config = require("../config");
const userService = require("../services/user.service");
const httpStatus = require("../util/httpStatus");
const ApiError = require("../helper/apiError");

// Cloudinary configuration
cloudinary.config(config.cloudinary);

// Upload profile photo
const uploadPhoto = async (req, res) => {
  console.log("=== UPLOAD PHOTO STARTED ===");
  
  try {
    // Step 1: Check if file exists
    console.log("Step 1: Checking file");
    console.log("req.file:", req.file);
    
    if (!req.file) {
      console.log("ERROR: No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }
    
    // Step 2: Check user
    console.log("Step 2: Checking user");
    console.log("req.user:", req.user ? req.user._id : "No user");
    
    if (!req.user) {
      console.log("ERROR: No user in request");
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    
    // Step 3: Test cloudinary config
    console.log("Step 3: Cloudinary config");
    console.log("Cloud name:", config.cloudinary.cloud_name);
    console.log("API key exists:", !!config.cloudinary.api_key);
    console.log("API secret exists:", !!config.cloudinary.api_secret);
    
    // Step 4: Try cloudinary upload
    console.log("Step 4: Uploading to cloudinary");
    console.log("File path:", req.file.path);
    console.log("Current time:", new Date().toISOString());
    
    // Try using upload_stream instead of upload to avoid timestamp issues
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "user_photos",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.log("Cloudinary stream error:", error);
            reject(error);
          } else {
            console.log("Cloudinary stream success:", result.secure_url);
            resolve(result);
          }
        }
      ).end(require('fs').readFileSync(req.file.path));
    });
    
    console.log("Step 5: Cloudinary upload successful");
    console.log("Secure URL:", result.secure_url);
    
    // Step 6: Update user in database
    console.log("Step 6: Updating user in database");
    const updatedUser = await userService.updateUserPhoto(req.user._id, result.secure_url);
    
    if (!updatedUser) {
      console.log("ERROR: Failed to update user in database");
      return res.status(404).json({
        success: false,
        message: "Failed to update user"
      });
    }
    
    console.log("Step 7: Success!");
    console.log("Updated user photo URL:", updatedUser.photoUrl);
    
    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      photoUrl: result.secure_url,
      user: updatedUser,
    });
    
  } catch (error) {
    console.log("=== ERROR OCCURRED ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Upload failed: " + error.message,
      error: process.env.NODE_ENV !== "production" ? error.stack : undefined
    });
  }
};

// Get logged-in user details
const getUser = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userService.getUserById(userId);
  if (!user) {
    return next(new ApiError(httpStatus.notFound, "User not found"));
  }
  res.status(httpStatus.ok).json({ success: true, user });
};

// Update profile
const updateUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  const profileData = req.body;
  const updatedUser = await userService.updateUserProfile(userId, profileData);
  if (!updatedUser) {
    return next(new ApiError(httpStatus.notFound, "User not found"));
  }
  res.status(httpStatus.ok).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

// Get user profile with ratings and achievements
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return next(new ApiError(httpStatus.notFound, "User not found"));
    }
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "Profile retrieved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return next(error);
  }
};

// Get dashboard metrics for current user
const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    console.log("Getting dashboard metrics for user:", userId, "role:", userRole);
    
    const user = await userService.getUserById(userId);
    if (!user) {
      return next(new ApiError(httpStatus.notFound, "User not found"));
    }
    
    let metrics = {};
    
    if (userRole === 'learner') {
      // Get learner metrics from user profile
      metrics = user.learnerMetrics || {
        totalSessions: 0,
        skillsLearned: [],
        currentStreak: 0,
        totalHours: 0,
        lastUpdated: null
      };
      
      // Calculate real-time metrics if needed
      if (!metrics.lastUpdated || Date.now() - new Date(metrics.lastUpdated).getTime() > 24 * 60 * 60 * 1000) {
        const dashboardMetricsService = require('../services/dashboardMetrics.service');
        await dashboardMetricsService.updateLearnerMetrics(userId);
        
        // Refetch updated metrics
        const updatedUser = await userService.getUserById(userId);
        metrics = updatedUser.learnerMetrics;
      }
      
    } else if (userRole === 'guide') {
      // Get guide metrics from user profile
      metrics = user.guideMetrics || {
        totalSessions: 0,
        uniqueLearners: 0,
        skillsTaught: [],
        totalEarnings: 0,
        totalHours: 0,
        lastUpdated: null
      };
      
      // Calculate real-time metrics if needed
      if (!metrics.lastUpdated || Date.now() - new Date(metrics.lastUpdated).getTime() > 24 * 60 * 60 * 1000) {
        const dashboardMetricsService = require('../services/dashboardMetrics.service');
        await dashboardMetricsService.updateGuideMetrics(userId);
        
        // Refetch updated metrics
        const updatedUser = await userService.getUserById(userId);
        metrics = updatedUser.guideMetrics;
      }
    }
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "Dashboard metrics retrieved successfully",
      data: {
        ...metrics,
        skillsCount: userRole === 'learner' ? metrics.skillsLearned?.length || 0 : metrics.skillsTaught?.length || 0
      }
    });
    
  } catch (error) {
    console.error("Error getting dashboard metrics:", error);
    return next(error);
  }
};

// Get all available skills for management
const getAvailableSkills = async (req, res, next) => {
  try {
    const ServiceModel = require('../models/service.model');
    
    // Get all unique skills from all services
    const skillsAgg = await ServiceModel.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills' } },
      { $sort: { _id: 1 } }
    ]);
    
    const skills = skillsAgg.map(item => item._id).filter(skill => skill && skill.trim());
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "Available skills retrieved successfully",
      data: {
        skills,
        count: skills.length
      }
    });
    
  } catch (error) {
    console.error("Error getting available skills:", error);
    return next(error);
  }
};

// Add skills to user profile (for guides to manage their skills)
const addUserSkills = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Skills must be an array"
      });
    }
    
    // Update user tags/skills in profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          'profile.tags': { $each: skills }
        }
      },
      { new: true }
    );
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "Skills added successfully",
      data: {
        skills: updatedUser.profile?.tags || []
      }
    });
    
  } catch (error) {
    console.error("Error adding user skills:", error);
    return next(error);
  }
};

// Update user skills (replace existing)
const updateUserSkills = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Skills must be an array"
      });
    }
    
    // Update user tags/skills in profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.tags': skills
        }
      },
      { new: true }
    );
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "Skills updated successfully",
      data: {
        skills: updatedUser.profile?.tags || []
      }
    });
    
  } catch (error) {
    console.error("Error updating user skills:", error);
    return next(error);
  }
};

module.exports = {
    uploadPhoto,
    getUser,
    updateUserProfile,
    getUserProfile,
    getDashboardMetrics,
    getAvailableSkills,
    addUserSkills,
    updateUserSkills
};