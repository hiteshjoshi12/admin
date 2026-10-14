import { useEffect, useState, useMemo } from 'react';
import { 
  Eye, Truck, CheckCircle, XCircle, Clock, Calendar, 
  User, Search, Filter, ArrowUpRight, Package, RotateCcw, ChevronDown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../util/config';

const ORDER_STATUSES = [
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned"
];

const STATUS_TABS = [
  'All',
  'Processing',
  'Ready to Ship',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
  'Unpaid'
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      fetchOrders();
    }
  }, [userInfo]);

  // Quick inline status change handler
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.message || 'Status update failed');
      }

      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...updated, orderStatus: newStatus } : o));
      toast.success(`Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to determine active status of an order
  const getEffectiveStatus = (order) => {
    if (order.orderStatus) return order.orderStatus;
    if (order.isDelivered) return 'Delivered';
    if (order.shiprocketOrderId) return 'Shipped';
    return 'Processing';
  };

  // Compute live counts per tab
  const tabCounts = useMemo(() => {
    const counts = { All: orders.length, Unpaid: 0 };
    STATUS_TABS.forEach(t => { if (t !== 'All' && t !== 'Unpaid') counts[t] = 0; });

    orders.forEach(o => {
      if (!o.isPaid) counts.Unpaid = (counts.Unpaid || 0) + 1;
      const st = getEffectiveStatus(o);
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders list based on search and active tab
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = order.user?.name || order.guestInfo?.name || 'Guest';
      const customerEmail = order.user?.email || order.guestInfo?.email || '';
      const orderId = order._id || '';
      const awb = order.awbCode || '';
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || 
        orderId.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query) ||
        awb.toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (activeTab === 'All') return true;
      if (activeTab === 'Unpaid') return !order.isPaid;

      return getEffectiveStatus(order) === activeTab;
    });
  }, [orders, activeTab, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(date);
  };

  const PaymentBadge = ({ isPaid, method }) => {
    const isCOD = method === 'cod';
    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle size={12} /> Paid
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${isCOD ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
        {isCOD ? <Clock size={12} /> : <XCircle size={12} />}
        {isCOD ? 'COD Pending' : 'Unpaid'}
      </span>
    );
  };

  const FulfillmentBadge = ({ order }) => {
    const status = getEffectiveStatus(order);

    const config = {
      'Processing': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Package },
      'Ready to Ship': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Package },
      'Shipped': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck },
      'Out for Delivery': { bg: 'bg-sky-50 text-sky-700 border-sky-200', icon: Truck },
      'Delivered': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
      'Cancelled': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
      'Returned': { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: RotateCcw },
    }[status] || { bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: Package };

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${config.bg}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-serif text-[#1C1917] mb-2">Orders Management</h1>
           <p className="text-gray-500">Track, filter, and fulfill customer orders seamlessly.</p>
        </div>
        
        {/* STATS SUMMARY */}
        <div className="flex flex-wrap gap-3">
           <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[110px]">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Revenue</p>
              <p className="text-base font-bold text-[#1C1917] font-mono">
                ₹{orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0).toLocaleString()}
              </p>
           </div>
           <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[100px]">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Processing</p>
              <p className="text-base font-bold text-amber-600 font-mono">
                {tabCounts['Processing'] || 0}
              </p>
           </div>
           <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[100px]">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Shipped</p>
              <p className="text-base font-bold text-blue-600 font-mono">
                {tabCounts['Shipped'] || 0}
              </p>
           </div>
           <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-center min-w-[100px]">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Delivered</p>
              <p className="text-base font-bold text-emerald-600 font-mono">
                {tabCounts['Delivered'] || 0}
              </p>
           </div>
        </div>
      </div>

      {/* CONTROLS BAR: TABS & SEARCH */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        
        {/* SCROLLABLE FILTER TABS */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
           {STATUS_TABS.map((tab) => {
             const count = tabCounts[tab] || 0;
             const isActive = activeTab === tab;
             return (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                   isActive 
                     ? 'bg-[#1C1917] text-white shadow-sm' 
                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#1C1917]'
                 }`}
               >
                 <span>{tab}</span>
                 <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                   isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                 }`}>
                   {count}
                 </span>
               </button>
             );
           })}
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full">
           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Search by Order ID, Customer Name, Email, or AWB tracking..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#1C1917] outline-none transition-all"
           />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4">Update Status</th>
                <th className="px-6 py-4 text-right">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const currentStatus = getEffectiveStatus(order);
                const isUpdating = updatingId === order._id;

                return (
                  <tr key={order._id} className="group hover:bg-gray-50/70 transition-colors">
                    {/* ORDER ID */}
                    <td className="px-6 py-4">
                       <Link to={`/admin/order/${order._id}`} className="font-mono text-xs font-bold text-gray-500 group-hover:text-[#1C1917] hover:underline">
                         #{order._id.slice(-6).toUpperCase()}
                       </Link>
                       {order.awbCode && (
                         <p className="text-[10px] text-gray-400 font-mono mt-0.5">AWB: {order.awbCode}</p>
                       )}
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-[#1C1917]">{order.user?.name || order.guestInfo?.name || 'Guest'}</span>
                         <span className="text-xs text-gray-400">{order.user?.email || order.guestInfo?.email}</span>
                      </div>
                    </td>

                    {/* ITEMS COUNT */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                        {order.orderItems?.length || 0}
                      </span>
                    </td>

                    {/* TOTAL PRICE */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-[#1C1917]">₹{order.totalPrice.toLocaleString()}</span>
                    </td>

                    {/* PAYMENT BADGE */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                         <PaymentBadge isPaid={order.isPaid} method={order.paymentMethod} />
                         <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider pl-1">
                            {order.paymentMethod}
                         </span>
                      </div>
                    </td>

                    {/* CURRENT STATUS BADGE */}
                    <td className="px-6 py-4">
                      <FulfillmentBadge order={order} />
                    </td>

                    {/* QUICK STATUS SELECTOR */}
                    <td className="px-6 py-4">
                      <div className="relative inline-block w-40">
                        <select
                          value={currentStatus}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`w-full bg-gray-50 border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-[#1C1917] transition-all cursor-pointer ${
                            isUpdating ? 'opacity-50 cursor-wait' : ''
                          }`}
                        >
                          {ORDER_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-gray-500 font-medium">{formatDate(order.createdAt)}</span>
                    </td>

                    {/* VIEW ACTION */}
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/order/${order._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-white hover:bg-[#1C1917] hover:border-[#1C1917] transition-all bg-white shadow-sm"
                        title="View Full Details"
                      >
                        <ArrowUpRight size={15} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredOrders.map((order) => {
            const currentStatus = getEffectiveStatus(order);
            const isUpdating = updatingId === order._id;

            return (
              <div key={order._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                   <div>
                      <span className="font-mono text-xs font-bold text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                      <h4 className="font-bold text-sm text-[#1C1917]">{order.user?.name || order.guestInfo?.name || 'Guest'}</h4>
                      <p className="text-xs text-gray-400">{order.user?.email || order.guestInfo?.email}</p>
                   </div>
                   <span className="font-mono font-bold text-[#1C1917]">₹{order.totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                   <PaymentBadge isPaid={order.isPaid} method={order.paymentMethod} />
                   <FulfillmentBadge order={order} />
                </div>

                <div className="flex items-center gap-2 pt-1">
                   <select
                      value={currentStatus}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="flex-grow bg-gray-50 border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
                   >
                      {ORDER_STATUSES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                   </select>

                   <Link 
                      to={`/admin/order/${order._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold bg-[#1C1917] text-white px-3 py-1.5 rounded-lg"
                   >
                      Details <ArrowUpRight size={12} />
                   </Link>
                </div>

                <div className="text-[11px] text-gray-400">
                   Ordered on {formatDate(order.createdAt)}
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Search className="text-gray-300 w-8 h-8" />
             </div>
             <p className="text-gray-900 font-bold">No orders found</p>
             <p className="text-gray-500 text-sm mt-1">No orders match the filter "{activeTab}" or search query.</p>
          </div>
        )}

      </div>
    </div>
  );
}