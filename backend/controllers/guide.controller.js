// backend/controllers/guide.controller.js

const guideService = require("../services/guide.service");
const ApiError = require("../helper/apiError");

// List all guides (for learners to browse)
const getAllGuides = async (req, res, next) => {
  try {
    const guides = await guideService.getAllGuides();
    res.status(200).json({
      success: true,
      guides,
    });
  } catch (error) {
    console.error("Error in getAllGuides:", error);
    next(error);
  }
};

// Get a guide's public info & services by username
const getGuideInfoByUsername = async (req, res, next) => {
  const { username } = req.params;

  const guide = await guideService.getGuideByUsername(username);

  if (!guide) {
    return next(new ApiError(404, "Guide not found"));
  }

  const services = await guideService.getGuideServices(guide._id);

  res.status(200).json({
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
