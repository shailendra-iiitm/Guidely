const BASE_URL = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Debug: log environment variables (updated for redeployment)
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('BASE_URL being used:', BASE_URL);
console.log('Environment:', import.meta.env.MODE);

export { BASE_URL, RAZORPAY_KEY_ID };
