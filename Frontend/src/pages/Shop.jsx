import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  X,
  ChevronDown,
  Heart,
  Loader2,
  Plus
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

  // Redux State (This holds the *current page* data from API)
  const {
    items: reduxProducts, // The items for the current page only
    loading,
    error,
    pages, // Total pages available
    total,
  } = useSelector((state) => state.products);

  // Local State
  const [allProducts, setAllProducts] = useState([]); // Accumulates products (Load More logic)
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    priceRange: null,
  });

  // --- 1. FETCH TRIGGER ---
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

  // --- 2. SYNC & APPEND LOGIC ---
  useEffect(() => {
    // If loading is true, we wait.
    // We only update when reduxProducts changes AND we are not loading (or just finished)
    if (!loading) {
      if (currentPage === 1) {
        // New filter or sort applied -> Replace list
        setAllProducts(reduxProducts);
      } else {
        // Load More clicked -> Append to list
        // We check for duplicates just in case, though ID check is usually enough
        setAllProducts((prev) => {
            // Create a map of existing IDs to prevent duplicates
            const existingIds = new Set(prev.map(p => p._id));
            const newItems = reduxProducts.filter(p => !existingIds.has(p._id));
            return [...prev, ...newItems];
        });
      }
    }
  }, [reduxProducts, loading, currentPage]); // Depend on reduxProducts updating

  // --- HANDLERS ---
  const handleLoadMore = () => {
    if (currentPage < pages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const toggleFilter = (type, value) => {
    setCurrentPage(1); // Reset to page 1
    // setAllProducts([]); // Optional: clear view immediately to show loading state cleanly
    setFilters((prev) => {
      const current = prev[type];
      if (Array.isArray(current)) {
        const isSelected = current.includes(value);
        return {
          ...prev,
          [type]: isSelected
            ? current.filter((i) => i !== value)
            : [...current, value],
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

  // Error State
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">Error loading products.</p>
        <button onClick={() => window.location.reload()} className="underline text-[#1C1917]">
          Try Again
        </button>
      </div>
    );

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20" ref={topRef}>
      <title>Shop Handcrafted Jutis & Ethnic Mojris | Beads and Bloom</title>
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-3">The Collection</h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">Handcrafted luxury for every occasion.</p>
      </div>

      {/* TOOLBAR */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917]"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
        <span className="hidden lg:block text-xs font-bold uppercase tracking-widest text-gray-400">
          {total} Products Found
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden md:inline">Sort by:</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="appearance-none bg-transparent text-xs font-bold uppercase tracking-widest text-[#1C1917] pr-6 cursor-pointer outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="best-selling">Best Sellers</option>
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
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* LOADING SPINNER (First Load) */}
          {loading && currentPage === 1 && (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#1C1917]" />
             </div>
          )}

          {/* EMPTY STATE */}
          {!loading && allProducts.length === 0 && currentPage === 1 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-400 text-lg mb-4">No products match your filters.</p>
              <button onClick={clearFilters} className="text-[#FF2865] underline font-medium">
                Clear Filters
              </button>
            </div>
          )}

          {/* LOAD MORE BUTTON */}
          <div className="text-center mt-16 mb-8">
            {loading && currentPage > 1 ? (
                // Show spinner when loading more
                <button disabled className="bg-gray-100 text-gray-400 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </button>
            ) : (
                // Show button if more pages exist
                currentPage < pages ? (
                    <button onClick={handleLoadMore} className="bg-white border-2 border-[#1C1917] text-[#1C1917] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1C1917] hover:text-white transition-all mx-auto flex items-center gap-2">
                       <Plus size={16} /> Load More Products
                    </button>
                ) : (
                    // End of list message
                    allProducts.length > 0 && <p className="text-gray-400 text-xs uppercase tracking-widest">You've reached the end</p>
                )
            )}
          </div>

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${isMobileFilterOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileFilterOpen(false)}
        />
        <div className={`relative bg-white w-4/5 max-w-sm h-full shadow-2xl transition-transform duration-300 ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-serif text-xl">Filters</h2>
            <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <FilterContent filters={filters} toggleFilter={toggleFilter} clearFilters={clearFilters} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterContent({ filters, toggleFilter, clearFilters }) {
  return (
    <>
      <FilterGroup title="Category">
        {["Bridal", "Festive", "Everyday", "Limited Edition", "Office", "Party", "Casual"].map((cat) => (
          <button key={cat} onClick={() => toggleFilter("category", cat)} className="flex items-center gap-3 w-full text-left group">
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${filters.category.includes(cat) ? "bg-[#1C1917] border-[#1C1917]" : "border-gray-300 group-hover:border-[#FF2865]"}`}>
              {filters.category.includes(cat) && <span className="w-2 h-2 bg-white rounded-sm" />}
            </div>
            <span className="text-sm text-gray-600 group-hover:text-[#1C1917]">{cat}</span>
          </button>
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {[{ label: "Under ₹2,500", value: "under-2500" }, { label: "₹2,500 - ₹5,000", value: "2500-5000" }, { label: "Above ₹5,000", value: "above-5000" }].map((p) => (
          <button key={p.value} onClick={() => toggleFilter("priceRange", p.value)} className="flex items-center gap-3 w-full text-left group">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.priceRange === p.value ? "border-[#FF2865]" : "border-gray-300"}`}>
              {filters.priceRange === p.value && <div className="w-2 h-2 rounded-full bg-[#FF2865]" />}
            </div>
            <span className="text-sm text-gray-600 group-hover:text-[#1C1917]">{p.label}</span>
          </button>
        ))}
      </FilterGroup>
      <FilterGroup title="Size">
        <div className="grid grid-cols-4 gap-2">
          {[36, 37, 38, 39, 40, 41].map((size) => (
            <button key={size} onClick={() => toggleFilter("size", size)} className={`w-10 h-10 flex items-center justify-center text-sm border transition-all ${filters.size.includes(size) ? "bg-[#1C1917] text-white border-[#1C1917]" : "bg-white text-gray-600 border-gray-200 hover:border-[#FF2865]"}`}>
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
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-[#1C1917]">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.totalStock === 0;

  const optimizedMain = getOptimizedImage(product.image, 400);
  const optimizedHover = product.images?.[1] ? getOptimizedImage(product.images[1], 400) : optimizedMain;

  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (userInfo) {
      dispatch(toggleWishlistAPI(product))
        .unwrap()
        .then(() => toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist"))
        .catch(() => toast.error("Action Failed"));
    } else {
      dispatch(toggleWishlistLocal(product));
      toast.success(isWishlisted ? "Removed" : "Saved to Wishlist");
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className={`group block ${isOutOfStock ? "opacity-75" : ""}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
        {/* IMAGES */}
        <img
          src={optimizedMain}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${optimizedHover !== optimizedMain ? "group-hover:opacity-0" : "group-hover:scale-110"}`}
        />
        {optimizedHover !== optimizedMain && (
          <img
            src={optimizedHover}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* --- WISHLIST BUTTON --- */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-400"}`} />
        </button>

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isOutOfStock ? (
            <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase shadow-sm">Sold Out</span>
          ) : (
            <>
              {product.isNewArrival && <span className="bg-white text-black px-3 py-1 text-[10px] font-bold uppercase shadow-sm">New</span>}
              {hasDiscount && <span className="bg-[#FF2865] text-white px-3 py-1 text-[10px] font-bold uppercase shadow-sm">{discountPercent}% OFF</span>}
            </>
          )}
        </div>
      </div>

      <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#FF2865] transition-colors truncate">{product.name}</h3>
      <div className="flex items-center gap-2 text-sm mt-1">
        <p className="font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
        {hasDiscount && <p className="text-gray-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</p>}
      </div>
    </Link>
  );
}