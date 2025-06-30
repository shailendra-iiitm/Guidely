// backend/routes/v1/feedback.route.js

const express = require("express");
const feedbackController = require("../../controllers/feedback.controller");

const router = express.Router();

// Public routes
router.post("/submit", feedbackController.submitFeedback);
router.get("/track/:token", feedbackController.trackFeedback);
router.get("/stats", feedbackController.getFeedbackStats);

module.exports = router;
