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

// Get a guide's public info & services by username
const getGuideInfoByUsername = async (req, res, next) => {
  const { username } = req.params;

  const guide = await guideService.getGuideByUsername(username);

  if (!guide) {
    return next(new ApiError(httpStatus.notFound, "Guide not found"));
  }

  const services = await guideService.getGuideServices(guide._id);

  res.status(httpStatus.ok).json({
    success: true,
    guide,
    services,
  });
};
// Export the controller functions
module.exports = {
  getAllGuides,
    getGuideInfoByUsername,
};
