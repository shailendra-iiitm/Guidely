import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug environment in development
if (import.meta.env.DEV) {
  import('./debug/env-check.js').then(({ debugEnvironment }) => {
    console.log('🔍 Environment Debug Info:', debugEnvironment());
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
