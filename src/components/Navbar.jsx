import { ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Navbar() {
  const navRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 1. Drop-in animation on load
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.5 }
    );

    // 2. Scroll Event Listener
    const handleScroll = () => {
      // Toggle state based on scroll position (e.g., > 50px)
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${
        isScrolled ? 'pt-0 px-0' : 'pt-6 px-4'
      }`}
    >
      {/* The Navbar Element */}
      <nav 
        ref={navRef}
        className={`bg-white flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'w-full max-w-full rounded-none px-10 py-4 shadow-md' // Scrolled State: Full width, square, stick to top
            : 'w-full max-w-[1300px] rounded-full px-8 py-4 shadow-2xl' // Hero State: Capsule, constrained width
        }`}
      >
        
        {/* LEFT: Brand Identity */}
        <Link to="/" className="flex flex-col group">
          <span className="font-serif text-xl font-bold tracking-wide text-brand-black leading-none group-hover:text-gray-600 transition-colors">
            BEADS & BLOOM
          </span>
          <span className="text-[0.6rem] font-sans text-gray-400 tracking-[0.25em] uppercase mt-1">
            Handcrafted Luxury
          </span>
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {['New Arrivals', 'Bridal', 'Mules', 'Journal'].map((item) => (
            <Link 
              key={item} 
              to="/shop" 
              className="text-xs font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-black group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-5">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <span className="absolute top-2 right-1 h-2 w-2 bg-black rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
          </button>
        </div>

      </nav>
    </div>
  );
}