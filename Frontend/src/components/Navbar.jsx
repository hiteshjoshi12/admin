import siteNavigation from "@shared/siteNavigation.json";
import { ShoppingBag, Menu, X, User, LogOut, Package, ChevronDown, Heart, Search, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { clearWishlist } from "../redux/wishlistSlice";

// CONFIG & HOOKS
import { API_BASE_URL } from "../util/config";
import { getOptimizedImage } from "../util/imageUtils";
import { useDebounce } from "../hooks/useDebounce";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.shippingSettings?.freeShippingThreshold) {
          setFreeShippingThreshold(Number(data.shippingSettings.freeShippingThreshold));
        }
      })
      .catch(() => {});
  }, []);

  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchButtonRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems = [] } = useSelector((state) => state.cart);
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navLinks = siteNavigation.navLinks;

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/shop') {
      return location.pathname === '/shop' || location.pathname.startsWith('/product/');
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/search/instant?q=${debouncedSearchTerm}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        isSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  const handleLogout = () => {
    dispatch(logout()); dispatch(clearCart()); dispatch(clearWishlist());
    setIsMobileMenuOpen(false); navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <>
      <div className={`bg-[#1C1917] text-white text-[10px] md:text-xs font-bold tracking-widest text-center py-2 transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
        FREE SHIPPING ON ALL ORDERS ABOVE ₹{freeShippingThreshold.toLocaleString()}
      </div>

      <div className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${isScrolled ? "top-0 pt-0 px-0" : "top-8 pt-2 px-3"}`}>
        
        <nav className={`relative flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled 
            ? "w-full max-w-full rounded-none px-6 md:px-10 py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" 
            : "w-full max-w-[1440px] rounded-full px-6 md:px-8 py-4 bg-white shadow-2xl"
        }`}>
          
          {/* 1. LOGO - ALWAYS VISIBLE */}
          <Link to="/" className="flex flex-col group z-50 relative shrink-0" onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(false); }}>
            <span className="font-serif text-xl font-bold tracking-wide text-[#1C1917] leading-none group-hover:text-gray-600 transition-colors">
              BEADS & BLOOM
            </span>
            <span className="text-[0.5rem] md:text-[0.6rem] font-sans text-stone-500 tracking-[0.25em] uppercase mt-1">
              Handcrafted Luxury
            </span>
          </Link>

          {/* 2. NAV LINKS - HIDDEN WHEN SEARCH OPEN */}
          <div className={`hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest relative py-1 px-1 flex items-center gap-1 transition-colors ${
                    active
                      ? 'text-[#1C1917] font-extrabold'
                      : link.isSpecial
                        ? 'text-[#8B5E3C] font-extrabold hover:text-[#1C1917]'
                        : 'text-gray-500 font-bold hover:text-[#1C1917]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-[#1C1917] text-white text-[8px] px-1.5 py-0.5 rounded ml-1 -translate-y-2">{link.badge}</span>
                  )}
                  {active ? (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#1C1917] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : (
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black/40 group-hover:w-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 3. SEARCH BAR */}
          <div 
            ref={searchContainerRef}
            className={`absolute top-0 h-full z-[60] bg-white border border-gray-200 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center px-4 md:px-5 ${
              isScrolled ? "rounded-none" : "rounded-full"
            } ${
              isSearchOpen 
                ? "opacity-100 translate-y-0 pointer-events-auto" 
                : "opacity-0 -translate-y-full pointer-events-none"
            } left-0 w-full lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px]`}
          >
             <form onSubmit={handleSearchSubmit} className="relative w-full h-full flex items-center">
                {/* Search Icon Left */}
                <Search className="text-gray-400 w-5 h-5 shrink-0" />
                
                {/* Input Field */}
                <input 
                   ref={searchInputRef}
                   type="text" 
                   placeholder="Search handcrafted luxury..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-transparent pl-3 pr-8 py-2 text-sm md:text-base text-left focus:outline-none placeholder:text-gray-400 transition-all font-medium text-[#1C1917]"
                />
                
                {/* Close Button Right */}
                <button 
                   type="button" 
                   onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                   aria-label="Close search bar"
                   className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                >
                   <X size={18} />
                </button>

                {/* Dropdown Results */}
                {isSearchOpen && (searchResults.length > 0 || isSearching || (debouncedSearchTerm && searchResults.length === 0)) && (
                   <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up text-left">
                      {isSearching ? (
                         <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin w-4 h-4 text-[#1C1917]"/> Searching...
                         </div>
                      ) : searchResults.length > 0 ? (
                         <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 py-2 bg-gray-50 sticky top-0">Top Results</p>
                           {searchResults.map((product) => (
                              <Link 
                                key={product._id} 
                                to={`/product/${product.slug}`}
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                              >
                                 <img src={getOptimizedImage(product.image, 100)} alt={product.name} className="w-10 h-10 object-cover rounded-md shrink-0" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate hover:text-[#C5A059]">{product.name}</p>
                                    <p className="text-xs text-gray-500">₹{product.price}</p>
                                 </div>
                              </Link>
                           ))}
                           <Link to={`/shop?keyword=${encodeURIComponent(searchQuery)}`} onClick={() => setIsSearchOpen(false)} className="block text-center text-xs font-bold uppercase text-[#1C1917] py-3 bg-gray-50 hover:bg-gray-100 transition-colors sticky bottom-0">
                              View All Results
                           </Link>
                         </div>
                      ) : (
                         <div className="p-4 text-center text-xs text-gray-500">
                           No products found for "{debouncedSearchTerm}"
                         </div>
                      )}
                   </div>
                )}
             </form>
          </div>

          {/* 4. RIGHT ICONS */}
          <div className="flex items-center gap-2 md:gap-4 z-40 bg-white/0 pl-4">
            <button 
              ref={searchButtonRef}
              onClick={() => {
                 setIsMobileMenuOpen(false);
                 setIsSearchOpen(!isSearchOpen);
                 if(!isSearchOpen) setSearchQuery(""); 
              }} 
              aria-label={isSearchOpen ? "Close search bar" : "Open search bar"}
              className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'text-[#1C1917] bg-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/wishlist" aria-label="View Wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Heart className="w-5 h-5 text-gray-700 hover:text-[#FF2865] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#FF2865] text-white text-[9px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" aria-label="View Shopping Cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#1C1917] text-white text-[9px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:block">
              {userInfo ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-label="User account menu" className="flex items-center gap-1 p-1 rounded-full border border-transparent hover:border-gray-200 transition-all">
                    <div className="w-8 h-8 bg-[#1C1917] text-white rounded-full flex items-center justify-center font-serif text-sm">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-up origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Signed in as</p>
                        <p className="font-bold text-sm truncate text-[#1C1917]">{userInfo.name}</p>
                      </div>
                      
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1C1917]">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/myorders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1C1917]">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {userInfo.isAdmin && (
                         <Link to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-50">
                            Admin Dashboard
                         </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 border-t border-gray-50 text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                  <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black">Log In</Link>
                </div>
              )}
            </div>

            <button 
              className="md:hidden p-2" 
              onClick={() => {
                setIsSearchOpen(false);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }} 
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col pt-28 md:pt-32 px-6 overflow-y-auto pb-12 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-3xl font-serif flex items-center justify-between w-full transition-colors ${
                  active ? 'text-[#1C1917] font-bold' : 'text-gray-700 hover:text-[#C5A059]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.name}
                  {active && <span className="w-2 h-2 rounded-full bg-[#1C1917]" />}
                </span>
                <ArrowRight size={20} className={active ? "text-[#1C1917]" : "text-gray-300"} />
              </Link>
            );
          })}
          
          <div className="w-full h-[1px] bg-gray-100 my-4"></div>

          {userInfo ? (
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1C1917] text-white rounded-full flex items-center justify-center font-serif">{userInfo.name.charAt(0)}</div>
                  <p className="font-bold text-lg">{userInfo.name}</p>
               </div>
               <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg text-gray-600">My Profile</Link>
               <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg text-[#FF2865]">Wishlist ({wishlistCount})</Link>
               <button onClick={handleLogout} className="block text-lg text-red-500">Sign Out</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-center border border-gray-300 rounded-xl font-bold uppercase text-sm">Log In</Link>
               <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-center bg-black text-white rounded-xl font-bold uppercase text-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}