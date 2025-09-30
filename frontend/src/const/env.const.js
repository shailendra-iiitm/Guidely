// Environment configuration
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Set API URL based on environment
let apiUrl;
if (import.meta.env.VITE_API_URL) {
  apiUrl = import.meta.env.VITE_API_URL;
} else if (isDevelopment) {
  apiUrl = "http://localhost:9000";
} else {
  apiUrl = "https://guidely-backend.onrender.com";
}

const BASE_URL = apiUrl + "/api/v1";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Debug: log key environment variables
console.log('🌍 Environment Mode:', import.meta.env.MODE);
console.log('🔗 API Base URL:', BASE_URL);
console.log('💳 Razorpay Key Available:', !!RAZORPAY_KEY_ID);
console.log('⚙️ Using Environment File:', import.meta.env.VITE_API_URL ? 'Custom' : 'Default');

if (isDevelopment) {
  console.log('🔧 Development Mode: Using local backend');
} else if (isProduction) {
  console.log('🚀 Production Mode: Using remote backend');
}

export { BASE_URL, RAZORPAY_KEY_ID };
