import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImage } from '../util/imageUtils';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';

export default function Shop() {
  const dispatch = useDispatch();

  // Redux State
  const { items: products, loading, error, page, pages, total } = useSelector((state) => state.products);

  // Local Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [filters, setFilters] = useState({ category: [], size: [], priceRange: null });

  // --- THE TRIGGER ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    dispatch(fetchProducts({ 
      pageNumber: currentPage,
      category: filters.category,
      size: filters.size,
      priceRange: filters.priceRange,
      sort: sortOption
    }));
  }, [dispatch, currentPage, filters, sortOption]);

  // --- HANDLERS ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setCurrentPage(newPage);
    }
  };

  const toggleFilter = (type, value) => {
    setCurrentPage(1); 
    setFilters(prev => {
      const current = prev[type];
      if (Array.isArray(current)) {
        return { ...prev, [type]: current.includes(value) ? current.filter(i => i !== value) : [...current, value] };
      }
      return { ...prev, [type]: current === value ? null : value };
    });
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({ category: [], size: [], priceRange: null });
  };

  const handleSortChange = (e) => {
    setCurrentPage(1);
    setSortOption(e.target.value);
  };

  // --- RENDER HELPERS ---
  if (loading && products.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500">Error loading products.</p>
      <button onClick={() => window.location.reload()} className="underline text-[#1C1917]">Try Again</button>
    </div>
  );

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-3">The Collection</h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">Handcrafted luxury for every occasion.</p>
      </div>

      {/* TOOLBAR */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917]"><Filter className="w-4 h-4" /> Filters</button>
        <span className="hidden lg:block text-xs font-bold uppercase tracking-widest text-gray-400">
           {total} Products Found
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden md:inline">Sort by:</span>
          <div className="relative group">
            <select value={sortOption} onChange={handleSortChange} className="appearance-none bg-transparent text-xs font-bold uppercase tracking-widest text-[#1C1917] pr-6 cursor-pointer outline-none">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12 flex gap-12 items-start">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block w-64 sticky top-40 space-y-8 h-[calc(100vh-150px)] overflow-y-auto pr-4 scrollbar-thin">
           <FilterContent filters={filters} toggleFilter={toggleFilter} clearFilters={clearFilters} />
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 transition-opacity duration-300">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* EMPTY STATE */}
          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <p className="text-gray-400 text-lg mb-4">No products match your filters.</p>
               <button onClick={clearFilters} className="text-[#FF2865] underline font-medium">Clear Filters</button>
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:bg-[#1C1917] hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-bold text-[#1C1917]">
                Page {currentPage} of {pages}
              </span>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pages}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:bg-[#1C1917] hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* MOBILE FILTER DRAWER */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${isMobileFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMobileFilterOpen(false)} 
        />
        <div className={`relative bg-white w-4/5 max-w-sm h-full shadow-2xl flex flex-col transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="font-serif text-xl">Filters</h2>
             <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-8">
             <FilterContent filters={filters} toggleFilter={toggleFilter} clearFilters={clearFilters} />
           </div>
           
           <div className="p-6 border-t border-gray-100">
             <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-[#1C1917] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs">
               Show Results ({total})
             </button>
           </div>
        </div>
      </div>

    </div>
  );
}

// --- FIXED: REUSABLE FILTER COMPONENT ---
function FilterContent({ filters, toggleFilter, clearFilters }) {
  return (
    <>
      <FilterGroup title="Category">
        {['Bridal', 'Festive', 'Everyday', 'Limited Edition', 'Party', 'Casual'].map(cat => (
          // ADDED onClick HERE
          <label 
            key={cat} 
            onClick={() => toggleFilter('category', cat)} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${filters.category.includes(cat) ? 'bg-[#1C1917] border-[#1C1917]' : 'border-gray-300 group-hover:border-[#FF2865]'}`}>
              {filters.category.includes(cat) && <span className="w-2 h-2 bg-white rounded-sm" />}
            </div>
            <span className="text-sm text-gray-600 group-hover:text-[#1C1917]">{cat}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {[
          { label: 'Under ₹2,500', value: 'under-2500' },
          { label: '₹2,500 - ₹5,000', value: '2500-5000' },
          { label: 'Above ₹5,000', value: 'above-5000' }
        ].map(price => (
          // ADDED onClick HERE
          <label 
            key={price.value} 
            onClick={() => toggleFilter('priceRange', price.value)}
            className="flex items-center gap-3 cursor-pointer group"
          >
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
                filters.size.includes(size) ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF2865]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterGroup>

      <button onClick={clearFilters} className="text-xs font-bold text-[#FF2865] uppercase tracking-widest hover:text-[#1C1917] transition-colors">Clear Filters</button>
    </>
  );
}

function FilterGroup({ title, children }) {
  return <div className="space-y-4"><h3 className="font-serif text-lg text-[#1C1917]">{title}</h3><div className="space-y-2">{children}</div></div>;
}

// --- FIXED: PRODUCT CARD WITH HOVER EFFECT ---
function ProductCard({ product }) {
  // 1. Get Raw URLs from Data
  const rawMainImage = product.image || '';
  // Check if there is a second image in the array; otherwise fallback to main
  const rawHoverImage = (product.images && product.images.length > 1) 
    ? product.images[1] 
    : rawMainImage;

  // 2. OPTIMIZE: Request 400px width versions (Perfect for Grid Cards)
  const optimizedMain = getOptimizedImage(rawMainImage, 400);
  const optimizedHover = getOptimizedImage(rawHoverImage, 400);
  
  // 3. Check Stock Status
  const isOutOfStock = product.totalStock === 0;

  return (
    <Link 
      to={`/product/${product._id}`} 
      className={`group block ${isOutOfStock ? 'opacity-75' : ''}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
        
        {/* --- MAIN IMAGE --- */}
        {/* Visible by default. Fades out ONLY if there is a different second image */}
        <img 
          src={optimizedMain} 
          alt={product.name} 
          loading="lazy" 
          width="400"
          height="533"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 
            ${optimizedHover !== optimizedMain ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`} 
        />

        {/* --- HOVER IMAGE --- */}
        {/* Only render this if we actually have a DIFFERENT second image */}
        {optimizedHover !== optimizedMain && (
           <img 
             src={optimizedHover} 
             alt={product.name} 
             loading="lazy"
             width="400"
             height="533" 
             className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" 
           />
        )}

        {/* --- SOLD OUT OVERLAY --- */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
            <span className="bg-[#1C1917] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>
      
      {/* --- PRODUCT DETAILS --- */}
      <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#FF2865] transition-colors">
        {product.name}
      </h3>
      
      <div className="flex items-center gap-2 text-sm">
        <p className="font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}