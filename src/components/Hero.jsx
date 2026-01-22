// import { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const slides = [
//   {
//     id: 1,
//     image: "banner1.png",
//     subtitle: "The Wedding Edit '26",
//     titleLine1: "Handcrafted",
//     titleLine2: "Perfection",
//     cta: "Shop The Collection",
//     link: "/shop"
//   },
//   {
//     id: 2,
//     image: "banner2.png", 
//     subtitle: "Vibrant Heritage",
//     titleLine1: "Threads of",
//     titleLine2: "Tradition",
//     cta: "Explore Festive",
//     link: "/shop"
//   },
//   {
//     id: 3,
//     image: "banner3.png", 
//     subtitle: "New Arrivals",
//     titleLine1: "Walk in",
//     titleLine2: "Poetry",
//     cta: "View New Season",
//     link: "/shop"
//   }
// ];

// export default function Hero() {
//   const [current, setCurrent] = useState(0);
//   const length = slides.length;

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [length]);

//   const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
//   const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

//   return (
//     <section className="relative h-screen w-full overflow-hidden bg-[#1C1917]">
      
//       {/* 1. IMAGE LAYER */}
//       {slides.map((slide, index) => (
//         <div 
//           key={slide.id}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//             index === current ? 'opacity-50' : 'opacity-0'
//           }`}
//         >
//           <div className={`w-full h-full transition-transform duration-[8000ms] ease-linear ${
//             index === current ? 'scale-110' : 'scale-100'
//           }`}>
//              <img 
//               src={slide.image} 
//               alt={slide.titleLine1} 
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
//         </div>
//       ))}

//       {/* 2. TEXT CONTENT LAYER */}
//       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-20">
        
//         <div key={current} className="flex flex-col items-center max-w-5xl">
          
//           {/* Subtitle - Pastel Pink (#F8C8D0) */}
//           <p className="animate-fade-up text-[10px] md:text-xs font-sans font-bold tracking-[0.4em] uppercase mb-6 text-[#F8C8D0] drop-shadow-md">
//             {slides[current].subtitle}
//           </p>

//           {/* Main Title */}
//           <h1 className="animate-fade-up delay-100 font-serif leading-[0.85] drop-shadow-lg">
//             {/* Line 1: Pastel Blue (#AEC6CF) */}
//             <span className="block text-5xl md:text-8xl lg:text-[160px] tracking-tight text-[#AEC6CF]">
//               {slides[current].titleLine1}
//             </span>
//             {/* Line 2: Pastel Mint Green (#B2D8B9) */}
//             <span className="block text-5xl md:text-8xl lg:text-[160px] italic font-light mt-2 md:mt-4 text-[#B2D8B9]">
//               {slides[current].titleLine2}
//             </span>
//           </h1>

//           {/* Button - Pastel Yellow (#FDFD96) Background with Dark Text */}
//           <Link 
//             to={slides[current].link} 
//             className="animate-fade-up delay-200 mt-10 md:mt-12 bg-[#FDFD96] text-[#363636] px-10 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#FFB347] transition-all duration-300 shadow-xl rounded-full"
//           >
//             {slides[current].cta}
//           </Link>
//         </div>

//       </div>

//       {/* 3. CONTROLS - Using Pastel Yellow for accents */}
//       <button 
//         onClick={prevSlide}
//         className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-[#FDFD96]/70 hover:bg-[#FDFD96] hover:text-[#363636] transition-all duration-300"
//       >
//         <ChevronLeft className="w-8 h-8 opacity-80" />
//       </button>

//       <button 
//         onClick={nextSlide}
//         className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-[#FDFD96]/70 hover:bg-[#FDFD96] hover:text-[#363636] transition-all duration-300"
//       >
//         <ChevronRight className="w-8 h-8 opacity-80" />
//       </button>

//       {/* Progress Bars */}
//       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
//         {slides.map((_, index) => (
//           <button 
//             key={index}
//             onClick={() => setCurrent(index)}
//             className="group relative py-4 px-1"
//           >
//             <div className={`h-[2px] rounded-full transition-all duration-500 shadow-sm ${
//               index === current ? 'w-10 bg-[#FDFD96]' : 'w-4 bg-[#FDFD96]/40 group-hover:bg-[#FDFD96]/80'
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
    image: "banner2.png", 
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

// The "Sale Pink" from your reference image
const brandPink = "#FD61A7"; 

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
          <div className={`w-full h-full transition-transform duration-[8000ms] ease-linear ${
            index === current ? 'scale-110' : 'scale-100'
          }`}>
             <img 
              src={slide.image} 
              alt={slide.titleLine1} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Slightly darker overlay to ensure White/Pink text pops */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>
      ))}

      {/* 2. TEXT CONTENT LAYER */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-20">
        
        <div key={current} className="flex flex-col items-center max-w-5xl">
          
          {/* Subtitle - Crisp White like "END OF SEASON" */}
          <p className="animate-fade-up text-[10px] md:text-xs font-sans font-bold tracking-[0.4em] uppercase mb-6 text-white drop-shadow-md">
            {slides[current].subtitle}
          </p>

          {/* Main Title - White + Hot Pink Mix */}
          <h1 className="animate-fade-up delay-100 font-serif leading-[0.85] drop-shadow-xl">
            {/* Line 1: Pure White */}
            <span className="block text-5xl md:text-8xl lg:text-[160px] tracking-tight text-white">
              {slides[current].titleLine1}
            </span>
            {/* Line 2: The "Sale" Pink (Cursive/Italic vibe) */}
            <span 
              className="block text-5xl md:text-8xl lg:text-[160px] italic font-light mt-2 md:mt-4"
              style={{ color: brandPink }} 
            >
              {slides[current].titleLine2}
            </span>
          </h1>

          {/* Button - White Background, Pink Text (mimics the Sale vibe) */}
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
      <button 
        onClick={prevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white/70 hover:bg-white transition-all duration-300"
        onMouseEnter={(e) => e.target.style.color = brandPink}
        onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
      >
        <ChevronLeft className="w-8 h-8 opacity-80" />
      </button>

      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white/70 hover:bg-white transition-all duration-300"
        onMouseEnter={(e) => e.target.style.color = brandPink}
        onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
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
            <div 
              className={`h-[2px] rounded-full transition-all duration-500 shadow-sm ${
                index === current ? 'w-10' : 'w-4 bg-white/40'
              }`}
              style={{ backgroundColor: index === current ? brandPink : '' }}
            ></div>
          </button>
        ))}
      </div>

    </section>
  );
}