import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Anchor } from 'lucide-react';

export default function About() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      
      {/* 1. LOAD ONE PREMIUM FONT (Playfair Display) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          .font-luxury { font-family: 'Playfair Display', serif; }
        `}
      </style>

      {/* --- HERO SECTION --- */}
      <section className="relative py-24 md:py-32 px-6 text-center overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF2865] rounded-full blur-[180px] opacity-[0.03] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[#FF2865] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-6 block animate-fade-up">
            BRAND STORY
          </span>
          
          {/* 2. CLEANER, HIGH-FASHION TYPOGRAPHY */}
          <h1 className="font-luxury text-[#1C1917] leading-tight animate-fade-up delay-100">
            {/* Top Line: Bold, Uppercase, Wide Spacing */}
            <span className="block text-4xl md:text-6xl font-semibold tracking-widest uppercase mb-2">
              Threads of
            </span>
            
            {/* Bottom Line: Italic, Elegant, Accent Color */}
            <span className="block text-5xl md:text-7xl italic font-normal text-[#FF2865]">
              Tradition
            </span>
          </h1>

          <div className="w-[1px] h-16 bg-[#1C1917] mx-auto mt-10 mb-8 animate-fade-up delay-200 opacity-20"></div>
          
          <p className="max-w-xl mx-auto text-gray-500 font-serif italic text-lg animate-fade-up delay-300">
            "Where heritage meets modern grace."
          </p>
        </div>
      </section>

      {/* --- THE NARRATIVE --- */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid - Kept Clean */}
          <div className="relative h-[500px] md:h-[600px] hidden md:block animate-fade-up delay-300">
             <div className="absolute top-0 right-0 w-3/4 h-3/4 overflow-hidden rounded-t-[10rem] border border-white shadow-xl">
               <img 
                 src="https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075245/IMG_9775_mebgcp.jpg" 
                 alt="Artisan embroidery" 
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
               />
             </div>
             <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white p-3 shadow-2xl rotate-[-3deg] z-10 rounded-lg">
                <img 
                  src="https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071597/IMG_0279_l2cibn.jpg" 
                  alt="Hands working" 
                  className="w-full h-full object-cover rounded-sm"
                />
             </div>
          </div>

          {/* The Text - Improved Readability */}
          <div className="font-luxury text-2xl md:text-3xl leading-relaxed text-[#1C1917] space-y-10 text-center md:text-left">
            <div className="animate-fade-up delay-100">
              <p className="text-gray-400 text-xs font-sans font-bold uppercase tracking-widest mb-4">The Beginning</p>
              <p>
                Some stories aren’t written.<br />
                They’re <span className="italic text-[#FF2865] font-semibold">stitched.</span>
              </p>
            </div>
            
            <div className="animate-fade-up delay-200">
              <p className="text-lg md:text-xl font-sans font-light text-gray-600 leading-8">
                Before Beads & Bloom becomes something you wear,
                it begins with hands that remember—artisans rooted in Punjab, working with patience, precision, and pride.
              </p>
            </div>

            <div className="animate-fade-up delay-300 pl-0 md:pl-8 border-l-0 md:border-l-4 border-[#FF2865]/30">
              <p className="text-xl md:text-2xl italic text-gray-800">
                We don’t modernise by westernising.
                We refine what already belongs to us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOUNDER SECTION --- */}
      <section className="bg-[#1C1917] py-24 px-6 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="font-luxury text-4xl md:text-6xl mb-8 leading-tight">
            A Connection Deeper<br/> 
            <span className="italic text-[#FF2865]">Than Fashion.</span>
          </h2>
          
          <div className="space-y-8 text-gray-300 font-light leading-relaxed text-lg">
            <p className="font-luxury italic text-2xl text-white">
              "When a woman slips into Beads & Bloom for the first time,
              she doesn’t just feel style. She feels belonging."
            </p>
            <p className="max-w-2xl mx-auto">
              I started this journey to build a bridge between the heritage I grew up with and the modern world we live in. It is a quiet confidence. A celebration of where we come from.
            </p>
          </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="relative z-20 py-24 w-full bg-brand-bg">
        <div className="w-full px-4 md:px-16 text-center">
          
          <div className="w-full flex flex-col md:flex-row justify-around items-center gap-12 mb-20">
             <ValueCard icon={Anchor} title="Rooted" desc="Deeply connected to the soil and soul of Punjab." />
             <ValueCard icon={Heart} title="Resilient" desc="Crafted to endure, just like the stories we tell." />
             <ValueCard icon={Sparkles} title="Refined" desc="Ancient techniques, perfected for the modern foot." />
          </div>

          <div className="inline-block p-1 border border-[#FF2865]/20 rounded-full">
            <Link 
              to="/shop" 
              className="block bg-[#FF2865] text-white px-12 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1C1917] transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Experience the Collection
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center group cursor-default max-w-xs">
      <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#FF2865] group-hover:border-[#FF2865] group-hover:text-white group-hover:scale-110 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-2xl font-luxury mb-3 group-hover:text-[#FF2865] transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}