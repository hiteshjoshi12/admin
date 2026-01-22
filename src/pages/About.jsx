import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Anchor } from 'lucide-react';

export default function About() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 md:py-32 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF2865] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[#FF2865] text-xs font-bold uppercase tracking-[0.3em] mb-4 block animate-fade-up">
            Brand Story
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#1C1917] mb-6 animate-fade-up delay-100">
            Threads of <span className="italic font-light text-[#FF2865]">Tradition</span>
          </h1>
          <div className="w-[1px] h-20 bg-[#1C1917]/20 mx-auto my-8 animate-fade-up delay-200"></div>
        </div>
      </section>

      {/* --- THE NARRATIVE --- */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid */}
          <div className="relative h-[600px] hidden md:block animate-fade-up delay-300">
             <div className="absolute top-0 right-0 w-3/4 h-3/4 overflow-hidden rounded-t-[10rem] border border-gray-200">
               <img 
                 src="https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075245/IMG_9775_mebgcp.jpg" 
                 alt="Artisan embroidery" 
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white p-2 shadow-2xl rotate-[-3deg] z-10">
                <img 
                  src="https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071597/IMG_0279_l2cibn.jpg" 
                  alt="Hands working" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>

          {/* The Text */}
          <div className="font-serif text-2xl md:text-3xl leading-relaxed text-[#1C1917] space-y-12 text-center md:text-left">
            <div className="animate-fade-up delay-100">
              <p className="text-gray-400 text-sm font-sans uppercase tracking-widest mb-4">The Beginning</p>
              <p>
                Some stories aren’t written.<br />
                They’re <span className="italic text-[#FF2865]">stitched.</span> 🪡
              </p>
            </div>
            <div className="animate-fade-up delay-200">
              <p className="text-lg md:text-xl font-sans font-light text-gray-600 leading-8">
                Before Beads & Bloom becomes something you wear,
                it begins with hands that remember—artisans rooted in Punjab, working with patience, precision, and pride. 🌸
              </p>
            </div>
            <div className="animate-fade-up delay-300 pl-0 md:pl-8 border-l-0 md:border-l-2 border-[#FF2865]">
              <p>
                We don’t modernise by westernising.<br/>
                We refine what already belongs—<br/>
                <span className="text-[#FF2865]">softness without compromise</span>,<br/>
                comfort without losing soul. 💫
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOUNDER SECTION --- */}
      <section className="bg-[#1C1917] py-24 px-6 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

        <div className="max-w-[1000px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-xl border border-white/10 shadow-2xl group">
                 <img 
                   src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" 
                   alt="Founder" 
                   className="w-full h-full object-cover filter sepia-[0.2] transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20">
                    <p className="font-serif italic text-xl">Founder Name</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Creative Director</p>
                 </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-serif mb-8">
                A Connection Deeper<br/> Than <span className="text-[#FF2865] italic">Fashion.</span>
              </h2>
              <div className="space-y-6 text-gray-300 font-light leading-relaxed">
                <p>
                  "When a woman slips into Beads & Bloom for the first time,
                  she doesn’t just feel style. She feels belonging."
                </p>
                <p>
                  I started this journey not just to create footwear, but to build a bridge between the heritage I grew up with and the modern world we live in. It is a quiet confidence. A celebration of where we come from.
                </p>
              </div>
             
            </div>
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
              className="block bg-[#FF2865] text-white px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1C1917] transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Experience the Collection
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

// --- VALUE CARD COMPONENT ---
function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center group cursor-default">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#FF2865] group-hover:border-[#FF2865] group-hover:text-white group-hover:scale-110 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-serif mb-3 group-hover:text-[#FF2865] transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
        {desc}
      </p>
    </div>
  );
}