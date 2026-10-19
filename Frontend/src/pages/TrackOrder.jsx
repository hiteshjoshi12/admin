import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Package, Truck, CheckCircle, Clock, 
  AlertTriangle, Copy, Check, ExternalLink, ArrowRight,
  MapPin, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../util/config'; 
import { getOptimizedImage } from '../util/imageUtils'; 
import SEO from '../components/seo/SEO';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ orderId: '', email: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);

  const fetchTrackOrder = useCallback(async (idToTrack, emailToTrack) => {
    if (!idToTrack || !idToTrack.trim()) return;
    const rawId = idToTrack.trim();
    const match24 = rawId.match(/[a-f0-9]{24}/i);
    const cleanId = match24 ? match24[0] : rawId;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: cleanId, 
          email: emailToTrack ? emailToTrack.trim() : '' 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Could not find order. Please verify your Order ID.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Pre-fill and auto-track from URL query params (e.g., ?orderId=64f8a... or ?id=...)
  useEffect(() => {
    const qId = searchParams.get('orderId') || searchParams.get('id');
    const qEmail = searchParams.get('email');

    if (qId) {
      const match24 = qId.match(/[a-f0-9]{24}/i);
      const cleanQId = match24 ? match24[0] : qId;
      setFormData({
        orderId: cleanQId,
        email: qEmail || ''
      });
      fetchTrackOrder(cleanQId, qEmail || '');
    }
  }, [searchParams, fetchTrackOrder]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'orderId') {
      const match24 = value.match(/[a-f0-9]{24}/i);
      if (match24 && (value.includes('/') || value.includes('http') || value.includes('#'))) {
        value = match24[0];
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawId = formData.orderId.trim();
    const match24 = rawId.match(/[a-f0-9]{24}/i);
    const idToTrack = match24 ? match24[0] : rawId;
    fetchTrackOrder(idToTrack, formData.email);
  };

  const handleCopyLink = () => {
    if (!order) return;
    const directUrl = `${window.location.origin}/order/${order._id}`;
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    toast.success("Live order tracking link copied!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyAwb = (awb) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    toast.success("Tracking number (AWB) copied!");
    setTimeout(() => setCopiedAwb(false), 2500);
  };

  // --- HELPER: DETERMINE ACTIVE STEP ---
  const getStepStatus = () => {
    const currentStatus = order?.orderStatus || 'Processing';
    
    if (currentStatus === 'Returned') return -1; // RTO Case
    if (currentStatus === 'Cancelled') return -2; // Cancelled Case
    
    if (currentStatus === 'Delivered') return 4;
    if (currentStatus === 'Out for Delivery') return 3;
    if (currentStatus === 'Ready to Ship' || currentStatus === 'Shipped') return 2;
    if (currentStatus === 'Processing') return 1;
    return 0; // Order Placed
  };

  const activeStep = getStepStatus();

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-16 px-4 md:px-6">
      <SEO
        title="Track Your Order | Beads and Bloom"
        description="Real-time order tracking and shipment status for your Beads and Bloom handcrafted footwear."
        canonical="/track-order"
        robots="noindex, nofollow"
      />
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3 shadow-2xs">
            <Truck size={13} className="text-[#1C1917]" /> Live Shipment Tracker
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] mb-3">Track Your Order</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Enter your Order ID from your confirmation email or receipt to view real-time package updates.
          </p>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-4">
            
            <div className="md:col-span-6 space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-600 flex items-center justify-between">
                <span>Order ID *</span>
                <span className="text-[10px] text-gray-400 font-normal">From email, link, or receipt</span>
              </label>
              <input 
                type="text" 
                name="orderId"
                placeholder="e.g. 6ad665... or paste tracking URL"
                value={formData.orderId}
                onChange={handleChange}
                required
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-[#1C1917] focus:border-[#1C1917] focus:bg-white outline-none transition-all placeholder:font-sans placeholder:text-gray-400"
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-600 flex items-center justify-between">
                <span>Billing Email</span>
                <span className="text-[10px] text-gray-400 font-normal">(Optional)</span>
              </label>
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:border-[#1C1917] focus:bg-white outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1C1917] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#FF2865] transition-all disabled:opacity-70 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                {loading ? 'Tracking...' : 'Track'}
                {!loading && <Search className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100 flex items-center justify-center gap-2 animate-fade-in">
              <AlertTriangle size={16} /> {error}
            </div>
          )}
        </div>

        {/* ORDER RESULTS */}
        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-up">
            
            {/* Top Bar: ID, Date, Amount */}
            <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/70">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Reference</p>
                <p className="text-lg font-bold font-mono text-[#1C1917]">#{order._id.slice(-6).toUpperCase()}</p>
                {order.createdAt && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                <p className="text-xl font-bold text-[#FF2865]">₹{order.totalPrice.toLocaleString()}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {order.isPaid ? 'PAID' : (order.paymentMethod?.toUpperCase() === 'COD' ? 'CASH ON DELIVERY' : 'PENDING')}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              
              {/* 🔗 DIRECT LIVE TRACKING LINK BANNER */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-2xs">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-200">
                    <ExternalLink size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Direct Live Tracking Link</p>
                    <p className="text-xs font-mono text-emerald-950 truncate max-w-xs md:max-w-md">
                      {window.location.origin}/order/{order._id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold hover:bg-emerald-100/70 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedLink ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                  </button>
                  <Link
                    to={`/order/${order._id}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#1C1917] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Full Order View</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Destination badge if available */}
              {(order.shippingCity || order.shippingState) && (
                <div className="mb-6 flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <MapPin size={14} className="text-gray-400" />
                  <span>Delivering to: <strong className="text-gray-900">{order.shippingCity}, {order.shippingState} {order.shippingPostalCode ? `- ${order.shippingPostalCode}` : ''}</strong></span>
                </div>
              )}

              {/* STATUS ALERT FOR CANCELLED/RETURNED */}
              {activeStep < 0 && (
                 <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertTriangle className="shrink-0" />
                    <div>
                        <p className="font-bold">{order.orderStatus}</p>
                        <p className="text-xs">This order has been {order.orderStatus.toLowerCase()}. Contact support for help.</p>
                    </div>
                 </div>
              )}

              {/* TIMELINE (Hidden if Cancelled/Returned) */}
              {activeStep >= 0 && (
                  <div className="relative mb-12">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 hidden md:block"></div>
                    <div className="absolute left-6 top-0 w-1 h-full bg-gray-100 -translate-x-1/2 z-0 md:hidden"></div>

                    <div className="grid grid-rows-4 md:grid-rows-1 md:grid-cols-4 gap-8 relative z-10">
                      
                      {/* Step 1: Placed */}
                      <TimelineStep 
                        icon={Clock} 
                        label="Order Placed" 
                        date={new Date(order.createdAt).toLocaleDateString()} 
                        isActive={activeStep >= 0}
                        isCompleted={activeStep > 0} 
                      />
                      
                      {/* Step 2: Processing */}
                      <TimelineStep 
                        icon={Package} 
                        label="Processing" 
                        subLabel="Handcrafted & Packed"
                        isActive={activeStep >= 1}
                        isCompleted={activeStep > 1} 
                      />

                      {/* Step 3: Shipped (Shows Courier Name & AWB) */}
                      <TimelineStep 
                        icon={Truck} 
                        label="Shipped" 
                        subLabel={order.awbCode ? `${order.courierName || 'Courier'} (AWB: ${order.awbCode})` : "Waiting for courier handover"}
                        isActive={activeStep >= 2}
                        isCompleted={activeStep > 2}
                        link={order.awbCode ? `https://shiprocket.co/tracking/${order.awbCode}` : null}
                      />

                      {/* Step 4: Delivered */}
                      <TimelineStep 
                        icon={CheckCircle} 
                        label="Delivered" 
                        date={order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : null}
                        isActive={activeStep >= 4} 
                        isCompleted={activeStep >= 4}
                      />

                    </div>
                  </div>
              )}

              {/* Courier Tracking Quick Bar if AWB exists */}
              {order.awbCode && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {order.courierName || 'Courier'} Waybill Number
                      </p>
                      <p className="font-mono text-sm font-bold text-[#1C1917]">{order.awbCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyAwb(order.awbCode)}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:text-black rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedAwb ? "Copied" : "Copy AWB"}
                    </button>
                    <a
                      href={`https://shiprocket.co/tracking/${order.awbCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#1C1917] text-white text-xs font-bold rounded-lg hover:bg-[#FF2865] transition-colors"
                    >
                      <span>Courier Status</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              {/* ITEMS LIST */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Package size={14} /> Package Contents ({order.orderItems?.length || 0})
                </h3>
                <div className="space-y-3">
                  {order.orderItems?.map((item) => (
                    <div key={item._id || item.product} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <img 
                          src={getOptimizedImage(item.image, 100)} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1C1917] text-sm md:text-base truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Size: <span className="font-semibold text-gray-700">{item.size}</span> | Qty: <span className="font-semibold text-gray-700">{item.quantity}</span></p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm shrink-0">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to={`/order/${order._id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all shadow-md"
                >
                  <span>Open Full Order & Invoice Page</span>
                  <ArrowRight size={14} />
                </Link>
                <p className="text-xs text-gray-400 text-center sm:text-right">
                  Questions? <Link to="/contact" className="text-[#1C1917] underline font-bold hover:text-[#FF2865]">Contact Customer Care</Link>
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TIMELINE STEP ---
function TimelineStep({ icon: Icon, label, subLabel, date, isActive, isCompleted, link }) {
  return (
    <div className={`flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500
        ${isActive ? 'bg-[#1C1917] border-[#1C1917] text-white' : 'bg-white border-gray-200 text-gray-400'}
        ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
        `}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`font-bold text-sm ${isActive ? 'text-[#1C1917]' : 'text-gray-500'}`}>{label}</p>
        
        {subLabel && <p className="text-xs text-gray-500 mt-0.5 break-all">{subLabel}</p>}
        {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
        
        {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#FF2865] underline mt-1 block hover:text-[#1C1917]">
                Track via Courier
            </a>
        )}
      </div>
    </div>
  );
}