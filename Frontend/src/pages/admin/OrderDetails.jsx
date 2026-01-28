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
  User,
  Settings,
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

  // --- NEW: CONFIRMATION & SHIPPING LOGIC ---
  const handleShiprocket = () => {
    // 1. Custom Toast UI (No more "localhost says")
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-sm">
            Generate Shipping Label?
          </span>
          <span className="text-xs text-gray-500">
            This will push the order to Shiprocket.
          </span>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id); // Close toast
                executeShipping(); // Run logic
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700"
            >
              Yes, Ship It
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, icon: "🚀" },
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
      toast.error(err.response?.data?.message || "Shipping Failed", {
        id: toastId,
      });
    } finally {
      setShipLoading(false);
    }
  };

  // --- MANUAL STATUS UPDATE ---
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

  // --- HELPERS ---
  const getStepStatus = () => {
    if (!order) return 0;
    const status = order.orderStatus;
    if (order.isDelivered || status === "Delivered") return 4;
    if (status === "Out for Delivery") return 3;
    if (status === "Ready to Ship" || status === "Shipped" || order.awbCode)
      return 2;
    if (status === "Processing") return 1;
    return 0;
  };
  const activeStep = getStepStatus();
  const safePrice = (p) => (p ? p.toLocaleString() : "0");

  // --- RENDER ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-[#F9F8F6]">
        <h2 className="text-2xl font-serif text-red-500 mb-4">
          Error Loading Order
        </h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/myorders" className="underline hover:text-[#FF2865]">
          Back to My Orders
        </Link>
      </div>
    );

  const isShipped = !!order.awbCode || !!order.shiprocketOrderId; // Check if already shipped

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1C1917] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif text-[#1C1917] flex items-center gap-3">
              Order{" "}
              <span className="text-gray-400 font-mono text-xl">
                #{order._id.slice(-6).toUpperCase()}
              </span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Placed On
            </p>
            <p className="text-sm font-medium text-[#1C1917] flex items-center gap-2 justify-end">
              <Calendar className="w-4 h-4" />
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: TIMELINE & ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-400" /> Order Tracking
                </h3>
                {order.awbCode && (
                  <div className="text-right animate-fade-in">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {order.courierCompanyName || "Courier"} Tracking (AWB)
                    </p>
                    <p className="font-mono text-blue-600 font-bold text-lg">
                      {order.awbCode}
                    </p>
                    <a
                      href={`https://shiprocket.co/tracking/${order.awbCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#FF2865] underline"
                    >
                      Track Shipment
                    </a>
                  </div>
                )}
              </div>

              <div className="relative">
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
                    subLabel={order.awbCode ? "In Transit" : ""}
                    isActive={activeStep >= 2}
                    isCompleted={activeStep > 2}
                  />
                  <TimelineStep
                    icon={CheckCircle}
                    label="Delivered"
                    date={
                      order.isDelivered
                        ? new Date(order.deliveredAt).toLocaleDateString()
                        : null
                    }
                    isActive={activeStep >= 4}
                    isCompleted={activeStep >= 4}
                  />
                </div>
              </div>
            </div>

            {/* ITEMS LIST */}
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link
                        to={`/product/${item.product}`}
                        className="font-bold text-[#1C1917] hover:text-[#FF2865] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1C1917]">
                        ₹{safePrice(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ACTIONS & SUMMARY */}
          <div className="space-y-6">
            {userInfo?.isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" /> Manage Order
                </h3>
                <div className="space-y-4">
                  {/* --- NEW: SMART SHIP BUTTON --- */}
                  <button
                    onClick={handleShiprocket}
                    disabled={
                      shipLoading ||
                      isShipped ||
                      order.orderStatus === "Cancelled"
                    }
                    className={`w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 text-sm
        ${
          isShipped
            ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        }`}
                  >
                    {shipLoading ? (
                      "Connecting..."
                    ) : isShipped ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Order Pushed to
                        Shiprocket
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4" /> Ship via Shiprocket
                      </>
                    )}
                  </button>

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
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleManualStatusUpdate}
                        disabled={updateLoading}
                        className="bg-gray-900 text-white px-4 rounded-lg font-bold text-xs hover:bg-[#FF2865] transition-colors disabled:opacity-70"
                      >
                        {updateLoading ? "..." : "Update"}
                      </button>
                    </div>

                    {/* 👇 RESTORED WARNING MESSAGE */}
                    <p className="text-[10px] text-gray-400 mt-2">
                      Use this if automation fails. It will override the current
                      status.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT & ADDRESS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" /> Payment
              </h3>
              <div className="space-y-3 text-sm border-b border-gray-50 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Method</span>
                  <span className="font-bold uppercase">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Status</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${order.isPaid ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}
                  >
                    {order.isPaid ? "PAID" : "PENDING"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total</span>
                  <span className="font-bold text-black">
                    ₹{safePrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" /> Delivery To
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900 mb-1">
                    {order.user?.name || "Guest"}
                  </p>
                  <p>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </p>
                  <p>
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.state}
                  </p>
                  <p className="mt-2 font-medium text-black">
                    Ph: {order.shippingAddress.phoneNumber}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Helper
function TimelineStep({
  icon: Icon,
  label,
  subLabel,
  date,
  isActive,
  isCompleted,
}) {
  return (
    <div
      className={`flex flex-row md:flex-col items-center gap-4 md:gap-3 text-left md:text-center ${isActive ? "opacity-100" : "opacity-40 grayscale"}`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${isActive ? "bg-[#1C1917] border-[#1C1917] text-white" : "bg-white border-gray-200 text-gray-400"} ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}`}
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <div>
        <p
          className={`font-bold text-sm ${isActive ? "text-[#1C1917]" : "text-gray-500"}`}
        >
          {label}
        </p>
        {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
        {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
      </div>
    </div>
  );
}
