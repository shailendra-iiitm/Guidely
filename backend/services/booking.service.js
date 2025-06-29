// backend/services/booking.service.js

const BookingModel = require("../models/booking.model");

// Helper function to categorize bookings based on current time and status
const categorizeBookings = (bookings) => {
  const now = new Date();
  const categorized = {
    upcoming: [],
    inProgress: [],
    completed: [],
    cancelled: [],
    pending: []
  };

  bookings.forEach(booking => {
    const bookingDate = new Date(booking.dateAndTime);
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);

    // If booking is explicitly cancelled or no-show
    if (booking.status === 'cancelled' || booking.status === 'no-show') {
      categorized.cancelled.push(booking);
    }
    // If booking is explicitly completed
    else if (booking.status === 'completed') {
      categorized.completed.push(booking);
    }
    // If booking is currently in progress
    else if (booking.status === 'in-progress') {
      // Check if session should be completed based on duration
      if (booking.sessionStartedAt && booking.service?.duration) {
        const sessionDuration = booking.service.duration;
        const expectedEndTime = new Date(booking.sessionStartedAt.getTime() + sessionDuration * 60000);
        
        if (now > expectedEndTime) {
          // Session should be completed, but categorize as completed
          categorized.completed.push(booking);
        } else {
          categorized.inProgress.push(booking);
        }
      } else {
        categorized.inProgress.push(booking);
      }
    }
    // If booking date has passed (more than 1 hour ago) and not completed/cancelled
    else if (hoursDiff < -1) {
      // Only treat past bookings as completed if they were confirmed
      if (booking.status === 'confirmed' || booking.status === 'upcoming') {
        categorized.completed.push(booking);
      } 
      // Keep pending bookings as pending even if time has passed (payment might still be processing)
      else if (booking.status === 'pending') {
        categorized.pending.push(booking);
      }
      // Only mark as cancelled if explicitly cancelled or no-show
      else {
        categorized.cancelled.push(booking);
      }
    }
    // If booking is within next 24 hours (upcoming)
    else if (hoursDiff >= -1 && hoursDiff <= 24) {
      categorized.upcoming.push(booking);
    }
    // If booking is more than 24 hours in the future
    else if (hoursDiff > 24) {
      // Keep confirmed/upcoming bookings as upcoming, others as pending
      if (booking.status === 'confirmed' || booking.status === 'upcoming') {
        categorized.upcoming.push(booking);
      } else {
        categorized.pending.push(booking);
      }
    }
    // Default fallback
    else {
      categorized.pending.push(booking);
    }
  });

  return categorized;
};

const createBooking = async (bookingData) => {
  try {
    console.log("Creating booking in database with data:", bookingData);
    
    // If no status is provided, determine initial status based on booking time and price
    if (!bookingData.status) {
      const bookingDate = new Date(bookingData.dateAndTime);
      const now = new Date();
      const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
      
      // For free sessions or sessions more than 24 hours away, set as confirmed
      // For paid sessions, keep as pending until payment is confirmed
      if (bookingData.price === 0 || bookingData.price === "0" || 
          bookingData.price === "Free" || bookingData.price === null || 
          bookingData.price === undefined) {
        bookingData.status = "confirmed";
      } else {
        bookingData.status = "pending";
      }
    }
    
    const booking = await BookingModel.create(bookingData);
    console.log("Successfully created booking:", booking);
    return booking;
  } catch (error) {
    console.error("Error creating booking in database:", error);
    throw error;
  }
};

const getBookingById = async (bookingId) => {
  return await BookingModel.findById(bookingId)
    .populate("service")
    .populate("user");
};

const updateBookingById = async (bookingId, bookingData) => {
  try {
    console.log("Updating booking:", bookingId, bookingData);
    
    // Extract user/guide filtering from bookingData if present
    const { user, guide, ...updateData } = bookingData;
    
    let query = { _id: bookingId };
    if (user) query.user = user;
    if (guide) query.guide = guide;
    
    const booking = await BookingModel.findOneAndUpdate(
      query,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('service', 'name description duration price')
    .populate('user', 'name email photoUrl profile')
    .populate('guide', 'name email photoUrl profile');
    
    console.log("Updated booking:", booking ? 'found' : 'not found');
    return booking;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

const getUsersBooking = async (userId) => {
  try {
    console.log("Getting bookings for user:", userId);
    
    // Update booking statuses before fetching
    await updateBookingStatuses();
    
    const bookings = await BookingModel.find({ user: userId })
      .populate('service', 'name description duration price')
      .populate('guide', 'name email photoUrl profile')
      .sort({ dateAndTime: -1 });
    
    console.log("Found user bookings:", bookings.length);
    console.log("User bookings details:", bookings.map(b => ({ 
      id: b._id, 
      status: b.status, 
      service: b.service?.name,
      guide: b.guide?.name,
      dateTime: b.dateAndTime 
    })));
    
    // Return both raw bookings and categorized bookings
    const categorized = categorizeBookings(bookings);
    
    return {
      bookings,
      categorized,
      stats: {
        total: bookings.length,
        upcoming: categorized.upcoming.length,
        inProgress: categorized.inProgress.length,
        completed: categorized.completed.length,
        cancelled: categorized.cancelled.length,
        pending: categorized.pending.length
      }
    };
  } catch (error) {
    console.error("Error getting user bookings:", error);
    throw error;
  }
};

const getGuideBookings = async (guideId) => {
  try {
    console.log("Getting bookings for guide:", guideId);
    
    // Update booking statuses before fetching
    await updateBookingStatuses();
    
    const bookings = await BookingModel.find({ guide: guideId })
      .populate('service', 'name description duration price')
      .populate('user', 'name email photoUrl profile')
      .sort({ dateAndTime: -1 });
    
    console.log("Found guide bookings:", bookings.length);
    console.log("Guide bookings details:", bookings.map(b => ({ 
      id: b._id, 
      status: b.status, 
      service: b.service?.name,
      user: b.user?.name,
      dateTime: b.dateAndTime 
    })));
    
    // Return both raw bookings and categorized bookings
    const categorized = categorizeBookings(bookings);
    
    return {
      bookings,
      categorized,
      stats: {
        total: bookings.length,
        upcoming: categorized.upcoming.length,
        inProgress: categorized.inProgress.length,
        completed: categorized.completed.length,
        cancelled: categorized.cancelled.length,
        pending: categorized.pending.length
      }
    };
  } catch (error) {
    console.error("Error getting guide bookings:", error);
    throw error;
  }
};

// Auto-update booking statuses based on current time
const updateBookingStatuses = async () => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000);
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    console.log("Updating booking statuses at:", now);
    
    // Update pending bookings that have passed to 'no-show'
    const noShowResult = await BookingModel.updateMany(
      { 
        status: 'pending',
        dateAndTime: { $lt: oneHourAgo }
      },
      { status: 'no-show' }
    );
    console.log("Updated pending to no-show:", noShowResult.modifiedCount);
    
    // Update in-progress sessions that should be completed based on session duration
    const inProgressBookings = await BookingModel.find({
      status: 'in-progress',
      sessionStartedAt: { $exists: true }
    }).populate('service', 'duration');
    
    let inProgressCompletedCount = 0;
    for (const booking of inProgressBookings) {
      const sessionDuration = booking.service?.duration || 60; // Default 60 minutes
      const expectedEndTime = new Date(booking.sessionStartedAt.getTime() + sessionDuration * 60000);
      
      if (now > expectedEndTime) {
        await BookingModel.findByIdAndUpdate(booking._id, {
          status: 'completed',
          sessionEndedAt: expectedEndTime
        });
        inProgressCompletedCount++;
      }
    }
    console.log("Updated in-progress to completed:", inProgressCompletedCount);
    
    // Update confirmed bookings that have passed to 'completed' (if no explicit completion)
    const completedResult = await BookingModel.updateMany(
      { 
        status: { $in: ['confirmed', 'upcoming'] },
        dateAndTime: { $lt: oneHourAgo },
        sessionEndedAt: { $exists: false }
      },
      { 
        status: 'completed',
        sessionEndedAt: new Date()
      }
    );
    console.log("Updated past confirmed to completed:", completedResult.modifiedCount);
    
    // Update confirmed bookings to 'upcoming' when they're within 24 hours
    const upcomingResult = await BookingModel.updateMany(
      { 
        status: 'confirmed',
        dateAndTime: { 
          $gte: oneHourAgo,
          $lte: twentyFourHoursFromNow 
        }
      },
      { status: 'upcoming' }
    );
    console.log("Updated confirmed to upcoming:", upcomingResult.modifiedCount);
    
    console.log("Booking statuses updated successfully");
    return {
      noShowUpdates: noShowResult.modifiedCount,
      completedUpdates: completedResult.modifiedCount,
      upcomingUpdates: upcomingResult.modifiedCount,
      inProgressCompletedUpdates: inProgressCompletedCount
    };
  } catch (error) {
    console.error("Error updating booking statuses:", error);
    throw error;
  }
};

// Reschedule a booking with history tracking
const rescheduleBooking = async (bookingId, updateData) => {
  try {
    console.log("Rescheduling booking:", bookingId, updateData);
    
    // First, get the current booking to store previous dateTime
    const currentBooking = await BookingModel.findById(bookingId);
    if (!currentBooking) {
      return null;
    }

    // Add previous dateTime to reschedule history
    if (updateData.rescheduleHistory) {
      updateData.rescheduleHistory.previousDateTime = currentBooking.dateAndTime;
      
      // If booking already has reschedule history, add to array
      if (currentBooking.rescheduleHistory) {
        updateData.$push = { rescheduleHistory: updateData.rescheduleHistory };
        delete updateData.rescheduleHistory;
      } else {
        updateData.rescheduleHistory = [updateData.rescheduleHistory];
      }
    }
    
    // Extract user/guide filtering from updateData if present
    const { user, guide, ...finalUpdateData } = updateData;
    
    let query = { _id: bookingId };
    if (user) query.user = user;
    if (guide) query.guide = guide;
    
    const booking = await BookingModel.findOneAndUpdate(
      query,
      finalUpdateData,
      { new: true, runValidators: true }
    )
    .populate('service', 'name description duration price')
    .populate('user', 'name email photoUrl profile')
    .populate('guide', 'name email photoUrl profile');
    
    console.log("Rescheduled booking:", booking ? 'found' : 'not found');
    return booking;
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    throw error;
  }
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingById,
  getUsersBooking,
  getGuideBookings,
  categorizeBookings, // Export the helper function for use in other modules
  updateBookingStatuses, // Export the status update function
  rescheduleBooking // Export the reschedule function
};
