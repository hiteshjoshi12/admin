import { useState, forwardRef } from 'react';

// --- IMAGE WRAPPER ---
export const ImageWithShimmer = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    // We apply your Tailwind classes to the outer wrapper so it sizes correctly
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

// --- VIDEO WRAPPER (Notice the forwardRef!) ---
export const VideoWithShimmer = forwardRef(({ src, className, ...props }, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <video
        ref={ref} // 👈 This allows your togglePlay(videoRef) to work!
        src={src}
        onLoadedData={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
});

// Set display name for debugging since we used forwardRef
VideoWithShimmer.displayName = 'VideoWithShimmer';