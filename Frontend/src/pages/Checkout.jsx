import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Lock,
  AlertCircle,
  ShoppingBag,
  Tag,
  Loader2,
  Mail,
  Copy,
  ChevronDown,
  ChevronUp,
  Truck,
  Banknote, // Icon for Cash
} from "lucide-react";
import { toast } from "react-hot-toast";

// REDUX IMPORTS
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  applyDiscount, // Assuming you have this action
} from "../redux/cartSlice";
import { createOrder, resetOrder } from "../redux/orderSlice";
import { saveAddressToProfile } from "../redux/authSlice";
import { API_BASE_URL } from "../util/config";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- REDUX STATE ---
  const { userInfo } = useSelector((state) => state.auth);
  const {
    items: cartItems,
    totalAmount,
    shippingAddress = {},
    coupon,
  } = useSelector((state) => state.cart);
  const { loading, success, error, order } = useSelector(
    (state) => state.order,
  );

  // --- LOCAL STATE ---
  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);

  // RESTORED: Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // Default to Online

  // RESTORED: Coupon State
  const [couponCode, setCouponCode] = useState("");

  const [formData, setFormData] = useState({
    email: userInfo?.email || "",
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    state: shippingAddress?.state || "",
    postalCode: shippingAddress?.postalCode || "",
    phoneNumber: shippingAddress?.phoneNumber || "",
    country: "India",
    name: userInfo?.name || "",
  });

  // --- 1. DYNAMIC SHIPPING & PRICE CALCULATION ---
  const {
    itemsPrice,
    shippingCost,
    discountAmount,
    finalTotal,
    shippingLabel,
  } = useMemo(() => {
    const itemsPrice = totalAmount;
    let shipping = 150;
    let label = "(Pan India)";

    if (totalAmount > 5000) {
      shipping = 0;
      label = "Free Shipping";
    } else if (formData.postalCode && formData.postalCode.length === 6) {
      const isNCR = /^(11|12|201)/.test(formData.postalCode);
      if (isNCR) {
        shipping = 100;
        label = "Delhi NCR Rate";
      }
    }

    const discount = coupon ? coupon.discountAmount : 0;
    const total = Math.round(itemsPrice + shipping - discount);

    return {
      itemsPrice,
      shippingCost: shipping,
      discountAmount: discount,
      finalTotal: total,
      shippingLabel: label,
    };
  }, [totalAmount, coupon, formData.postalCode]);

  // --- 2. RAZORPAY SCRIPT LOADER ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (step === 2) loadRazorpayScript();
  }, [step]);

  // --- 3. RAZORPAY PAYMENT HANDLER ---
  const handleRazorpayPayment = async (orderData) => {
    setPaymentProcessing(true);
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      toast.error("Payment gateway failed to load. Please refresh.");
      setPaymentProcessing(false);
      return;
    }

    try {
      const initRes = await fetch(
        `${API_BASE_URL}/api/orders/${orderData._id}/pay/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(userInfo && { Authorization: `Bearer ${userInfo.token}` }),
          },
        },
      );
      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.message || "Initiation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: initData.amount,
        currency: initData.currency,
        name: "Beads & Bloom",
        description: `Order #${orderData._id.slice(-6).toUpperCase()}`,
        order_id: initData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API_BASE_URL}/api/orders/${orderData._id}/pay/verify`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  ...(userInfo && {
                    Authorization: `Bearer ${userInfo.token}`,
                  }),
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              },
            );

            if (verifyRes.ok) {
              dispatch(clearCart());
              setStep(3);
              window.scrollTo(0, 0);
            } else {
              toast.error("Payment verification failed. Contact support.");
            }
          } catch (err) {
            toast.error("Network error during verification.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: { color: "#1C1917" },
        modal: { ondismiss: () => setPaymentProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
      setPaymentProcessing(false);
    }
  };

  // --- 4. EFFECTS ---
  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) navigate("/cart");
  }, [cartItems, navigate, step]);

  useEffect(() => {
    // Only auto-trigger razorpay if success AND payment method is razorpay
    if (success && order && step === 2 && paymentMethod === "razorpay") {
      handleRazorpayPayment(order);
    } else if (success && order && step === 2 && paymentMethod === "cod") {
      // Direct success for COD
      dispatch(clearCart());
      setStep(3);
      window.scrollTo(0, 0);
    }
  }, [success, order]);

  // --- 5. HANDLERS ---
  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length < 10)
      return toast.error("Invalid phone number");

    dispatch(saveShippingAddress(formData));
    if (userInfo && (!userInfo.addresses || userInfo.addresses.length === 0)) {
      dispatch(saveAddressToProfile(formData));
    }
    setStep(2);
  };

  

  const handlePlaceOrder = () => {
    if (loading || paymentProcessing) return;

    if (success && order) {
      if (paymentMethod === "razorpay") handleRazorpayPayment(order);
      else setStep(3);
      return;
    }

    const orderData = {
      // ✅ SAFETY NET FIX: Ensure ID maps correctly
      orderItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item.product || item._id || item.id,
      })),
      shippingAddress: formData,
      paymentMethod: paymentMethod === "razorpay" ? "upi" : "cod", // Map to backend expected string
      itemsPrice,
      shippingPrice: shippingCost,
      totalPrice: finalTotal,
      guestEmail: formData.email,
      name: formData.name,
    };

    dispatch(createOrder(orderData));
  };

  // --- SUCCESS SCREEN ---
  // --- SUCCESS SCREEN ---
  if (step === 3 && order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 animate-fade-in">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-serif mb-3 text-[#1C1917]">Order Confirmed!</h1>
        <p className="text-gray-500 mb-10 text-sm">
           A receipt has been sent to <span className="font-bold text-black">{formData.email}</span>
        </p>
        
        {/* Order ID Box */}
        <div className="bg-gray-50 px-6 py-4 rounded-xl flex items-center gap-4 mb-10 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Reference</p>
            <p className="text-sm font-mono font-bold text-[#1C1917]">{order._id}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(order._id);
              toast.success("Order ID Copied!");
            }}
            className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-[#FF2865]"
            title="Copy Order ID"
          >
            <Copy size={18} />
          </button>
        </div>

        {/* RESTORED BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/shop"
            className="bg-[#1C1917] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FF2865] hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            Continue Shopping
          </Link>
          
          <Link
            to={`/order/${order._id}`}
            className="border-2 border-gray-100 bg-white text-[#1C1917] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#1C1917] hover:bg-gray-50 transition-all"
          >
            View Order Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* MOBILE SUMMARY */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowSummaryMobile(!showSummaryMobile)}
            className="w-full bg-white p-4 rounded-xl flex justify-between items-center border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShoppingBag size={18} className="text-[#FF2865]" />{" "}
              {showSummaryMobile ? "Hide" : "Show"} Summary
            </div>
            <div className="text-sm font-bold">
              ₹{finalTotal.toLocaleString()}{" "}
              {showSummaryMobile ? (
                <ChevronUp className="inline ml-1" />
              ) : (
                <ChevronDown className="inline ml-1" />
              )}
            </div>
          </button>
          {showSummaryMobile && (
            <div className="bg-white border-x border-b border-gray-200 p-4 rounded-b-xl animate-fade-down">
              <OrderSummaryContent
                items={cartItems}
                itemsPrice={itemsPrice}
                shippingCost={shippingCost}
                discount={discountAmount}
                total={finalTotal}
                coupon={coupon}
                label={shippingLabel}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT COLUMN: FORMS */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span className={step >= 1 ? "text-[#FF2865]" : ""}>
                1. Details
              </span>
              <div className="w-8 h-[1px] bg-gray-200"></div>
              <span className={step >= 2 ? "text-[#FF2865]" : ""}>
                2. Payment
              </span>
            </div>

            {step === 1 ? (
              <form
                onSubmit={handleNextStep}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
                  <Mail size={20} className="text-[#FF2865]" /> Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF2865]/20"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF2865]/20"
                  />
                </div>

                <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-[#FF2865]" /> Shipping
                  Address
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none"
                    />
                    <select
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Pincode"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          postalCode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none"
                    />
                    <input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full bg-[#F9F8F6] rounded-xl px-5 py-3 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-8 bg-[#1C1917] text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all flex justify-center items-center gap-2"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
                {/* --- RESTORED: ADDRESS REVIEW --- */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        Ship to:
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.address}, {formData.city}
                        <br />
                        {formData.state} - {formData.postalCode}
                        <br />
                        +91 {formData.phoneNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[#FF2865] text-xs font-bold underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* --- RESTORED: PAYMENT METHODS --- */}
                <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#FF2865]" /> Payment
                  Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* OPTION 1: ONLINE */}
                  <div
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      paymentMethod === "razorpay"
                        ? "border-[#FF2865] bg-red-50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "razorpay" ? "border-[#FF2865]" : "border-gray-300"}`}
                    >
                      {paymentMethod === "razorpay" && (
                        <div className="w-2 h-2 rounded-full bg-[#FF2865]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">Online Payment</p>
                      <p className="text-xs text-gray-500">
                        UPI, Cards, NetBanking
                      </p>
                    </div>
                    <Smartphone size={20} className="ml-auto text-gray-400" />
                  </div>

                  {/* OPTION 2: COD */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      paymentMethod === "cod"
                        ? "border-[#FF2865] bg-red-50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-[#FF2865]" : "border-gray-300"}`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2 h-2 rounded-full bg-[#FF2865]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">
                        Pay cash upon arrival
                      </p>
                    </div>
                    <Banknote size={20} className="ml-auto text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || paymentProcessing}
                    className="flex-[2] bg-[#1C1917] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-[#FF2865] transition-all flex justify-center items-center gap-2"
                  >
                    {loading || paymentProcessing ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : paymentMethod === "cod" ? (
                      `Place Order ₹${finalTotal.toLocaleString()}`
                    ) : (
                      `Pay Now ₹${finalTotal.toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="hidden lg:block w-1/3 sticky top-32">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <OrderSummaryContent
                items={cartItems}
                itemsPrice={itemsPrice}
                shippingCost={shippingCost}
                discount={discountAmount}
                total={finalTotal}
                coupon={coupon}
                label={shippingLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Summary Component
function OrderSummaryContent({
  items,
  itemsPrice,
  shippingCost,
  discount,
  total,
  coupon,
  label,
}) {
  return (
    <>
      <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
        <ShoppingBag size={18} /> Summary
      </h3>
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => (
          <div key={item._id} className="flex gap-4 items-center">
            <img
              src={item.image}
              className="w-12 h-12 object-cover rounded-lg bg-gray-50"
              alt={item.name}
            />
            <div className="flex-1">
              <p className="text-xs font-bold line-clamp-1">{item.name}</p>
              <p className="text-[10px] text-gray-400">
                Size: {item.size} x {item.quantity}
              </p>
            </div>
            <p className="text-xs font-bold">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-3 text-sm border-t pt-4">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>₹{itemsPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>
            Shipping{" "}
            <span className="text-[10px] lowercase text-gray-400">{label}</span>
          </span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-bold">Free</span>
            ) : (
              `₹${shippingCost}`
            )}
          </span>
        </div>
        {coupon && (
          <div className="flex justify-between text-[#FF2865] font-bold">
            <span>Discount</span>
            <span>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t text-[#1C1917]">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}
