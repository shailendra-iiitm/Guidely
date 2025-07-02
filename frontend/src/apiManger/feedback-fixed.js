// frontend/src/apiManger/feedback.js

import AxiosInstance from ".";

// Save feedback to localStorage as fallback
const saveToLocalStorage = (feedbackData) => {
  try {
    const token = 'FB' + Date.now().toString(36).toUpperCase();
    const submission = {
      token,
      ...feedbackData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('guidely_feedback_submissions') || '[]');
    existing.push(submission);
    localStorage.setItem('guidely_feedback_submissions', JSON.stringify(existing));
    
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

// Get feedback from localStorage
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

// Submit feedback with simple fallback
const submitFeedback = async (feedbackData) => {
  try {
    // Try primary endpoint
    console.log("Trying primary endpoint...");
    return await AxiosInstance.post("/feedback/submit", feedbackData);
  } catch (primaryError) {
    console.warn("Primary endpoint failed, using localStorage fallback");
    
    // Use localStorage fallback
    try {
      return saveToLocalStorage(feedbackData);
    } catch (storageError) {
      throw new Error(`Submission failed: ${primaryError.message}`);
    }
  }
};

// Track feedback with simple fallback
const trackFeedback = async (token) => {
  // Check localStorage first for FB tokens
  if (token.startsWith('FB')) {
    try {
      return getFromLocalStorage(token);
    } catch (storageError) {
      throw new Error('Feedback not found in local storage');
    }
  }

  // Try server tracking for other tokens
  try {
    console.log("Trying primary endpoint for tracking...");
    return await AxiosInstance.get(`/feedback/track/${token}`);
  } catch (error) {
    throw new Error('Failed to track feedback from server');
  }
};

// Get basic feedback stats
const getFeedbackStats = async () => {
  try {
    return await AxiosInstance.get("/feedback/stats");
  } catch (error) {
    // Return local stats as fallback
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
};

export default {
  submitFeedback,
  trackFeedback,
  getFeedbackStats
};
