const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:9000") + "/api/v1";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Debug: log key environment variables
console.log('Environment:', import.meta.env.MODE);
console.log('BASE_URL:', BASE_URL);
console.log('RAZORPAY_KEY_ID available:', !!RAZORPAY_KEY_ID);

export { BASE_URL, RAZORPAY_KEY_ID };
