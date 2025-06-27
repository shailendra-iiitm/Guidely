// backend/controllers/service.controller.js

const serviceService = require("../services/service.service");
const httpStatus = require("../util/httpStatus");
const ApiError = require("../helper/apiError");

// Guide creates a new service
const createService = async (req, res, next) => {
  const guideId = req.user._id;
  const { name, description, duration, price } = req.body;

  console.log("=== CREATE SERVICE ===");
  console.log("Guide ID:", guideId);
  console.log("Service data:", { name, description, duration, price });

  const service = await serviceService.createService({
    guide: guideId,
    name,
    description,
    duration,
    price,
  });

  console.log("Created service:", service);

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


// Get all services by guide
const getServiceByGuide = async (req, res, next) => {
  const guideId = req.user._id;
  
  console.log("=== GET SERVICES BY GUIDE ===");
  console.log("Guide ID:", guideId);

  const services = await serviceService.getServiceByGuide(guideId);
  
  console.log("Found services:", services.length);
  console.log("Services:", services);

  res.status(httpStatus.ok).json({
    success: true,
    services,
  });
};

// Get any service by ID
const getServiceById = async (req, res, next) => {
  const serviceId = req.params.serviceId;
  const service = await serviceService.getServiceById(serviceId);

  res.status(httpStatus.ok).json({
    success: true,
    service,
  });
};




module.exports = {
  createService,
  updateService,
  getServiceByGuide,
  getServiceById,
};
