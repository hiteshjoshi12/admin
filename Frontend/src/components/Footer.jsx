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
          <h3 className="text-2xl font-serif mb-4 tracking-wide">BEADS & BLOOM</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Handcrafted luxury footwear blending Punjabi heritage with double-cushioned modern elegance.
          </p>
          <div className="text-xs text-gray-400 space-y-1 mb-6 border-l-2 border-[#C5A059] pl-3">
            <p><span className="text-white font-medium">Studio:</span> Sector 15, Gurgaon, HR 122001</p>
            <p><span className="text-white font-medium">Delivery:</span> Worldwide Express Shipping</p>
            <p><span className="text-white font-medium">Payments:</span> COD & 100% Secure Online</p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com/beadsnbloom.india?igsh=MXhjdDBoeTN3ZGMxOA%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow Beads and Bloom on Instagram"
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit Beads and Bloom on Facebook"
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow Beads and Bloom on Twitter"
              className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">Handcrafted Juttis</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/shop" className="hover:text-white transition-colors">Complete Jutti Range</Link></li>
            <li><Link to="/collection/bridal" className="hover:text-white transition-colors">Bridal & Wedding Juttis</Link></li>
            <li><Link to="/collection/festive" className="hover:text-white transition-colors">Festive & Sangeet Juttis</Link></li>
            <li><Link to="/collection/casual" className="hover:text-white transition-colors">Casual Everyday Chic</Link></li>
            <li><Link to="/sale" className="hover:text-white transition-colors">Archive Festive Sale</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">About & Support</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story & Heritage</Link></li>
            <li><Link to="/bridal-guide" className="hover:text-white transition-colors">Bridal Footwear Guide</Link></li>
            <li><Link to="/care-guide" className="hover:text-white transition-colors">Jutti Care & Cleaning</Link></li>
            <li><Link to="/size-chart" className="hover:text-white transition-colors">Size Guide & Fit</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Worldwide Shipping & COD</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Gurgaon Studio & Contact</Link></li>
            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">Stay in the Loop</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive bridal edits & festive releases.</p>
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

      {/* SEO Keyword Footer Strip */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-8 text-[11px] text-gray-400 leading-relaxed text-center md:text-left">
        <span className="text-gray-300 font-semibold">Specializing in:</span> Handcrafted Punjabi Juttis • Bridal Juttis in Gurgaon • Sector 15 Gurgaon Studio • Festive & Party Wear Mojaris • Casual Ethnic Flats • Double-Cushioned Comfort Soles • Cash on Delivery (COD) across India • Worldwide Delivery (USA, UK, Canada, Australia, UAE).
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