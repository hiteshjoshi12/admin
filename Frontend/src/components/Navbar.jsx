import { ShoppingBag, Menu, X, User, LogOut, Package, ChevronDown, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// REDUX IMPORTS
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { clearWishlist } from "../redux/wishlistSlice"; // Import clearWishlist

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // 1. GET DATA FROM REDUX
  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems = [] } = useSelector((state) => state.cart);
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist); // Get Wishlist

  // 2. CALCULATE COUNTS
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navLinks = [
    { name: 'Sale', path: '/sale', isSpecial: true },
    { name: 'New Arrivals', path: '/shop' },
    { name: 'Bridal', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    dispatch(logout()); 
    dispatch(clearCart()); 
    dispatch(clearWishlist()); // Clear wishlist on logout
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${isScrolled ? "pt-0 px-0" : "pt-2 px-3"}`}>
        <nav className={`bg-white flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled ? "w-full max-w-full rounded-none px-6 md:px-10 py-4 shadow-md" : "w-full max-w-325 rounded-full px-6 md:px-8 py-4 shadow-2xl animate-fade-up"
        }`}>
          
          {/* LEFT: Brand */}
          <Link to="/" className="flex flex-col group z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="font-serif text-xl font-bold tracking-wide text-brand-black leading-none group-hover:text-gray-600 transition-colors">
              BEADS & BLOOM
            </span>
            <span className="text-[0.6rem] font-sans text-gray-400 tracking-[0.25em] uppercase mt-1">
              Handcrafted Luxury
            </span>
          </Link>

          {/* CENTER: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-medium uppercase tracking-widest transition-colors relative group ${link.isSpecial ? 'text-[#FF2865]' : 'text-gray-600 hover:text-black'}`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-black group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* RIGHT: Auth & Icons */}
          <div className="flex items-center gap-4 z-50 relative">
            
            {/* WISHLIST ICON (Desktop) */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group hidden sm:block">
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-[#FF2865] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#FF2865] text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART ICON */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#FF2865] text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* --- DESKTOP AUTH LOGIC --- */}
            <div className="hidden md:block">
              {userInfo ? (
                // LOGGED IN VIEW
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-[#1C1917] text-white rounded-full flex items-center justify-center font-serif text-sm">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-sm truncate">{userInfo.name}</p>
                      </div>
                      
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#FF2865] transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      
                      {/* Dropdown Wishlist Link */}
                      <Link to="/wishlist" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#FF2865] transition-colors">
                        <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                      </Link>

                      <Link to="/myorders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#FF2865] transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // LOGGED OUT VIEW
                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                  <Link to="/login" className="text-xs font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-colors">Log In</Link>
                  <Link to="/signup" className="text-xs font-medium uppercase tracking-widest bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-all hover:scale-105">Sign Up</Link>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE BUTTON */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6 text-brand-black" /> : <Menu className="w-6 h-6 text-brand-black" />}
            </button>
          </div>
        </nav>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-serif text-brand-black hover:text-brand-gold transition-colors duration-300 transform ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}

          <div className="w-12 h-[1px] bg-gray-200 my-4"></div>

          {/* MOBILE AUTH STATE */}
          <div className={`flex flex-col gap-3 w-full transition-all duration-500 delay-300 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            {/* Mobile Wishlist Link (Always Visible) */}
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 border border-gray-200 rounded-full text-sm font-sans uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-2">
               <Heart className="w-4 h-4 text-[#FF2865]" /> Wishlist ({wishlistCount})
            </Link>

            {userInfo ? (
              <>
                <div className="text-center mb-4 mt-4">
                  <div className="w-16 h-16 bg-[#1C1917] text-white rounded-full flex items-center justify-center font-serif text-2xl mx-auto mb-2">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-bold">Hi, {userInfo.name}</p>
                </div>
                
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 border border-gray-200 rounded-full text-sm font-sans uppercase tracking-widest hover:bg-gray-50">
                  My Account
                </Link>
                <Link to="/myorders" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 border border-gray-200 rounded-full text-sm font-sans uppercase tracking-widest hover:bg-gray-50">
                   My Orders
                </Link>
                <button onClick={handleLogout} className="w-full text-center py-3 bg-red-50 text-red-500 rounded-full text-sm font-sans uppercase tracking-widest hover:bg-red-100">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 border border-gray-300 rounded-full text-sm font-sans uppercase tracking-widest text-gray-700 hover:border-black hover:text-black transition-colors">Log In</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 bg-black text-white rounded-full text-sm font-sans uppercase tracking-widest hover:bg-gray-800 transition-colors">Sign Up</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}