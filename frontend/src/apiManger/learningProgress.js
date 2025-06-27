// frontend/src/apiManger/learningProgress.js

import AxiosInstance from ".";

// Get learning progress for current user
const getLearningProgress = async () => {
  return await AxiosInstance.get("/learning-progress");
};

// Get learning progress for a specific user (admin use)
const getUserLearningProgress = async (userId) => {
  return await AxiosInstance.get(`/learning-progress/${userId}`);
};

export default {
  getLearningProgress,
  getUserLearningProgress
};
