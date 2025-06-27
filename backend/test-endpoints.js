// Simple test to check API endpoints without authentication
const axios = require('axios');

const BASE_URL = 'http://localhost:9000/api/v1';

async function testEndpoints() {
  try {
    console.log('🧪 Testing API endpoints availability...\n');

    // Test 1: Check base API endpoint
    console.log('1. Testing base API endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/`);
      console.log('✅ Base API endpoint working:', response.data);
    } catch (error) {
      console.log('❌ Base API test failed:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 2: Check auth endpoints (should return validation errors for empty body)
    console.log('\n2. Testing auth signin endpoint...');
    try {
      const response = await axios.post(`${BASE_URL}/auth/signin`, {});
      console.log('✅ Auth signin endpoint accessible');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Auth signin endpoint working (validation error expected)');
      } else {
        console.log('❌ Auth signin test failed:', error.response?.status, error.response?.data?.message || error.message);
      }
    }

    // Test 3: Check protected endpoints (should return auth errors)
    console.log('\n3. Testing protected payment endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/payment/history`);
      console.log('✅ Payment endpoint accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Payment endpoint working (auth error expected)');
      } else {
        console.log('❌ Payment endpoint test failed:', error.response?.status, error.response?.data?.message || error.message);
      }
    }

    console.log('\n4. Testing protected learning progress endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/learning-progress`);
      console.log('✅ Learning progress endpoint accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Learning progress endpoint working (auth error expected)');
      } else {
        console.log('❌ Learning progress endpoint test failed:', error.response?.status, error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 API endpoint testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function checkServer() {
  try {
    await axios.get(`${BASE_URL.split('/api')[0]}`);
    console.log('✅ Server is running on port 9000');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testEndpoints();
  }
}

main();
