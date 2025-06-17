// backend/controllers/guide.controller.js

const guideService = require("../services/guide.service");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");



// List all guides (for learners to browse)
const getAllGuides = async (req, res, next) => {
  const guides = await guideService.getAllGuides();
  res.status(httpStatus.ok).json({
    success: true,
    guides,
  });
};

module.exports = {
  getAllGuides
};
