// backend/routes/v1/booking.route.js

const express = require("express");
const bookingController = require("../../controllers/booking.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const {
  initiateBookingValidation,
} = require("../../validations/booking.validation");

const router = express.Router();

router.post(
  "/initiate-booking",
  validate(initiateBookingValidation),
  auth.protect,
  asyncHandler(bookingController.initiateBookingAndPayment)
);

router.get("/", auth.protect, asyncHandler(bookingController.getBookings));

router.get(
  "/guide",
  auth.protect,
  auth.restrictTo("guide"),
  asyncHandler(bookingController.getGuideBookings)
);

module.exports = router;
