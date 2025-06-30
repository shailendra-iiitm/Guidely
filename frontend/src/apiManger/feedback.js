// frontend/src/apiManger/feedback.js

import AxiosInstance from ".";
import axios from "axios";

// Fallback URLs for local development
const LOCAL_BASE_URL = "http://localhost:8080/api/v1";
const DEPLOYED_BASE_URL = "https://guidely-backend.onrender.com/api/v1";

// Temporary local storage fallback for feedback
const saveToLocalStorage = (feedbackData) => {
  try {
    const token = 'FB' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const submission = {
      token,
      ...feedbackData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    // Get existing submissions
    const existing = JSON.parse(localStorage.getItem('guidely_feedback_submissions') || '[]');
    existing.push(submission);
    
    // Store with timestamp for cleanup
    localStorage.setItem('guidely_feedback_submissions', JSON.stringify(existing));
    localStorage.setItem('guidely_feedback_last_cleanup', Date.now().toString());
    
    return {
      data: {
        success: true,
        data: {
          token: submission.token,
          status: submission.status,
          submittedAt: submission.submittedAt
        }
      }
    };
  } catch (error) {
    throw new Error('Failed to save feedback locally');
  }
};

// Get feedback from local storage
const getFromLocalStorage = (token) => {
  try {
    const submissions = JSON.parse(localStorage.getItem('guidely_feedback_submissions') || '[]');
    const submission = submissions.find(s => s.token === token);
    
    if (!submission) {
      throw new Error('Feedback not found');
    }
    
    return {
      data: {
        success: true,
        data: {
          token: submission.token,
          type: submission.type,
          subject: submission.subject,
          status: submission.status,
          priority: 'medium',
          submittedAt: submission.submittedAt,
          lastUpdated: submission.timestamp
        }
      }
    };
  } catch (error) {
    throw new Error('Feedback not found or invalid token');
  }
};

// Smart submit with fallback mechanism
const submitFeedback = async (feedbackData) => {
  let lastError;
  
  // First try the main AxiosInstance (respects env config)
  try {
    console.log("Trying primary endpoint...");
    return await AxiosInstance.post("/feedback/submit", feedbackData);
  } catch (primaryError) {
    console.warn("Primary endpoint failed:", primaryError.message);
    lastError = primaryError;
    
    // If running locally and primary fails, try local server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        console.log("Trying local fallback...");
        return await axios.post(`${LOCAL_BASE_URL}/feedback/submit`, feedbackData);
      } catch (localError) {
        console.warn("Local fallback failed:", localError.message);
        lastError = localError;
        
        // Try deployed server
        try {
          console.log("Trying deployed fallback...");
          return await axios.post(`${DEPLOYED_BASE_URL}/feedback/submit`, feedbackData);
        } catch (deployedError) {
          console.warn("Deployed fallback failed:", deployedError.message);
          lastError = deployedError;
        }
      }
    } else {
      // If not local, try deployed server
      try {
        console.log("Trying deployed fallback...");
        return await axios.post(`${DEPLOYED_BASE_URL}/feedback/submit`, feedbackData);
      } catch (deployedError) {
        console.warn("Deployed fallback failed:", deployedError.message);
        lastError = deployedError;
      }
    }
    
    // All network options failed, use localStorage fallback
    try {
      console.log("All network endpoints failed, using local storage fallback...");
      return saveToLocalStorage(feedbackData);
    } catch (storageError) {
      console.error("Even localStorage failed:", storageError.message);
      throw new Error(`All endpoints failed. Last network error: ${lastError.message}. Storage error: ${storageError.message}`);
    }
  }
};

// Smart track with fallback mechanism
const trackFeedback = async (token) => {
  let lastError;
  
  // First try the main AxiosInstance
  try {
    console.log("Trying primary endpoint for tracking...");
    return await AxiosInstance.get(`/feedback/track/${token}`);
  } catch (primaryError) {
    console.warn("Primary tracking endpoint failed:", primaryError.message);
    lastError = primaryError;
    
    // If running locally and primary fails, try local server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        console.log("Trying local fallback for tracking...");
        return await axios.get(`${LOCAL_BASE_URL}/feedback/track/${token}`);
      } catch (localError) {
        console.warn("Local tracking fallback failed:", localError.message);
        lastError = localError;
        
        // Try deployed server
        try {
          console.log("Trying deployed fallback for tracking...");
          return await axios.get(`${DEPLOYED_BASE_URL}/feedback/track/${token}`);
        } catch (deployedError) {
          console.warn("Deployed tracking fallback failed:", deployedError.message);
          lastError = deployedError;
        }
      }
    } else {
      // If not local, try deployed server
      try {
        console.log("Trying deployed fallback for tracking...");
        return await axios.get(`${DEPLOYED_BASE_URL}/feedback/track/${token}`);
      } catch (deployedError) {
        console.warn("Deployed tracking fallback failed:", deployedError.message);
        lastError = deployedError;
      }
    }
    
    // All network options failed, try localStorage
    try {
      console.log("All network endpoints failed, checking local storage...");
      return getFromLocalStorage(token);
    } catch (storageError) {
      console.error("Even localStorage failed:", storageError.message);
      throw new Error(`All endpoints failed. Last network error: ${lastError.message}. Storage error: ${storageError.message}`);
    }
  }
};

// Get feedback statistics with fallback
const getFeedbackStats = async () => {
  try {
    return await AxiosInstance.get("/feedback/stats");
  } catch (primaryError) {
    console.warn("Primary stats endpoint failed:", primaryError.message);
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        return await axios.get(`${LOCAL_BASE_URL}/feedback/stats`);
      } catch (localError) {
        console.warn("Local stats fallback failed:", localError.message);
        try {
          return await axios.get(`${DEPLOYED_BASE_URL}/feedback/stats`);
        } catch (deployedError) {
          // Return local storage stats
          const submissions = JSON.parse(localStorage.getItem('guidely_feedback_submissions') || '[]');
          return {
            data: {
              success: true,
              data: {
                totalFeedbacks: submissions.length,
                pending: submissions.filter(s => s.status === 'pending').length,
                inProgress: 0,
                resolved: 0
              }
            }
          };
        }
      }
    } else {
      try {
        return await axios.get(`${DEPLOYED_BASE_URL}/feedback/stats`);
      } catch (deployedError) {
        // Return basic stats
        return {
          data: {
            success: true,
            data: {
              totalFeedbacks: 0,
              pending: 0,
              inProgress: 0,
              resolved: 0
            }
          }
        };
      }
    }
  }
};

export default {
  submitFeedback,
  trackFeedback,
  getFeedbackStats
};
