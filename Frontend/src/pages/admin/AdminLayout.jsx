import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, Box, ShoppingCart, Users, Tag, 
  FileText, LogOut, Menu, X, Bell 
} from 'lucide-react';
import { logout } from '../../redux/authSlice';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const { userInfo } = useSelector((state) => state.auth);

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
    { name: 'CMS', icon: FileText, path: '/admin/cms' }, // <-- NEW CMS OPTION
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1917] text-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-800">
           <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[#1C1917] font-bold text-xl mr-3">B</div>
           <span className="text-xl font-bold tracking-wide">BeadsNBloom</span>
        </div>

        <nav className="p-4 space-y-2">
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
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-500">
               <Menu className="w-6 h-6" />
             </button>
             <h1 className="text-2xl font-bold text-gray-800">
               {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
             </h1>
           </div>

           <div className="flex items-center gap-6">
             <button className="relative text-gray-400 hover:text-gray-600">
               <Bell className="w-6 h-6" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900">{userInfo?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                   {userInfo?.name?.charAt(0) || 'A'}
                </div>
             </div>
           </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
}