import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X, ShoppingBag } from 'lucide-react';

// --- MOCK DATA ---
const initialProducts = [
  {
    id: 1,
    name: "Velvet Zardosi Mule",
    originalPrice: 4500,
    salePrice: 2699,
    discount: 40,
    size: [36, 37, 38],
    category: "Mules",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600",
    tag: "Best Seller"
  },
  {
    id: 2,
    name: "Crystal Bow Heel",
    originalPrice: 5200,
    salePrice: 3899,
    discount: 25,
    size: [38, 39, 40],
    category: "Heels",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600",
    tag: "Limited Stock"
  },
  {
    id: 3,
    name: "Rose Gold Wedge",
    originalPrice: 3200,
    salePrice: 1599,
    discount: 50,
    size: [37, 39, 41],
    category: "Wedges",
    image: "https://images.unsplash.com/photo-1596253406560-c3d3284d7285?q=80&w=600",
    tag: null
  },
  {
    id: 4,
    name: "Pearl Embroidered Flat",
    originalPrice: 2800,
    salePrice: 1999,
    discount: 28,
    size: [36, 40],
    category: "Flats",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    tag: "Selling Fast"
  },
];

export default function Sale() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [products, setProducts] = useState(initialProducts);
  
  // --- FILTER STATES ---
  const [activeDropdown, setActiveDropdown] = useState(null); // 'size', 'price', 'category'
  
  const [filters, setFilters] = useState({
    size: null,
    priceRange: null, // 'under-2000', '2000-3000', 'above-3000'
    category: null
  });

  // --- FILTER LOGIC (Runs whenever filters change) ---
  useEffect(() => {
    let result = initialProducts;

    // 1. Filter by Size
    if (filters.size) {
      result = result.filter(p => p.size.includes(filters.size));
    }

    // 2. Filter by Category
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // 3. Filter by Price
    if (filters.priceRange) {
      if (filters.priceRange === 'under-2000') {
        result = result.filter(p => p.salePrice < 2000);
      } else if (filters.priceRange === '2000-3000') {
        result = result.filter(p => p.salePrice >= 2000 && p.salePrice <= 3000);
      } else if (filters.priceRange === 'above-3000') {
        result = result.filter(p => p.salePrice > 3000);
      }
    }

    setProducts(result);
  }, [filters]);

  // --- HANDLERS ---
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveDropdown(null); // Close dropdown after selecting
  };

  const clearAllFilters = () => {
    setFilters({ size: null, priceRange: null, category: null });
    setActiveDropdown(null);
  };

  const hasActiveFilters = filters.size || filters.priceRange || filters.category;

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      
      {/* --- HERO --- */}
      <section className="bg-[#1C1917] text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#FF2865]/20 to-transparent animate-pulse"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="bg-[#FF2865] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block">
            Limited Time Offer
          </span>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            The Archive <span className="italic text-[#FF2865]">Sale</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-8 max-w-lg mx-auto">
            Rare finds and last-chance treasures. Up to <span className="text-white font-bold">50% OFF</span>.
          </p>
        </div>
      </section>

      {/* --- FILTER BAR --- */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {products.length} Styles Found
          </p>

          <div className="flex flex-wrap justify-center gap-3 relative">
            
            {/* 1. SIZE FILTER */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('size')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${filters.size ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
              >
                Size {filters.size ? `(${filters.size})` : ''} <ChevronDown className="w-3 h-3" />
              </button>
              
              {activeDropdown === 'size' && (
                <div className="absolute top-full mt-2 w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100 grid grid-cols-3 gap-1 z-40 animate-fade-up">
                  {[36, 37, 38, 39, 40, 41].map(size => (
                    <button
                      key={size}
                      onClick={() => setFilter('size', size)}
                      className={`py-2 text-sm rounded-lg hover:bg-gray-50 ${filters.size === size ? 'bg-[#FF2865] text-white' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PRICE FILTER */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('price')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${filters.priceRange ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
              >
                Price <ChevronDown className="w-3 h-3" />
              </button>
              
              {activeDropdown === 'price' && (
                <div className="absolute top-full mt-2 w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100 flex flex-col gap-1 z-40 animate-fade-up">
                  {[
                    { label: 'Under ₹2000', value: 'under-2000' },
                    { label: '₹2000 - ₹3000', value: '2000-3000' },
                    { label: 'Above ₹3000', value: 'above-3000' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilter('priceRange', option.value)}
                      className={`py-2 px-3 text-left text-sm rounded-lg hover:bg-gray-50 ${filters.priceRange === option.value ? 'bg-[#FF2865] text-white' : 'text-gray-600'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. CATEGORY FILTER */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('category')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${filters.category ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
              >
                Category {filters.category ? `(${filters.category})` : ''} <ChevronDown className="w-3 h-3" />
              </button>
              
              {activeDropdown === 'category' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100 flex flex-col gap-1 z-40 animate-fade-up">
                  {['Mules', 'Heels', 'Wedges', 'Flats'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter('category', cat)}
                      className={`py-2 px-3 text-left text-sm rounded-lg hover:bg-gray-50 ${filters.category === cat ? 'bg-[#FF2865] text-white' : 'text-gray-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CLEAR ALL */}
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs text-[#FF2865] underline hover:text-black ml-2">
                Clear All
              </button>
            )}

          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          
          {products.map((product) => (
            <div key={product.slug} className="group relative">
              
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-20 bg-[#FF2865] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md">
                -{product.discount}%
              </div>

              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <button className="bg-white text-[#1C1917] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#FF2865] hover:text-white transition-colors shadow-lg translate-y-4 group-hover:translate-y-0 duration-300">
                      <ShoppingBag className="w-3 h-3" /> Quick Add
                    </button>
                </div>

                {product.tag && (
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[9px] uppercase tracking-widest font-bold text-[#1C1917] rounded-sm">
                    {product.tag}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                <h3 className="font-serif text-lg text-[#1C1917] mb-1">{product.name}</h3>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
                  <span className="text-[#FF2865] font-bold text-lg">₹{product.salePrice}</span>
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-gray-400">No treasures found.</h3>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
            <button onClick={clearAllFilters} className="text-[#FF2865] mt-4 underline">Clear filters</button>
          </div>
        )}
      </div>

    </div>
  );
}