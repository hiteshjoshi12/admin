import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

export default function Hero() {
  const comp = useRef(null);

 // inside useEffect in Hero.jsx
useEffect(() => {
  let ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 0.5 }); // Keep the delay

    tl.from(".hero-anim", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      clearProps: "all" // CRITICAL: Removes styles after animation finishes to prevent bugs
    });
  }, comp);
  return () => ctx.revert();
}, []);

  return (
    <section ref={comp} className="relative h-screen w-full overflow-hidden">
      
      {/* 1. Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2500&auto=format&fit=crop" 
          alt="Luxury Shoe Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* 2. Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-20">
        
        {/* Top Tagline */}
        <p className="hero-anim text-xs md:text-sm font-sans tracking-[0.3em] uppercase mb-4 text-white/90">
          The Wedding Edit '26
        </p>

        {/* Main Heading */}
        <h1 className="hero-anim text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] mb-8 drop-shadow-lg">
          Handcrafted <br />
          <span className="italic font-light">Perfection</span>
        </h1>

        {/* CTA Button */}
        <Link 
          to="/shop" 
          className="hero-anim mt-8 bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
        >
          Shop The Collection
        </Link>
      </div>

      {/* 3. Scroll Indicator */}
      <div className="hero-anim absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-80">
        <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
        <div className="w-[1px] h-12 bg-white/50"></div>
      </div>

    </section>
  );
}