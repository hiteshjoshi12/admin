import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
// FIX 1: Correctly import the named export to avoid [object Object] error
import config from '../config/config.js';

export default function CollectionTiles() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/collections`);
        const data = await res.json();
        
        // Optional: Filter for only active collections if your API returns all
        const activeCollections = data.filter(col => col.isActive !== false);
        setCollections(activeCollections);
        
        console.log("Collections fetched:", data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // --- OVERLAY COMPONENT ---
  const QuickAddOverlay = () => (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-8 transition-opacity duration-300 bg-black/5 opacity-100 md:opacity-0 md:group-hover:opacity-100">
      <button className="bg-white text-[#1C1917] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xl transition-all duration-500 ease-out hover:bg-[#C5A059] hover:text-white translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
        <ShoppingBag className="w-4 h-4"/> View Collection
      </button>
    </div>
  );

  if (loading) return null;

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
          // FIX 2: Safe Link Logic
          // Since we don't have product IDs in the simple data, we link to the shop page
          // If you implement filtering later, you can do: `/shop?category=${col.name}`
          const targetLink = col.products && col.products.length > 0 
            ? `/product/${col.products[0]._id}` 
            : '/shop'; 

          return (
            <Link 
              to={targetLink} 
              key={col._id || col.name} // Fallback to name if _id is missing
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] bg-gray-200 shadow-md">
                <img 
                  src={col.image} 
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <QuickAddOverlay />
              </div>

              <div className="text-center mt-6">
                {/* FIX 3: Only show "Designs" count if the data actually exists */}
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