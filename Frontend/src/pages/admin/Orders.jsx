import { useEffect, useState } from 'react';
import { Eye, Truck, CheckCircle, XCircle, Clock, Calendar, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../util/config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        setOrders(data);
        console.log("Fetched Orders:", data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  // Helper to render Status Badges (Used in both Mobile & Desktop)
  const renderPaymentStatus = (isPaid) => (
    isPaid ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
        <CheckCircle className="w-3 h-3" /> Paid
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3" /> Pending
      </span>
    )
  );

  const renderpaymentMethod = (order) => {
    if(order.paymentMethod === 'upi'){
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
          UPI
        </span>
      );
    }
    else if(order.paymentMethod === 'cod'){
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Clock className="w-3 h-3" /> COD
        </span>
      );
    }
  };

  const renderFulfillmentStatus = (order) => {
    if (order.isDelivered) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          Delivered
        </span>
      );
    } else if (order.shiprocketOrderId) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <Truck className="w-3 h-3" /> Shipped
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          Processing
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
           <p className="text-sm text-gray-500">Track and fulfill customer orders</p>
        </div>
        <span className="bg-[#1C1917] text-white px-3 py-1 rounded-full text-xs font-bold w-fit">
          {orders.length} Total Orders
        </span>
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Payment</th>
                <th className="px-6 py-4 font-semibold text-center">Fulfillment</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {order._id.substring(order._id.length - 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.user?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderpaymentMethod(order)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderPaymentStatus(order.isPaid)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {renderFulfillmentStatus(order)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/admin/order/${order._id}`}
                      className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[#1C1917] hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                   <td colSpan="7" className="text-center py-12 text-gray-400 italic">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/admin/order/${order._id}`} className="block">
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Card Header: ID & Price */}
                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="font-mono text-sm font-bold text-gray-800">#{order._id}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                      <p className="font-bold text-[#1C1917]">₹{order.totalPrice.toLocaleString()}</p>
                   </div>
                </div>

                {/* Card Body: Info */}
                <div className="space-y-2 mb-4">
                   <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="font-medium truncate">{order.user?.name || 'Guest'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>

                {/* Card Footer: Statuses */}
                <div className="flex justify-between items-center pt-2">
                   <div className="flex gap-2">
                      {renderPaymentStatus(order.isPaid)}
                      {renderFulfillmentStatus(order)}
                   </div>
                   <div className="text-gray-400">
                      <Eye className="w-4 h-4" />
                   </div>
                </div>

             </div>
          </Link>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        )}
      </div>

    </div>
  );
}