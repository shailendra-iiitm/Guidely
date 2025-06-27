// backend/controllers/payment.controller.js

const PaymentModel = require("../models/payment.model");
const httpStatus = require("../util/httpStatus");

// Get payment history for current user
const getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    console.log("Getting payment history for user:", userId, "role:", userRole);

    let query = {};
    
    // For learners, show payments they made
    if (userRole === "learner" || userRole === "student") {
      query = { user: userId };
    }
    // For guides, show payments they received
    else if (userRole === "guide" || userRole === "mentor") {
      query = { guide: userId };
    }

    const payments = await PaymentModel.find(query)
      .populate('booking', 'dateAndTime status')
      .populate('service', 'name description')
      .populate('user', 'name email')
      .populate('guide', 'name email')
      .sort({ createdAt: -1 });

    console.log("Found payments:", payments.length);

    res.status(httpStatus.ok).json({
      success: true,
      data: {
        payments,
        total: payments.length
      }
    });

  } catch (error) {
    console.error("Error getting payment history:", error);
    return next(error);
  }
};

// Get earnings for guides
const getEarnings = async (req, res, next) => {
  try {
    const guideId = req.user._id;
    
    console.log("Getting earnings for guide:", guideId);

    // Get all completed payments for this guide
    const payments = await PaymentModel.find({
      guide: guideId,
      status: { $in: ['completed', 'free'] }
    })
    .populate('booking', 'dateAndTime')
    .populate('service', 'name')
    .populate('user', 'name');

    // Calculate earnings statistics
    const totalEarnings = payments.reduce((sum, payment) => sum + (payment.guideEarning || 0), 0);
    const totalSessions = payments.length;
    
    // Calculate this month's earnings
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthPayments = payments.filter(payment => 
      new Date(payment.createdAt) >= thisMonth
    );
    const thisMonthEarnings = thisMonthPayments.reduce((sum, payment) => sum + (payment.guideEarning || 0), 0);

    res.status(httpStatus.ok).json({
      success: true,
      data: {
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        thisMonthEarnings: Math.round(thisMonthEarnings * 100) / 100,
        totalSessions,
        thisMonthSessions: thisMonthPayments.length,
        payments: payments.slice(0, 10) // Latest 10 payments
      }
    });

  } catch (error) {
    console.error("Error getting earnings:", error);
    return next(error);
  }
};

// Get payment statistics
const getPaymentStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    console.log("Getting payment stats for user:", userId, "role:", userRole);

    let query = {};
    if (userRole === "learner" || userRole === "student") {
      query = { user: userId };
    } else if (userRole === "guide" || userRole === "mentor") {
      query = { guide: userId };
    }

    const payments = await PaymentModel.find(query);
    
    const stats = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
      completedPayments: payments.filter(p => p.status === 'completed').length,
      freePayments: payments.filter(p => p.status === 'free').length,
      pendingPayments: payments.filter(p => p.status === 'pending').length
    };

    res.status(httpStatus.ok).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("Error getting payment stats:", error);
    return next(error);
  }
};

// Get payment by ID
const getPaymentById = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;
    
    console.log("Getting payment by ID:", paymentId, "for user:", userId);

    const payment = await PaymentModel.findById(paymentId)
      .populate('booking')
      .populate('service')
      .populate('user', 'name email')
      .populate('guide', 'name email');

    if (!payment) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Payment not found"
      });
    }

    // Check if user has access to this payment
    if (payment.user._id.toString() !== userId.toString() && 
        payment.guide._id.toString() !== userId.toString()) {
      return res.status(httpStatus.forbidden).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error("Error getting payment by ID:", error);
    return next(error);
  }
};

module.exports = {
  getPaymentHistory,
  getEarnings,
  getPaymentStats,
  getPaymentById
};
