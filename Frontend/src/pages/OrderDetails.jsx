import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, MapPin, CreditCard, Calendar, 
  ArrowLeft, CheckCircle, XCircle, Clock, Truck 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import config from '../config/config';

export default function OrderDetails() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (!res.ok) throw new Error('Order not found');

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [id, userInfo]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20">
      <h2 className="text-2xl font-serif text-red-500 mb-4">Error Loading Order</h2>
      <p className="text-gray-500 mb-6">{error || "Order data is missing"}</p>
      <Link to="/myorders" className="underline hover:text-[#FF2865]">Back to My Orders</Link>
    </div>
  );

  // --- SAFE PRICE HELPERS ---
  const safePrice = (price) => {
    return price ? price.toLocaleString() : '0';
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link to="/myorders" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1C1917] mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif text-[#1C1917]">
              Order <span className="text-gray-400">#{order._id?.substring(0, 10)}</span>
            </h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Placed On</p>
             <p className="text-sm font-medium text-[#1C1917]">
               {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Delivery Status */}
               <div className={`p-6 rounded-2xl border flex items-start gap-4 ${order.isDelivered ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
                 <div className={`p-3 rounded-full ${order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                   {order.isDelivered ? <CheckCircle className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                 </div>
                 <div>
                   <h3 className="font-bold text-[#1C1917] mb-1">Delivery Status</h3>
                   {order.isDelivered ? (
                     <div>
                       <p className="text-green-700 text-sm font-medium">Delivered</p>
                     </div>
                   ) : (
                     <p className="text-gray-500 text-sm">On its way</p>
                   )}
                 </div>
               </div>

               {/* Payment Status */}
               <div className={`p-6 rounded-2xl border flex items-start gap-4 ${order.isPaid ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                 <div className={`p-3 rounded-full ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                   {order.isPaid ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                 </div>
                 <div>
                   <h3 className="font-bold text-[#1C1917] mb-1">Payment Status</h3>
                   {order.isPaid ? (
                     <div>
                       <p className="text-green-700 text-sm font-medium">Paid</p>
                     </div>
                   ) : (
                     <p className="text-yellow-700 text-sm font-medium">Pending</p>
                   )}
                 </div>
               </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" /> Order Items
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="p-6 flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.product}`} className="font-bold text-[#1C1917] hover:text-[#FF2865] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1C1917]">₹{safePrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-gray-400">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" /> Shipping Address
              </h3>
              {order.shippingAddress ? (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}<br />
                  <span className="text-gray-400 text-xs mt-2 block">Phone: {order.shippingAddress.phoneNumber}</span>
                </p>
              ) : <p className="text-sm text-gray-400">No address details</p>}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" /> Payment Summary
              </h3>
              
              <div className="space-y-3 text-sm border-b border-gray-50 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Method</span>
                  <span className="font-bold uppercase">{order.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{safePrice(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'Free' : `₹${safePrice(order.shippingPrice)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{safePrice(order.taxPrice)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-[#1C1917]">
                <span>Total</span>
                <span>₹{safePrice(order.totalPrice)}</span>
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-[#1C1917] text-white p-6 rounded-2xl text-center">
              <h4 className="font-serif text-lg mb-2">Need Help?</h4>
              <p className="text-xs text-gray-400 mb-4">Have an issue with this order?</p>
              <button className="bg-white text-[#1C1917] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FF2865] hover:text-white transition-colors w-full">
                Contact Support
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}