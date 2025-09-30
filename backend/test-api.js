const axios = require('axios');

async function testSupportTicketAPI() {
  try {
    // First, let's try to access the API without authentication to see what happens
    console.log('Testing support ticket API...');
    
    try {
      const response = await axios.get('http://localhost:9000/api/v1/support-tickets');
      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('Error response status:', error.response?.status);
      console.log('Error response data:', JSON.stringify(error.response?.data, null, 2));
      console.log('Error message:', error.message);
    }

    // Now let's try the stats endpoint
    console.log('\nTesting support ticket stats API...');
    
    try {
      const statsResponse = await axios.get('http://localhost:9000/api/v1/support-tickets/admin/stats');
      console.log('Stats response status:', statsResponse.status);
      console.log('Stats response data:', JSON.stringify(statsResponse.data, null, 2));
    } catch (error) {
      console.log('Stats error response status:', error.response?.status);
      console.log('Stats error response data:', JSON.stringify(error.response?.data, null, 2));
      console.log('Stats error message:', error.message);
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testSupportTicketAPI();