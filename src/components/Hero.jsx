// import { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const slides = [
//   {
//     id: 1,
//     image: "banner1.png",
//     subtitle: "The Wedding Edit '26",
//     title: "Handcrafted\nPerfection",
//     cta: "Shop The Collection",
//     link: "/shop"
//   },
//   {
//     id: 2,
//     image: "banner2.png", // Vibrant pink/festive
//     subtitle: "Vibrant Heritage",
//     title: "Threads of\nTradition",
//     cta: "Explore Festive",
//     link: "/shop"
//   },
//   {
//     id: 3,
//     image: "banner3.png", // Elegant/Model shot
//     subtitle: "New Arrivals",
//     title: "Walk in\nPoetry",
//     cta: "View New Season",
//     link: "/shop"
//   }
// ];

// export default function Hero() {
//   const [current, setCurrent] = useState(0);
//   const length = slides.length;

//   // Auto-advance slides every 5 seconds
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [length]);

//   const nextSlide = () => {
//     setCurrent(current === length - 1 ? 0 : current + 1);
//   };

//   const prevSlide = () => {
//     setCurrent(current === 0 ? length - 1 : current - 1);
//   };

//   if (!Array.isArray(slides) || slides.length <= 0) {
//     return null;
//   }

//   return (
//     <section className="relative h-screen w-full overflow-hidden bg-black">
      
//       {/* 1. IMAGE LAYER (Map through all to allow crossfade) */}
//       {slides.map((slide, index) => (
//         <div 
//           key={slide.id}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//             index === current ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           {/* Ken Burns Effect: Scale image slowly when active */}
//           <div className={`w-full h-full transition-transform duration-[8000ms] ease-linear ${
//             index === current ? 'scale-110' : 'scale-100'
//           }`}>
//              <img 
//               src={slide.image} 
//               alt={slide.title} 
//               className="w-full h-full object-cover"
//             />
//           </div>
//           {/* Dark Overlay */}
//           <div className="absolute inset-0 bg-black/30"></div>
//         </div>
//       ))}

//       {/* 2. TEXT CONTENT LAYER */}
//       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4 pt-20">
        
//         {/* We use 'key={current}' to force React to re-mount text and re-trigger animations on slide change */}
//         <div key={current} className="flex flex-col items-center">
          
//           <p className="animate-fade-up text-xs md:text-sm font-sans tracking-[0.3em] uppercase mb-4 text-white/90">
//             {slides[current].subtitle}
//           </p>

//           <h1 className="animate-fade-up delay-100 text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] mb-8 drop-shadow-lg whitespace-pre-line">
//             {/* Renders newlines as line breaks for "Handcrafted \n Perfection" */}
//             <span className="block">{slides[current].title.split('\n')[0]}</span>
//             <span className="italic font-light block">{slides[current].title.split('\n')[1]}</span>
//           </h1>

//           <Link 
//             to={slides[current].link} 
//             className="animate-fade-up delay-200 mt-6 bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
//           >
//             {slides[current].cta}
//           </Link>
//         </div>

//       </div>

//       {/* 3. NAVIGATION CONTROLS */}
      
//       {/* Left Arrow (Hidden on mobile to keep clean) */}
//       <button 
//         onClick={prevSlide}
//         className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 border border-white/20 rounded-full text-white/50 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>

//       {/* Right Arrow */}
//       <button 
//         onClick={nextSlide}
//         className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 border border-white/20 rounded-full text-white/50 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>

//       {/* Bottom Indicators / Progress */}
//       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
//         {slides.map((_, index) => (
//           <button 
//             key={index}
//             onClick={() => setCurrent(index)}
//             className="group relative py-4" // Larger hit area
//           >
//             {/* The line */}
//             <div className={`h-[2px] transition-all duration-500 ${
//               index === current ? 'w-12 bg-white' : 'w-6 bg-white/40 group-hover:bg-white/80'
//             }`}></div>
//           </button>
//         ))}
//       </div>

//     </section>
//   );
// }


import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "banner1.png",
    subtitle: "The Wedding Edit '26",
    titleLine1: "Handcrafted",
    titleLine2: "Perfection",
    cta: "Shop The Collection",
    link: "/shop"
  },
  {
    id: 2,
    image: "banner2.png", // Vibrant pink/festive
    subtitle: "Vibrant Heritage",
    titleLine1: "Threads of",
    titleLine2: "Tradition",
    cta: "Explore Festive",
    link: "/shop"
  },
  {
    id: 3,
    image: "banner3.png",
    subtitle: "New Arrivals",
    titleLine1: "Walk in",
    titleLine2: "Poetry",
    cta: "View New Season",
    link: "/shop"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
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
          {/* Ken Burns Scale Effect */}
          <div className={`w-full h-full transition-transform duration-[8000ms] ease-linear ${
            index === current ? 'scale-110' : 'scale-100'
          }`}>
             <img 
              src={slide.image} 
              alt={slide.titleLine1} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Gradient Overlay: Clear in center, darker at edges for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          
          {/* Subtle Mobile Overlay for extra contrast */}
          <div className="absolute inset-0 bg-black/20 md:bg-transparent"></div>
        </div>
      ))}

      {/* 2. TEXT CONTENT LAYER */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4 pt-20">
        
        <div key={current} className="flex flex-col items-center max-w-5xl">
          
          {/* Subtitle - Small & Spaced */}
          <p className="animate-fade-up text-[10px] md:text-xs font-sans font-bold tracking-[0.4em] uppercase mb-6 text-white/90 drop-shadow-md">
            {slides[current].subtitle}
          </p>

          {/* Main Title - Massive & Elegant */}
          <h1 className="animate-fade-up delay-100 font-serif leading-[0.85] text-white drop-shadow-lg">
            {/* Line 1: Solid & Big */}
            <span className="block text-5xl md:text-8xl lg:text-[160px] tracking-tight">
              {slides[current].titleLine1}
            </span>
            {/* Line 2: Italic & Flowy */}
            <span className="block text-5xl md:text-8xl lg:text-[160px] italic font-light mt-2 md:mt-4">
              {slides[current].titleLine2}
            </span>
          </h1>

          {/* Button - Clean White */}
          <Link 
            to={slides[current].link} 
            className="animate-fade-up delay-200 mt-10 md:mt-12 bg-white text-black px-10 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 shadow-xl"
          >
            {slides[current].cta}
          </Link>
        </div>

      </div>

      {/* 3. CONTROLS */}
      <button 
        onClick={prevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white/70 hover:bg-white hover:text-black transition-all duration-300"
      >
        <ChevronLeft className="w-8 h-8 opacity-80" />
      </button>

      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white/70 hover:bg-white hover:text-black transition-all duration-300"
      >
        <ChevronRight className="w-8 h-8 opacity-80" />
      </button>

      {/* Progress Bars */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrent(index)}
            className="group relative py-4 px-1"
          >
            <div className={`h-[2px] rounded-full transition-all duration-500 shadow-sm ${
              index === current ? 'w-10 bg-white' : 'w-4 bg-white/40 group-hover:bg-white/80'
            }`}></div>
          </button>
        ))}
      </div>

    </section>
  );
}