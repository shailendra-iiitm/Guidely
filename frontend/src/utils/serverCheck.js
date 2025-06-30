// frontend/src/utils/serverCheck.js

import axios from "axios";

export const checkServerHealth = async (baseUrl) => {
  try {
    const response = await axios.get(`${baseUrl}/health`, { timeout: 3000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

export const getAvailableEndpoint = async () => {
  const LOCAL_URL = "http://localhost:8080/api/v1";
  const DEPLOYED_URL = "https://guidely-backend.onrender.com/api/v1";
  
  // If on localhost, prefer local server
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const localAvailable = await checkServerHealth(LOCAL_URL);
    if (localAvailable) {
      return { url: LOCAL_URL, type: 'local' };
    }
    
    const deployedAvailable = await checkServerHealth(DEPLOYED_URL);
    if (deployedAvailable) {
      return { url: DEPLOYED_URL, type: 'deployed' };
    }
    
    return { url: LOCAL_URL, type: 'unknown' }; // fallback
  }
  
  // If not localhost, use deployed
  return { url: DEPLOYED_URL, type: 'deployed' };
};
