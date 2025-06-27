// backend/services/payment.service.js

const PaymentModel = require("../models/payment.model");

/**
 * Create a payment record for a booking
 */
const createPaymentRecord = async (paymentData) => {
  try {
    console.log("Creating payment record:", paymentData);
    
    // Calculate platform fee and guide earning
    const amount = paymentData.amount || 0;
    const platformFeePercentage = 0.10; // 10% platform fee
    const platformFee = amount * platformFeePercentage;
    const guideEarning = amount - platformFee;
    
    const paymentRecord = {
      ...paymentData,
      platformFee: Math.round(platformFee * 100) / 100, // Round to 2 decimal places
      guideEarning: Math.round(guideEarning * 100) / 100,
      paidAt: paymentData.amount === 0 ? new Date() : paymentData.paidAt,
      status: paymentData.amount === 0 ? "free" : paymentData.status || "pending",
      paymentMethod: paymentData.amount === 0 ? "free" : paymentData.paymentMethod || "razorpay"
    };
    
    const payment = await PaymentModel.create(paymentRecord);
    console.log("Payment record created successfully:", payment._id);
    
    return payment;
  } catch (error) {
    console.error("Error creating payment record:", error);
    throw error;
  }
};

/**
 * Get payment history for a user (learner)
 */
const getUserPaymentHistory = async (userId) => {
  try {
    const payments = await PaymentModel.find({ user: userId })
      .populate('booking', 'dateAndTime status')
      .populate('service', 'name description duration')
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });
    
    return payments;
  } catch (error) {
    console.error("Error getting user payment history:", error);
    throw error;
  }
};

/**
 * Get earnings history for a guide
 */
const getGuideEarnings = async (guideId) => {
  try {
    const payments = await PaymentModel.find({ 
      guide: guideId,
      status: { $in: ["completed", "free"] }
    })
      .populate('booking', 'dateAndTime status')
      .populate('service', 'name description duration')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Calculate total earnings
    const totalEarnings = payments.reduce((total, payment) => {
      return total + (payment.guideEarning || 0);
    }, 0);
    
    const totalSessions = payments.length;
    const paidSessions = payments.filter(p => p.amount > 0).length;
    const freeSessions = payments.filter(p => p.amount === 0).length;
    
    return {
      payments,
      summary: {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalSessions,
        paidSessions,
        freeSessions
      }
    };
  } catch (error) {
    console.error("Error getting guide earnings:", error);
    throw error;
  }
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (paymentId, status, additionalData = {}) => {
  try {
    const updateData = {
      status,
      ...additionalData
    };
    
    if (status === "completed" && !additionalData.paidAt) {
      updateData.paidAt = new Date();
    }
    
    const payment = await PaymentModel.findByIdAndUpdate(
      paymentId,
      updateData,
      { new: true }
    );
    
    return payment;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

/**
 * Find payment by booking ID
 */
const getPaymentByBookingId = async (bookingId) => {
  try {
    const payment = await PaymentModel.findOne({ booking: bookingId })
      .populate('service', 'name price')
      .populate('user', 'name email')
      .populate('guide', 'name email');
    
    return payment;
  } catch (error) {
    console.error("Error getting payment by booking ID:", error);
    throw error;
  }
};

module.exports = {
  createPaymentRecord,
  getUserPaymentHistory,
  getGuideEarnings,
  updatePaymentStatus,
  getPaymentByBookingId
};
