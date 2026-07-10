/**
 * Optimizes ImageKit Video URLs
 * @param {string} url - The original video URL
 * @param {number} width - Target width (default 400 for 320px UI containers)
 * @returns {string} - The optimized video URL
 */
export const getOptimizedVideo = (url, width = 400) => {
  if (!url || typeof url !== 'string') return '';

  // --- IMAGEKIT.IO OPTIMIZATION ---
  if (url.includes('ik.imagekit.io')) {
    // Safety check: If the URL already contains a transformation, return it as-is 
    // to avoid stacking parameters like ?tr=w-400&tr=w-720 which consumes extra VPUs.
    if (url.includes('tr=')) return url; 

    const separator = url.includes('?') ? '&' : '?';
    
    // Width matched to UI container + quality & format optimizations
    const transformation = `tr=w-${width},q-60,f-auto`;

    return `${url}${separator}${transformation}`;
  }

  // Fallback for any other URLs
  return url;
};