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

// Guide updates a service they own
const updateService = async (req, res, next) => {
  const serviceId = req.params.serviceId;
  const guideId = req.user._id;
  const { name, description, duration, price, active } = req.body;

  const updatedService = await serviceService.updateService(
    serviceId,
    guideId,
    { name, description, duration, price, active }
  );

  if (!updatedService) {
    throw new ApiError(
      httpStatus.notFound,
      "Service not found or you don't have permission to update it"
    );
  }

  res.status(httpStatus.ok).json({
    success: true,
    message: "Service updated successfully",
    service: updatedService,
  });
};





module.exports = {
  createService,
    updateService,
};
