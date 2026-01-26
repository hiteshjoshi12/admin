import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import config from '../config/config.js';

// --- IMPORTS FOR SKELETON LOADING ---
import { GridSkeleton } from './loaders/SectionLoader';
import { Skeleton } from './ui/Skeleton';

export default function CollectionTiles() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/collections`);
        const data = await res.json();
        
        // Filter for only active collections
        const activeCollections = data.filter(col => col.isActive !== false);
        setCollections(activeCollections);
        
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const QuickAddOverlay = () => (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-8 transition-opacity duration-300 bg-black/5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
      <button className="bg-white text-[#1C1917] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xl transition-all duration-500 ease-out hover:bg-[#C5A059] hover:text-white translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
        <ShoppingBag className="w-4 h-4"/> View Collection
      </button>
    </div>
  );

  // --- 1. LOADING STATE ---
  if (loading) return (
    <section className="py-24 px-4 md:px-12 max-w-[1440px] mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 px-2 gap-6 md:gap-0">
        <div>
          {/* Title placeholder */}
          <Skeleton className="h-10 w-64 mb-4" />
          {/* Subtitle placeholder */}
          <Skeleton className="h-4 w-48" />
        </div>
        {/* Button placeholder */}
        <Skeleton className="h-4 w-24 hidden md:block" />
      </div>

      {/* Grid Skeleton (Using 'arch' type to match your design) */}
      <GridSkeleton count={3} type="arch" />
    </section>
  );

  return (
    <section className="py-24 px-4 md:px-12 max-w-[1440px] mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 px-2 gap-6 md:gap-0">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-2">
            Curated Collections
          </h2>
          <p className="text-sm font-sans text-gray-500 tracking-wide">
            Handpicked favorites for every occasion.
          </p>
        </div>
        
        <Link 
          to="/shop" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((col) => {
          // Safe Link Logic
          const targetLink = col.products && col.products.length > 0 
            ? `/product/${col.products[0]._id}` 
            : '/shop'; 

          return (
            <Link 
              to={targetLink} 
              key={col._id || col.name} 
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] bg-gray-200 shadow-md">
                <img 
                  src={col.image} 
                  alt={col.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <QuickAddOverlay />
              </div>

              <div className="text-center mt-6">
                {col.products && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1 block">
                      {col.products.length} Designs
                    </span>
                )}
                
                <h3 className="text-2xl font-serif text-[#1C1917] group-hover:text-gray-600 transition-colors">
                  {col.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}