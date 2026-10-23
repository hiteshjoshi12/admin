import { useEffect, useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../util/config';

export default function FeaturedOffers() {
  const [coupons, setCoupons] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/coupons/active`);
        const data = await res.json();
        setCoupons(data);
      } catch (error) {
        console.error("Failed to load offers");
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!coupons || coupons.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-[#ECE7E1]" aria-label="Special Offers">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block mb-2">
              Atelier Privileges
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917]">
              Current Promotional Codes
            </h2>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-light max-w-sm">
            Apply these limited codes at checkout for exclusive privileges on your handcrafted pairs.
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div 
              key={coupon._id}
              className="relative bg-[#FAF8F5] border border-[#EAE3D2] rounded-3xl p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-[#1C1917] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`}
                  </span>
                  
                  <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
                    Expires {new Date(coupon.expirationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="font-mono text-xl font-bold tracking-wider text-[#1C1917] mb-2">
                  {coupon.code}
                </h3>
                
                <p className="text-xs text-gray-600 font-light leading-relaxed mb-6">
                  {coupon.description || `Special seasonal discount on our handcrafted jutti collection.`}
                </p>
              </div>

              {/* Action Ribbon */}
              <div className="pt-4 border-t border-[#EAE3D2] flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-light">
                  Click to copy & apply at checkout
                </span>

                <button 
                  onClick={() => handleCopy(coupon.code, coupon._id)}
                  aria-label={`Copy discount code ${coupon.code}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  <AnimatePresence mode='wait'>
                    {copiedId === coupon._id ? (
                      <motion.span 
                        key="copied"
                        initial={{ opacity: 0, y: 3 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1 text-emerald-700"
                      >
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </motion.span>
                    ) : (
                      <motion.span 
                        key="copy"
                        initial={{ opacity: 0, y: -3 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}