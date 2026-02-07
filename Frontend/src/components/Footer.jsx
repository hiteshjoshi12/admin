import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    // FIX 1: Used hardcoded hex #1C1917 (Charcoal) to ensure background is dark
    <footer className="bg-[#1C1917] text-white pt-20 pb-10">
      
      {/* FIX 2: Changed max-w-[360] to max-w-[1440px] */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-serif mb-6 tracking-wide">BEADS & BLOOM</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Handcrafted luxury footwear blending ancient heritage with modern elegance.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a 
                key={i} 
                href="https://www.instagram.com/beadsnbloom.india?igsh=MXhjdDBoeTN3ZGMxOA%3D%3D&utm_source=qr" 
                // Social Icons: White border/icon default -> White bg / Black icon on hover
                className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/shop" className="hover:text-white transition-colors">The Collection</Link></li>
            <li><Link to="/collection/casual" className="hover:text-white transition-colors">Best Sellers</Link></li>
            <li><Link to="/collection/bridal" className="hover:text-white transition-colors">Bridal Collection</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Gift Cards</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            {/* LINKED THESE TO /terms PAGE */}
            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="/size-chart" className="hover:text-white transition-colors">Size Guide</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">Stay in the Loop</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive updates.</p>
          <div className="flex border-b border-gray-700 pb-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent w-full text-sm outline-none placeholder-gray-600 text-white"
            />
            <button className="text-xs font-bold uppercase tracking-widest hover:text-[#C5A059] text-white">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 uppercase tracking-widest">
        <p>© 2026 Beads & Bloom. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/terms" className="hover:text-gray-400">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}