// client/src/config.js
const isProduction = import.meta.env.MODE === 'production';

export const API_BASE_URL = isProduction 
  ? import.meta.env.VITE_API_URL  // Live Backend URL (Render)
  : 'http://localhost:5000';      // Local Backend