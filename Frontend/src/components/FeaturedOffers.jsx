import { useEffect, useState } from 'react';
import { Tag, Copy, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../util/config'; // Adjust path as needed

export default function FeaturedOffers() {
  const [coupons, setCoupons] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Fetch Active Coupons
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
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2s
  };

  if (coupons.length === 0) return null; // Don't show section if no offers

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-pink-100 rounded-full text-[#FF2865]">
             <Sparkles className="w-5 h-5" />
           </div>
           <h2 className="font-serif text-2xl md:text-3xl text-[#1C1917]">Exclusive Offers</h2>
        </div>

        {/* Coupon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {coupons.map((coupon) => (
             <motion.div 
               key={coupon._id}
               whileHover={{ y: -5 }}
               className="relative group bg-gradient-to-br from-[#F9F8F6] to-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all overflow-hidden"
             >
                {/* Decorative Circles */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                   <div>
                      <span className="inline-block px-3 py-1 bg-[#1C1917] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                        {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`}
                      </span>
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{coupon.code}</h3>
                      <p className="text-sm text-gray-500">{coupon.description}</p>
                   </div>
                   
                   <Tag className="w-10 h-10 text-gray-200 group-hover:text-pink-200 transition-colors rotate-12" />
                </div>

                {/* Dotted Divider */}
                <div className="my-4 border-t-2 border-dashed border-gray-200 relative">
                   <div className="absolute -left-8 -top-3 w-6 h-6 bg-white rounded-full border-r border-gray-200"></div>
                   <div className="absolute -right-8 -top-3 w-6 h-6 bg-white rounded-full border-l border-gray-200"></div>
                </div>

                {/* Action Area */}
                <div className="flex justify-between items-center">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Valid till {new Date(coupon.expirationDate).toLocaleDateString()}
                   </p>
                   
                   <button 
                     onClick={() => handleCopy(coupon.code, coupon._id)}
                     className="flex items-center gap-2 text-sm font-bold text-[#FF2865] hover:text-[#1C1917] transition-colors"
                   >
                     <AnimatePresence mode='wait'>
                       {copiedId === coupon._id ? (
                         <motion.span 
                           key="copied"
                           initial={{ opacity: 0, y: 5 }} 
                           animate={{ opacity: 1, y: 0 }}
                           className="flex items-center gap-1 text-green-600"
                         >
                           <CheckCircle className="w-4 h-4" /> Copied!
                         </motion.span>
                       ) : (
                         <motion.span 
                           key="copy"
                           initial={{ opacity: 0, y: -5 }} 
                           animate={{ opacity: 1, y: 0 }}
                           className="flex items-center gap-1"
                         >
                           <Copy className="w-4 h-4" /> Copy Code
                         </motion.span>
                       )}
                     </AnimatePresence>
                   </button>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}