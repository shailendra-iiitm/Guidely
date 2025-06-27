// backend/controllers/learningProgress.controller.js

const learningProgressService = require("../services/learningProgress.service");
const httpStatus = require("../util/httpStatus");

/**
 * Get learning progress for a user
 */
const getLearningProgress = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get from authenticated user
    
    console.log("Fetching learning progress for user:", userId);
    
    const progressData = await learningProgressService.calculateLearningProgress(userId);
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "Learning progress retrieved successfully",
      data: progressData
    });
    
  } catch (error) {
    console.error("Error getting learning progress:", error);
    return next(error);
  }
};

/**
 * Get learning progress for a specific user (admin/guide view)
 */
const getUserLearningProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    console.log("Fetching learning progress for user:", userId);
    
    const progressData = await learningProgressService.calculateLearningProgress(userId);
    
    res.status(httpStatus.ok).json({
      success: true,
      message: "User learning progress retrieved successfully",
      data: progressData
    });
    
  } catch (error) {
    console.error("Error getting user learning progress:", error);
    return next(error);
  }
};

module.exports = {
  getLearningProgress,
  getUserLearningProgress
};
