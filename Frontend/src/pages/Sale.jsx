import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ShoppingBag, Loader2, Copy, Plus, Ticket, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

// REDUX & API
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { API_BASE_URL } from '../util/config';
import { getOptimizedImage } from '../util/imageUtils';

export default function Sale() {
  const dispatch = useDispatch();
  const topRef = useRef(null);

  // --- STATE ---
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // PAGINATION
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    size: null,
    priceRange: null, 
    category: null
  });

  // --- 1. FETCH PRODUCTS ---
  const fetchProducts = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`${API_BASE_URL}/api/products?pageNumber=${pageNumber}`);
      const data = await res.json();
      
      if (res.ok) {
        let newProducts = [];
        let total = 1;

        if (data.products && Array.isArray(data.products)) {
            newProducts = data.products;
            total = data.pages || 1;
        } else if (Array.isArray(data)) {
            newProducts = data;
        }

        setTotalPages(total);

        if (pageNumber === 1) {
            setAllProducts(newProducts);
            // Only show items that are actually on sale or have a discount
            // Logic: originalPrice > price
            const saleItems = newProducts.filter(p => Number(p.originalPrice) > Number(p.price));
            // Fallback: If no explicit sale items, show all (for demo purposes), otherwise show saleItems
            setDisplayedProducts(saleItems.length > 0 ? saleItems : newProducts); 
        } else {
            const updatedList = [...allProducts, ...newProducts];
            setAllProducts(updatedList);
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

  useEffect(() => {
    fetchProducts(1);
    window.scrollTo(0, 0);
  }, []);

  // --- 2. FILTER LOGIC ---
  const applyFilters = (products, currentFilters) => {
      let result = [...products];

      // Always ensure we prioritize sale items in the view
      // result = result.filter(p => Number(p.originalPrice) > Number(p.price));

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
        <div className="min-h-screen flex items-center justify-center bg-white">
           <Loader2 className="w-8 h-8 animate-spin text-[#1C1917]" />
        </div>
     );
  }

  return (
    <div className="bg-white min-h-screen pt-20" ref={topRef}>
      
      {/* HERO SECTION - Minimal & Classy */}
      <section className="bg-[#fcf8f5] py-20 px-6 text-center relative overflow-hidden border-b border-[#f0ebe0]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#1C1917 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 max-w-2xl mx-auto animate-fade-up">
          <span className="text-[#FF2865] text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Limited Time Event</span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#1C1917] mb-6 tracking-tight">The Archive Sale</h1>
          <p className="text-gray-500 text-sm md:text-base font-light mb-10 max-w-md mx-auto">
            Exclusive access to our handcrafted favorites at exceptional prices. Quantities are limited.
          </p>

          {/* Coupon Ticket */}
          <div onClick={copyCoupon} className="group cursor-pointer inline-flex items-center bg-white border border-[#1C1917] px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF2865]"></div>
             <div className="text-left mr-8">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Extra 10% Off Code</p>
                <p className="text-lg font-mono font-bold text-[#1C1917] tracking-widest group-hover:text-[#FF2865] transition-colors">INAUGURAL10</p>
             </div>
             <div className="h-8 w-[1px] bg-gray-200 mx-4"></div>
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-[#1C1917] flex items-center gap-2">
                <Copy size={14} /> Copy
             </span>
          </div>
        </div>
      </section>

      {/* FILTER BAR - Sticky & Clean */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-50 shadow-sm transition-all">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{displayedProducts.length} Treasures Found</p>
          
          <div className="flex flex-wrap justify-center gap-3 relative">
            
            {/* Size Filter */}
            <div className="relative">
              <button onClick={() => toggleDropdown('size')} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all ${filters.size ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-transparent text-[#1C1917] border-gray-200 hover:border-[#1C1917]'}`}>
                Size {filters.size ? `(${filters.size})` : ''} <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'size' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl rounded-xl p-3 border border-gray-100 grid grid-cols-3 gap-2 z-40 animate-fade-in">
                  {[36, 37, 38, 39, 40, 41].map(size => (
                    <button key={size} onClick={() => setFilter('size', size)} className={`py-2 text-xs font-bold rounded-md transition-colors ${filters.size === size ? 'bg-[#1C1917] text-white' : 'hover:bg-gray-50 text-gray-600'}`}>{size}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button onClick={() => toggleDropdown('price')} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all ${filters.priceRange ? 'bg-[#1C1917] text-white border-[#1C1917]' : 'bg-transparent text-[#1C1917] border-gray-200 hover:border-[#1C1917]'}`}>
                Price <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'price' && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl p-2 border border-gray-100 flex flex-col gap-1 z-40 animate-fade-in">
                  {[
                    { label: 'Under ₹2000', value: 'under-2000' },
                    { label: '₹2000 - ₹3000', value: '2000-3000' },
                    { label: 'Above ₹3000', value: 'above-3000' }
                  ].map(option => (
                    <button key={option.value} onClick={() => setFilter('priceRange', option.value)} className={`py-3 px-4 text-left text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${filters.priceRange === option.value ? 'bg-[#f8f8f8] text-[#1C1917]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1C1917]'}`}>
                       {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[10px] font-bold uppercase tracking-widest text-[#FF2865] hover:text-[#1C1917] ml-2 border-b border-[#FF2865] hover:border-[#1C1917] transition-all pb-0.5">
                 Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          
          {Array.isArray(displayedProducts) && displayedProducts.map((product) => {
            
            const pPrice = Number(product.price);
            const pOriginal = Number(product.originalPrice);
            const isOnSale = pOriginal > 0 && pOriginal > pPrice;
            const discount = isOnSale ? Math.round(((pOriginal - pPrice) / pOriginal) * 100) : 0;
            
            return (
                <Link to={`/product/${product.slug}`} key={product._id} className="group relative block cursor-pointer">
                
                {/* 🔴 DISCOUNT BADGE */}
                {isOnSale && (
                    <div className="absolute top-3 left-3 z-20 bg-[#FF2865] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">
                        -{discount}% Sale
                    </div>
                )}

                {/* Product Image - Soft Corners & Physics Transition */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f4f4f4] mb-5">
                    <img 
                       src={getOptimizedImage(product.image, 500)} 
                       alt={product.name} 
                       className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" 
                    />
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0">
                        <button 
                           onClick={(e) => handleQuickAdd(e, product)} 
                           className="w-full bg-white/95 backdrop-blur-sm text-[#1C1917] py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#1C1917] hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                           <ShoppingBag className="w-3 h-3" /> Quick Add
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                    <h3 className="font-serif text-base text-[#1C1917] mb-1 group-hover:text-[#8B5E3C] transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-center gap-3">
                        <span className="font-bold text-sm text-[#FF2865]">₹{pPrice.toLocaleString()}</span>
                        {isOnSale && (
                            <span className="text-xs text-gray-400 line-through">₹{pOriginal.toLocaleString()}</span>
                        )}
                    </div>
                </div>

                </Link>
            );
          })}
        </div>

        {/* --- LOAD MORE --- */}
        <div className="text-center mt-20 mb-8">
           {loadingMore ? (
               <div className="flex items-center justify-center gap-2 opacity-50">
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
               </div>
           ) : (
               page < totalPages ? (
                   <button onClick={handleLoadMore} className="group relative px-10 py-4 overflow-hidden rounded-full border border-[#1C1917] bg-transparent text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-white">
                      <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                         View More
                      </span>
                   </button>
               ) : (
                   displayedProducts.length > 0 && (
                      <div className="flex items-center justify-center gap-4 opacity-20">
                         <div className="h-[1px] w-12 bg-black"></div>
                         <span className="text-[9px] uppercase tracking-[0.3em] font-serif">End</span>
                         <div className="h-[1px] w-12 bg-black"></div>
                      </div>
                   )
               )
           )}
        </div>

        {/* Empty State */}
        {(!displayedProducts || displayedProducts.length === 0) && !loading && (
          <div className="text-center py-32 opacity-0 animate-fade-in forwards" style={{animationDelay: '0.2s'}}>
            <h3 className="text-2xl font-serif text-[#1C1917] mb-2">No sale items found.</h3>
            <p className="text-gray-400 text-sm mb-6">Check back later for new markdowns.</p>
            <button onClick={clearAllFilters} className="text-[#1C1917] border-b border-[#1C1917] pb-1 hover:text-[#FF2865] hover:border-[#FF2865] transition-all text-xs font-bold uppercase tracking-widest">
                Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}