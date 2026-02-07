import { ShoppingBag, Menu, X, User, LogOut, Package, ChevronDown, Heart, Search, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

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

  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems = [] } = useSelector((state) => state.cart);
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navLinks = [
    { name: 'New Arrivals', path: '/shop?sort=newest', badge: 'NEW' },
    { name: 'Bridal', path: '/shop?category=Bridal' },
    { name: 'Casual', path: '/shop?category=Casual' },
    { name: 'Sale', path: '/sale', isSpecial: true },
  ];

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
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout()); dispatch(clearCart()); dispatch(clearWishlist());
    setIsMobileMenuOpen(false); navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?keyword=${searchQuery}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <>
      <div className={`bg-[#1C1917] text-white text-[10px] md:text-xs font-bold tracking-widest text-center py-2 transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
        FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹5000
      </div>

      <div className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${isScrolled ? "top-0 pt-0 px-0" : "top-8 pt-2 px-3"}`}>
        
        <nav className={`relative flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled 
            ? "w-full max-w-full rounded-none px-6 md:px-10 py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" 
            : "w-full max-w-[1440px] rounded-full px-6 md:px-8 py-4 bg-white shadow-2xl"
        }`}>
          
          {/* 1. LOGO - ALWAYS VISIBLE */}
          <Link to="/" className="flex flex-col group z-50 relative shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-serif text-xl font-bold tracking-wide text-[#1C1917] leading-none group-hover:text-gray-600 transition-colors">
              BEADS & BLOOM
            </span>
            <span className="text-[0.5rem] md:text-[0.6rem] font-sans text-gray-400 tracking-[0.25em] uppercase mt-1">
              Handcrafted Luxury
            </span>
          </Link>

          {/* 2. NAV LINKS - HIDDEN WHEN SEARCH OPEN */}
          <div className={`hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest relative group flex items-center gap-1 ${link.isSpecial ? 'text-[#C5A059]' : 'text-gray-600 hover:text-black'}`}
              >
                {link.name}
                {link.badge && (
                  <span className="bg-[#1C1917] text-white text-[8px] px-1.5 py-0.5 rounded ml-1 -translate-y-2">{link.badge}</span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* 3. SEARCH BAR - CENTERED, DROPS FROM TOP */}
          <div 
            className={`hidden border rounded-2xl border-gray-200 lg:flex absolute left-1/2 -translate-x-1/2 top-0 h-full w-[600px] bg-white z-40 items-center justify-center  transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
          >
             <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                {/* Search Icon Left */}
                <Search className="absolute left-3 text-gray-400 w-6 h-6" />
                
                {/* Input Field */}
                <input 
                   ref={searchInputRef}
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-transparent  pl-12 pr-8 py-2 text-sm text-left focus:outline-none focus:border-[#1C1917] placeholder:text-gray-300 transition-all font-medium "
                />
                
                {/* Close Button Right */}
                <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="absolute right-4 text-gray-400 hover:text-red-500 p-1">
                   <X size={16} />
                </button>

                {/* Dropdown Results */}
                {isSearchOpen && (searchResults.length > 0 || isSearching) && (
                   <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up text-left">
                      {isSearching ? (
                         <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin w-3 h-3"/> Searching...
                         </div>
                      ) : (
                         <div className="max-h-[400px] overflow-y-auto">
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 py-2 bg-gray-50 sticky top-0">Top Results</p>
                           {searchResults.map((product) => (
                              <Link 
                                key={product._id} 
                                to={`/product/${product.slug}`}
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                              >
                                 <img src={getOptimizedImage(product.image, 100)} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[#C5A059]">{product.name}</p>
                                    <p className="text-xs text-gray-500">₹{product.price}</p>
                                 </div>
                              </Link>
                           ))}
                           <Link to={`/shop?keyword=${searchQuery}`} onClick={() => setIsSearchOpen(false)} className="block text-center text-xs font-bold uppercase text-[#1C1917] py-3 bg-gray-50 hover:bg-gray-100 transition-colors sticky bottom-0">
                              View All Results
                           </Link>
                         </div>
                      )}
                   </div>
                )}
             </form>
          </div>

          {/* 4. RIGHT ICONS */}
          <div className="flex items-center gap-2 md:gap-4 z-50 bg-white/0 pl-4">
            <button 
              onClick={() => {
                 setIsSearchOpen(!isSearchOpen);
                 if(!isSearchOpen) setSearchQuery(""); 
              }} 
              className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'text-[#1C1917] bg-gray-100' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Heart className="w-5 h-5 text-gray-700 hover:text-[#FF2865] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#FF2865] text-white text-[9px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 p-1 rounded-full border border-transparent hover:border-gray-200 transition-all">
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

            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col pt-32 px-6 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        
        <form onSubmit={handleSearchSubmit} className="relative mb-8">
           <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full px-6 py-4 text-lg outline-none focus:border-black"
           />
           <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><Search /></button>
        </form>

        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-serif text-brand-black flex items-center justify-between w-full hover:text-[#C5A059] transition-colors"
            >
              {link.name} <ArrowRight size={20} className="text-gray-300" />
            </Link>
          ))}
          
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