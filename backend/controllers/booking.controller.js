// backend/controllers/booking.controller.js

const Razorpay = require("razorpay");
const bookingService = require("../services/booking.service");
const httpStatus = require("../util/httpStatus");
const serviceService = require("../services/service.service");
const config = require("../config");
const BookingModel = require("../models/booking.model");
const paymentService = require("../services/payment.service");

const initiateBookingAndPayment = async (req, res, next) => {
  try {
    const { dateAndTime, serviceId } = req.body;

    console.log("Initiate booking request:", { dateAndTime, serviceId, userId: req.user._id });

    // Validate required fields
    if (!serviceId || !dateAndTime) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Service ID and date/time are required"
      });
    }

    // Validate date format
    const bookingDate = new Date(dateAndTime);
    if (isNaN(bookingDate.getTime())) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Invalid date/time format"
      });
    }

    // Get the service details
    const service = await serviceService.getServiceById(serviceId);
    console.log("Retrieved service:", service);
    
    if (!service) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Service not found"
      });
    }

    // Validate that service has a guide
    if (!service.guide) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Service does not have an associated guide"
      });
    }

    // Create a new booking
    const bookingData = {
      user: req.user._id,
      guide: service.guide,  
      dateAndTime: bookingDate,
      service: serviceId,
      price: service.price,
      // Set status based on whether it's a free session
      status: (service.price === 0 || service.price === "0" || 
               service.price === "Free" || service.price === null || 
               service.price === undefined) ? "confirmed" : "pending"
    };

    console.log("Creating booking with data:", bookingData);
    const newBooking = await bookingService.createBooking(bookingData);
    console.log("Created booking:", newBooking);

    // Create payment record for ALL bookings (including free ones)
    try {
      const paymentData = {
        booking: newBooking._id,
        user: req.user._id,
        guide: service.guide,
        service: serviceId,
        amount: service.price || 0,
        currency: "INR",
        status: (service.price === 0 || service.price === "0" || 
                service.price === "Free" || service.price === null || 
                service.price === undefined) ? "free" : "pending",
        paymentMethod: (service.price === 0 || service.price === "0" || 
                       service.price === "Free" || service.price === null || 
                       service.price === undefined) ? "free" : "razorpay",
        transactionId: (service.price === 0 || service.price === "0" || 
                       service.price === "Free" || service.price === null || 
                       service.price === undefined) ? `FREE_${newBooking._id}` : null
      };

      console.log("Creating payment record:", paymentData);
      const payment = await paymentService.createPaymentRecord(paymentData);
      console.log("Payment record created:", payment._id);
    } catch (paymentError) {
      console.error("Error creating payment record:", paymentError);
      // Don't fail the booking if payment record creation fails
    }

    // Check if it's a free session (more robust check)
    const isFreeSession = service.price === 0 || service.price === "0" || 
                         service.price === "Free" || service.price === null || 
                         service.price === undefined;
    
    console.log("Is free session:", isFreeSession, "Price:", service.price);
    
    if (isFreeSession) {
      // For free sessions, return success without payment
      return res.status(httpStatus.created).json({
        success: true,
        message: "Free session booked successfully",
        booking: newBooking,
        isFreeSession: true
      });
    }

    // For paid sessions, validate Razorpay configuration
    if (!config.razorpay || !config.razorpay.key_id || !config.razorpay.key_secret) {
      console.error("Razorpay configuration missing");
      return res.status(httpStatus.internalServerError).json({
        success: false,
        message: "Payment service not configured properly"
      });
    }

    // Check if Razorpay config has placeholder values (for development)
    if (config.razorpay.key_secret === "1234567890qwerty" || 
        config.razorpay.key_id.includes("test_key")) {
      console.warn("Razorpay configuration contains placeholder values");
      // For development, treat as free session
      return res.status(httpStatus.created).json({
        success: true,
        message: "Session booked successfully (Razorpay not configured - treating as free session)",
        booking: newBooking,
        isFreeSession: true
      });
    }

    // Create Razorpay order
    const razorpay = new Razorpay(config.razorpay);

    const options = {
      amount: Math.round(service.price * 100), // amount in paise, ensure it's an integer
      currency: "INR",
      receipt: `receipt_order_${newBooking._id}`,
      payment_capture: 1,
      notes: {
        bookingId: newBooking._id.toString(),
        serviceId: serviceId,
        userId: req.user._id.toString(),
      },
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Created Razorpay order:", order);

    // Send response with booking and payment details
    res.status(httpStatus.created).json({
      success: true,
      booking: newBooking,
      order,
      isFreeSession: false
    });
  } catch (error) {
    console.error("Error in initiateBookingAndPayment:", error);
    console.error("Error stack:", error.stack);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Validation error: " + error.message
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    return next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getUsersBooking(req.user._id);
    
    // Handle both old format (just bookings array) and new format (object with bookings and categorized)
    if (result.bookings) {
      // New format with categorization
      res.status(httpStatus.ok).json({ 
        success: true, 
        bookings: result.bookings,
        categorized: result.categorized,
        stats: result.stats
      });
    } else {
      // Old format (backward compatibility)
      res.status(httpStatus.ok).json({ success: true, bookings: result });
    }
  } catch (error) {
    console.error("Error in getBookings:", error);
    return next(error);
  }
};

const getGuideBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getGuideBookings(req.user._id);
    
    // Handle both old format (just bookings array) and new format (object with bookings and categorized)
    if (result.bookings) {
      // New format with categorization
      res.status(httpStatus.ok).json({ 
        success: true, 
        bookings: result.bookings,
        categorized: result.categorized,
        stats: result.stats
      });
    } else {
      // Old format (backward compatibility)
      res.status(httpStatus.ok).json({ success: true, bookings: result });
    }
  } catch (error) {
    console.error("Error in getGuideBookings:", error);
    return next(error);
  }
};

const updateMeetingLink = async (req, res, next) => {
  try {
    const { bookingId, meetingLink } = req.body;
    const guideId = req.user._id;

    console.log("Updating meeting link:", { bookingId, meetingLink, guideId });

    const booking = await bookingService.updateBookingById(bookingId, { 
      meetingLink,
      guide: guideId // Ensure only the guide can update their booking
    });

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to update it"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Meeting link updated successfully",
      booking
    });
  } catch (error) {
    console.error("Error updating meeting link:", error);
    return next(error);
  }
};

const markSessionComplete = async (req, res, next) => {
  try {
    const { bookingId, sessionNotes, achievements } = req.body;
    const guideId = req.user._id;

    console.log("Marking session complete:", { bookingId, guideId });

    const updateData = {
      status: "completed",
      sessionEndedAt: new Date(),
      guide: guideId
    };

    if (sessionNotes) {
      updateData.sessionNotes = sessionNotes;
    }

    if (achievements && Array.isArray(achievements)) {
      updateData.achievements = achievements;
    }

    const booking = await bookingService.updateBookingById(bookingId, updateData);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to update it"
      });
    }

    // Add achievements to learner's profile
    if (achievements && Array.isArray(achievements) && achievements.length > 0 && booking.user && booking.user._id) {
      try {
        const UserModel = require('../models/user.model');
        const learner = await UserModel.findById(booking.user._id);
        
        if (learner) {
          // Initialize achievements array if it doesn't exist
          if (!learner.profile.achievements) {
            learner.profile.achievements = [];
          }
          
          // Add new achievements to learner's profile
          const newAchievements = achievements.map(achievement => ({
            title: achievement.title,
            description: achievement.description,
            earnedAt: new Date(),
            category: achievement.category || "session",
            icon: achievement.icon || "trophy"
          }));
          
          learner.profile.achievements.push(...newAchievements);
          await learner.save();
          
          console.log(`Added ${newAchievements.length} achievements to learner ${learner._id}`);
        }
      } catch (error) {
        console.error("Error adding achievements to learner profile:", error);
        // Don't fail the main request if achievement update fails
      }
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Session marked as completed",
      booking
    });
  } catch (error) {
    console.error("Error marking session complete:", error);
    return next(error);
  }
};

const rateSession = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user._id;

    console.log("Rating session:", { bookingId, rating, userId });

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // First, check if this session is already rated
    const existingBooking = await BookingModel.findById(bookingId);
    if (!existingBooking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (existingBooking.rating && existingBooking.rating.score) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "This session has already been rated"
      });
    }

    const updateData = {
      rating: {
        score: rating,
        comment: comment || "",
        ratedAt: new Date()
      },
      user: userId // Ensure only the learner can rate their session
    };

    console.log("Updating booking with rating data:", updateData);
    const booking = await bookingService.updateBookingById(bookingId, updateData);
    console.log("Booking update result:", booking ? 'SUCCESS' : 'FAILED');

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to rate it"
      });
    }

    console.log("Booking guide info:", {
      hasGuide: !!booking.guide,
      guideId: booking.guide?._id,
      guideName: booking.guide?.name
    });

    // Update guide's rating in their profile
    if (booking.guide && booking.guide._id) {
      try {
        console.log("Starting guide rating update for guide:", booking.guide._id);
        const UserModel = require('../models/user.model');
        const guide = await UserModel.findById(booking.guide._id);
        
        if (guide) {
          console.log("Guide found, current profile:", JSON.stringify(guide.profile?.rating || 'none'));
          
          // Initialize profile if it doesn't exist
          if (!guide.profile) {
            guide.profile = {};
            console.log("Initialized profile object");
          }
          
          // Initialize rating if it doesn't exist
          if (!guide.profile.rating) {
            guide.profile.rating = { average: 0, count: 0, total: 0 };
            console.log("Initialized rating object");
          }
          
          // Store old values for logging
          const oldRating = { ...guide.profile.rating };
          
          // Update rating statistics
          guide.profile.rating.total += rating;
          guide.profile.rating.count += 1;
          guide.profile.rating.average = guide.profile.rating.total / guide.profile.rating.count;
          
          console.log("Rating update:", {
            oldRating,
            newRating: guide.profile.rating,
            addedRating: rating
          });
          
          // Use findByIdAndUpdate for more reliable saving
          const updatedGuide = await UserModel.findByIdAndUpdate(
            guide._id,
            { 
              $set: { 
                'profile.rating': guide.profile.rating 
              }
            },
            { new: true }
          );
          
          console.log("Guide rating updated successfully:", {
            guideId: guide._id,
            finalRating: updatedGuide.profile?.rating
          });
        } else {
          console.log('Guide not found for rating update');
        }
      } catch (error) {
        console.error("Error updating guide rating:", error);
        // Don't fail the main request if rating update fails
      }
    } else {
      console.log('No guide ID found in booking for rating update');
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Session rated successfully",
      booking
    });
  } catch (error) {
    console.error("Error rating session:", error);
    return next(error);
  }
};

const startSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    console.log("Starting session:", { bookingId, userId });

    const updateData = {
      status: "in-progress",
      sessionStartedAt: new Date()
    };

    const booking = await bookingService.updateBookingById(bookingId, updateData);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Session started",
      booking
    });
  } catch (error) {
    console.error("Error starting session:", error);
    return next(error);
  }
};

const updateBookingStatuses = async (req, res, next) => {
  try {
    await bookingService.updateBookingStatuses();
    res.status(httpStatus.ok).json({
      success: true,
      message: "Booking statuses updated successfully"
    });
  } catch (error) {
    console.error("Error updating booking statuses:", error);
    return next(error);
  }
};

// Guide confirms a pending booking
const confirmBooking = async (req, res, next) => {
  try {
    const { bookingId, meetingLink } = req.body;
    const guideId = req.user._id;

    console.log("Confirming booking:", { bookingId, guideId });

    const updateData = {
      status: "confirmed",
      guide: guideId
    };

    if (meetingLink) {
      updateData.meetingLink = meetingLink;
    }

    const booking = await bookingService.updateBookingById(bookingId, updateData);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to confirm it"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Booking confirmed successfully",
      booking
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return next(error);
  }
};

// Guide reschedules a booking
const rescheduleBooking = async (req, res, next) => {
  try {
    const { bookingId, newDateTime, reason } = req.body;
    const guideId = req.user._id;

    console.log("Rescheduling booking:", { bookingId, newDateTime, guideId });

    // Validate new date
    const newBookingDate = new Date(newDateTime);
    if (isNaN(newBookingDate.getTime())) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "Invalid date/time format"
      });
    }

    // Check if new date is in the future
    if (newBookingDate <= new Date()) {
      return res.status(httpStatus.badRequest).json({
        success: false,
        message: "New booking date must be in the future"
      });
    }

    const updateData = {
      dateAndTime: newBookingDate,
      status: "confirmed", // Auto-confirm when guide reschedules
      guide: guideId,
      rescheduleHistory: {
        previousDateTime: null, // Will be set by the service
        newDateTime: newBookingDate,
        reason: reason || "Rescheduled by guide",
        rescheduledAt: new Date(),
        rescheduledBy: guideId
      }
    };

    const booking = await bookingService.rescheduleBooking(bookingId, updateData);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to reschedule it"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Booking rescheduled successfully",
      booking
    });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    return next(error);
  }
};

// Guide cancels a booking
const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId, reason } = req.body;
    const guideId = req.user._id;

    console.log("Cancelling booking:", { bookingId, guideId });

    const updateData = {
      status: "cancelled",
      cancellationReason: reason || "Cancelled by guide",
      cancelledAt: new Date(),
      cancelledBy: guideId,
      guide: guideId
    };

    const booking = await bookingService.updateBookingById(bookingId, updateData);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to cancel it"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return next(error);
  }
};

// Learner adds feedback/suggestions after rating
const addBookingFeedback = async (req, res, next) => {
  try {
    const { bookingId, feedback, suggestions, highlights } = req.body;
    const userId = req.user._id;

    console.log("Adding feedback to booking:", { bookingId, userId });

    const updateData = {
      feedback: {
        generalFeedback: feedback || "",
        suggestions: suggestions || "",
        highlights: highlights || "",
        submittedAt: new Date()
      },
      user: userId
    };

    const booking = await bookingService.updateBookingById(bookingId, updateData);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found or you're not authorized to add feedback"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      message: "Feedback added successfully",
      booking
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    return next(error);
  }
};

// Get booking details with full information
const getBookingDetails = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log("Getting booking details:", { bookingId, userId, userRole });

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(httpStatus.notFound).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check authorization - user should be either the learner or the guide
    if (booking.user._id.toString() !== userId.toString() && 
        booking.guide._id.toString() !== userId.toString()) {
      return res.status(httpStatus.forbidden).json({
        success: false,
        message: "You're not authorized to view this booking"
      });
    }

    res.status(httpStatus.ok).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error("Error getting booking details:", error);
    return next(error);
  }
};

module.exports = {
  initiateBookingAndPayment,
  getBookings,
  getGuideBookings,
  updateMeetingLink,
  markSessionComplete,
  rateSession,
  startSession,
  updateBookingStatuses,
  confirmBooking,
  rescheduleBooking,
  cancelBooking,
  addBookingFeedback,
  getBookingDetails,
};
