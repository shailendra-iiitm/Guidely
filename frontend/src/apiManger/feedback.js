// frontend/src/apiManger/feedback.js

import AxiosInstance from ".";

// Submit feedback
const submitFeedback = async (feedbackData) => {
  return await AxiosInstance.post("/feedback/submit", feedbackData);
};

// Track feedback status by token
const trackFeedback = async (token) => {
  return await AxiosInstance.get(`/feedback/track/${token}`);
};

// Get feedback statistics
const getFeedbackStats = async () => {
  return await AxiosInstance.get("/feedback/stats");
};

export default {
  submitFeedback,
  trackFeedback,
  getFeedbackStats
};
