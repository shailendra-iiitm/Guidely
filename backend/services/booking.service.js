// backend/services/booking.service.js

const BookingModel = require("../models/booking.model");

const createBooking = async (bookingData) => {
  return await BookingModel.create(bookingData);
};

const getBookingById = async (bookingId) => {
  return await BookingModel.findById(bookingId)
    .populate("service")
    .populate("user");
};

const updateBookingById = async (bookingId, bookingData) => {
  return await BookingModel.findByIdAndUpdate(bookingId, bookingData, {
    new: true,
  });
};

const getUsersBooking = async (userId) => {
  return await BookingModel.find({ user: userId });
};

const getGuideBookings = async (guideId) => {
  return await BookingModel.find({ guide: guideId });
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingById,
  getUsersBooking,
  getGuideBookings,
};
