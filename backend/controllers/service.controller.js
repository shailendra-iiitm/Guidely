// backend/controllers/service.controller.js

const serviceService = require("../services/service.service");
const httpStatus = require("../util/httpStatus");
const ApiError = require("../helper/apiError");

// Guide creates a new service
const createService = async (req, res, next) => {
  const guideId = req.user._id;
  const { name, description, duration, price } = req.body;

  const service = await serviceService.createService({
    guide: guideId,
    name,
    description,
    duration,
    price,
  });

  res.status(httpStatus.created).json({
    success: true,
    message: "Service created successfully",
    service,
  });
};

module.exports = {
  createService
};
