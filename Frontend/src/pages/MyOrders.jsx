import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function MyOrders() {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch orders directly here (or you could make a Redux slice for orders)
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Send Token!
          },
        });
        
        if (!res.ok) throw new Error('Failed to fetch orders');
        
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        
        <h1 className="text-3xl font-serif text-[#1C1917] mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">Track your past purchases and returns.</p>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1917] mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't indulged in luxury yet.</p>
            <Link to="/shop" className="bg-[#1C1917] text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono text-sm text-[#1C1917]">#{order._id.substring(0, 10)}...</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Date</p>
                    <p className="text-sm text-[#1C1917]">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                    <p className="font-bold text-[#1C1917]">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.isDelivered ? (
                       <span className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                         <CheckCircle className="w-3 h-3" /> Delivered
                       </span>
                    ) : (
                       <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                         <Clock className="w-3 h-3" /> Processing
                       </span>
                    )}
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex justify-between items-center">
                   <div className="flex -space-x-3 overflow-hidden">
                     {order.orderItems.map((item, index) => (
                       <img 
                         key={index} 
                         src={item.image} 
                         alt={item.name} 
                         className="w-10 h-10 rounded-full border-2 border-white object-cover"
                         title={item.name}
                       />
                     ))}
                   </div>
                   <Link to={`/order/${order._id}`} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#FF2865] hover:text-[#1C1917] transition-colors">
                     View Details <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}