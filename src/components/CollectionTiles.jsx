import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  { 
    id: 1, 
    name: "The Bridal Edit", 
    count: "12 Designs",
    img: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    name: "Everyday Mules", 
    count: "24 Designs",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    name: "Luxury Potlis", 
    count: "8 Designs",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" 
  }
];

export default function CollectionTiles() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Staggered Fade Up Animation
      gsap.from(".collection-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // Starts when top of section hits 80% of viewport
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 md:px-12 max-w-[1440px] mx-auto">
      
      {/* Section Header */}
      <div className="flex items-end justify-between mb-16 px-2">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-2">
            Curated Collections
          </h2>
          <p className="text-sm font-sans text-gray-500 tracking-wide">
            Handpicked favorites for every occasion.
          </p>
        </div>
        
        <Link 
          to="/shop" 
          className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((col) => (
          <Link 
            to="/shop" 
            key={col.id} 
            className="collection-card group cursor-pointer"
          >
            {/* 1. Arch Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] bg-gray-200 shadow-md">
              <img 
                src={col.img} 
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* 2. Text Content (Below Image for clean look) */}
            <div className="text-center mt-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 block">
                {col.count}
              </span>
              <h3 className="text-2xl font-serif text-brand-black group-hover:text-gray-600 transition-colors">
                {col.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}