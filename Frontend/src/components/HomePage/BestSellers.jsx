import { useEffect, useState } from 'react';
import { ArrowUpRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { API_BASE_URL } from '../../util/config.js';
import { getOptimizedImage } from '../../util/imageUtils';
import { Skeleton } from '../ui/Skeleton.jsx';

export default function BestSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null); // Desktop: Track expanded card

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bestsellers`);
        const data = await res.json();
        setItems(data.slice(0, 3)); 
        if(data.length > 1) setActiveId(data[1].product._id);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleHover = (id) => {
    setActiveId(id);
  };

  if (loading) return <div className="py-24 px-8"><Skeleton className="h-[600px] w-full rounded-xl" /></div>;
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 px-2">
           <div className="text-center md:text-left w-full md:w-auto">
             <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3 block">
               Curated Favorites
             </span>
             <h2 className="text-3xl md:text-5xl font-serif text-[#1C1917]">
               The Spotlight
             </h2>
           </div>
           <Link to="/shop" className="group hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b border-gray-300 hover:border-[#1C1917] transition-all mb-2">
              View All <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
           </Link>
        </div>

        {/* =========================================
            DESKTOP VIEW: EXPANDING ACCORDION
           ========================================= */}
        <div className="hidden md:flex h-[600px] gap-4">
           {items.map((item) => (
             <DesktopCard 
               key={item.product._id} 
               item={item} 
               isActive={activeId === item.product._id}
               onHover={() => handleHover(item.product._id)}
             />
           ))}
        </div>

        {/* =========================================
            MOBILE VIEW: HORIZONTAL SWIPE CAROUSEL
           ========================================= */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
           {items.map((item) => (
             <MobileCard key={item.product._id} item={item} />
           ))}
           
           {/* "View All" Card at end of scroll */}
           <Link to="/shop" className="min-w-[40vw] flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl snap-center shrink-0 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center mb-2">
                 <ArrowRight size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">View All</span>
           </Link>
        </div>

      </div>
    </section>
  );
}

// --- DESKTOP COMPONENT (EXPANDING) ---
function DesktopCard({ item, isActive, onHover }) {
   const { product, tag } = item;
   const optimizedImage = getOptimizedImage(product.image, 800);

   return (
     <Link 
       to={`/product/${product.slug || product._id}`}
       onMouseEnter={onHover}
       className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
         ${isActive ? 'flex-[3] grayscale-0' : 'flex-[1] grayscale'}
       `}
     >
       <div className="absolute inset-0 w-full h-full">
         <img 
           src={optimizedImage} 
           alt={product.name}
           className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-110' : 'scale-100'}`}
         />
         <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-40'}`} />
       </div>

       <div className={`absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full`}>
         <div className={`absolute top-6 left-6 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="bg-white text-[#1C1917] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
               {tag}
            </span>
         </div>

         <div className="relative z-10 overflow-hidden">
             <motion.h3 layout className={`font-serif text-white transition-all duration-500 ${isActive ? 'text-4xl mb-2' : 'text-2xl mb-0'}`}>
                {product.name}
             </motion.h3>
             
             <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-300 text-sm mb-6 max-w-sm line-clamp-2">
                   Experience luxury handcrafted with precision.
                </p>
                <div className="flex items-center justify-between w-full border-t border-white/20 pt-4">
                   <p className="text-2xl font-medium text-white">₹{product.price.toLocaleString()}</p>
                   <div className="flex items-center gap-2 bg-white text-[#1C1917] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors">
                      Shop <ShoppingBag size={14} />
                   </div>
                </div>
             </div>
         </div>
       </div>
     </Link>
   );
}

// --- MOBILE COMPONENT (VERTICAL CARD) ---
function MobileCard({ item }) {
   const { product, tag } = item;
   const optimizedImage = getOptimizedImage(product.image, 600);

   return (
      <Link 
         to={`/product/${product.slug || product._id}`}
         className="min-w-[85vw] snap-center shrink-0 relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg group"
      >
         <img 
            src={optimizedImage} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
         />
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

         {/* Content */}
         <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="self-start">
               <span className="bg-white/90 backdrop-blur-sm text-[#1C1917] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                  {tag}
               </span>
            </div>

            <div className="translate-y-2 group-hover:translate-y-0 transition-transform">
               <h3 className="font-serif text-2xl text-white mb-1">{product.name}</h3>
               <div className="flex items-center justify-between mt-2 border-t border-white/20 pt-3">
                  <span className="text-lg font-bold text-white">₹{product.price.toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
                     Shop Now <ArrowRight size={12} />
                  </span>
               </div>
            </div>
         </div>
      </Link>
   );
}