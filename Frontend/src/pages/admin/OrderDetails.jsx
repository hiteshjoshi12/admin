import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck, CheckCircle, Package, MapPin, User, Calendar, CreditCard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';

export default function OrderDetails() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliverLoading, setDeliverLoading] = useState(false);

  // --- FETCH ORDER ---
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, userInfo]);

  // --- MARK AS DELIVERED HANDLER ---
  const handleDeliver = async () => {
    if (!window.confirm("Are you sure you want to mark this as delivered?")) return;
    
    setDeliverLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        alert("Order Marked as Delivered!");
      }
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setDeliverLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F9F8F6]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  if (!order) return <div className="p-10 text-center">Order not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 md:py-10 md:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6 md:mb-8">
        <Link to="/admin/orders" className="self-start p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex flex-col md:flex-row md:items-center gap-3">
            <span>Order #{order._id.substring(0, 8).toUpperCase()}</span>
            
            <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-3 py-1 rounded-full border ${order.isPaid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                   {order.isPaid ? 'PAID' : 'PAYMENT PENDING'}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full border ${order.isDelivered ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                   {order.isDelivered ? 'DELIVERED' : order.orderStatus}
                </span>
            </div>
          </h1>
          <p className="text-sm text-gray-500 mt-2 md:mt-1 flex items-center gap-2">
             <Calendar className="w-3 h-3" /> Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. ORDER ITEMS */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <Package className="w-5 h-5 text-gray-500" /> Items ({order.orderItems.length})
             </h2>
             <div className="divide-y divide-gray-100">
               {order.orderItems.map((item, index) => (
                 <div key={index} className="py-4 flex gap-3 md:gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1 md:hidden">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="hidden md:block font-medium text-sm text-gray-600">₹{item.price.toLocaleString()}</p>
                       <p className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                 </div>
               ))}
             </div>
             
             {/* Totals */}
             <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Subtotal</span>
                   <span>₹{order.itemPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Shipping</span>
                   <span>₹{order.shippingPrice}</span>
                </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Tax</span>
                   <span>₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3 mt-2">
                   <span>Total</span>
                   <span>₹{order.totalPrice.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* 2. SHIPPING INFO */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
             <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
               <MapPin className="w-5 h-5 text-gray-500" /> Shipping Details
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg md:bg-transparent md:p-0">
                   <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Customer</label>
                   <p className="font-medium text-gray-900 flex items-center gap-2">
                     <User className="w-3 h-3" /> {order.user?.name || 'Guest User'}
                   </p>
                   <p className="text-gray-500 ml-5 text-xs md:text-sm break-all">{order.user?.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg md:bg-transparent md:p-0">
                   <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Phone</label>
                   <p className="font-medium text-gray-900">{order.shippingAddress.phoneNumber}</p>
                </div>
                <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg md:bg-transparent md:p-0">
                   <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Address</label>
                   <p className="font-medium text-gray-900 leading-relaxed">
                     {order.shippingAddress.address}, <br/>
                     {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br/>
                     {order.shippingAddress.country}
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONS */}
        <div className="space-y-6">
            
           {/* PAYMENT CARD */}
           <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-gray-500" /> Payment
              </h2>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Method</span>
                    <span className="text-sm font-bold uppercase">{order.paymentMethod}</span>
                 </div>
                 {order.isPaid ? (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-green-200">
                       <CheckCircle className="w-4 h-4 shrink-0" /> 
                       <span>Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                    </div>
                 ) : (
                    <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-yellow-200">
                       Currently Unpaid
                    </div>
                 )}
              </div>
           </div>

           {/* FULFILLMENT CARD */}
           <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Truck className="w-5 h-5 text-gray-500" /> Fulfillment
              </h2>
              
              {/* Shiprocket Data */}
              {order.awbCode && (
                 <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Tracking Number (AWB)</p>
                    <p className="text-lg font-mono font-bold text-blue-800 break-all">{order.awbCode}</p>
                 </div>
              )}

              {/* Status Stepper */}
              <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-6 py-2">
                 {/* Step 1: Placed */}
                 <div className="relative">
                    <span className="absolute -left-[31px] bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-1 ring-green-500"></span>
                    <p className="text-sm font-bold text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                 </div>
                 
                 {/* Step 2: Shipped */}
                 <div className="relative">
                    <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white ring-1 ${order.shiprocketOrderId ? 'bg-green-500 ring-green-500' : 'bg-gray-200 ring-gray-200'}`}></span>
                    <p className={`text-sm font-bold ${order.shiprocketOrderId ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</p>
                    {order.shiprocketOrderId && <p className="text-xs text-green-600">Via Shiprocket</p>}
                 </div>

                 {/* Step 3: Delivered */}
                 <div className="relative">
                    <span className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white ring-1 ${order.isDelivered ? 'bg-green-500 ring-green-500' : 'bg-gray-200 ring-gray-200'}`}></span>
                    <p className={`text-sm font-bold ${order.isDelivered ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</p>
                    {order.isDelivered && <p className="text-xs text-gray-500">{new Date(order.deliveredAt).toLocaleDateString()}</p>}
                 </div>
              </div>

              {/* Action Button */}
              {!order.isDelivered && (
                 <button 
                   onClick={handleDeliver}
                   disabled={deliverLoading}
                   className="w-full mt-6 bg-[#1C1917] text-white py-3 rounded-lg font-bold hover:bg-[#FF2865] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                 >
                   {deliverLoading ? 'Updating...' : 'Mark As Delivered'}
                 </button>
              )}
           </div>

        </div>
      </div>

    </div>
  );
}