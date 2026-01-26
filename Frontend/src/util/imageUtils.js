// src/utils/imageUtils.js

/**
 * Optimizes an ImageKit URL by injecting transformation parameters.
 * * @param {string} url - The original image URL
 * @param {number} width - The desired width (e.g., 400 for product cards)
 * @returns {string} - The optimized URL
 */
export const getOptimizedImage = (url, width = 600) => {
  if (!url) return '';

  // 1. Check if it is actually an ImageKit URL
  // (Replace 'ik.imagekit.io' with your actual ImageKit ID if using a custom domain)
  if (url.includes('ik.imagekit.io')) {
    
    // 2. Define the transformation string
    // tr:w-{width} -> Resize to width
    // f-auto       -> Auto format (WebP/AVIF)
    // q-auto       -> Auto quality optimization
    // dpr-auto     -> Auto device pixel ratio (for Retina screens)
    const transformation = `tr:w-${width},f-auto,q-auto,dpr-auto`;

    // 3. Insert transformation params
    // Case A: URL already has query params? (Rare for ImageKit, but possible)
    if (url.includes('?')) {
      return `${url}&${transformation.replace('tr:', 'tr=')}`; 
    }
    
    // Case B: Standard path-based URL
    // We try to inject it right after the ImageKit ID (the 4th slash usually)
    // Example: https://ik.imagekit.io/your_id/image.jpg
    // Becomes: https://ik.imagekit.io/your_id/tr:w-600,f-auto,q-auto/image.jpg
    
    const parts = url.split('/');
    // Find the index of your ImageKit ID. Usually it's index 3.
    // [https:, "", ik.imagekit.io, your_id, image.jpg]
    const idIndex = parts.findIndex(part => part.includes('ik.imagekit.io')) + 1;

    if (idIndex > 0 && idIndex < parts.length) {
      parts.splice(idIndex + 1, 0, transformation);
      return parts.join('/');
    }
  }

  // Fallback: If not an ImageKit URL (or logic fails), return original
  return url;
};