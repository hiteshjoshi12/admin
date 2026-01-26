import { useEffect, useState } from 'react';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import config from '../config/config.js';

// --- IMPORTS FOR SKELETON LOADING ---
import { BestSellerSkeleton } from './loaders/SectionLoader';
import { Skeleton } from './ui/Skeleton';

export default function BestSellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/bestsellers`);
        const data = await res.json();
        setItems(data);
        console.log("Best Sellers fetched:", data); 
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const QuickAddOverlay = () => (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-8 transition-opacity duration-300 bg-black/5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
      <button className="bg-white text-[#1C1917] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xl transition-all duration-500 ease-out hover:bg-[#C5A059] hover:text-white translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
        <ShoppingBag className="w-4 h-4"/> Quick Add
      </button>
    </div>
  );

  // --- 1. LOADING STATE ---
  if (loading) return (
    <section className="py-24 px-4 md:px-12 bg-white relative overflow-hidden">
       <div className="max-w-[1440px] mx-auto relative z-10">
         
         {/* HEADER SKELETON */}
         <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              {/* "Curated Favorites" placeholder */}
              <Skeleton className="h-4 w-32 mb-4" />
              {/* "The Best Sellers" Title placeholder */}
              <Skeleton className="h-12 w-64 md:w-96" />
            </div>
            {/* "Shop All" Button placeholder */}
            <Skeleton className="h-4 w-32 hidden md:block" />
         </div>
         
         {/* COMPLEX GRID SKELETON */}
         {/* This loads the reusable layout we defined in SectionLoader */}
         <BestSellerSkeleton />
       </div>
    </section>
  );

  // Helper to find item by position (1, 2, or 3)
  const getItem = (pos) => items.find(i => i.position === pos);
  
  // Only render if we have at least one item
  if (items.length === 0) return null;

  // Assign variables
  const heroItem = getItem(1);
  const pebbleItem = getItem(2);
  const archItem = getItem(3);

  return (
    <section className="py-24 px-4 md:px-12 bg-white relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] border-[20px] border-[#C5A059]/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2 block">
              Curated Favorites
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] leading-none">
              The Best Sellers
            </h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors mt-6 md:mt-0">
            Shop All Icons <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* The Geometric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* POSITION 1: The Hero Arch */}
          {heroItem && (
            <Link to={`/product/${heroItem.product._id}`} className="md:col-span-5 relative group cursor-pointer block">
              <span className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1C1917] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                {heroItem.tag}
              </span>
              <div className="relative h-[600px] rounded-t-[15rem] overflow-hidden bg-[#F9F8F6] border-2 border-transparent group-hover:border-[#C5A059]/20 transition-all duration-500">
                <img src={heroItem.product.image} alt={heroItem.product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                <QuickAddOverlay />
              </div>
              <div className="text-center mt-6">
                <h3 className="text-2xl font-serif">{heroItem.product.name}</h3>
                <p className="text-gray-500 mt-1">₹{heroItem.product.price.toLocaleString()}</p>
              </div>
            </Link>
          )}

          {/* Right Side Container */}
          <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              
             {/* POSITION 2: The Pebble */}
             {pebbleItem && (
               <Link to={`/product/${pebbleItem.product._id}`} className="relative group cursor-pointer md:-ml-12 md:mt-12 z-10 block">
                 <span className="absolute top-4 right-4 z-30 bg-[#C5A059] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                   {pebbleItem.tag}
                 </span>
                 <div className="relative h-[350px] rounded-[4rem] overflow-hidden bg-[#F9F8F6] shadow-xl group-hover:shadow-2xl transition-shadow border-2 border-transparent group-hover:border-[#C5A059]/20">
                     <img src={pebbleItem.product.image} alt={pebbleItem.product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                     <QuickAddOverlay />
                 </div>
                 <div className="text-left mt-4 ml-4">
                   <h3 className="text-xl font-serif">{pebbleItem.product.name}</h3>
                   <p className="text-gray-500">₹{pebbleItem.product.price.toLocaleString()}</p>
                 </div>
               </Link>
             )}

             {/* POSITION 3: The Short Arch */}
             {archItem && (
               <Link to={`/product/${archItem.product._id}`} className="relative group cursor-pointer md:mt-32 block">
                 <span className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur text-[#1C1917] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                   {archItem.tag}
                 </span>
                 <div className="relative h-[400px] rounded-t-[10rem] overflow-hidden bg-[#F9F8F6] border-2 border-transparent group-hover:border-[#C5A059]/20 transition-all">
                     <img src={archItem.product.image} alt={archItem.product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                     <QuickAddOverlay />
                 </div>
                 <div className="text-center mt-4">
                   <h3 className="text-xl font-serif">{archItem.product.name}</h3>
                   <p className="text-gray-500">₹{archItem.product.price.toLocaleString()}</p>
                 </div>
               </Link>
             )}

          </div>
        </div>
      </div>
    </section>
  );
}