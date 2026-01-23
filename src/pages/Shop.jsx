import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, X, ChevronDown, ShoppingBag, ArrowUpRight } from 'lucide-react';

// --- MOCK DATA ---
// src/pages/Shop.jsx

// --- UPDATED MOCK DATA ---
const productsData = [
  {
    id: 1,
    name: "Royal Zardosi Mule",
    category: "Bridal",
    price: 4200,
    originalPrice: 5500,
    sizes: [36, 37, 38, 39],
    // NEW MEDIA STRUCTURE (Image to Image)
    media: [
      { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg" },
      { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg" } // Second angle
    ],
    tags: ["Best Seller"],
    date: "2023-12-01"
  },
  {
    id: 2,
    name: "Golden Hour Wedge",
    category: "Festive",
    price: 3100,
    originalPrice: null,
    sizes: [37, 38, 39, 40, 41],
    // NEW MEDIA STRUCTURE (Image to Video)
    // Note: Replace video src with a real short product clip later. Using a placeholder gif/video for demo.
    media: [
        { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg" },
        // Using a placeholder video link for demonstration.
        { type: 'video', src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069368/j5_ketdz3.mp4" } 
    ],
    tags: ["New"],
    date: "2024-01-15"
  },
  // ... keep other products similarly updated with at least one media item ...
  {
    id: 3,
    name: "Daily Comfort Flat",
    category: "Everyday",
    price: 1899,
    originalPrice: 2499,
    sizes: [36, 37, 38, 39, 40],
    media: [
        { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg" }
        // Only one image is fine too, the component handles it.
    ],
    tags: [],
    date: "2023-11-20"
  },
   {
    id: 4,
    name: "Royal Zardosi Mule",
    category: "Bridal",
    price: 4200,
    originalPrice: 5500,
    sizes: [36, 37, 38, 39],
    // NEW MEDIA STRUCTURE (Image to Image)
    media: [
      { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg" },
      { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg" } // Second angle
    ],
    tags: ["Best Seller"],
    date: "2023-12-01"
  },
  {
    id: 5,
    name: "Golden Hour Wedge",
    category: "Festive",
    price: 3100,
    originalPrice: null,
    sizes: [37, 38, 39, 40, 41],
    // NEW MEDIA STRUCTURE (Image to Video)
    // Note: Replace video src with a real short product clip later. Using a placeholder gif/video for demo.
    media: [
        { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg" },
        // Using a placeholder video link for demonstration.
        { type: 'video', src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069368/j5_ketdz3.mp4" } 
    ],
    tags: ["New"],
    date: "2024-01-15"
  },
  // ... keep other products similarly updated with at least one media item ...
  {
    id: 6,
    name: "Daily Comfort Flat",
    category: "Everyday",
    price: 1899,
    originalPrice: 2499,
    sizes: [36, 37, 38, 39, 40],
    media: [
        { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg" }
        // Only one image is fine too, the component handles it.
    ],
    tags: [],
    date: "2023-11-20"
  },
   {
    id: 7,
    name: "Royal Zardosi Mule",
    category: "Bridal",
    price: 4200,
    originalPrice: 5500,
    sizes: [36, 37, 38, 39],
    // NEW MEDIA STRUCTURE (Image to Image)
    media: [
      { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg" },
      { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg" } // Second angle
    ],
    tags: ["Best Seller"],
    date: "2023-12-01"
  },
  {
    id: 8,
    name: "Golden Hour Wedge",
    category: "Festive",
    price: 3100,
    originalPrice: null,
    sizes: [37, 38, 39, 40, 41],
    // NEW MEDIA STRUCTURE (Image to Video)
    // Note: Replace video src with a real short product clip later. Using a placeholder gif/video for demo.
    media: [
        { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075143/IMG_0972_1_gzc9om.jpg" },
        // Using a placeholder video link for demonstration.
        { type: 'video', src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069368/j5_ketdz3.mp4" } 
    ],
    tags: ["New"],
    date: "2024-01-15"
  },
  // ... keep other products similarly updated with at least one media item ...
  {
    id: 10,
    name: "Daily Comfort Flat",
    category: "Everyday",
    price: 1899,
    originalPrice: 2499,
    sizes: [36, 37, 38, 39, 40],
    media: [
        { type: 'image', src: "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg" }
        // Only one image is fine too, the component handles it.
    ],
    tags: [],
    date: "2023-11-20"
  },
  // ... rest of your data
];

export default function Shop() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- STATE ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest'); // newest, price-low, price-high
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    priceRange: null // 'under-2500', '2500-5000', 'above-5000'
  });

  // --- FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = productsData;

    // 1. Category Filter
    if (filters.category.length > 0) {
      result = result.filter(p => filters.category.includes(p.category));
    }

    // 2. Size Filter
    if (filters.size.length > 0) {
      result = result.filter(p => p.sizes.some(s => filters.size.includes(s)));
    }

    // 3. Price Filter
    if (filters.priceRange) {
      if (filters.priceRange === 'under-2500') result = result.filter(p => p.price < 2500);
      if (filters.priceRange === '2500-5000') result = result.filter(p => p.price >= 2500 && p.price <= 5000);
      if (filters.priceRange === 'above-5000') result = result.filter(p => p.price > 5000);
    }

    // 4. Sorting
    if (sortOption === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [filters, sortOption]);

  // --- HANDLERS ---
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      // For arrays (Checkbox behavior)
      if (Array.isArray(current)) {
        return {
          ...prev,
          [type]: current.includes(value) 
            ? current.filter(item => item !== value) 
            : [...current, value]
        };
      }
      // For single values (Radio behavior)
      return {
        ...prev,
        [type]: current === value ? null : value
      };
    });
  };

  const clearFilters = () => {
    setFilters({ category: [], size: [], priceRange: null });
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-100 py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-3">The Collection</h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Explore our handcrafted range of bridal mules, everyday flats, and festive essentials.
        </p>
      </div>

      {/* --- TOOLBAR (Sort & Filter Toggle) --- */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        
        {/* Mobile Filter Button */}
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917]"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>

        {/* Desktop Product Count */}
        <span className="hidden lg:block text-xs font-bold uppercase tracking-widest text-gray-400">
          {filteredProducts.length} Products
        </span>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden md:inline">Sort by:</span>
          <div className="relative group">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-transparent text-xs font-bold uppercase tracking-widest text-[#1C1917] pr-6 cursor-pointer outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12 flex gap-12 items-start">
        
        {/* --- LEFT SIDEBAR (Desktop Filters) --- */}
        <aside className="hidden lg:block w-64 sticky top-40 space-y-8 h-[calc(100vh-150px)] overflow-y-auto pr-4 scrollbar-thin">
          
          <FilterGroup title="Category">
            {['Bridal', 'Festive', 'Everyday', 'Limited Edition'].map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-all ${filters.category.includes(cat) ? 'bg-[#1C1917] border-[#1C1917]' : 'border-gray-300 group-hover:border-[#FF2865]'}`}>
                  {filters.category.includes(cat) && <span className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className="text-sm text-gray-600 group-hover:text-[#1C1917] transition-colors">{cat}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {[
              { label: 'Under ₹2,500', value: 'under-2500' },
              { label: '₹2,500 - ₹5,000', value: '2500-5000' },
              { label: 'Above ₹5,000', value: 'above-5000' }
            ].map(price => (
              <label key={price.value} className="flex items-center gap-3 cursor-pointer group">
                 <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.priceRange === price.value ? 'border-[#FF2865]' : 'border-gray-300'}`}>
                    {filters.priceRange === price.value && <div className="w-2 h-2 rounded-full bg-[#FF2865]" />}
                 </div>
                 <span className="text-sm text-gray-600 group-hover:text-[#1C1917]">{price.label}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Size">
            <div className="grid grid-cols-4 gap-2">
              {[36, 37, 38, 39, 40, 41].map(size => (
                <button
                  key={size}
                  onClick={() => toggleFilter('size', size)}
                  className={`w-10 h-10 flex items-center justify-center text-sm border transition-all ${
                    filters.size.includes(size) 
                      ? 'bg-[#1C1917] text-white border-[#1C1917]' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF2865]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterGroup>

          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-[#FF2865] uppercase tracking-widest hover:text-[#1C1917] transition-colors"
          >
            Clear All Filters
          </button>

        </aside>

        {/* --- PRODUCT GRID --- */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <p className="text-gray-400 text-lg mb-4">No products match your filters.</p>
               <button onClick={clearFilters} className="text-[#FF2865] underline font-medium">Clear Filters</button>
            </div>
          )}
        </div>

      </div>

      {/* --- MOBILE FILTER DRAWER --- */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${isMobileFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileFilterOpen(false)}
        />
        
        {/* Drawer */}
        <div className={`relative bg-white w-4/5 max-w-sm h-full shadow-2xl flex flex-col transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="font-serif text-xl">Filters</h2>
             <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Copy of filters logic for mobile... simplifying by reusing the desktop layout structures visually */}
              <FilterGroup title="Category">
                {['Bridal', 'Festive', 'Everyday', 'Limited Edition'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.category.includes(cat)} 
                      onChange={() => toggleFilter('category', cat)}
                      className="accent-[#1C1917] w-5 h-5" 
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Price">
                {[
                  { label: 'Under ₹2,500', value: 'under-2500' },
                  { label: '₹2,500 - ₹5,000', value: '2500-5000' },
                  { label: 'Above ₹5,000', value: 'above-5000' }
                ].map(price => (
                  <label key={price.value} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobilePrice"
                      checked={filters.priceRange === price.value} 
                      onChange={() => toggleFilter('priceRange', price.value)}
                      className="accent-[#FF2865] w-5 h-5" 
                    />
                    <span className="text-gray-700">{price.label}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Size">
                <div className="grid grid-cols-4 gap-3">
                  {[36, 37, 38, 39, 40, 41].map(size => (
                    <button
                      key={size}
                      onClick={() => toggleFilter('size', size)}
                      className={`h-12 border rounded-lg ${filters.size.includes(size) ? 'bg-[#1C1917] text-white' : 'border-gray-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </FilterGroup>
           </div>
           
           <div className="p-6 border-t border-gray-100">
             <button 
               onClick={() => setIsMobileFilterOpen(false)}
               className="w-full bg-[#1C1917] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs"
             >
               Show {filteredProducts.length} Results
             </button>
           </div>
        </div>
      </div>

    </div>
  );
}

// --- HELPER COMPONENTS ---

function FilterGroup({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-[#1C1917]">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// src/pages/Shop.jsx (Scroll down to the bottom component)

// --- UPDATED ADVANCED PRODUCT CARD ---
function ProductCard({ product }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Safeguard: Ensure media array exists and has at least one item
  const primaryMedia = product.media?.[0];
  // Use second item if available, otherwise fall back to primary so it doesn't break
  const secondaryMedia = product.media.length > 1 ? product.media[1] : primaryMedia;

  if (!primaryMedia) return null; // Don't render if data is corrupted

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        {/* MEDIA CONTAINER - Uses CSS Grid to stack images exactly on top of each other */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#F9F8F6] mb-4 grid grid-cols-1 grid-rows-1">
          
          {/* --- SECONDARY MEDIA (Visible on Hover) --- */}
          {/* It sits at layer z-10. Initially opacity-0, becomes opacity-100 on hover */}
          <div className="col-start-1 row-start-1 w-full h-full z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none">
            {secondaryMedia.type === 'video' ? (
              <video 
                src={secondaryMedia.src} 
                className="w-full h-full object-cover"
                autoPlay loop muted playsInline // Essential attributes for autoplaying videos without sound
              />
            ) : (
              <img 
                src={secondaryMedia.src} 
                alt={`${product.name} alternate view`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* --- PRIMARY MEDIA (Default View) --- */}
          {/* It sits at layer z-0. Initially full opacity, fades out slightly on hover for effect */}
          <div className="col-start-1 row-start-1 w-full h-full z-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-0">
             <img 
                src={primaryMedia.src} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
          </div>
          
          {/* BADGES (Sits on top of everything z-20) */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {discount > 0 && (
              <span className="bg-[#FF2865] text-white text-[9px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase tracking-wider">
                -{discount}%
              </span>
            )}
            {product.tags.map(tag => (
              <span key={tag} className="bg-white/90 backdrop-blur text-[#1C1917] text-[9px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Add Button Overlay */}
          <div className="absolute inset-0 z-30 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
             <button className="bg-white text-[#1C1917] px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#1C1917] hover:text-white transition-colors shadow-lg translate-y-4 group-hover:translate-y-0 duration-300">
               <ShoppingBag className="w-3 h-3" /> Quick Add
             </button>
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h3 className="font-serif text-lg text-[#1C1917] leading-tight mb-1 group-hover:text-[#FF2865] transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}