import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      
      {/* Background Decor - Subtle circular gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 animate-fade-up max-w-lg mx-auto">
        {/* Giant 404 */}
        <h1 className="font-serif text-[120px] md:text-[180px] leading-none text-[#1C1917] opacity-10 select-none">
          404
        </h1>

        <div className="-mt-8 md:-mt-12 space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1C1917]">
            Lost in Luxury?
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            The page you are looking for seems to have gone out of style or has been moved to a new collection.
          </p>

          <div className="w-16 h-[1px] bg-[#1C1917] opacity-20 mx-auto"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1C1917] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FF2865] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Home size={14} /> Return Home
            </Link>

            <Link 
              to="/shop" 
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1C1917] border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#1C1917] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} /> Continue Shopping
            </Link>

          </div>
        </div>
      </div>

      {/* Footer Helper */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          Need help? <Link to="/contact" className="underline hover:text-[#1C1917]">Contact Support</Link>
        </p>
      </div>

    </div>
  );
};

export default NotFound;