import { useEffect, useState } from 'react';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { API_BASE_URL } from '../../util/config.js';
import { getOptimizedImage } from '../../util/imageUtils';
import { Skeleton } from '../ui/Skeleton.jsx';

export default function BestSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null); // Track which card is expanded

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bestsellers`);
        const data = await res.json();
        setItems(data.slice(0, 3)); 
        // Set middle item as active by default for visual balance
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
    <section className="py-24 px-4 md:px-8 bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-2">
           <div>
             <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2 block">
               Top Rated
             </span>
             <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917]">
               The Spotlight
             </h2>
           </div>
           <Link to="/shop" className="group hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b border-gray-300 hover:border-[#1C1917] transition-all mb-2">
              View All <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
           </Link>
        </div>

        {/* --- EXPANDING ACCORDION --- */}
        <div className="flex flex-col md:flex-row h-[800px] md:h-[600px] gap-4">
           {items.map((item) => (
             <ExpandingCard 
               key={item.product._id} 
               item={item} 
               isActive={activeId === item.product._id}
               onHover={() => handleHover(item.product._id)}
             />
           ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-[#1C1917] pb-1">
               View All Products <ArrowUpRight size={14} />
            </Link>
        </div>

      </div>
    </section>
  );
}

// --- SUB-COMPONENT: EXPANDING CARD ---
function ExpandingCard({ item, isActive, onHover }) {
   const { product, tag } = item;

   return (
     <Link 
       to={`/product/${product.slug || product._id}`}
       onMouseEnter={onHover}
       className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
         ${isActive ? 'flex-[3] grayscale-0' : 'flex-[1] grayscale'}
         h-[200px] md:h-auto md:flex-row
       `}
     >
       {/* Background Image */}
       <div className="absolute inset-0 w-full h-full">
         <img 
           src={getOptimizedImage(product.image, 800)} 
           alt={product.name}
           className={`w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-110' : 'scale-100'}`}
         />
         {/* Dark Gradient Overlay */}
         <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-40'}`} />
       </div>

       {/* Content Container */}
       <div className={`absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full`}>
          
          {/* Tag (Always Visible but moves) */}
          <div className={`absolute top-6 left-6 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
             <span className="bg-white text-[#1C1917] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                {tag}
             </span>
          </div>

          {/* Title & Price */}
          <div className="relative z-10 overflow-hidden">
             <motion.h3 
               layout
               className={`font-serif text-white transition-all duration-500 ${isActive ? 'text-3xl md:text-4xl mb-2' : 'text-xl md:text-2xl mb-0'}`}
             >
                {product.name}
             </motion.h3>
             
             <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-300 text-sm mb-6 max-w-sm line-clamp-2">
                   {/* Fallback description if none exists */}
                   Experience luxury handcrafted with precision. Perfect for the modern wardrobe.
                </p>
                
                <div className="flex items-center justify-between w-full border-t border-white/20 pt-4">
                   <p className="text-2xl font-medium text-white">₹{product.price.toLocaleString()}</p>
                   
                   <div className="flex items-center gap-2 bg-white text-[#1C1917] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors">
                      Shop Now <ShoppingBag size={14} />
                   </div>
                </div>
             </div>
          </div>
       </div>
     </Link>
   );
}