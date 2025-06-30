// backend/controllers/feedback.controller.js

const FeedbackModel = require("../models/feedback.model");
const httpStatus = require("../util/httpStatus");

// Submit new feedback
const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, type, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !type || !subject || !message) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Create feedback
    const feedback = await FeedbackModel.create({
      name,
      email,
      type,
      subject,
      message
    });

    console.log("Feedback submitted:", feedback.token);

    res.status(httpStatus.created).json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        token: feedback.token,
        status: feedback.status,
        submittedAt: feedback.createdAt
      }
    });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    return next(error);
  }
};

// Track feedback status using token
const trackFeedback = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Feedback token is required"
      });
    }

    const feedback = await FeedbackModel.findOne({ token })
      .select('token type subject status priority createdAt resolvedAt updatedAt');

    if (!feedback) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Feedback not found with this token"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      data: {
        token: feedback.token,
        type: feedback.type,
        subject: feedback.subject,
        status: feedback.status,
        priority: feedback.priority,
        submittedAt: feedback.createdAt,
        lastUpdated: feedback.updatedAt,
        resolvedAt: feedback.resolvedAt
      }
    });

  } catch (error) {
    console.error("Error tracking feedback:", error);
    return next(error);
  }
};

// Get feedback statistics (public)
const getFeedbackStats = async (req, res, next) => {
  try {
    const stats = await FeedbackModel.aggregate([
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalFeedbacks: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0
    };

    res.status(httpStatus.ok).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Error getting feedback stats:", error);
    return next(error);
  }
};

module.exports = {
  submitFeedback,
  trackFeedback,
  getFeedbackStats
};
