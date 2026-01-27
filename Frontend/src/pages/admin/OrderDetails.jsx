import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, MapPin, CreditCard, Calendar, 
  ArrowLeft, CheckCircle, Clock, Truck, User, Settings 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';

// Matches your Backend Enum
const ORDER_STATUSES = [
  'Processing', 
  'Ready to Ship', 
  'Shipped', 
  'Out for Delivery', 
  'Delivered', 
  'Cancelled',
  'Returned'
];

export default function OrderDetails() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local state for actions
  const [shipLoading, setShipLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (!res.ok) throw new Error('Order not found');

        const data = await res.json();
        setOrder(data);
        setSelectedStatus(data.orderStatus); // Initialize dropdown
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

  // --- HELPER: CALCULATE STEP ---
  const getStepStatus = () => {
    if (!order) return 0;
    const status = order.orderStatus;
    if (order.isDelivered || status === 'Delivered') return 4;
    if (status === 'Out for Delivery') return 3;
    if (status === 'Ready to Ship' || status === 'Shipped' || order.awbCode) return 2;
    if (status === 'Processing') return 1;
    return 0; // Placed
  };

  const activeStep = getStepStatus();

  // --- HELPER: SAFE PRICE ---
  const safePrice = (price) => {
    return price ? price.toLocaleString() : '0';
  };

  // --- HANDLER: SHIP VIA SHIPROCKET ---
  const handleShiprocket = async () => {
    if(!window.confirm("Generate Shiprocket Label for this order?")) return;
    setShipLoading(true);
    // Placeholder for actual API call
    setTimeout(() => {
        alert("Shiprocket Integration coming next! (Label Generation)");
        setShipLoading(false);
    }, 1000);
  };

  // --- HANDLER: MANUAL STATUS UPDATE ---
  const handleManualStatusUpdate = async () => {
    if(!window.confirm(`Manually update status to "${selectedStatus}"?`)) return;

    setUpdateLoading(true);
    try {
      // NOTE: Ensure your backend has a generic update route or handle this logic
      // If you only have /deliver, this might need backend adjustment
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify({ status: selectedStatus })
      });
      
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        alert("Status Updated Successfully!");
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-[#F9F8F6]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-[#F9F8F6]">
      <h2 className="text-2xl font-serif text-red-500 mb-4">Error Loading Order</h2>
      <p className="text-gray-500 mb-6">{error || "Order data is missing"}</p>
      <Link to="/myorders" className="underline hover:text-[#FF2865]">Back to My Orders</Link>
    </div>
  );

  return (
    <div className="bg-[#F9F8F6] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link to="/admin/orders" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1C1917] mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to List
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif text-[#1C1917] flex items-center gap-3">
              Order <span className="text-gray-400 font-mono text-xl">#{order._id.slice(-6).toUpperCase()}</span>
            </h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Placed On</p>
             <p className="text-sm font-medium text-[#1C1917] flex items-center gap-2 justify-end">
               <Calendar className="w-4 h-4" />
               {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Timeline & Items) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. TRACKING TIMELINE CARD */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-4">
                 <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-400" /> Order Tracking
                 </h3>
                 {order.awbCode && (
                   <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {order.courierCompanyName || 'Courier'} Tracking (AWB)
                      </p>
                      <p className="font-mono text-blue-600 font-bold">{order.awbCode}</p>
                   </div>
                 )}
               </div>

               <div className="relative">
                  {/* Connector Line */}
                  <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-100 md:h-0.5 md:w-full md:top-6 md:left-0 z-0"></div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                    <TimelineStep 
                        icon={Clock} 
                        label="Placed" 
                        date={new Date(order.createdAt).toLocaleDateString()} 
                        isActive={activeStep >= 0}
                        isCompleted={activeStep > 0} 
                    />
                    <TimelineStep 
                        icon={Package} 
                        label="Processing" 
                        isActive={activeStep >= 1}
                        isCompleted={activeStep > 1}
                    />
                    <TimelineStep 
                        icon={Truck} 
                        label="Shipped" 
                        subLabel={order.awbCode ? 'In Transit' : ''}
                        link={order.awbCode ? `https://shiprocket.co/tracking/${order.awbCode}` : null}
                        isActive={activeStep >= 2}
                        isCompleted={activeStep > 2}
                    />
                    <TimelineStep 
                        icon={CheckCircle} 
                        label="Delivered" 
                        date={order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : null}
                        isActive={activeStep >= 4}
                        isCompleted={activeStep >= 4}
                    />
                  </div>
               </div>
            </div>

            {/* 2. ORDER ITEMS LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" /> Items in Order
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="p-6 flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
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

          {/* RIGHT COLUMN (Summary & Actions) */}
          <div className="space-y-6">
            
            {/* ACTIONS CARD (ADMIN ONLY) */}
            {userInfo?.isAdmin && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" /> Manage Order
                    </h3>
                    
                    <div className="space-y-4">
                        {/* 1. Automated Shipping */}
                        {!order.awbCode && !order.isDelivered && (
                            <button 
                                onClick={handleShiprocket}
                                disabled={shipLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
                            >
                                {shipLoading ? 'Generating...' : <><Package className="w-4 h-4" /> Ship via Shiprocket</>}
                            </button>
                        )}

                        {/* 2. Manual Status Override (Dropdown) */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                                Manual Status Override
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <select 
                                        value={selectedStatus} 
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-[#1C1917] appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF2865]/20"
                                    >
                                        {ORDER_STATUSES.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleManualStatusUpdate}
                                    disabled={updateLoading}
                                    className="bg-gray-900 text-white px-4 rounded-lg font-bold text-xs hover:bg-[#FF2865] transition-colors disabled:opacity-70"
                                >
                                    {updateLoading ? '...' : 'Update'}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">
                                Use this if automation fails. It will override the current status.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENT SUMMARY */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" /> Payment
              </h3>
              
              <div className="space-y-3 text-sm border-b border-gray-50 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Method</span>
                  <span className="font-bold uppercase">{order.paymentMethod || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                    <span>Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${order.isPaid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {order.isPaid ? 'PAID' : 'PENDING'}
                    </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{safePrice(order.itemsPrice || order.itemPrice)}</span>
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

            {/* SHIPPING ADDRESS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" /> Delivery To
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> {order.user?.name || 'Guest'}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.state}, {order.shippingAddress.country}</p>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                     <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</p>
                     <p className="font-medium text-[#1C1917]">{order.shippingAddress.phoneNumber}</p>
                  </div>
                </div>
              ) : <p className="text-sm text-gray-400">No address details</p>}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- TIMELINE STEP COMPONENT ---
function TimelineStep({ icon: Icon, label, subLabel, date, isActive, isCompleted, link }) {
  return (
    <div className={`flex flex-row md:flex-col items-center gap-4 md:gap-3 text-left md:text-center ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 relative z-10
        ${isActive ? 'bg-[#1C1917] border-[#1C1917] text-white' : 'bg-white border-gray-200 text-gray-400'}
        ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
        `}
      >
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <div>
        <p className={`font-bold text-sm ${isActive ? 'text-[#1C1917]' : 'text-gray-500'}`}>{label}</p>
        {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
        {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
        {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#FF2865] underline mt-1 block hover:text-[#1C1917]">
                Track Package
            </a>
        )}
      </div>
    </div>
  );
}