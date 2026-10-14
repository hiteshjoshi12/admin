import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../util/config';
import { getOptimizedImage } from '../../util/imageUtils';
import { getOptimizedVideo } from '../../util/videoUtils';
import { ImageWithShimmer } from '../../util/ShimmerMedia';

// Curated Luxury Fallbacks (supporting both Video and Image)
const fallbackSlides = [
  {
    id: 'fallback-1',
    mediaType: 'video',
    video: 'https://ik.imagekit.io/beandandbloom/Media/j5_ketdz3.mp4',
    image: 'banner1.png',
    subtitle: 'Artisanal Punjabi Juttis',
    titleLine1: 'Beads &',
    titleLine2: 'Bloom',
    cta: 'Shop The Collection',
    link: '/shop'
  },
  {
    id: 'fallback-2',
    mediaType: 'image',
    image: 'banner1.png',
    subtitle: 'Handcrafted Heritage',
    titleLine1: 'Couture',
    titleLine2: 'Craftsmanship',
    cta: 'Explore Bestsellers',
    link: '/shop'
  }
];

const brandPink = "#FD61A7";

// Helper component for rendering individual slide media (Video or Image)
function SlideMedia({ slide, isActive, isMuted }) {
  const videoRef = useRef(null);
  const isVideo = slide.mediaType === 'video' || 
    Boolean(slide.video) || 
    (typeof slide.image === 'string' && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(slide.image));
  
  const videoUrl = slide.video || slide.image;

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isActive) {
        // Safe play promise handling to avoid uncaught browser abort exceptions
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policies might block unmuted playback
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isVideo]);

  if (isVideo && videoUrl) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-[#1C1917]">
        <video
          ref={videoRef}
          src={getOptimizedVideo(videoUrl, 1920)}
          poster={slide.image && !/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(slide.image) ? getOptimizedImage(slide.image, 1600) : undefined}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center pointer-events-none"
          aria-label={`${slide.titleLine1 || 'Beads and Bloom'} showcase video`}
        />
      </div>
    );
  }

  return (
    <div className={`w-full h-full transition-transform duration-[7000ms] ease-out ${
      isActive ? 'scale-105' : 'scale-100'
    }`}>
      <ImageWithShimmer
        src={getOptimizedImage(slide.image || 'banner1.png', 1920)}
        alt={`${slide.titleLine1 || 'Beads and Bloom'} ${slide.titleLine2 || 'Handcrafted Juttis'}`}
        className="w-full h-full object-cover object-center"
        priority={isActive}
      />
    </div>
  );
}

export default function HeroNew() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();

        if (data && data.heroSlides && data.heroSlides.length > 0) {
          const isVideoUrl = (url) => 
            typeof url === 'string' && (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.includes('/video/'));

          const formattedSlides = data.heroSlides.map((slide, idx) => {
            const isVid = slide.mediaType === 'video' || Boolean(slide.video) || isVideoUrl(slide.image);
            const rawTitle = slide.title || '';
            const words = rawTitle.trim().split(' ').filter(Boolean);
            const line1 = words.length > 0 ? words[0] : 'Handcrafted';
            const line2 = words.length > 1 ? words.slice(1).join(' ') : 'Juttis';

            return {
              id: slide._id || `slide-${idx}`,
              mediaType: isVid ? 'video' : 'image',
              video: slide.video || (isVideoUrl(slide.image) ? slide.image : ''),
              image: isVideoUrl(slide.image) ? (slide.video ? slide.image : '') : (slide.image || 'banner1.png'),
              titleLine1: line1,
              titleLine2: line2,
              subtitle: slide.subtitle || 'Artisanal Footwear',
              cta: slide.cta || 'Shop Now',
              link: slide.link || '/shop'
            };
          });
          setSlides(formattedSlides);
        } else {
          setSlides(fallbackSlides);
        }
      } catch (error) {
        console.error("Failed to fetch content, using fallback:", error);
        setSlides(fallbackSlides);
      }
    };
    fetchContent();
  }, []);

  const length = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  }, [length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  }, [length]);

  // Dynamic slide duration: 7s for videos so user can appreciate motion, 5s for images
  useEffect(() => {
    if (length <= 1 || isPaused) return;

    const currentSlide = slides[current];
    const duration = currentSlide?.mediaType === 'video' || currentSlide?.video ? 7000 : 5000;

    const timer = setInterval(() => {
      nextSlide();
    }, duration);

    return () => clearInterval(timer);
  }, [length, current, isPaused, slides, nextSlide]);

  const currentSlide = slides[current] || slides[0] || fallbackSlides[0];
  const hasContent = Boolean(currentSlide?.subtitle || currentSlide?.titleLine1 || currentSlide?.cta);
  const currentIsVideo = currentSlide?.mediaType === 'video' || 
    Boolean(currentSlide?.video) || 
    (typeof currentSlide?.image === 'string' && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(currentSlide.image));

  return (
    <section 
      className="relative h-[88vh] md:h-screen w-full overflow-hidden bg-[#1C1917]"
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. MEDIA LAYER (Images & Videos) */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
            }`}
          >
            <SlideMedia 
              slide={slide} 
              isActive={isActive} 
              isMuted={isMuted} 
            />

            {/* Subtle luxury gradient overlay - preserves video vibrancy while making text crystal clear */}
            {hasContent && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_45%,rgba(0,0,0,0.35)_100%] pointer-events-none" />
              </>
            )}
          </div>
        );
      })}

      {/* 2. REFINED LUXURY TEXT & CTA LAYER */}
      {hasContent ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-20 pointer-events-none">
          <div key={current} className="flex flex-col items-center max-w-4xl px-2">
            
            {/* Refined Subtitle Pill Badge */}
            {currentSlide.subtitle && (
              <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1 md:py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-[10px] md:text-xs font-sans font-semibold tracking-[0.28em] uppercase text-white/95 mb-4 md:mb-5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FD61A7] animate-pulse" />
                {currentSlide.subtitle}
              </div>
            )}

            {/* Redesigned Balanced Headline - Scaled appropriately for video visibility */}
            <h1 className="animate-fade-up delay-100 font-serif leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white">
                {currentSlide.titleLine1 || 'Handcrafted'}
              </span>
              <span 
                className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl italic font-light mt-1 md:mt-2"
                style={{ color: brandPink }}
              >
                {currentSlide.titleLine2 || 'Juttis'}
              </span>
            </h1>

            {/* Redesigned Refined CTA Button */}
            {currentSlide.cta && (
              <div className="pointer-events-auto">
                <Link 
                  to={currentSlide.link || '/shop'} 
                  className="animate-fade-up delay-200 mt-6 md:mt-8 inline-flex items-center gap-2.5 bg-white text-[#1C1917] px-6 py-2.5 md:px-8 md:py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/40 hover:bg-[#FD61A7] hover:text-white hover:border-[#FD61A7] hover:shadow-[#FD61A7]/30 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
                >
                  <span>{currentSlide.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FD61A7] group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h1 className="sr-only">Handcrafted Punjabi Juttis & Ethnic Footwear | Beads and Bloom</h1>
      )}

      {/* 3. AUDIO MUTE / UNMUTE BUTTON (Appears when active slide is a video) */}
      {currentIsVideo && (
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Click to unmute" : "Click to mute"}
          className="absolute bottom-6 right-5 md:bottom-8 md:right-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/20 text-xs transition-all duration-300 shadow-xl cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-white/70" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#FD61A7]" />
          )}
          <span className="hidden sm:inline text-[10px] font-semibold tracking-wider uppercase">
            {isMuted ? "Unmute" : "Sound On"}
          </span>
        </button>
      )}

      {/* 4. CAROUSEL CONTROLS & INDICATORS */}
      {length > 1 && (
        <>
          {/* Left Arrow */}
          <button 
            onClick={prevSlide} 
            aria-label="Previous Slide"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/25 hover:bg-white text-white hover:text-[#FD61A7] backdrop-blur-md border border-white/15 transition-all duration-300 shadow-lg cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide} 
            aria-label="Next Slide"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/25 hover:bg-white text-white hover:text-[#FD61A7] backdrop-blur-md border border-white/15 transition-all duration-300 shadow-lg cursor-pointer group"
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          {/* Slide Indicator Capsules */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15">
            {slides.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrent(index)} 
                aria-label={`Go to slide ${index + 1}`}
                className="py-1 px-0.5 cursor-pointer"
              >
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === current ? 'w-8 shadow-sm' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  style={{ backgroundColor: index === current ? brandPink : undefined }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
