import { useEffect, useState, useMemo } from 'react';
import { 
  Eye, Truck, CheckCircle, XCircle, Clock, Calendar, 
  User, Search, Filter, ArrowUpRight, Package 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../util/config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW STATES FOR CLARITY ---
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  // --- FILTERING LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Filter
      const matchesSearch = 
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.user?.name || 'Guest').toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Tab Filter
      let matchesTab = true;
      if (activeTab === 'Pending') matchesTab = !order.isDelivered && !order.shiprocketOrderId;
      if (activeTab === 'Shipped') matchesTab = order.shiprocketOrderId && !order.isDelivered;
      if (activeTab === 'Delivered') matchesTab = order.isDelivered;
      if (activeTab === 'Unpaid') matchesTab = !order.isPaid;

      return matchesSearch && matchesTab;
    });
  }, [orders, activeTab, searchQuery]);

  // --- HELPER: FORMAT DATE ---
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(date);
  };

  // --- HELPER: STATUS BADGES ---
  const PaymentBadge = ({ isPaid, method }) => {
    const isCOD = method === 'cod';
    
    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle size={12} /> Paid
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${isCOD ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
        {isCOD ? <Clock size={12} /> : <XCircle size={12} />}
        {isCOD ? 'COD Pending' : 'Pending'}
      </span>
    );
  };

  const FulfillmentBadge = ({ order }) => {
    if (order.isDelivered) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
          <CheckCircle size={12} /> Delivered
        </span>
      );
    }
    if (order.shiprocketOrderId) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
          <Truck size={12} /> Shipped
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100 animate-pulse">
        <Package size={12} /> Processing
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-serif text-[#1C1917] mb-2">Orders</h1>
           <p className="text-gray-500">Manage and fulfill your customer orders.</p>
        </div>
        
        {/* STATS SUMMARY (Optional but helpful) */}
        <div className="flex gap-4">
           <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Revenue</p>
              <p className="text-lg font-bold text-[#1C1917] font-mono">
                ₹{orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0).toLocaleString()}
              </p>
           </div>
           <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pending Orders</p>
              <p className="text-lg font-bold text-orange-600 font-mono">
                {orders.filter(o => !o.isDelivered).length}
              </p>
           </div>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* TABS */}
        <div className="flex p-1 bg-gray-100/50 rounded-lg w-full md:w-auto overflow-x-auto">
           {['All', 'Pending', 'Shipped', 'Delivered', 'Unpaid'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                 activeTab === tab 
                   ? 'bg-white text-[#1C1917] shadow-sm' 
                   : 'text-gray-500 hover:text-[#1C1917]'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Search ID or Name..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-[#1C1917]/10 outline-none transition-all"
           />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold text-center">Items</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Date</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                     <span className="font-mono text-xs font-bold text-gray-500 group-hover:text-[#1C1917] transition-colors">
                       #{order._id.slice(-6).toUpperCase()}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-[#1C1917]">{order.user?.name || order.guestInfo?.name || 'Guest'}</span>
                       <span className="text-xs text-gray-400">{order.user?.email || order.guestInfo?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                      {order.orderItems?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold">₹{order.totalPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                       <PaymentBadge isPaid={order.isPaid} method={order.paymentMethod} />
                       <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider pl-1">
                          {order.paymentMethod}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <FulfillmentBadge order={order} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-gray-500 font-medium">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/admin/order/${order._id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:text-[#1C1917] hover:border-[#1C1917] hover:bg-white transition-all bg-white shadow-sm"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredOrders.map((order) => (
             <Link key={order._id} to={`/admin/order/${order._id}`} className="block p-4 active:bg-gray-50">
               <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                     <span className="font-mono text-xs font-bold text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                     <span className="font-bold text-[#1C1917]">{order.user?.name || 'Guest'}</span>
                  </div>
                  <span className="font-mono font-bold">₹{order.totalPrice.toLocaleString()}</span>
               </div>
               
               <div className="flex gap-2 mb-3">
                  <PaymentBadge isPaid={order.isPaid} method={order.paymentMethod} />
                  <FulfillmentBadge order={order} />
               </div>

               <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(order.createdAt)}</span>
                  <div className="flex items-center gap-1 text-[#1C1917]">
                     Details <ArrowUpRight size={12} />
                  </div>
               </div>
             </Link>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-300 w-8 h-8" />
             </div>
             <p className="text-gray-900 font-bold">No orders found</p>
             <p className="text-gray-500 text-sm mt-1">Try changing your search or filter.</p>
          </div>
        )}

      </div>
    </div>
  );
}