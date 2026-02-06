import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ShoppingBag, Loader2, Copy, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// REDUX & API
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { API_BASE_URL } from '../util/config';
import { getOptimizedImage } from '../util/imageUtils';

export default function Sale() {
  const dispatch = useDispatch();

  // --- STATE ---
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // For "Load More" spinner
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    size: null,
    priceRange: null, 
    category: null
  });

  // --- 1. FETCH PRODUCTS (Pagination Logic) ---
  const fetchProducts = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      // Add ?pageNumber=X to the URL
      const res = await fetch(`${API_BASE_URL}/api/products?pageNumber=${pageNumber}`);
      const data = await res.json();
      
      if (res.ok) {
        let newProducts = [];
        let total = 1;

        // Handle { products: [...], pages: 10 } structure
        if (data.products && Array.isArray(data.products)) {
            newProducts = data.products;
            total = data.pages || 1;
        } else if (Array.isArray(data)) {
            newProducts = data;
        }

        setTotalPages(total);

        // If Page 1, replace. If Page > 1, append.
        if (pageNumber === 1) {
            setAllProducts(newProducts);
            setDisplayedProducts(newProducts);
        } else {
            const updatedList = [...allProducts, ...newProducts];
            setAllProducts(updatedList);
            // Re-apply filters instantly to the new combined list
            setDisplayedProducts(applyFilters(updatedList, filters));
        }

      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchProducts(1);
    window.scrollTo(0, 0);
  }, []);

  // --- 2. FILTER LOGIC (Extracted for reuse) ---
  const applyFilters = (products, currentFilters) => {
      let result = [...products];

      if (currentFilters.size) {
        result = result.filter(p => 
          p.stock && p.stock.some(s => s.size === currentFilters.size && s.quantity > 0)
        );
      }
      if (currentFilters.category) {
        result = result.filter(p => p.category === currentFilters.category);
      }
      if (currentFilters.priceRange) {
        if (currentFilters.priceRange === 'under-2000') {
          result = result.filter(p => p.price < 2000);
        } else if (currentFilters.priceRange === '2000-3000') {
          result = result.filter(p => p.price >= 2000 && p.price <= 3000);
        } else if (currentFilters.priceRange === 'above-3000') {
          result = result.filter(p => p.price > 3000);
        }
      }
      return result;
  };

  // Re-run filters when filter state changes
  useEffect(() => {
    setDisplayedProducts(applyFilters(allProducts, filters));
  }, [filters, allProducts]);


  // --- HANDLERS ---
  const handleLoadMore = () => {
      if (page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage);
      }
  };

  const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveDropdown(null);
  };

  const clearAllFilters = () => {
    setFilters({ size: null, priceRange: null, category: null });
    setActiveDropdown(null);
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!product.stock || !Array.isArray(product.stock)) return toast.error("Stock info unavailable");
    const availableSize = product.stock.find(s => s.quantity > 0);
    
    if (availableSize) {
       dispatch(addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: availableSize.size,
          quantity: 1,
          maxStock: availableSize.quantity
       }));
       toast.success(`Added Size ${availableSize.size} to Bag`);
    } else {
       toast.error("Sold Out");
    }
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText("INAUGURAL10");
    toast.success("Code copied: INAUGURAL10");
  };

  const hasActiveFilters = filters.size || filters.priceRange || filters.category;

  if (loading && page === 1) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
           <Loader2 className="w-10 h-10 animate-spin text-[#1C1917]" />
        </div>
     );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      
      {/* HERO SECTION */}
      <section className="bg-[#1C1917] text-white py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-[#1C1917] to-[#1C1917] opacity-50"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="bg-[#FF2865] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block animate-pulse">Special Offer</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">Shop The <span className="italic text-[#FF2865]">Collection</span></h1>
          <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl max-w-sm mx-auto flex items-center justify-between gap-4 shadow-lg">
             <div className="text-left">
                <p className="text-xs text-gray-300 uppercase tracking-wider">Extra 10% Off</p>
                <p className="text-xl font-bold font-mono text-[#FF2865] tracking-wide">INAUGURAL10</p>
             </div>
             <button onClick={copyCoupon} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-[#FF2865] hover:text-white transition-colors flex items-center gap-2">
                <Copy size={14} /> Copy
             </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{allProducts.length} Styles Loaded</p>
          <div className="flex flex-wrap justify-center gap-3 relative">
            {/* Size Filter */}
            <div className="relative">
              <button onClick={() => toggleDropdown('size')} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${filters.size ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}>
                Size {filters.size ? `(${filters.size})` : ''} <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'size' && (
                <div className="absolute top-full mt-2 w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100 grid grid-cols-3 gap-1 z-40 animate-fade-up">
                  {[36, 37, 38, 39, 40, 41].map(size => (
                    <button key={size} onClick={() => setFilter('size', size)} className={`py-2 text-sm rounded-lg hover:bg-gray-50 ${filters.size === size ? 'bg-[#FF2865] text-white' : ''}`}>{size}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Price Filter */}
            <div className="relative">
              <button onClick={() => toggleDropdown('price')} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${filters.priceRange ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}>
                Price <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'price' && (
                <div className="absolute top-full mt-2 w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100 flex flex-col gap-1 z-40 animate-fade-up">
                  {[
                    { label: 'Under ₹2000', value: 'under-2000' },
                    { label: '₹2000 - ₹3000', value: '2000-3000' },
                    { label: 'Above ₹3000', value: 'above-3000' }
                  ].map(option => (
                    <button key={option.value} onClick={() => setFilter('priceRange', option.value)} className={`py-2 px-3 text-left text-sm rounded-lg hover:bg-gray-50 ${filters.priceRange === option.value ? 'bg-[#FF2865] text-white' : 'text-gray-600'}`}>{option.label}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Category Filter */}
            <div className="relative">
              <button onClick={() => toggleDropdown('category')} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${filters.category ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}>
                Category {filters.category ? `(${filters.category})` : ''} <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'category' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100 flex flex-col gap-1 z-40 animate-fade-up">
                  {['Mules', 'Heels', 'Wedges', 'Flats'].map(cat => (
                    <button key={cat} onClick={() => setFilter('category', cat)} className={`py-2 px-3 text-left text-sm rounded-lg hover:bg-gray-50 ${filters.category === cat ? 'bg-[#FF2865] text-white' : 'text-gray-600'}`}>{cat}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Clear All */}
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs text-[#FF2865] underline hover:text-black ml-2">Clear All</button>
            )}
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          
          {Array.isArray(displayedProducts) && displayedProducts.map((product) => {
            
            // 🚨 FIXED LOGIC: Force Number conversion to ensure accurate math
            const pPrice = Number(product.price);
            const pOriginal = Number(product.originalPrice);

            // It is on sale ONLY if original > price AND original is not zero
            const isOnSale = pOriginal > 0 && pOriginal > pPrice;
            
            const discount = isOnSale 
                ? Math.round(((pOriginal - pPrice) / pOriginal) * 100) 
                : 0;
            
            return (
                <Link to={`/product/${product.slug}`} key={product._id} className="group relative block">
                
                {/* 🔴 DISCOUNT BADGE */}
                {isOnSale && (
                    <div className="absolute top-3 left-3 z-20 bg-[#FF2865] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md animate-fade-in">
                        -{discount}%
                    </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
                    <img src={getOptimizedImage(product.image, 400)} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button onClick={(e) => handleQuickAdd(e, product)} className="bg-white text-[#1C1917] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#FF2865] hover:text-white transition-colors shadow-lg translate-y-4 group-hover:translate-y-0 duration-300">
                           <ShoppingBag className="w-3 h-3" /> Quick Add
                        </button>
                    </div>

                    {product.isNewArrival && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[9px] uppercase tracking-widest font-bold text-[#1C1917] rounded-sm">New Arrival</div>
                    )}
                </div>

                {/* Product Info */}
                <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="font-serif text-lg text-[#1C1917] mb-1">{product.name}</h3>
                    <div className="flex items-center justify-center gap-3">
                        {/* 🔴 CROSSED PRICE */}
                        {isOnSale && (
                            <span className="text-gray-400 line-through text-sm">₹{pOriginal.toLocaleString()}</span>
                        )}
                        <span className={`${isOnSale ? 'text-[#FF2865]' : 'text-[#1C1917]'} font-bold text-lg`}>
                            ₹{pPrice.toLocaleString()}
                        </span>
                    </div>
                </div>

                </Link>
            );
          })}
        </div>

        {/* --- LOAD MORE BUTTON --- */}
        <div className="text-center mt-12 mb-8">
           {loadingMore ? (
               <button disabled className="bg-gray-100 text-gray-400 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto">
                   <Loader2 className="w-4 h-4 animate-spin" /> Loading...
               </button>
           ) : (
               // Only show if we have more pages to load
               page < totalPages ? (
                   <button onClick={handleLoadMore} className="bg-white border-2 border-[#1C1917] text-[#1C1917] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1C1917] hover:text-white transition-all mx-auto flex items-center gap-2">
                      <Plus size={16} /> Load More Products
                   </button>
               ) : (
                   displayedProducts.length > 0 && <p className="text-gray-400 text-xs uppercase tracking-widest">You've reached the end</p>
               )
           )}
        </div>

        {/* Empty State */}
        {(!displayedProducts || displayedProducts.length === 0) && !loading && (
          <div className="text-center py-20 animate-fade-in">
            <h3 className="text-2xl font-serif text-gray-400">No treasures found.</h3>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
            <button onClick={clearAllFilters} className="text-[#FF2865] mt-4 underline font-bold">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}