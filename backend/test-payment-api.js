// Test script for payment API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:9000/api/v1';

// Test user credentials (adjust based on your test data)
const testCredentials = {
  learner: {
    email: 'learner@test.com',
    password: 'test123'
  },
  guide: {
    email: 'guide@test.com', 
    password: 'test123'
  }
};

async function testPaymentAPI() {
  try {
    console.log('🧪 Testing Payment API endpoints...\n');

    // Test 1: Test payment history endpoint
    console.log('1. Testing Payment History endpoint...');
    try {
      // First login to get token (using existing test user)
      const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
        email: 'learner@test.com',
        password: 'test123'
      });
      
      const token = loginResponse.data.data.tokens.access.token;
      console.log('✅ Login successful');

      // Test payment history
      const historyResponse = await axios.get(`${BASE_URL}/payment/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Payment history retrieved:', historyResponse.data.data.length, 'records');
      
    } catch (error) {
      console.log('❌ Payment history test failed:', error.response?.data?.message || error.message);
    }

    // Test 2: Test payment stats endpoint
    console.log('\n2. Testing Payment Stats endpoint...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
        email: 'learner@test.com',
        password: 'test123'
      });
      
      const token = loginResponse.data.data.tokens.access.token;

      const statsResponse = await axios.get(`${BASE_URL}/payment/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Payment stats retrieved:', statsResponse.data.data);
      
    } catch (error) {
      console.log('❌ Payment stats test failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Test learning progress endpoint  
    console.log('\n3. Testing Learning Progress endpoint...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
        email: 'learner@test.com',
        password: 'test123'
      });
      
      const token = loginResponse.data.data.tokens.access.token;

      const progressResponse = await axios.get(`${BASE_URL}/learning-progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Learning progress retrieved:', Object.keys(progressResponse.data.data));
      
    } catch (error) {
      console.log('❌ Learning progress test failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Payment API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first with: npm start');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testPaymentAPI();
  }
}

main();
