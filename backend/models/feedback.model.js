// backend/models/feedback.model.js

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["suggestion", "complaint", "bug-report", "feature-request", "general"],
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    adminNotes: {
      type: String,
      default: ""
    },
    resolvedAt: {
      type: Date
    },
    assignedTo: {
      type: String,
      default: ""
    }
  },
  { 
    timestamps: true 
  }
);

// Generate unique 8-character token
feedbackSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = 'FB' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

module.exports = FeedbackModel;
