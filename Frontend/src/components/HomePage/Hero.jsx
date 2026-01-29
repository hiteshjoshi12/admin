import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../util/config';
// 1. IMPORT OPTIMIZER
import { getOptimizedImage } from '../../util/imageUtils';

// 1. THE SINGLE HARDCODED FALLBACK
const fallbackSlide = {
  id: 'fallback-1',
  image: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1769069487/banner1_viwl2e.png",
  subtitle: "The Wedding Edit '26",
  titleLine1: "Handcrafted",
  titleLine2: "Perfection",
  cta: "Shop The Collection",
  link: "/shop"
};

const brandPink = "#FD61A7"; 

export default function Hero() {
  const [slides, setSlides] = useState([fallbackSlide]); 
  const [current, setCurrent] = useState(0);

  // --- FETCH HERO CONTENT ---
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        
        if (data && data.heroSlides && data.heroSlides.length > 0) {
          const formattedSlides = data.heroSlides.map((slide, idx) => ({
             id: slide._id || idx,
             image: slide.image,
             titleLine1: slide.title ? slide.title.split(' ')[0] : 'New',
             titleLine2: slide.title ? slide.title.split(' ').slice(1).join(' ') : 'Arrivals',
             subtitle: slide.subtitle,
             cta: slide.cta,
             link: slide.link
          }));
          setSlides(formattedSlides);
        } else {
           setSlides([fallbackSlide]); 
        }
      } catch (error) {
        console.error("Failed to fetch content, using fallback:", error);
        setSlides([fallbackSlide]);
      }
    };

    fetchContent();
  }, []);

  const length = slides.length;

  useEffect(() => {
    if (length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [length]);

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1C1917]">
      
      {/* 1. IMAGE LAYER */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`w-full h-full transition-transform duration-[8000ms] ease-linear ${
            index === current ? 'scale-110' : 'scale-100'
          }`}>
             {/* 2. APPLY OPTIMIZATION HERE */}
             {/* Width 1600 is good balance for desktop quality vs speed */}
             <img 
               src={getOptimizedImage(slide.image, 1600)} 
               alt={slide.titleLine1} 
               className="w-full h-full object-cover"
               priority="true" // Optional: Hint to browser to load this immediately
             />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>
      ))}

      {/* 2. TEXT CONTENT LAYER */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-20">
        <div key={current} className="flex flex-col items-center max-w-5xl">
          <p className="animate-fade-up text-[10px] md:text-xs font-sans font-bold tracking-[0.4em] uppercase mb-6 text-white drop-shadow-md">
            {slides[current].subtitle}
          </p>

          <h1 className="animate-fade-up delay-100 font-serif leading-[0.85] drop-shadow-xl">
            <span className="block text-5xl md:text-8xl lg:text-[160px] tracking-tight text-white">
              {slides[current].titleLine1}
            </span>
            <span 
              className="block text-5xl md:text-8xl lg:text-[160px] italic font-light mt-2 md:mt-4"
              style={{ color: brandPink }} 
            >
              {slides[current].titleLine2}
            </span>
          </h1>

          <Link 
            to={slides[current].link} 
            className="animate-fade-up delay-200 mt-10 md:mt-12 bg-white px-10 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl rounded-full border-2 border-white hover:border-transparent"
            style={{ color: brandPink }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = brandPink;
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.color = brandPink;
            }}
          >
            {slides[current].cta}
          </Link>
        </div>
      </div>

      {/* 3. CONTROLS */}
      {length > 1 && (
        <>
          <button onClick={prevSlide} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white/70 hover:bg-white transition-all duration-300 group">
            <ChevronLeft className="w-8 h-8 opacity-80 group-hover:text-[#FD61A7]" />
          </button>
          <button onClick={nextSlide} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white/70 hover:bg-white transition-all duration-300 group">
            <ChevronRight className="w-8 h-8 opacity-80 group-hover:text-[#FD61A7]" />
          </button>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
              <button key={index} onClick={() => setCurrent(index)} className="group relative py-4 px-1">
                <div 
                  className={`h-[2px] rounded-full transition-all duration-500 shadow-sm ${
                    index === current ? 'w-10' : 'w-4 bg-white/40'
                  }`}
                  style={{ backgroundColor: index === current ? brandPink : '' }}
                ></div>
              </button>
            ))}
          </div>
        </>
      )}

    </section>
  );
}