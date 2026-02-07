import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  Settings,
  Phone,
  Mail,
  AlertTriangle,
  Copy
} from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../util/config";
import axios from "axios";
import { toast } from "react-hot-toast";

const ORDER_STATUSES = [
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
];

export default function OrderDetails() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [shipLoading, setShipLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // --- FETCH ORDER ---
  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrder(data);
      setSelectedStatus(data.orderStatus);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userInfo) fetchOrder();
  }, [id, userInfo]);

  // --- ACTIONS ---
  const handleShiprocket = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-sm">Generate Shipping Label?</span>
          <span className="text-xs text-gray-500">This will push the order to Shiprocket.</span>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeShipping();
              }}
              className="bg-[#1C1917] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-800"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, icon: "📦" }
    );
  };

  const executeShipping = async () => {
    setShipLoading(true);
    const toastId = toast.loading("Connecting to Shiprocket...");

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/orders/${id}/ship`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      if (data.awbCode) {
        toast.success(`Label Generated! AWB: ${data.awbCode}`, { id: toastId });
      } else {
        toast.success("Order sent to Dashboard (Draft)", { id: toastId });
      }
      setOrder(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Shipping Failed", { id: toastId });
    } finally {
      setShipLoading(false);
    }
  };

  const handleManualStatusUpdate = async () => {
    setUpdateLoading(true);
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/orders/${id}/status`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setOrder(data);
      toast.success("Status Updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  // --- HELPERS ---
  const getStepStatus = () => {
    if (!order) return 0;
    const status = order.orderStatus;
    if (order.isDelivered || status === "Delivered") return 4;
    if (status === "Out for Delivery") return 3;
    if (status === "Ready to Ship" || status === "Shipped" || order.awbCode) return 2;
    if (status === "Processing") return 1;
    return 0;
  };
  const activeStep = getStepStatus();
  const safePrice = (p) => (p ? p.toLocaleString() : "0");
  const isShipped = !!order?.awbCode || !!order?.shiprocketOrderId;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-[#F9F8F6]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-[#F9F8F6]">
      <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
      <p className="text-gray-500 mb-6">{error || "The requested order does not exist."}</p>
      <Link to="/admin/orders" className="bg-[#1C1917] text-white px-6 py-2 rounded-lg font-bold text-sm">
        Back to Orders
      </Link>
    </div>
  );

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1C1917] mb-3 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to List
            </Link>
            <div className="flex items-baseline gap-3">
               <h1 className="text-3xl font-serif text-[#1C1917]">Order Details</h1>
               <span className="font-mono text-gray-400 text-lg">#{order._id.slice(-6).toUpperCase()}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
               <Calendar size={12} /> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3">
             <div className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 ${order.isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {order.isPaid ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {order.isPaid ? 'Payment Verified' : 'Payment Pending'}
             </div>
             <div className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 ${order.isDelivered ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                {order.isDelivered ? <CheckCircle size={16} /> : <Clock size={16} />}
                {order.isDelivered ? 'Delivered' : order.orderStatus}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (Info) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TIMELINE */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-400" /> Fulfillment Status
                  </h3>
                  {order.awbCode && (
                     <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-gray-400">AWB Tracking</p>
                        <div className="flex items-center gap-2">
                           <span className="font-mono font-bold text-[#1C1917]">{order.awbCode}</span>
                           <button onClick={() => copyToClipboard(order.awbCode)} className="text-gray-400 hover:text-[#1C1917]"><Copy size={12} /></button>
                        </div>
                     </div>
                  )}
               </div>
               
               <div className="relative">
                  {/* Progress Bar Line */}
                  <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-100 md:h-0.5 md:w-full md:top-6 md:left-0 z-0"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                     <TimelineStep icon={Clock} label="Placed" date={new Date(order.createdAt).toLocaleDateString()} isActive={activeStep >= 0} isCompleted={activeStep > 0} />
                     <TimelineStep icon={Package} label="Processing" isActive={activeStep >= 1} isCompleted={activeStep > 1} />
                     <TimelineStep icon={Truck} label="Shipped" isActive={activeStep >= 2} isCompleted={activeStep > 2} />
                     <TimelineStep icon={CheckCircle} label="Delivered" date={order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : null} isActive={activeStep >= 4} isCompleted={activeStep >= 4} />
                  </div>
               </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" /> Items ({order.orderItems?.length})
                  </h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="p-6 flex gap-4 hover:bg-gray-50/30 transition-colors">
                       <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-grow">
                          <Link to={`/product/${item.product}`} className="font-bold text-[#1C1917] hover:underline line-clamp-1">
                             {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-[#1C1917]">₹{safePrice(item.price * item.quantity)}</p>
                          <p className="text-xs text-gray-400">{item.quantity} x ₹{item.price}</p>
                       </div>
                    </div>
                  ))}
               </div>
               {/* Totals Footer */}
               <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                     <span>Subtotal</span>
                     <span>₹{safePrice(order.itemPrice || (order.totalPrice - order.shippingPrice))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                     <span>Shipping</span>
                     <span>₹{safePrice(order.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1C1917] pt-2 border-t border-gray-200/50">
                     <span>Total</span>
                     <span>₹{safePrice(order.totalPrice)}</span>
                  </div>
               </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Actions & Meta) --- */}
          <div className="space-y-6">

             {/* ADMIN ACTIONS CARD */}
             {userInfo?.isAdmin && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-400" /> Admin Actions
                   </h3>
                   
                   <div className="space-y-4">
                      {/* SHIPROCKET BUTTON */}
                      <button
                        onClick={handleShiprocket}
                        disabled={shipLoading || isShipped || order.orderStatus === "Cancelled"}
                        className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
                           ${isShipped 
                             ? "bg-green-50 text-green-700 border border-green-100 cursor-default" 
                             : "bg-[#1C1917] text-white hover:bg-[#FF2865] shadow-lg shadow-gray-200 hover:shadow-red-100"
                           } disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                         {shipLoading ? <Clock className="animate-spin w-4 h-4"/> : isShipped ? <CheckCircle className="w-4 h-4"/> : <Package className="w-4 h-4"/>}
                         {shipLoading ? "Processing..." : isShipped ? "Shipped via Shiprocket" : "Generate Label"}
                      </button>

                      <hr className="border-gray-100" />

                      {/* MANUAL STATUS */}
                      <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Update Status</label>
                         <div className="flex gap-2">
                            <select
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1C1917]/10 outline-none"
                            >
                               {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button
                               onClick={handleManualStatusUpdate}
                               disabled={updateLoading}
                               className="bg-white border border-gray-200 text-[#1C1917] px-4 rounded-lg font-bold text-xs hover:bg-gray-50 transition-colors"
                            >
                               {updateLoading ? "..." : "Save"}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* CUSTOMER DETAILS */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-[#1C1917] mb-4">Customer</h3>
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                         {order.user?.name?.charAt(0) || "G"}
                      </div>
                      <div>
                         <p className="font-bold text-sm text-[#1C1917]">{order.user?.name || order.guestInfo?.name || "Guest"}</p>
                         <p className="text-xs text-gray-500">Customer</p>
                      </div>
                   </div>
                   
                   <div className="pt-4 border-t border-gray-50 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <Mail className="w-4 h-4 text-gray-400" />
                         <a href={`mailto:${order.user?.email || order.guestInfo?.email}`} className="hover:text-[#1C1917] hover:underline truncate">
                            {order.user?.email || order.guestInfo?.email}
                         </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <Phone className="w-4 h-4 text-gray-400" />
                         <span>{order.shippingAddress?.phoneNumber || "N/A"}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* SHIPPING ADDRESS */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-gray-400" /> Shipping Address
                </h3>
                {order.shippingAddress ? (
                   <div className="text-sm text-gray-600 leading-relaxed">
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <p className="font-mono mt-1">{order.shippingAddress.postalCode}</p>
                      <p className="mt-2 text-xs text-gray-400 uppercase font-bold tracking-wider">{order.shippingAddress.country || 'India'}</p>
                   </div>
                ) : (
                   <p className="text-sm text-gray-400 italic">No address provided</p>
                )}
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-Component: Timeline
function TimelineStep({ icon: Icon, label, date, isActive, isCompleted }) {
  return (
    <div className={`flex flex-row md:flex-col items-center gap-4 md:gap-3 text-left md:text-center ${isActive ? "opacity-100" : "opacity-40 grayscale"}`}>
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all 
          ${isActive ? "bg-[#1C1917] border-[#1C1917] text-white shadow-md" : "bg-white border-gray-200 text-gray-300"} 
          ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}`}>
        {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
      </div>
      <div>
        <p className={`font-bold text-xs md:text-sm ${isActive ? "text-[#1C1917]" : "text-gray-400"}`}>{label}</p>
        {date && <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">{date}</p>}
      </div>
    </div>
  );
}