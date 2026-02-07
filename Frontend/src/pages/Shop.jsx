import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  X,
  ChevronDown,
  Heart,
  Loader2,
  Plus,
  SlidersHorizontal,
  Check
} from "lucide-react";
import { getOptimizedImage } from "../util/imageUtils";
import { toast } from "react-hot-toast";

// REDUX IMPORTS
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { toggleWishlistAPI, toggleWishlistLocal } from "../redux/wishlistSlice";

export default function Shop() {
  const dispatch = useDispatch();
  const topRef = useRef(null);

  // Redux State
  const { items: reduxProducts, loading, error, pages, total } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Local State
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    priceRange: null,
  });

  // --- FETCH & SYNC LOGIC (Same as before) ---
  useEffect(() => {
    dispatch(
      fetchProducts({
        pageNumber: currentPage,
        category: filters.category,
        size: filters.size,
        priceRange: filters.priceRange,
        sort: sortOption,
      })
    );
  }, [dispatch, currentPage, filters, sortOption]);

  useEffect(() => {
    if (!loading) {
      if (currentPage === 1) {
        setAllProducts(reduxProducts);
      } else {
        setAllProducts((prev) => {
            const existingIds = new Set(prev.map(p => p._id));
            const newItems = reduxProducts.filter(p => !existingIds.has(p._id));
            return [...prev, ...newItems];
        });
      }
    }
  }, [reduxProducts, loading, currentPage]);

  const handleLoadMore = () => { if (currentPage < pages) setCurrentPage((prev) => prev + 1); };

  const toggleFilter = (type, value) => {
    setCurrentPage(1);
    setFilters((prev) => {
      const current = prev[type];
      if (Array.isArray(current)) {
        const isSelected = current.includes(value);
        return {
          ...prev,
          [type]: isSelected ? current.filter((i) => i !== value) : [...current, value],
        };
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

  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">Error loading products.</p></div>;

  return (
    <div className="bg-white min-h-screen pt-20" ref={topRef}>
      
      {/* HEADER HERO - Clean & Minimal */}
      <div className="bg-[#fffdf9] py-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto animate-fade-up">
            <span className="text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Handcrafted Luxury</span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#1C1917] mb-6">The Collection</h1>
            <div className="w-16 h-[1px] bg-[#1C1917] mx-auto opacity-20"></div>
        </div>
      </div>

      {/* STICKY TOOLBAR - More subtle shadow */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex justify-between items-center transition-all duration-500">
        
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#8B5E3C] transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" /> Filters
        </button>

        <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {total} Styles Found
        </span>

        <div className="flex items-center gap-3 group cursor-pointer">
          <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-[#1C1917] transition-colors hidden md:inline">Sort by</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none bg-transparent text-[10px] font-bold uppercase tracking-widest text-[#1C1917] pr-5 cursor-pointer outline-none"
            >
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-300 group-hover:text-[#1C1917] transition-colors" />
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 flex gap-12 items-start">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block w-64 sticky top-44 space-y-12 h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide pr-6">
           <FilterContent filters={filters} toggleFilter={toggleFilter} clearFilters={clearFilters} />
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-h-[60vh]">
          
          {/* PRODUCT GRID - More gap for 'gallery' feel */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} wishlist={wishlistItems} />
            ))}
            
            {loading && currentPage === 1 && [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>

          {/* EMPTY STATE */}
          {!loading && allProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-0 animate-fade-in forwards" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl font-serif text-[#1C1917] mb-2">No matches found</h3>
              <p className="text-gray-400 text-sm mb-6 font-light">Try adjusting your filters.</p>
              <button onClick={clearFilters} className="text-[#1C1917] border-b border-[#1C1917] pb-1 hover:text-[#8B5E3C] hover:border-[#8B5E3C] transition-all text-sm">
                Clear all filters
              </button>
            </div>
          )}

          {/* LOAD MORE - Elegant Button */}
          <div className="text-center mt-24 mb-16">
            {loading && currentPage > 1 ? (
                <div className="flex items-center justify-center gap-2">
                   <Loader2 className="w-5 h-5 animate-spin text-[#1C1917]" />
                   <span className="text-xs uppercase tracking-widest text-gray-400">Loading...</span>
                </div>
            ) : (
                currentPage < pages && (
                    <button onClick={handleLoadMore} className="group relative px-10 py-4 overflow-hidden rounded-full border border-[#1C1917] bg-transparent text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-white">
                       <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                          Load More
                       </span>
                    </button>
                )
            )}
            {!loading && allProducts.length > 0 && currentPage >= pages && (
               <div className="flex items-center justify-center gap-4 opacity-30 mt-12">
                  <div className="h-[1px] w-16 bg-gray-900"></div>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-serif italic">Fin</span>
                  <div className="h-[1px] w-16 bg-gray-900"></div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${isMobileFilterOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileFilterOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileFilterOpen(false)}
        />
        <div className={`relative bg-white w-[90%] max-w-sm h-full shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-serif text-2xl text-[#1C1917]">Refine</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-12 h-[calc(100%-90px)]">
            <FilterContent filters={filters} toggleFilter={toggleFilter} clearFilters={clearFilters} />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-50">
             <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs">View Results</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function FilterContent({ filters, toggleFilter, clearFilters }) {
  const categories = ["Bridal", "Festive", "Everyday", "Limited Edition", "Office", "Party", "Casual"];
  const prices = [
      { label: "Under ₹2.5k", value: "under-2500" }, 
      { label: "₹2.5k - ₹5k", value: "2500-5000" }, 
      { label: "Above ₹5k", value: "above-5000" }
  ];
  const sizes = [36, 37, 38, 39, 40, 41];

  return (
    <div className="animate-fade-in space-y-10">
      {/* Category - Clean Lists */}
      <div>
        <h3 className="font-serif text-lg text-[#1C1917] mb-4">Category</h3>
        <div className="space-y-3">
           {categories.map((cat) => (
             <button 
                key={cat} 
                onClick={() => toggleFilter("category", cat)} 
                className={`flex items-center gap-3 w-full text-left transition-all duration-300 group`}
             >
                <div className={`w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center transition-all ${filters.category.includes(cat) ? "bg-[#1C1917] border-[#1C1917]" : "group-hover:border-[#1C1917]"}`}>
                    {filters.category.includes(cat) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className={`text-sm ${filters.category.includes(cat) ? "text-[#1C1917] font-medium" : "text-gray-500 group-hover:text-[#1C1917]"}`}>{cat}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-serif text-lg text-[#1C1917] mb-4">Price</h3>
        <div className="space-y-3">
            {prices.map((p) => (
              <button key={p.value} onClick={() => toggleFilter("priceRange", p.value)} className="flex items-center gap-3 w-full text-left group">
                  <div className={`w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center transition-all ${filters.priceRange === p.value ? "bg-[#1C1917] border-[#1C1917]" : "group-hover:border-[#1C1917]"}`}>
                      {filters.priceRange === p.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm ${filters.priceRange === p.value ? "text-[#1C1917] font-medium" : "text-gray-500 group-hover:text-[#1C1917]"}`}>{p.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Size - Minimal Boxes */}
      <div>
         <h3 className="font-serif text-lg text-[#1C1917] mb-4">Size (EU)</h3>
         <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
               <button 
                  key={size} 
                  onClick={() => toggleFilter("size", size)} 
                  className={`h-10 w-full flex items-center justify-center text-xs rounded-md border transition-all duration-300 ${filters.size.includes(size) ? "bg-[#1C1917] text-white border-[#1C1917]" : "bg-transparent text-gray-500 border-gray-200 hover:border-[#1C1917] hover:text-[#1C1917]"}`}
               >
                  {size}
               </button>
            ))}
         </div>
      </div>

      {(filters.category.length > 0 || filters.size.length > 0 || filters.priceRange) && (
          <button onClick={clearFilters} className="text-xs font-bold text-[#1C1917] uppercase tracking-widest border-b border-gray-200 pb-1 hover:border-[#1C1917] transition-all">Clear All</button>
      )}
    </div>
  );
}

function ProductCard({ product, wishlist }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const isWishlisted = Array.isArray(wishlist) && wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.totalStock === 0;

  const optimizedMain = getOptimizedImage(product.image, 600);
  const optimizedHover = product.images?.[1] ? getOptimizedImage(product.images[1], 600) : optimizedMain;
  const hasDiscount = product.originalPrice > product.price;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userInfo) {
      dispatch(toggleWishlistAPI(product)).unwrap().then(() => toast.success(isWishlisted ? "Removed" : "Saved"));
    } else {
      dispatch(toggleWishlistLocal(product));
      toast.success(isWishlisted ? "Removed" : "Saved");
    }
  };

  return (
    <div className="group relative flex flex-col cursor-pointer">
       <Link to={`/product/${product.slug}`} className="block relative mb-4">
          
          {/* IMAGE CONTAINER - Updated for Smoothness & Rounded Corners */}
          <div className="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden rounded-xl">
             
             {/* Main Image */}
             <img 
               src={optimizedMain} 
               alt={product.name} 
               className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOutOfStock ? "grayscale opacity-80" : "group-hover:scale-105"} ${optimizedHover !== optimizedMain ? "group-hover:opacity-0" : ""}`} 
             />
             
             {/* Hover Image (Crossfade) */}
             {optimizedHover !== optimizedMain && !isOutOfStock && (
                <img 
                  src={optimizedHover} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100 group-hover:scale-105" 
                />
             )}
             
             {/* Floating Wishlist - Appears on Hover */}
             <button 
                onClick={handleWishlist}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out hover:bg-[#1C1917] group/btn"
             >
                <Heart className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#1C1917] group-hover/btn:text-white"}`} />
             </button>

             {/* Sold Out Overlay */}
             {isOutOfStock && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                   <div className="bg-[#1C1917] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md">Sold Out</div>
                </div>
             )}
          </div>
       </Link>

       {/* PRODUCT INFO - Minimal & Clean */}
       <div className="text-center">
          <Link to={`/product/${product.slug}`} className="block">
             <h3 className="font-serif text-base text-[#1C1917] mb-1.5 group-hover:text-[#8B5E3C] transition-colors duration-300">{product.name}</h3>
             
             <div className="flex items-center justify-center gap-3">
                <span className="font-medium text-sm text-[#1C1917]">₹{product.price.toLocaleString()}</span>
                {hasDiscount && (
                   <span className="text-xs text-gray-400 line-through font-light">₹{product.originalPrice.toLocaleString()}</span>
                )}
             </div>
          </Link>
          
          {/* Subtle Tags */}
          <div className="flex gap-2 mt-2 justify-center min-h-[20px]">
             {product.isNewArrival && <span className="text-[9px] font-bold uppercase tracking-wider text-[#8B5E3C]">New Arrival</span>}
          </div>
       </div>
    </div>
  );
}

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-100 mb-4 rounded-xl"></div>
            <div className="h-4 bg-gray-100 w-2/3 mx-auto mb-2 rounded-md"></div>
            <div className="h-3 bg-gray-100 w-1/3 mx-auto rounded-md"></div>
        </div>
    )
}