// src/utils/imageUtils.js

export const getOptimizedImage = (url, width = 600) => {
  if (!url) return '';

  // 1. Safely fix ONLY unencoded spaces without double-encoding existing ones
  let safeUrl = url.trim().replace(/ /g, '%20');

  // 2. Check if it is actually an ImageKit URL
  if (safeUrl.includes('ik.imagekit.io')) {
    
    // 3. Define the transformation as a Query Parameter string
    // 🚨 Changed f-auto to f-webp: iOS struggles with AVIF, WebP is safe for both platforms
    const transformation = `tr=w-${width},f-webp,q-auto`;

    // 4. Append safely to the end of the URL
    if (safeUrl.includes('?')) {
      // If the URL already has some query parameters (like ?updatedAt=123)
      // Check if we already added 'tr=' to prevent duplicates
      if (safeUrl.includes('tr=')) return safeUrl; 
      return `${safeUrl}&${transformation}`;
    } else {
      // Standard URL: just append the query param
      return `${safeUrl}?${transformation}`;
    }
  }

  // Fallback: Return safely spaced URL
  return safeUrl;
};