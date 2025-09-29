const express = require("express");
const guideVerificationController = require("../../controllers/guideVerification.controller");
const asyncHandler = require("../../helper/asyncHandler");
const { protect, adminOnly, guideOnly } = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const validate = require("../../middleware/validate");
const { reviewVerificationValidation } = require("../../validations/guideVerification.validation");

const router = express.Router();

// Guide routes - for guides to upload documents and check status
router.post(
  "/upload-documents",
  protect,
  guideOnly,
  upload.fields([
    { name: 'identity', maxCount: 1 },
    { name: 'qualification', maxCount: 1 },
    { name: 'experience', maxCount: 1 }
  ]),
  asyncHandler(guideVerificationController.uploadDocuments)
);

router.get(
  "/status",
  protect,
  guideOnly,
  asyncHandler(guideVerificationController.getVerificationStatus)
);

// Admin routes - for admins to review verifications
router.get(
  "/pending",
  protect,
  adminOnly,
  asyncHandler(guideVerificationController.getPendingVerifications)
);

router.patch(
  "/review/:guideId",
  protect,
  adminOnly,
  validate(reviewVerificationValidation),
  asyncHandler(guideVerificationController.reviewVerification)
);

// Public route - to get verified guides (for learners)
router.get(
  "/verified-guides",
  asyncHandler(guideVerificationController.getVerifiedGuides)
);

module.exports = router;