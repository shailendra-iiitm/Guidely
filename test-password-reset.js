const axios = require('axios');

const BASE_URL = 'http://localhost:9000/api/v1';
const TEST_EMAIL = 'abhay-shukla@example.com';
const NEW_PASSWORD = 'newTestPassword123';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
    log(`\n🔄 STEP ${step}: ${message}`, 'blue');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message,
            status: error.response?.status 
        };
    }
}

// Function to get OTP from database (for testing purposes)
async function getLatestOTP(email) {
    const { exec } = require('child_process');
    return new Promise((resolve) => {
        const command = `node -e "const OtpModel = require('./models/otp.model.js'); require('./config/db.js'); setTimeout(async () => { const otp = await OtpModel.findOne({email: '${email}', type: 'password_reset', used: false}).sort({createdAt: -1}); console.log(otp ? otp.otp : 'NONE'); process.exit(); }, 1000);"`;
        
        exec(command, { cwd: './backend' }, (error, stdout) => {
            if (error) {
                resolve(null);
            } else {
                const otp = stdout.trim().split('\n').pop();
                resolve(otp === 'NONE' ? null : otp);
            }
        });
    });
}

async function testCompletePasswordResetFlow() {
    log('🚀 Starting Complete Password Reset Flow Test', 'blue');
    log('='.repeat(60), 'blue');
    
    try {
        // Step 1: Request OTP
        logStep(1, 'Requesting Password Reset OTP');
        const forgotResponse = await makeRequest('POST', '/auth/forgot-password', {
            email: TEST_EMAIL
        });
        
        if (!forgotResponse.success) {
            logError(`Failed to request OTP: ${JSON.stringify(forgotResponse.error)}`);
            return false;
        }
        
        logSuccess('OTP request sent successfully');
        log(`Response: ${JSON.stringify(forgotResponse.data)}`);
        
        // Step 2: Get OTP from database
        logStep(2, 'Retrieving OTP from Database');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        const otp = await getLatestOTP(TEST_EMAIL);
        if (!otp) {
            logError('Failed to retrieve OTP from database');
            return false;
        }
        
        logSuccess(`OTP retrieved: ${otp}`);
        
        // Step 3: Verify OTP
        logStep(3, 'Verifying OTP');
        const verifyResponse = await makeRequest('POST', '/auth/verify-reset-otp', {
            email: TEST_EMAIL,
            otp: otp
        });
        
        if (!verifyResponse.success) {
            logError(`OTP verification failed: ${JSON.stringify(verifyResponse.error)}`);
            return false;
        }
        
        logSuccess('OTP verified successfully');
        log(`Response: ${JSON.stringify(verifyResponse.data)}`);
        
        // Step 4: Reset Password
        logStep(4, 'Resetting Password');
        const resetResponse = await makeRequest('POST', '/auth/reset-password', {
            email: TEST_EMAIL,
            otp: otp,
            newPassword: NEW_PASSWORD
        });
        
        if (!resetResponse.success) {
            logError(`Password reset failed: ${JSON.stringify(resetResponse.error)}`);
            return false;
        }
        
        logSuccess('Password reset successfully');
        log(`Response: ${JSON.stringify(resetResponse.data)}`);
        
        // Step 5: Test Login with New Password
        logStep(5, 'Testing Login with New Password');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const loginResponse = await makeRequest('POST', '/auth/signin', {
            email: TEST_EMAIL,
            password: NEW_PASSWORD
        });
        
        if (!loginResponse.success) {
            logError(`Login failed: ${JSON.stringify(loginResponse.error)}`);
            return false;
        }
        
        logSuccess('Login successful with new password!');
        log(`User: ${loginResponse.data.user?.name} (${loginResponse.data.user?.role})`);
        log(`Token: ${loginResponse.data.token?.substring(0, 50)}...`);
        
        return true;
        
    } catch (error) {
        logError(`Unexpected error: ${error.message}`);
        return false;
    }
}

async function testLoginWithOldPassword() {
    logStep('EXTRA', 'Testing Login with Old Password (Should Fail)');
    
    const oldPasswords = ['learnerPass123', 'testPassword123', 'finalPassword123', 'testingMiddleware123'];
    
    for (const oldPassword of oldPasswords) {
        log(`\nTrying old password: ${oldPassword}`, 'yellow');
        const loginResponse = await makeRequest('POST', '/auth/signin', {
            email: TEST_EMAIL,
            password: oldPassword
        });
        
        if (loginResponse.success) {
            logWarning(`Unexpected: Login succeeded with old password: ${oldPassword}`);
        } else {
            logSuccess(`Correctly rejected old password: ${oldPassword}`);
        }
    }
}

async function main() {
    log('🔐 Password Reset & Login Test Script', 'blue');
    log('=' .repeat(60), 'blue');
    log(`Test Email: ${TEST_EMAIL}`, 'yellow');
    log(`New Password: ${NEW_PASSWORD}`, 'yellow');
    log('=' .repeat(60), 'blue');
    
    // Test complete flow
    const success = await testCompletePasswordResetFlow();
    
    if (success) {
        log('\n🎉 ALL TESTS PASSED! Password reset and login working correctly.', 'green');
        
        // Test old passwords
        await testLoginWithOldPassword();
        
    } else {
        log('\n💥 TEST FAILED! There are issues with the password reset flow.', 'red');
    }
    
    log('\n' + '='.repeat(60), 'blue');
    log('Test completed.', 'blue');
}

// Run the test
main().catch(error => {
    logError(`Script error: ${error.message}`);
    process.exit(1);
});