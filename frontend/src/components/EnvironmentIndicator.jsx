import React from 'react';
import { BASE_URL } from '../const/env.const';

const EnvironmentIndicator = () => {
  // Only show in development
  if (import.meta.env.PROD) return null;

  const isLocalhost = BASE_URL.includes('localhost');
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 text-center py-1 text-xs font-mono ${
      isLocalhost 
        ? 'bg-green-100 text-green-800 border-b border-green-200' 
        : 'bg-red-100 text-red-800 border-b border-red-200'
    }`}>
      {isLocalhost ? '🔧 DEVELOPMENT' : '🌐 REMOTE'} | API: {BASE_URL}
    </div>
  );
};

export default EnvironmentIndicator;