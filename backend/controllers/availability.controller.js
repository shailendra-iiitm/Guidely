// backend/controllers/availability.controller.js

const ApiError = require("../helper/apiError");
const availabilityService = require("../services/availability.service");
const httpStatus = require("../util/httpStatus");

const createAvailability = async (req, res, next) => {
  const userId = req.user._id; // guide's user id
  const availabilityData = req.body;

  const existingAvailability = await availabilityService.getAvailability(userId);

  if (existingAvailability) {
    return next(
      new ApiError(httpStatus.badRequest, "Availability already exists")
    );
  }

  const availability = await availabilityService.createAvailability(
    userId,
    availabilityData
  );

  res.status(httpStatus.created).json({
    success: true,
    message: "Availability created successfully",
    availability,
  });
};

const getAvailability = async (req, res, next) => {
  const userId = req.user._id;

  const availability = await availabilityService.getAvailability(userId);

  if (!availability) {
    return next(new ApiError(httpStatus.notFound, "Availability not found"));
  }

  res.status(httpStatus.ok).json({
    success: true,
    availability,
  });
};

const getNext14DaysAvailability = async (req, res, next) => {
  try {
    const guideId = req.params.guideId;
    const durationInMinutes = req.query.duration || req.query.durationInMinutes || 30;

    console.log("Getting availability for guideId:", guideId);
    console.log("Duration:", durationInMinutes);

    // Validate guideId
    if (!guideId) {
      return next(new ApiError(httpStatus.badRequest, "Guide ID is required"));
    }

    // Validate duration
    if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
      return next(new ApiError(httpStatus.badRequest, "Invalid duration"));
    }

    const availability = await availabilityService.getGuideAvailabilityForNext14Days(
      guideId,
      parseInt(durationInMinutes)
    );

    console.log("Retrieved availability:", availability);

    res.status(httpStatus.ok).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("Error in getNext14DaysAvailability:", error);
    return next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id; // guide's user id
    const availabilityData = req.body;

    const availability = await availabilityService.updateAvailability(
      userId,
      availabilityData
    );

    res.status(httpStatus.ok).json({
      success: true,
      message: "Availability updated successfully",
      availability,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAvailability,
  getAvailability,
  updateAvailability,
  getNext14DaysAvailability,
};
