// backend/models/payment.model.js

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
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
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "free"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "free", "stripe", "paypal"],
      default: "free"
    },
    transactionId: {
      type: String,
      default: null
    },
    razorpayOrderId: {
      type: String,
      default: null
    },
    razorpayPaymentId: {
      type: String,
      default: null
    },
    razorpaySignature: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    refundedAt: {
      type: Date,
      default: null
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    platformFee: {
      type: Number,
      default: 0
    },
    guideEarning: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Indexes for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ guide: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1 });

const PaymentModel = mongoose.model("Payment", paymentSchema);

module.exports = PaymentModel;
