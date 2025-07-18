// backend/services/availability.service.js

const AvailabilityModel = require("../models/availability.model");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");
const moment = require("moment");
const BookingModel = require("../models/booking.model");

const createAvailability = async (userId, availabilityData) => {
  return await AvailabilityModel.create({
    userId,
    ...availabilityData,
  });
};

const updateAvailability = async (userId, availabilityData) => {
  try {
    const availability = await AvailabilityModel.findOneAndUpdate(
      { userId },
      availabilityData,
      { new: true, runValidators: true }
    );
    if (!availability) {
      throw new ApiError(httpStatus.notFound, "Availability not found");
    }
    return availability;
  } catch (error) {
    throw new ApiError(httpStatus.badRequest, "Error updating availability");
  }
};

const getAvailability = async (userId) => {
  return await AvailabilityModel.findOne({ userId });
};

const getGuideAvailabilityForNext14Days = async (userId, durationInMinutes) => {
  try {
    console.log(`Fetching availability for guide: ${userId}, duration: ${durationInMinutes}`);
    
    // Fetch the guide's availability by userId
    const guideAvailability = await AvailabilityModel.findOne({ userId });

    if (!guideAvailability) {
      console.log(`No availability found for guide: ${userId}`);
      // Return empty array instead of throwing error for guides without availability
      return [];
    }

    console.log(`Found availability for guide: ${userId}`, {
      hasWeeklyAvailability: !!guideAvailability.weeklyAvailability,
      unavailableDatesCount: guideAvailability.unavailableDates?.length || 0
    });

    const { weeklyAvailability, unavailableDates } = guideAvailability;
    
    // Validate weeklyAvailability exists and is an object
    if (!weeklyAvailability || typeof weeklyAvailability !== 'object') {
      console.log(`Invalid weeklyAvailability for guide: ${userId}`);
      return [];
    }
    
    const unavailableDateSet = new Set(
      (unavailableDates || []).map((date) => moment(date).format("YYYY-MM-DD"))
    );

    // Function to break down time slots into smaller durations with full date-time
    const getSlots = (currentDate, startTime, endTime, duration) => {
      const start = moment(`${currentDate}T${startTime}`);
      const end = moment(`${currentDate}T${endTime}`);
      const slots = [];
      while (start < end) {
        const slotEnd = moment(start).add(duration, "minutes");
        if (slotEnd > end) break;
        slots.push({
          startTime: start.format("HH:mm"),
          endTime: slotEnd.format("HH:mm"),
          fullStart: start.toISOString(),
          fullEnd: slotEnd.toISOString(),
        });
        start.add(duration, "minutes");
      }
      return slots;
    };

    // Get all bookings for the next 14 days for the guide
    const bookings = await BookingModel.find({
      guide: userId,
      dateAndTime: {
        $gte: moment().startOf("day").toDate(),
        $lte: moment().add(14, "days").endOf("day").toDate(),
      },
    });

    const bookedSlots = new Set(
      bookings.map((booking) => moment(booking.dateAndTime).toISOString())
    );

    // Generate availability for the next 14 days
    const next14DaysAvailability = [];
    for (let i = 0; i < 14; i++) {
      const currentDate = moment().add(i, "days").format("YYYY-MM-DD");
      const dayOfWeek = moment(currentDate).format("dddd").toLowerCase();

      // Skip if the date is marked as unavailable
      if (unavailableDateSet.has(currentDate)) {
        continue;
      }

      // Get the guide's availability for that day of the week
      const dailyAvailability = weeklyAvailability[dayOfWeek] || [];
      const slotsForDay = [];

      if (dailyAvailability.length === 0) {
        console.log(`No availability for ${dayOfWeek} (${currentDate})`);
        continue;
      }

      dailyAvailability.forEach((slot) => {
        const slots = getSlots(
          currentDate,
          slot.startTime,
          slot.endTime,
          durationInMinutes
        );

        // Exclude slots that are already booked
        const availableSlots = slots.filter(
          (slot) => !bookedSlots.has(slot.fullStart)
        );

        slotsForDay.push(...availableSlots);
      });

      if (slotsForDay.length > 0) {
        next14DaysAvailability.push({
          date: currentDate,
          slots: slotsForDay,
        });
      }
    }

    console.log(`Generated ${next14DaysAvailability.length} days of availability for guide: ${userId}`);
    return next14DaysAvailability;
  } catch (error) {
    console.error("Error fetching guide availability:", error);
    throw new ApiError(
      httpStatus.internalServerError, 
      "Error retrieving guide availability."
    );
  }
};

module.exports = {
  createAvailability,
  updateAvailability,
  getAvailability,
  getGuideAvailabilityForNext14Days,
};
