import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, Box, ShoppingCart, Users, Tag, 
  FileText, LogOut, Menu, X, MessageSquare
} from 'lucide-react';
import { logout } from '../../redux/authSlice';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  
  // State specifically for Mobile Menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Analytics', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Inventory', icon: Box, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Offers', icon: Tag, path: '/admin/offers' },
    { name: 'CMS', icon: FileText, path: '/admin/cms' },
    { name: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
      
      {/* --- MOBILE OVERLAY --- */}
      {/* Only visible on mobile when menu is open */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1917] text-white transition-transform duration-300 ease-in-out flex flex-col 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-gray-800 shrink-0">
           <div className="flex items-center">
             <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#1C1917] font-bold text-xl mr-3">B</div>
             <span className="text-xl font-bold tracking-wide">BeadsNBloom</span>
           </div>
           {/* Close Button (Mobile Only) */}
           <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
             <X className="w-6 h-6" />
           </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#FF2865] text-white shadow-md' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section (Pinned to bottom) */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
           <div className="flex items-center gap-4">
             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)} 
               className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
             >
               <Menu className="w-6 h-6" />
             </button>
             
             <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
               {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
             </h1>
           </div>

           <div className="flex items-center gap-4 md:gap-6">
             {/* User Profile Info */}
             <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900">{userInfo?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                   {userInfo?.name?.charAt(0) || 'A'}
                </div>
             </div>
           </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
}