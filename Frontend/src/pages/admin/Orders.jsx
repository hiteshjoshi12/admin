import { useEffect, useState } from 'react';
import { Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../util/config'; // Adjust path

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <span className="bg-[#1C1917] text-white px-3 py-1 rounded-full text-xs font-bold">
          {orders.length} Total Orders
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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

                  {/* Payment Status */}
                  <td className="px-6 py-4 text-center">
                    {order.isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                        <XCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>

                  {/* Delivery Status */}
                  <td className="px-6 py-4 text-center">
                     {order.isDelivered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                           Delivered
                        </span>
                     ) : order.shiprocketOrderId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                           <Truck className="w-3 h-3" /> Shipped
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                           Processing
                        </span>
                     )}
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
    </div>
  );
}