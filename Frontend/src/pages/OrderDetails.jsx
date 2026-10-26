import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  Package, MapPin, CreditCard, Calendar, 
  ArrowLeft, CheckCircle, Clock, Truck, User,
  Copy, Sparkles, Check, ShoppingBag, Share2
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fireConfetti } from '../util/confetti';
import { API_BASE_URL } from '../util/config';
import SEO from '../components/seo/SEO';

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const isNewOrder = Boolean(location.state?.orderPlaced);

  useEffect(() => {
    if (isNewOrder) {
      try {
        fireConfetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#1C1917', '#F59E0B', '#FF2865']
        });
      } catch (e) {}
    }
  }, [isNewOrder]);

  const copyLiveTrackingUrl = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Live tracking URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      toast.error("Could not copy link");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrder = async () => {
      try {
        const headers = {};
        if (userInfo && userInfo.token) {
          headers.Authorization = `Bearer ${userInfo.token}`;
        }
        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers,
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

    if (id) {
      fetchOrder();
    }
  }, [id, userInfo]);

  // --- HELPER: CALCULATE STEP ---
  const getStepStatus = () => {
    if (!order) return 0;
    const status = order.orderStatus;
    if (order.isDelivered) return 4;
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-[#F9F8F6]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-[#F9F8F6]">
      <h2 className="text-2xl font-serif text-red-500 mb-4">Error Loading Order</h2>
      <p className="text-gray-500 mb-6">{error || "Order data is missing"}</p>
      {userInfo ? (
        <Link to="/myorders" className="underline hover:text-[#FF2865]">Back to My Orders</Link>
      ) : (
        <Link to="/track-order" className="underline hover:text-[#FF2865]">Look Up Order by ID</Link>
      )}
    </div>
  );

  const handleSupport = () => {
    window.location.href = `mailto: connect@beadsandbloom.in?subject=Support%20Request%20for%20Order%20${order._id.slice(-6).toUpperCase()}&body=Hello%20Support%20Team,%0D%0A%0D%0AI%20need%20assistance%20with%20my%20order%20${order._id.slice(-6).toUpperCase()}.%0D%0A%0D%0AOrder%20Details:%0D%0A- %20Order ID:%20${order._id}%0D%0A- %20Placed On:%20${new Date(order.createdAt).toLocaleString()}%0D%0A- %20Items:%20${order.orderItems.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')}.%0D%0A- %20Total:%20₹${safePrice(order.totalPrice)}.%0D%0A%0D%0APlease%20assist%20me%20with...`;
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-12">
      <SEO 
        title={`Order #${order._id.slice(-6).toUpperCase()} Tracking | Beads and Bloom`} 
        description="Live tracking status and invoice breakdown for your Beads and Bloom handcrafted order."
        robots="noindex, nofollow" 
      />
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* 🎉 NEW ORDER CELEBRATION BANNER */}
        {isNewOrder && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-200">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-emerald-950">
                  Order Confirmed & Placed Successfully!
                </h2>
                <p className="text-xs text-emerald-800 mt-0.5">
                  A receipt has been sent to your email. Bookmark or copy this live tracking URL to check your order anytime.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={copyLiveTrackingUrl}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Link Copied!" : "Copy Tracking Link"}
              </button>
              <Link
                to="/shop"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Shop More
              </Link>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            {userInfo ? (
              <Link to="/myorders" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1C1917] mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
              </Link>
            ) : (
              <Link to="/shop" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1C1917] mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            )}
            <div className="flex items-center flex-wrap gap-3">
              <h1 className="text-2xl md:text-3xl font-serif text-[#1C1917] flex items-center gap-3">
                Order <span className="text-gray-400 font-mono text-xl">#{order._id.slice(-6).toUpperCase()}</span>
              </h1>
              <button
                onClick={copyLiveTrackingUrl}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-[#1C1917] bg-white border border-gray-200 hover:border-gray-300 px-3 py-1 rounded-full transition-colors cursor-pointer shadow-2xs"
                title="Copy live tracking URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
                <span>{copied ? "Copied" : "Share Tracking URL"}</span>
              </button>
            </div>
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
                  <div key={index} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <Link to={`/product/${item.product}`} className="font-bold text-[#1C1917] hover:text-[#FF2865] transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                        <p className="font-bold text-[#1C1917] mt-1 sm:hidden">₹{safePrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-gray-50 sm:border-0">
                      {(order.isDelivered || activeStep >= 4) && (
                        <Link
                          to={`/product/${item.product}?writeReview=true&size=${item.size}#reviews-section`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-full text-xs font-bold transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Review & Share Fit
                        </Link>
                      )}
                      <div className="hidden sm:block text-right">
                        <p className="font-bold text-[#1C1917]">₹{safePrice(item.price * item.quantity)}</p>
                        <p className="text-xs text-gray-400">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Summary & Address) */}
          <div className="space-y-6">
            
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
                
                {/* Payment Status Badge */}
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
                    <User className="w-3 h-3" /> {order.user?.name || order.guestInfo?.name || order.shippingAddress?.name || 'Customer'}
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

            {/* SUPPORT */}
            <div className="bg-[#1C1917] text-white p-6 rounded-2xl text-center">
              <h4 className="font-serif text-lg mb-2">Need Help?</h4>
              <p className="text-xs text-gray-400 mb-4">Have an issue with this order?</p>
              <button onClick={handleSupport} className="bg-white text-[#1C1917] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FF2865] hover:text-white transition-colors w-full">
                Contact Support
              </button>
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