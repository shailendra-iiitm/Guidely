// backend/scripts/test-booking-features.js
// Test script for all booking system features

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/v1';
const GUIDE_TOKEN = 'your_guide_jwt_token_here';
const LEARNER_TOKEN = 'your_learner_jwt_token_here';

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null, token) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
};

// Test scenarios
const testBookingFeatures = async () => {
  console.log('🧪 Testing Booking System Features\n');
  
  // Test 1: Get learner bookings
  console.log('1. Testing learner bookings fetch...');
  const learnerBookings = await makeRequest('GET', '/booking', null, LEARNER_TOKEN);
  if (learnerBookings) {
    console.log('✅ Learner bookings:', learnerBookings.stats);
  }
  
  // Test 2: Get guide bookings
  console.log('\n2. Testing guide bookings fetch...');
  const guideBookings = await makeRequest('GET', '/booking/guide', null, GUIDE_TOKEN);
  if (guideBookings) {
    console.log('✅ Guide bookings:', guideBookings.stats);
  }
  
  // Get a sample booking ID for testing (use first pending booking)
  let testBookingId = null;
  if (guideBookings && guideBookings.categorized.pending.length > 0) {
    testBookingId = guideBookings.categorized.pending[0]._id;
    console.log('📝 Using booking ID for testing:', testBookingId);
  }
  
  if (!testBookingId) {
    console.log('❌ No pending bookings found for testing. Please create a booking first.');
    return;
  }
  
  // Test 3: Confirm booking (Guide)
  console.log('\n3. Testing booking confirmation...');
  const confirmResult = await makeRequest('PUT', '/booking/confirm', {
    bookingId: testBookingId,
    meetingLink: 'https://zoom.us/j/123456789'
  }, GUIDE_TOKEN);
  if (confirmResult) {
    console.log('✅ Booking confirmed successfully');
  }
  
  // Test 4: Update meeting link (Guide)
  console.log('\n4. Testing meeting link update...');
  const linkResult = await makeRequest('PUT', '/booking/meeting-link', {
    bookingId: testBookingId,
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  }, GUIDE_TOKEN);
  if (linkResult) {
    console.log('✅ Meeting link updated successfully');
  }
  
  // Test 5: Get booking details
  console.log('\n5. Testing booking details fetch...');
  const bookingDetails = await makeRequest('GET', `/booking/${testBookingId}`, null, GUIDE_TOKEN);
  if (bookingDetails) {
    console.log('✅ Booking details fetched successfully');
    console.log('   Status:', bookingDetails.booking.status);
    console.log('   Meeting Link:', bookingDetails.booking.meetingLink);
  }
  
  // Test 6: Start session
  console.log('\n6. Testing session start...');
  const startResult = await makeRequest('PUT', '/booking/start', {
    bookingId: testBookingId
  }, GUIDE_TOKEN);
  if (startResult) {
    console.log('✅ Session started successfully');
  }
  
  // Test 7: Complete session (Guide)
  console.log('\n7. Testing session completion...');
  const completeResult = await makeRequest('PUT', '/booking/complete', {
    bookingId: testBookingId,
    sessionNotes: 'Excellent session! Student showed great progress.',
    achievements: [
      {
        title: 'Problem Solver',
        description: 'Successfully solved complex problems'
      }
    ]
  }, GUIDE_TOKEN);
  if (completeResult) {
    console.log('✅ Session completed successfully');
  }
  
  // Test 8: Rate session (Learner)
  console.log('\n8. Testing session rating...');
  const rateResult = await makeRequest('PUT', '/booking/rate', {
    bookingId: testBookingId,
    rating: 5,
    comment: 'Amazing session! Very helpful and informative.'
  }, LEARNER_TOKEN);
  if (rateResult) {
    console.log('✅ Session rated successfully');
  }
  
  // Test 9: Add feedback (Learner)
  console.log('\n9. Testing feedback addition...');
  const feedbackResult = await makeRequest('PUT', '/booking/feedback', {
    bookingId: testBookingId,
    feedback: 'The guide was very patient and explained concepts clearly.',
    suggestions: 'Maybe provide more real-world examples in future sessions.',
    highlights: 'Loved the interactive coding session and personalized approach.'
  }, LEARNER_TOKEN);
  if (feedbackResult) {
    console.log('✅ Feedback added successfully');
  }
  
  // Test 10: Update booking statuses
  console.log('\n10. Testing status update...');
  const statusResult = await makeRequest('PUT', '/booking/update-statuses', null, GUIDE_TOKEN);
  if (statusResult) {
    console.log('✅ Booking statuses updated successfully');
  }
  
  // Test 11: Reschedule booking (create a new booking for this test)
  console.log('\n11. Testing booking reschedule...');
  // Note: This would need a pending booking to reschedule
  const rescheduleResult = await makeRequest('PUT', '/booking/reschedule', {
    bookingId: 'another_booking_id', // Replace with actual ID
    newDateTime: '2025-07-10T14:00:00.000Z',
    reason: 'Schedule conflict resolved'
  }, GUIDE_TOKEN);
  if (rescheduleResult) {
    console.log('✅ Booking rescheduled successfully');
  } else {
    console.log('ℹ️ Reschedule test skipped (need valid booking ID)');
  }
  
  // Test 12: Cancel booking
  console.log('\n12. Testing booking cancellation...');
  const cancelResult = await makeRequest('PUT', '/booking/cancel', {
    bookingId: 'another_booking_id', // Replace with actual ID
    reason: 'Personal emergency'
  }, GUIDE_TOKEN);
  if (cancelResult) {
    console.log('✅ Booking cancelled successfully');
  } else {
    console.log('ℹ️ Cancel test skipped (need valid booking ID)');
  }
  
  console.log('\n🎉 Booking system testing completed!');
  console.log('\n📊 Final booking stats:');
  
  // Get final stats
  const finalStats = await makeRequest('GET', '/booking', null, LEARNER_TOKEN);
  if (finalStats) {
    console.log('   Total bookings:', finalStats.stats.total);
    console.log('   Upcoming:', finalStats.stats.upcoming);
    console.log('   In Progress:', finalStats.stats.inProgress);
    console.log('   Completed:', finalStats.stats.completed);
    console.log('   Cancelled:', finalStats.stats.cancelled);
    console.log('   Pending:', finalStats.stats.pending);
  }
};

// Run tests
if (require.main === module) {
  console.log('Please update GUIDE_TOKEN and LEARNER_TOKEN before running tests');
  console.log('Run: node scripts/test-booking-features.js');
  
  // Uncomment the line below after updating tokens
  // testBookingFeatures().catch(console.error);
}

module.exports = { testBookingFeatures, makeRequest };
