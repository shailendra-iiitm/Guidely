// backend/services/service.service.js

const ServiceModel = require("../models/service.model");

const createService = async (serviceData) => {
  return await ServiceModel.create(serviceData);
};

const updateService = async (serviceId, guideId, updateData) => {
  return await ServiceModel.findOneAndUpdate(
    { _id: serviceId, guide: guideId },
    updateData,
    { new: true, runValidators: true }
  );
};

const getServiceByGuide = async (guideId) => {
  return await ServiceModel.find({ guide: guideId });
};

const getServiceById = async (serviceId) => {
  try {
    console.log("Fetching service by ID:", serviceId);
    const service = await ServiceModel.findById(serviceId).populate('guide', 'name email');
    console.log("Retrieved service:", service);
    return service;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    throw error;
  }
};

module.exports = {
  createService,
  updateService,
  getServiceByGuide,
  getServiceById,
};
