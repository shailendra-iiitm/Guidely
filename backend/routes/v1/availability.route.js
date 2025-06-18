// backend/routes/v1/availability.route.js

const express = require("express");
const {
  createAvailabilityValidation,
} = require("../../validations/availability.validation");
const availabilityController = require("../../controllers/availability.controller");
const asyncHandler = require("../../helper/asyncHandler");
const validate = require("../../middleware/validate");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("guide"),
  validate(createAvailabilityValidation),
  asyncHandler(availabilityController.createAvailability)
);

router.get(
  "/",
  authMiddleware.protect,
  authMiddleware.restrictTo("guide"),
  asyncHandler(availabilityController.getAvailability)
);

router.get(
  "/:guideId",
  authMiddleware.protect,
  asyncHandler(availabilityController.getNext14DaysAvailability)
);

module.exports = router;
