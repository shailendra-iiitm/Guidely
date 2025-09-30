// Environment Configuration Checker
// This file helps debug environment setup

console.log('=== ENVIRONMENT CONFIGURATION CHECK ===');
console.log('Mode:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('DEV:', import.meta.env.DEV);
console.log('PROD:', import.meta.env.PROD);
console.log('SSR:', import.meta.env.SSR);

// Test API URL construction
const testApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:9000") + "/api/v1";
console.log('Constructed API URL:', testApiUrl);

// Check if running locally
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
console.log('Running locally:', isLocal);
console.log('Current hostname:', window.location.hostname);
console.log('Current origin:', window.location.origin);

export const debugEnvironment = () => {
  return {
    mode: import.meta.env.MODE,
    apiUrl: testApiUrl,
    isLocal,
    hostname: window.location.hostname,
    allEnvVars: import.meta.env
  };
};