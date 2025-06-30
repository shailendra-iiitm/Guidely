// backend/models/booking.model.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guide: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateAndTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    meetingLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "upcoming", "in-progress", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    sessionNotes: {
      type: String,
      default: "",
    },
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      ratedAt: {
        type: Date,
      }
    },
    achievements: [{
      title: String,
      description: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    rescheduleHistory: [{
      previousDateTime: Date,
      newDateTime: Date,
      reason: String,
      rescheduledAt: Date,
      rescheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }],
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    feedback: {
      generalFeedback: String,
      suggestions: String,
      highlights: String,
      submittedAt: Date
    },
    sessionStartedAt: {
      type: Date,
    },
    sessionEndedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
