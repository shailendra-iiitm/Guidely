// backend/routes/v1/learningProgress.route.js

const express = require("express");
const auth = require("../../middleware/auth");
const asyncHandler = require("../../helper/asyncHandler");
const learningProgressController = require("../../controllers/learningProgress.controller");

const router = express.Router();

// Get current user's learning progress
router.get(
  "/",
  auth.protect,
  auth.restrictTo("learner"),
  asyncHandler(learningProgressController.getLearningProgress)
);

// Get specific user's learning progress (for guides/admins)
router.get(
  "/user/:userId",
  auth.protect,
  asyncHandler(learningProgressController.getUserLearningProgress)
);

module.exports = router;
