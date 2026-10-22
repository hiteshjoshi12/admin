import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight, Heart, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImage } from '../../util/imageUtils';

const DEFAULT_PERSPECTIVES = [
  'On-Foot / Model',
  'Clean Pair',
  'Craft Embroidery',
  'Top Close-Up',
  'Side Profile',
  'Back & Sole',
  'Artisanal Detail',
  'Packaging & Dust Bag'
];

export default function ProductGallery({
  images = [],
  productName = '',
  isWishlisted = false,
  onToggleWishlist,
  imageDetails = []
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const validImages = images.length > 0 ? images : ['/logo.png'];
  const optimizedImages = validImages.map((img) => getOptimizedImage(img, 1200));
  const thumbnails = validImages.map((img) => getOptimizedImage(img, 200));

  // AUTO-PLAY: Automatically cycle images every 5 seconds
  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [validImages.length, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // Get perspective label
  const getPerspectiveLabel = (idx) => {
    if (imageDetails && imageDetails[idx]?.perspective) {
      return imageDetails[idx].perspective;
    }
    return DEFAULT_PERSPECTIVES[idx % DEFAULT_PERSPECTIVES.length];
  };

  return (
    <div className="relative w-full">
      {/* Lightbox Modal (Opens ONLY when explicit Zoom button is clicked) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <GalleryLightbox 
            images={optimizedImages}
            initialIndex={activeIndex}
            productName={productName}
            onClose={() => setIsLightboxOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
        
        {/* THUMBNAIL STRIP (Vertical on Desktop, Horizontal on Mobile) */}
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto scrollbar-hide py-1 shrink-0 md:w-20 md:max-h-[520px] w-full">
          {thumbnails.map((thumb, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#FAF8F5] ${
                  isActive 
                    ? 'border-[#1C1917] ring-2 ring-[#C5A059]/40 shadow-xs' 
                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={thumb} 
                  alt={`${productName} thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            );
          })}
        </div>

        {/* MAIN STAGE: Sized to fit comfortably in view without cropping */}
        <div 
          className="relative flex-1 w-full h-[400px] sm:h-[460px] lg:h-[520px] max-h-[75vh] rounded-2xl md:rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EAE6DF] select-none group flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Wishlist Button */}
          <button 
            type="button"
            onClick={onToggleWishlist} 
            className="absolute top-4 right-4 z-20 w-10 h-10 md:w-11 md:h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border border-gray-100"
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-500 hover:text-[#FF2865]"}`} />
          </button>




          {/* Zoom In Fullscreen Button (Explicit click only, no hover zoom) */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full text-gray-700 hover:text-[#1C1917] hover:bg-white shadow-xs hover:scale-105 transition-all cursor-pointer border border-gray-100"
            title="Expand to Fullscreen"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Navigation Arrows (Visible on hover on desktop, or tap on mobile) */}
          {validImages.length > 1 && (
            <>
              <button 
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-gray-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-gray-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Full Image Stage: object-contain guarantees full jutti is completely visible without cropping or zoom on hover */}
          <div className="w-full h-full p-3 md:p-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeIndex}
                src={optimizedImages[activeIndex]} 
                alt={`${productName} view ${activeIndex + 1} - ${getPerspectiveLabel(activeIndex)}`} 
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                loading={activeIndex === 0 ? "eager" : "lazy"}
                fetchPriority={activeIndex === 0 ? "high" : "auto"}
                className="max-w-full max-h-full object-contain pointer-events-none select-none drop-shadow-xs"
              />
            </AnimatePresence>
          </div>

          {/* Subtle auto-play progress bar indicators at bottom */}
          {validImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 items-center">
              {validImages.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === activeIndex 
                      ? 'w-6 bg-[#1C1917]' 
                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Jump to image ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function GalleryLightbox({ images, initialIndex, productName, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-between p-4 md:p-6"
    >
      {/* Lightbox Header */}
      <div 
        className="w-full max-w-5xl flex items-center justify-between text-white z-50 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h4 className="font-serif font-bold text-sm md:text-base tracking-wide">{productName}</h4>
          <span className="text-xs text-gray-400 font-mono">
            View {currentIndex + 1} of {images.length}
          </span>
        </div>
        <button 
          type="button"
          onClick={onClose} 
          className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close fullscreen view"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Display: Full image visible, fitted within screen */}
      <div 
        className="w-full max-w-5xl flex-1 flex items-center justify-center p-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Full view ${currentIndex + 1}`} 
          className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl select-none shadow-2xl" 
        />
      </div>

      {/* Lightbox Bottom Thumbnail Bar & Navigation */}
      <div 
        className="w-full max-w-md flex items-center justify-center gap-3 z-50 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                idx === currentIndex ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <button 
          type="button" 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
