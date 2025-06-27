// backend/routes/v1/payment.route.js

const express = require("express");
const auth = require("../../middleware/auth");
const asyncHandler = require("../../helper/asyncHandler");
const paymentController = require("../../controllers/payment.controller");

const router = express.Router();

// Get payment history for current user
router.get(
  "/history",
  auth.protect,
  asyncHandler(paymentController.getPaymentHistory)
);

// Get earnings for guides
router.get(
  "/earnings",
  auth.protect,
  auth.restrictTo("guide"),
  asyncHandler(paymentController.getEarnings)
);

// Get payment statistics
router.get(
  "/stats",
  auth.protect,
  asyncHandler(paymentController.getPaymentStats)
);

// Get payment by ID
router.get(
  "/:paymentId",
  auth.protect,
  asyncHandler(paymentController.getPaymentById)
);

module.exports = router;
