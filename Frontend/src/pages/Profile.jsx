import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, MapPin } from 'lucide-react'; // Import MapPin
import { logout } from '../redux/authSlice';
import { clearCart } from '../redux/cartSlice';

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  if (!userInfo) return null;

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center mb-8">
          <div className="w-24 h-24 bg-[#1C1917] text-white rounded-full flex items-center justify-center text-4xl font-serif mx-auto mb-4">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-serif text-[#1C1917] mb-1">{userInfo.name}</h1>
          <p className="text-gray-500 text-sm mb-6">{userInfo.email}</p>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 mx-auto text-red-500 hover:bg-red-50 px-6 py-2 rounded-full transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
           {/* ADDRESS CARD */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
             <div className="bg-gray-50 p-3 rounded-full text-[#1C1917]">
               <MapPin className="w-6 h-6" />
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-[#1C1917] mb-1">Saved Address</h3>
               
               {userInfo.addresses && userInfo.addresses.length > 0 ? (
                 userInfo.addresses.map((addr, index) => (
                   <div key={index} className="text-sm text-gray-500 mb-2 border-b border-gray-50 pb-2 last:border-0">
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-gray-800">{addr.city}</span>
                       {addr.isPrimary && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">PRIMARY</span>}
                     </div>
                     <p className="line-clamp-2">{addr.address}</p>
                     <p>{addr.postalCode}</p>
                     <p className="text-xs text-gray-400 mt-1">{addr.phoneNumber}</p>
                   </div>
                 ))
               ) : (
                 <p className="text-sm text-gray-400">No addresses saved yet.</p>
               )}
             </div>
           </div>

           {/* ORDERS CARD */}
           <div 
             onClick={() => navigate('/myorders')}
             className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-pointer hover:border-[#FF2865] transition-colors group"
           >
             <div className="bg-gray-50 p-3 rounded-full text-[#1C1917] group-hover:text-[#FF2865]">
               <Package className="w-6 h-6" />
             </div>
             <div>
               <h3 className="font-bold text-[#1C1917] mb-1 group-hover:text-[#FF2865]">My Orders</h3>
               <p className="text-sm text-gray-500">Track, return, or buy again.</p>
               <p className="text-xs font-bold uppercase tracking-widest text-[#FF2865] mt-3">View History →</p>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}