import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, Box, ShoppingCart, Users, Tag, 
  FileText, LogOut, Menu, X, MessageSquare, ChevronDown, Store, ShieldCheck
} from 'lucide-react';
import { logout } from '../../redux/authSlice';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: Box, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Discounts', icon: Tag, path: '/admin/offers' },
    { name: 'Content', icon: FileText, path: '/admin/cms' },
    { name: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#1C1917]">
      
      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1C1917] text-white transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static`}
      >
        {/* Brand Header */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/10 shrink-0">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2865] to-[#D4144B] flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg shadow-red-900/50">B</div>
             <div>
                <h1 className="text-lg font-bold tracking-wide leading-none">BeadsNBloom</h1>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Admin Panel</p>
             </div>
           </div>
           {/* Close Button (Mobile Only) */}
           <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
             <X className="w-6 h-6" />
           </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-white text-[#1C1917] font-bold shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm">{item.name}</span>
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF2865] rounded-l-full"></div>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-6 border-t border-white/10 bg-[#161312]">
          <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 overflow-hidden">
                 {/* Placeholder Avatar */}
                 <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-[#FF2865]">
                    {userInfo?.name?.charAt(0) || 'A'}
                 </div>
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold truncate text-white">{userInfo?.name || 'Admin'}</p>
                 <p className="text-xs text-gray-500 truncate">{userInfo?.email || 'admin@example.com'}</p>
              </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-widest border border-white/5 hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 shadow-sm">
           
           <div className="flex items-center gap-4">
             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)} 
               className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <Menu className="w-6 h-6" />
             </button>
             
             {/* Breadcrumb / Title */}
             <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1C1917]">
                  {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                </h2>
             </div>
           </div>

           {/* ACTIONS RIGHT */}
           <div className="flex items-center gap-6">
             
             {/* VIEW SWITCHER DROPDOWN */}
             <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#1C1917] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                >
                   <ShieldCheck className="w-4 h-4 text-[#FF2865]" />
                   <span className="hidden md:inline">Admin View</span>
                   <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in z-50">
                     <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Switch View</p>
                     </div>
                     
                     <div className="p-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50 text-[#1C1917] font-bold text-sm">
                           <ShieldCheck className="w-4 h-4 text-[#FF2865]" />
                           Admin Dashboard
                           <span className="ml-auto w-2 h-2 rounded-full bg-green-500"></span>
                        </button>
                        
                        <Link 
                           to="/" 
                           className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#1C1917] transition-colors font-medium text-sm mt-1"
                        >
                           <Store className="w-4 h-4" />
                           Live Storefront
                        </Link>
                     </div>
                  </div>
                )}
             </div>

           </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin">
           <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}