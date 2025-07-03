// Comprehensive Dashboard Metrics Update System
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const BookingModel = require('../models/booking.model');
const PaymentModel = require('../models/payment.model');
const ServiceModel = require('../models/service.model');
const UserModel = require('../models/user.model');

/**
 * Update user dashboard metrics after booking completion
 */
const updateUserMetricsAfterBooking = async (bookingId) => {
  try {
    console.log('🔄 Updating user metrics for booking:', bookingId);
    
    const booking = await BookingModel.findById(bookingId)
      .populate('user')
      .populate('guide') 
      .populate('service');
    
    if (!booking) {
      console.error('❌ Booking not found:', bookingId);
      return;
    }
    
    // Update Learner Metrics
    if (booking.user) {
      await updateLearnerMetrics(booking.user._id, booking);
    }
    
    // Update Guide Metrics
    if (booking.guide) {
      await updateGuideMetrics(booking.guide._id, booking);
    }
    
    console.log('✅ User metrics updated successfully for booking:', bookingId);
    
  } catch (error) {
    console.error('❌ Error updating user metrics:', error);
    throw error;
  }
};

/**
 * Update learner dashboard metrics
 */
const updateLearnerMetrics = async (learnerId, booking) => {
  try {
    console.log('📚 Updating learner metrics for:', learnerId);
    
    // Get all completed sessions for this learner
    const completedSessions = await BookingModel.find({
      user: learnerId,
      status: 'completed'
    }).populate('service');
    
    // Calculate total sessions
    const totalSessions = completedSessions.length;
    
    // Calculate skills learned
    const skillsSet = new Set();
    completedSessions.forEach(session => {
      if (session.service && session.service.skills) {
        session.service.skills.forEach(skill => skillsSet.add(skill));
      }
      // Also add service category as a skill
      if (session.service && session.service.category) {
        skillsSet.add(session.service.category);
      }
    });
    const skillsLearned = Array.from(skillsSet);
    
    // Calculate learning streak
    const currentStreak = await calculateLearningStreak(learnerId);
    
    // Calculate total hours
    const totalHours = completedSessions.reduce((total, session) => {
      return total + ((session.service?.duration || 60) / 60);
    }, 0);
    
    // Update user record with calculated metrics
    await UserModel.findByIdAndUpdate(learnerId, {
      $set: {
        'learnerMetrics.totalSessions': totalSessions,
        'learnerMetrics.skillsLearned': skillsLearned,
        'learnerMetrics.currentStreak': currentStreak,
        'learnerMetrics.totalHours': Math.round(totalHours * 10) / 10,
        'learnerMetrics.lastUpdated': new Date()
      }
    });
    
    console.log('✅ Learner metrics updated:', {
      totalSessions,
      skillsLearned: skillsLearned.length,
      currentStreak,
      totalHours
    });
    
  } catch (error) {
    console.error('❌ Error updating learner metrics:', error);
    throw error;
  }
};

/**
 * Update guide dashboard metrics
 */
const updateGuideMetrics = async (guideId, booking) => {
  try {
    console.log('👨‍🏫 Updating guide metrics for:', guideId);
    
    // Get all completed sessions for this guide
    const completedSessions = await BookingModel.find({
      guide: guideId,
      status: 'completed'
    }).populate('service').populate('user');
    
    // Calculate total sessions
    const totalSessions = completedSessions.length;
    
    // Calculate unique learners
    const learnersSet = new Set();
    completedSessions.forEach(session => {
      if (session.user) {
        learnersSet.add(session.user._id.toString());
      }
    });
    const uniqueLearners = learnersSet.size;
    
    // Calculate skills taught
    const skillsSet = new Set();
    completedSessions.forEach(session => {
      if (session.service && session.service.skills) {
        session.service.skills.forEach(skill => skillsSet.add(skill));
      }
      if (session.service && session.service.category) {
        skillsSet.add(session.service.category);
      }
    });
    const skillsTaught = Array.from(skillsSet);
    
    // Calculate total earnings from payments
    const payments = await PaymentModel.find({
      guide: guideId,
      status: { $in: ['completed', 'free'] }
    });
    
    const totalEarnings = payments.reduce((total, payment) => {
      return total + (payment.guideEarning || 0);
    }, 0);
    
    // Calculate total hours taught
    const totalHours = completedSessions.reduce((total, session) => {
      return total + ((session.service?.duration || 60) / 60);
    }, 0);
    
    // Update user record with calculated metrics
    await UserModel.findByIdAndUpdate(guideId, {
      $set: {
        'guideMetrics.totalSessions': totalSessions,
        'guideMetrics.uniqueLearners': uniqueLearners,
        'guideMetrics.skillsTaught': skillsTaught,
        'guideMetrics.totalEarnings': Math.round(totalEarnings * 100) / 100,
        'guideMetrics.totalHours': Math.round(totalHours * 10) / 10,
        'guideMetrics.lastUpdated': new Date()
      }
    });
    
    console.log('✅ Guide metrics updated:', {
      totalSessions,
      uniqueLearners,
      skillsTaught: skillsTaught.length,
      totalEarnings,
      totalHours
    });
    
  } catch (error) {
    console.error('❌ Error updating guide metrics:', error);
    throw error;
  }
};

/**
 * Calculate learning streak for a user
 */
const calculateLearningStreak = async (userId) => {
  try {
    const completedBookings = await BookingModel.find({
      user: userId,
      status: 'completed'
    }).select('dateAndTime').sort({ dateAndTime: -1 });

    if (completedBookings.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get unique days when sessions were completed
    const sessionDays = [...new Set(
      completedBookings.map(booking => {
        const date = new Date(booking.dateAndTime);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    )].sort((a, b) => b - a);

    // Check for consecutive days
    let expectedDate = currentDate.getTime();
    
    for (const sessionDay of sessionDays) {
      if (sessionDay === expectedDate || sessionDay === expectedDate - 24 * 60 * 60 * 1000) {
        streak++;
        expectedDate = sessionDay - 24 * 60 * 60 * 1000;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('❌ Error calculating learning streak:', error);
    return 0;
  }
};

/**
 * Bulk update all user metrics (for fixing existing data)
 */
const bulkUpdateAllUserMetrics = async () => {
  try {
    console.log('🚀 Starting bulk update of all user metrics...');
    
    const DB_URL = process.env.DB_URL;
    await mongoose.connect(DB_URL);
    console.log('✅ Connected to MongoDB');
    
    // Get all users
    const allUsers = await UserModel.find({});
    console.log(`👥 Found ${allUsers.length} users to update`);
    
    let learnerCount = 0;
    let guideCount = 0;
    
    for (const user of allUsers) {
      if (user.role === 'learner') {
        // Find any completed booking for this learner to trigger update
        const booking = await BookingModel.findOne({
          user: user._id,
          status: 'completed'
        }).populate('service').populate('guide');
        
        if (booking) {
          await updateLearnerMetrics(user._id, booking);
          learnerCount++;
        }
      } else if (user.role === 'guide') {
        // Find any completed booking for this guide to trigger update
        const booking = await BookingModel.findOne({
          guide: user._id,
          status: 'completed'
        }).populate('service').populate('user');
        
        if (booking) {
          await updateGuideMetrics(user._id, booking);
          guideCount++;
        }
      }
    }
    
    console.log('✅ Bulk update complete!');
    console.log(`📚 Updated ${learnerCount} learners`);
    console.log(`👨‍🏫 Updated ${guideCount} guides`);
    
  } catch (error) {
    console.error('❌ Error in bulk update:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

module.exports = {
  updateUserMetricsAfterBooking,
  updateLearnerMetrics,
  updateGuideMetrics,
  calculateLearningStreak,
  bulkUpdateAllUserMetrics
};

// Run bulk update if this script is executed directly
if (require.main === module) {
  bulkUpdateAllUserMetrics();
}
