// backend/routes/v1/booking.route.js

const express = require("express");
const bookingController = require("../../controllers/booking.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const auth = require("../../middleware/auth");
const {
  initiateBookingValidation,
  updateMeetingLinkValidation,
  markCompleteValidation,
  rateSessionValidation,
  startSessionValidation,
  confirmBookingValidation,
  rescheduleBookingValidation,
  cancelBookingValidation,
  feedbackValidation,
} = require("../../validations/booking.validation");

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Booking routes are working",
    timestamp: new Date().toISOString()
  });
});

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

// Update meeting link (guides only)
router.put(
  "/meeting-link",
  validate(updateMeetingLinkValidation),
  auth.protect,
  auth.restrictTo("guide"),
  asyncHandler(bookingController.updateMeetingLink)
);

// Mark session as complete (guides only)
router.put(
  "/complete",
  validate(markCompleteValidation),
  auth.protect,
  auth.restrictTo("guide"),
  asyncHandler(bookingController.markSessionComplete)
);

// Rate a session (learners only)
router.put(
  "/rate",
  validate(rateSessionValidation),
  auth.protect,
  auth.restrictTo("learner"),
  asyncHandler(bookingController.rateSession)
);

// Start a session (both guide and learner)
router.put(
  "/start",
  validate(startSessionValidation),
  auth.protect,
  asyncHandler(bookingController.startSession)
);

// Get booking details
router.get("/:bookingId", auth.protect, asyncHandler(bookingController.getBookingDetails));

// Guide actions
router.put(
  "/confirm",
  validate(confirmBookingValidation),
  auth.protect,
  auth.restrictTo("guide"),
  asyncHandler(bookingController.confirmBooking)
);

router.put(
  "/reschedule",
  validate(rescheduleBookingValidation),
  auth.protect,
  auth.restrictTo("guide"),
  asyncHandler(bookingController.rescheduleBooking)
);

router.put(
  "/cancel",
  validate(cancelBookingValidation),
  auth.protect,
  asyncHandler(bookingController.cancelBooking)
);

// Learner actions
router.put(
  "/feedback",
  validate(feedbackValidation),
  auth.protect,
  auth.restrictTo("learner"),
  asyncHandler(bookingController.addBookingFeedback)
);

// Update booking statuses (admin or for debugging)
router.put(
  "/update-statuses",
  auth.protect,
  asyncHandler(bookingController.updateBookingStatuses)
);

module.exports = router;
