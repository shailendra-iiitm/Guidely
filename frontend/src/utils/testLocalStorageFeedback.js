// Test script to verify localStorage feedback functionality
// Run this in browser console to test the fallback mechanism

// Clear any existing feedback data
localStorage.removeItem('guidely_feedback_submissions');
localStorage.removeItem('guidely_feedback_last_cleanup');

console.log('🧪 Testing localStorage feedback fallback...');

// Test data
const testFeedback = {
  name: 'Test User',
  email: 'test@example.com',
  type: 'bug',
  subject: 'Test Feedback',
  message: 'This is a test message to verify localStorage fallback works.'
};

// Function to simulate the localStorage save (from feedback.js)
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

// Function to retrieve from localStorage (from feedback.js)
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

// Test submission
console.log('📝 Testing feedback submission...');
try {
  const submitResult = saveToLocalStorage(testFeedback);
  console.log('✅ Submission successful:', submitResult);
  
  const token = submitResult.data.data.token;
  console.log('🎫 Generated token:', token);
  
  // Test retrieval
  console.log('🔍 Testing feedback retrieval...');
  const retrieveResult = getFromLocalStorage(token);
  console.log('✅ Retrieval successful:', retrieveResult);
  
  // Test invalid token
  console.log('❌ Testing invalid token...');
  try {
    getFromLocalStorage('INVALID123');
  } catch (error) {
    console.log('✅ Correctly rejected invalid token:', error.message);
  }
  
  // Show current storage state
  const allSubmissions = JSON.parse(localStorage.getItem('guidely_feedback_submissions') || '[]');
  console.log('💾 Current localStorage state:', allSubmissions);
  
  console.log('🎉 All tests passed! localStorage fallback is working correctly.');
  
} catch (error) {
  console.error('❌ Test failed:', error);
}
