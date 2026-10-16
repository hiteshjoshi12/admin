import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../util/config.js';

// 1. IMPORT OPTIMIZER
import { getOptimizedImage } from '../../util/imageUtils';

// --- IMPORTS FOR SKELETON LOADING ---
import { GridSkeleton } from '../loaders/SectionLoader.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';

export default function CollectionTiles() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Verified shopping categories matching actual catalog data
  const defaultCollections = [
    {
      _id: 'bridal-cat',
      name: 'Bridal Juttis',
      route: '/collection/bridal',
      count: 14,
      image: 'https://ik.imagekit.io/hiteshh12/Products/Ruby%20Heritage_12.jpg',
      alt: 'Bridal Juttis - Handcrafted Royal Wedding Mojris'
    },
    {
      _id: 'festive-cat',
      name: 'Festive Juttis',
      route: '/collection/festive',
      count: 22,
      image: 'https://ik.imagekit.io/hiteshh12/Products/Blush%20Mirage_05.jpg',
      alt: 'Festive Juttis - Celebration & Sangeet Handcrafted Footwear'
    },
    {
      _id: 'casual-cat',
      name: 'Casual Juttis',
      route: '/collection/casual',
      count: 8,
      image: 'https://ik.imagekit.io/hiteshh12/Products/Noorani%20Dabka_03.jpg',
      alt: 'Casual Juttis - Everyday Chic Double-Cushioned Flats'
    }
  ];

  const QuickAddOverlay = () => (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-8 transition-opacity duration-300 bg-black/5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
      <span className="bg-white text-[#1C1917] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xl transition-all duration-500 ease-out group-hover:bg-[#C5A059] group-hover:text-white translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
        <ShoppingBag className="w-4 h-4"/> Browse Collection
      </span>
    </div>
  );

  return (
    <section className="py-24 px-4 md:px-12 max-w-[1440px] mx-auto" aria-label="Handcrafted Jutti Collections">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 px-2 gap-6 md:gap-0">
        <div>
          {/* SEO: H2 with target keyword */}
          <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-2">
            Handcrafted Jutti Collections
          </h2>
          <p className="text-sm font-sans text-gray-500 tracking-wide">
            Artisanal mojris and heritage designs for every occasion.
          </p>
        </div>
        
        <Link 
          to="/shop" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
        >
          Explore All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {defaultCollections.map((col) => {
          return (
            <Link 
              to={col.route} 
              key={col._id} 
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] bg-gray-200 shadow-md">
                
                <img 
                  src={getOptimizedImage(col.image, 600)} 
                  alt={col.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                <QuickAddOverlay />
              </div>

              <div className="text-center mt-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B5E3C] font-semibold mb-1 block">
                  {col.count} Designs Available
                </span>
                
                {/* SEO: H3 for category names with hover effect */}
                <h3 className="text-2xl font-serif text-[#1C1917] group-hover:text-[#C5A059] transition-colors">
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