import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react'; // Added AlertTriangle for RTO
import { API_BASE_URL } from '../util/config'; 
import { getOptimizedImage } from '../util/imageUtils'; 

export default function TrackOrder() {
  const [formData, setFormData] = useState({ orderId: '', email: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Could not find order. Check ID & Email.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: DETERMINE ACTIVE STEP ---
  const getStepStatus = () => {
    const currentStatus = order?.orderStatus || 'Processing';
    
    // 🚨 NEW: Handle Returned / Cancelled
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
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] mb-3">Track Your Order</h1>
          <p className="text-gray-500">Enter your Order ID and Email to see real-time updates.</p>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Order ID</label>
              <input 
                type="text" 
                name="orderId"
                placeholder="e.g. 64f8a..."
                value={formData.orderId}
                onChange={handleChange}
                required
                className="w-full bg-[#F9F8F6] border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Billing Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#F9F8F6] border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1C1917] text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-[#FF2865] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? 'Searching...' : 'Track'}
                {!loading && <Search className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100 flex items-center justify-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}
        </div>

        {/* ORDER RESULTS */}
        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-up">
            
            {/* Top Bar: ID & Amount */}
            <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order Found</p>
                <p className="text-lg font-bold text-[#1C1917]">#{order._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Amount</p>
                <p className="text-lg font-bold text-[#FF2865]">₹{order.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-8">
              
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
                        subLabel="Packing your order"
                        isActive={activeStep >= 1}
                        isCompleted={activeStep > 1}
                      />

                      {/* Step 3: Shipped (UPDATED to show Courier Name) */}
                      <TimelineStep 
                        icon={Truck} 
                        label="Shipped" 
                        // Show Courier Name OR 'Waiting'
                        subLabel={order.awbCode ? `${order.courierName || 'Courier'} (AWB: ${order.awbCode})` : "Waiting for courier"}
                        isActive={activeStep >= 2}
                        isCompleted={activeStep > 2}
                        // Only show link if AWB exists
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

              {/* ITEMS LIST */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Package Contents</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={getOptimizedImage(item.image, 100)} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1C1917] text-sm md:text-base">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
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
        ${isCompleted ? 'bg-green-500 border-green-500' : ''}
        `}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`font-bold text-sm ${isActive ? 'text-[#1C1917]' : 'text-gray-500'}`}>{label}</p>
        
        {/* Render SubLabel (Courier Name, etc.) */}
        {subLabel && <p className="text-xs text-gray-500 mt-0.5 break-all">{subLabel}</p>}
        
        {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
        
        {/* Render Tracking Link */}
        {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#FF2865] underline mt-1 block hover:text-[#1C1917]">
                Track Package
            </a>
        )}
      </div>
    </div>
  );
}