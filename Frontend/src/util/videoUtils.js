/**
 * Optimizes Cloudinary & ImageKit Video URLs
 * @param {string} url - The original video URL
 * @param {number} width - Target width (default 720p for balance)
 * @returns {string} - The optimized video URL
 */
export const getOptimizedVideo = (url, width = 720) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;

  // --- 1. CLOUDINARY OPTIMIZATION ---
  if (url.includes('cloudinary.com')) {
    // Cloudinary video urls usually look like: .../upload/v1234/my_video.mp4
    // We need to inject: .../upload/f_auto,q_auto,w_720,c_limit/v1234/my_video.mp4
    
    const parts = url.split('/upload/');
    if (parts.length < 2) return url;

    // Transformation: 
    // f_auto: Best format (WebM/MP4)
    // q_auto: Best quality vs size
    // w_{width}: Resize
    // c_limit: Maintain aspect ratio, don't upscale
    // vc_auto: Best video codec (H.264/H.265/VP9)
    const transformation = `f_auto,q_auto,w_${width},c_limit,vc_auto`;

    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  }

  // --- 2. IMAGEKIT.IO OPTIMIZATION ---
  if (url.includes('ik.imagekit.io')) {
    // ImageKit videos are safer handled via Query Parameters to avoid path breaking
    // Logic: Append &tr=w-{width},q-auto,f-auto
    
    const separator = url.includes('?') ? '&' : '?';
    const transformation = `tr=w-${width},q-auto,f-auto`;

    return `${url}${separator}${transformation}`;
  }

  // Fallback
  return url;
};