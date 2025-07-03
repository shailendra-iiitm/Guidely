const express = require("express");
const userController = require("../../controllers/user.controller");
const asyncHandler = require("../../helper/asyncHandler");
const authMiddleware = require("../../middleware/auth");
const upload = require("../../middleware/upload"); // Assuming you have an upload middleware
const validate = require("../../middleware/validate");
const {
  updateUserProfileValidation,
} = require("../../validations/user.validation");

const router = express.Router();

// ... other routes

router.post(
  "/upload-photo",
  authMiddleware.protect,
  upload.single("photo"), // Assuming 'photo' is the field name for the file
  userController.uploadPhoto
);

router.get("/", authMiddleware.protect, asyncHandler(userController.getUser));

router.put(
  "/update-profile",
  authMiddleware.protect,
  validate(updateUserProfileValidation),
  asyncHandler(userController.updateUserProfile)
);
// Get user profile with ratings and achievements
router.get(
  "/profile",
  authMiddleware.protect,
  asyncHandler(userController.getUserProfile)
);

// Get specific user profile with ratings and achievements
router.get(
  "/profile/:userId",
  authMiddleware.protect,
  asyncHandler(userController.getUserProfile)
);

// Get dashboard metrics for current user
router.get(
  "/dashboard-metrics",
  authMiddleware.protect,
  asyncHandler(userController.getDashboardMetrics)
);

// Get all available skills
router.get(
  "/skills",
  authMiddleware.protect,
  asyncHandler(userController.getAvailableSkills)
);

// Add skills to user profile
router.post(
  "/skills",
  authMiddleware.protect,
  asyncHandler(userController.addUserSkills)
);

// Update user skills
router.put(
  "/skills",
  authMiddleware.protect,
  asyncHandler(userController.updateUserSkills)
);

module.exports = router;
