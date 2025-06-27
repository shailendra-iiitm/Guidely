// backend/services/guide.service.js

const ServiceModel = require("../models/service.model");
const UserModel = require("../models/user.model");
const BookingModel = require("../models/booking.model");

const getAllGuides = async () => {
  const guides = await UserModel.find({ role: "guide" }).lean();
  
  // Calculate real metrics for each guide
  const guidesWithMetrics = await Promise.all(
    guides.map(async (guide) => {
      // Get guide's services to calculate pricing
      const services = await ServiceModel.find({ guide: guide._id, active: true }).lean();
      
      // Get guide's bookings to calculate sessions and rating
      const bookings = await BookingModel.find({ 
        guide: guide._id, 
        status: "completed" // Changed from "confirmed" to "completed"
      }).lean();
      
      // Calculate metrics
      const totalSessions = bookings.length;
      // Use the rating from user profile instead of calculating from bookings
      const averageRating = guide.profile?.rating?.average || null;
      const ratingCount = guide.profile?.rating?.count || 0;
      const hourlyRate = calculateHourlyRate(services);
      const skills = guide.profile?.tags || [];
      const availability = await checkAvailability(guide._id); // TODO: implement based on availability system
      
      return {
        ...guide,
        totalSessions,
        averageRating,
        ratingCount, // Add rating count for display
        hourlyRate,
        skills,
        availability,
        servicesCount: services.length,
        services: services
      };
    })
  );
  
  return guidesWithMetrics;
};

const getGuideById = async (id) => {
  const guide = await UserModel.findOne({ _id: id, role: "guide" }).lean();
  if (!guide) return null;
  
  return await enrichGuideWithMetrics(guide);
};

const getGuideByUsername = async (username) => {
  const guide = await UserModel.findOne({ username, role: "guide" }).lean();
  if (!guide) return null;
  
  return await enrichGuideWithMetrics(guide);
};

const getGuideServices = async (id) => {
  return await ServiceModel.find({ guide: id, active: true });
};

// Helper function to enrich guide with calculated metrics
const enrichGuideWithMetrics = async (guide) => {
  const services = await ServiceModel.find({ guide: guide._id, active: true }).lean();
  const bookings = await BookingModel.find({ 
    guide: guide._id, 
    status: "completed" // Changed from "confirmed" to "completed" to count actual sessions
  }).lean();
  
  const totalSessions = bookings.length;
  // Use the rating from user profile instead of calculating from bookings
  const averageRating = guide.profile?.rating?.average || null;
  const ratingCount = guide.profile?.rating?.count || 0;
  const hourlyRate = calculateHourlyRate(services);
  const skills = guide.profile?.tags || [];
  const availability = await checkAvailability(guide._id);
  
  return {
    ...guide,
    totalSessions,
    averageRating,
    ratingCount, // Add rating count for display
    hourlyRate,
    skills,
    availability,
    servicesCount: services.length,
    services: services
  };
};

// Helper function to calculate average hourly rate from services
const calculateHourlyRate = (services) => {
  if (services.length === 0) return 0;
  
  // Calculate average price per hour (assuming service duration is in minutes)
  const totalHourlyRates = services.reduce((sum, service) => {
    const hourlyRate = (service.price / service.duration) * 60; // Convert to hourly rate
    return sum + hourlyRate;
  }, 0);
  
  return Math.round(totalHourlyRates / services.length);
};

// Helper function to calculate average rating (placeholder for future review system)
const calculateAverageRating = (bookings) => {
  // TODO: Implement when review/rating system is added to bookings
  // For now, return null to indicate no rating data available
  return null;
};

// Helper function to check guide availability (placeholder)
const checkAvailability = async (guideId) => {
  // TODO: Implement based on your availability system
  // For now, return "Available" as default
  return "Available";
};

module.exports = {
  getAllGuides,
  getGuideById,
  getGuideByUsername,
  getGuideServices,
};
