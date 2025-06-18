// backend/routes/v1/guide.route.js

const express = require("express");
const guideController = require("../../controllers/guide.controller");
const asyncHandler = require("../../helper/asyncHandler");

const router = express.Router();

// Get guide by username (public profile + services)
router.get("/:username", asyncHandler(guideController.getGuideInfoByUsername));

// Get all guides
router.get("/", asyncHandler(guideController.getAllGuides));

module.exports = router;
