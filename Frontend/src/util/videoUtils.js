/**
 * Optimizes ImageKit Video URLs
 * @param {string} url - The original video URL
 * @param {number} width - Target width (default 720p for balance)
 * @returns {string} - The optimized video URL
 */
export const getOptimizedVideo = (url, width = 720) => {
  if (!url || typeof url !== 'string') return url || '';

  // --- IMAGEKIT.IO OPTIMIZATION ---
  if (url.includes('ik.imagekit.io')) {
    // ImageKit strictly requires an integer for quality (e.g., q-80).
    // Passing 'q-auto' will trigger a 400 Bad Request.
    
    const separator = url.includes('?') ? '&' : '?';
    const transformation = `tr=w-${width},q-80,f-auto`;

    return `${url}${separator}${transformation}`;
  }

  // Fallback for any other URLs
  return url;
};