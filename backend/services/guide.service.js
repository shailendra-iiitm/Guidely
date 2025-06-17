// backend/services/guide.service.js

const ServiceModel = require("../models/service.model");
const UserModel = require("../models/user.model");

const getAllGuides = async () => {
  return await UserModel.find({ role: "guide" });
};

const getGuideById = async (id) => {
  return await UserModel.findOne({ _id: id, role: "guide" });
};

const getGuideByUsername = async (username) => {
  return await UserModel.findOne({ username, role: "guide" });
};

const getGuideServices = async (id) => {
  return await ServiceModel.find({ guide: id, active: true });
};

module.exports = {
  getAllGuides,
  getGuideById,
  getGuideByUsername,
  getGuideServices,
};
