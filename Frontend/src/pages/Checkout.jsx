import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Smartphone,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Loader2,
  Mail,
  Copy,
  ChevronDown,
  ChevronUp,
  Banknote,
  Lock,
  ShieldCheck,
  BadgeCheck
} from "lucide-react";
import { toast } from "react-hot-toast";

// REDUX IMPORTS
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress, clearCart } from "../redux/cartSlice";
import { createOrder, resetOrder } from "../redux/orderSlice";
import { saveAddressToProfile } from "../redux/authSlice";
import { API_BASE_URL } from "../util/config";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- REDUX STATE ---
  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems, totalAmount, shippingAddress = {}, coupon } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.order);

  // --- LOCAL STATE ---
  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [createdOrderId, setCreatedOrderId] = useState(null); 
  
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

  // --- 1. DYNAMIC SHIPPING ---
  const { itemsPrice, shippingCost, discountAmount, finalTotal, shippingLabel } = useMemo(() => {
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

    return { itemsPrice, shippingCost: shipping, discountAmount: discount, finalTotal: total, shippingLabel: label };
  }, [totalAmount, coupon, formData.postalCode]);

  // --- 2. LIFECYCLE ---
  useEffect(() => { dispatch(resetOrder()); }, [dispatch]);
  useEffect(() => { if(error){ toast.error(error); } }, [error]);

  // --- 3. RAZORPAY LOGIC ---
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

  const handleRazorpayPayment = async (orderId) => {
    setPaymentProcessing(true);
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      toast.error("Payment gateway failed. Please refresh.");
      setPaymentProcessing(false);
      return;
    }

    try {
      const initRes = await fetch(`${API_BASE_URL}/api/orders/${orderId}/pay/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userInfo && { Authorization: `Bearer ${userInfo.token}` }),
        },
      });
      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.message || "Initiation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: initData.amount,
        currency: initData.currency,
        name: "Beads & Bloom",
        description: `Order #${orderId.slice(-6).toUpperCase()}`,
        order_id: initData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/orders/${orderId}/pay/verify`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(userInfo && { Authorization: `Bearer ${userInfo.token}` }),
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              dispatch(clearCart());
              setCreatedOrderId(orderId);
              setStep(3);
              window.scrollTo(0, 0);
            } else {
              toast.error("Verification failed.");
            }
          } catch (err) {
            toast.error("Network error.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phoneNumber },
        theme: { color: "#1C1917" },
        modal: { 
            ondismiss: () => {
                setPaymentProcessing(false);
                toast.error("Payment cancelled.");
            } 
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
      setPaymentProcessing(false);
    }
  };

  // --- 4. HANDLERS ---
  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length < 10) return toast.error("Invalid phone number");
    dispatch(saveShippingAddress(formData));
    if (userInfo && (!userInfo.addresses || userInfo.addresses.length === 0)) {
      dispatch(saveAddressToProfile(formData));
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (loading || paymentProcessing) return;
    if (cartItems.length === 0) return toast.error("Your cart is empty");

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item.product || item._id || item.id,
      })),
      shippingAddress: formData,
      paymentMethod: paymentMethod === "razorpay" ? "upi" : "cod",
      itemsPrice,
      shippingPrice: shippingCost,
      totalPrice: finalTotal,
      guestEmail: formData.email,
      name: formData.name,
      discountAmount: discountAmount || 0, 
      couponCode: coupon ? coupon.code : null 
    };

    try {
      const res = await dispatch(createOrder(orderData)).unwrap();
      if (paymentMethod === "razorpay") {
         handleRazorpayPayment(res._id);
      } else {
         setCreatedOrderId(res._id);
         dispatch(clearCart());
         setStep(3);
         window.scrollTo(0, 0);
      }
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    }
  };

  // --- RENDER SUCCESS ---
  if (step === 3 && createdOrderId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 animate-fade-in">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
          <BadgeCheck className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-serif mb-3 text-[#1C1917]">Order Confirmed!</h1>
        <p className="text-gray-500 mb-10 text-sm">
           A secure receipt has been sent to <span className="font-bold text-black">{formData.email}</span>
        </p>
        <div className="bg-gray-50 px-6 py-4 rounded-xl flex items-center gap-4 mb-10 border border-gray-200 shadow-sm">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Reference</p>
            <p className="text-sm font-mono font-bold text-[#1C1917]">{createdOrderId}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(createdOrderId); toast.success("Copied!"); }} className="text-gray-400 hover:text-[#1C1917]">
            <Copy size={18} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/shop" className="bg-[#1C1917] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
            Continue Shopping
          </Link>
          <Link to={`/order/${createdOrderId}`} className="border border-gray-300 bg-white text-[#1C1917] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#1C1917] transition-all">
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER CHECKOUT FORM ---
  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-20">
      
      {/* 🔒 SECURITY HEADER */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center gap-2 text-[#1C1917] border-b border-gray-200 pb-4">
             <Lock className="w-5 h-5 text-green-600" />
             <span className="font-serif text-xl font-bold">Secure Checkout</span>
             <span className="ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 100% Safe
             </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* MOBILE SUMMARY */}
        <div className="lg:hidden mb-6">
          <button onClick={() => setShowSummaryMobile(!showSummaryMobile)} className="w-full bg-white p-4 rounded-xl flex justify-between items-center border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><ShoppingBag size={18} /> {showSummaryMobile ? "Hide" : "Show"} Summary</div>
            <div className="text-sm font-bold">₹{finalTotal.toLocaleString()} {showSummaryMobile ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />}</div>
          </button>
          {showSummaryMobile && (
            <div className="bg-white border-x border-b border-gray-200 p-4 rounded-b-xl animate-fade-down">
              <OrderSummaryContent items={cartItems} itemsPrice={itemsPrice} shippingCost={shippingCost} discount={discountAmount} total={finalTotal} coupon={coupon} label={shippingLabel} />
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- LEFT SIDE: FORMS --- */}
          <div className="w-full lg:w-2/3">
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#1C1917]' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#1C1917] text-white' : 'bg-gray-200'}`}>1</div>
                    <span className="text-xs font-bold uppercase tracking-widest">Shipping</span>
                </div>
                <div className="w-8 h-[1px] bg-gray-200"></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#1C1917]' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#1C1917] text-white' : 'bg-gray-200'}`}>2</div>
                    <span className="text-xs font-bold uppercase tracking-widest">Payment</span>
                </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2 text-[#1C1917]"><MapPin size={20} /> Shipping Details</h2>
                
                {/* Contact Info */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="group">
                     <input type="email" required placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" />
                  </div>
                  <div className="group">
                     <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" />
                  </div>
                </div>

                {/* Address Info */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Address</p>
                <div className="space-y-4">
                  <input type="text" required placeholder="Street Address / Flat No." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                     className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                       className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" />
                    <select required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                       className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" maxLength={6} required placeholder="Pincode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, "") })} 
                       className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" />
                    <input type="text" maxLength={10} required placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, "") })} 
                       className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" />
                  </div>
                </div>

                <button type="submit" className="w-full mt-8 bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-lg">
                  Proceed to Payment <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 animate-fade-up">
                
                {/* Review Address */}
                <div className="mb-8 border border-gray-100 rounded-xl p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivering To</p>
                      <p className="text-sm text-[#1C1917] font-medium">
                        {formData.address}, {formData.city}, {formData.state} - {formData.postalCode}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">+91 {formData.phoneNumber}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[#1C1917] text-xs font-bold underline hover:text-[#FF2865]">Edit</button>
                </div>

                <h2 className="text-xl font-serif mb-6 flex items-center gap-2 text-[#1C1917]"><CreditCard size={20} /> Select Payment Method</h2>
                
                {/* 💳 Payment Options */}
                <div className="space-y-4 mb-8">
                  
                  {/* Option 1: Razorpay */}
                  <div onClick={() => setPaymentMethod("razorpay")} 
                       className={`relative cursor-pointer p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "razorpay" ? "border-[#1C1917] bg-white shadow-md" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "razorpay" ? "border-[#1C1917]" : "border-gray-300"}`}>
                      {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#1C1917]">Pay Online (Secured)</p>
                      <p className="text-xs text-gray-500 mt-0.5">UPI, Credit/Debit Cards, NetBanking</p>
                    </div>

                    {/* Trust Logos */}
                    <div className="flex gap-2 opacity-80">
                         <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" className="h-5" alt="Visa" />
                         <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" className="h-5" alt="Mastercard" />
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="h-5 object-contain" alt="UPI" />
                    </div>
                    
                    {paymentMethod === "razorpay" && <div className="absolute top-0 right-0 bg-[#1C1917] text-white text-[10px] px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">RECOMMENDED</div>}
                  </div>

                  {/* Option 2: COD */}
                  <div onClick={() => setPaymentMethod("cod")} 
                       className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "cod" ? "border-[#1C1917] bg-white shadow-md" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "cod" ? "border-[#1C1917]" : "border-gray-300"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#1C1917]">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Pay in cash when order arrives</p>
                    </div>
                    <Banknote size={24} className="text-gray-400" />
                  </div>
                </div>
      
                <div className="flex flex-col gap-4">
                  <button onClick={handlePlaceOrder} disabled={loading || paymentProcessing} className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-lg relative overflow-hidden">
                    {loading || paymentProcessing ? <Loader2 className="animate-spin" size={16} /> : 
                       <span className="flex items-center gap-2">
                           <Lock size={14} /> 
                           {paymentMethod === "cod" ? `Place Order ₹${finalTotal.toLocaleString()}` : `Pay Securely ₹${finalTotal.toLocaleString()}`}
                       </span>
                    }
                  </button>
                  
                  {/* Security Footer */}
                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-2">
                      <Lock size={10} />
                      <span>256-bit SSL Encrypted Payment</span>
                  </div>
                  
                  <button onClick={() => setStep(1)} className="text-xs text-gray-400 underline hover:text-[#1C1917]">Go back to Shipping</button>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: SUMMARY --- */}
          <div className="hidden lg:block w-1/3 sticky top-32">
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-gray-100">
              <OrderSummaryContent items={cartItems} itemsPrice={itemsPrice} shippingCost={shippingCost} discount={discountAmount} total={finalTotal} coupon={coupon} label={shippingLabel} />
            </div>
            
            {/* Security Badge Below Summary */}
            <div className="mt-4 flex items-center justify-center gap-4 grayscale opacity-60">
                <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" className="h-8" alt="Visa" />
                <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" className="h-8" alt="Amex" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" className="h-8" alt="Mastercard" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function OrderSummaryContent({ items, itemsPrice, shippingCost, discount, total, coupon, label }) {
  return (
    <>
      <h3 className="font-serif text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-4 text-[#1C1917]">
         <ShoppingBag size={18} /> Order Summary
      </h3>
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => (
          <div key={item._id} className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
               <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold line-clamp-1 text-[#1C1917]">{item.name}</p>
              <p className="text-[10px] text-gray-500">Size: {item.size} x {item.quantity}</p>
            </div>
            <p className="text-xs font-bold text-[#1C1917]">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
        <div className="flex justify-between text-gray-500 text-xs"><span>Subtotal</span><span>₹{itemsPrice.toLocaleString()}</span></div>
        <div className="flex justify-between text-gray-500 text-xs">
          <span>Shipping <span className="text-[10px] text-gray-400">{label}</span></span>
          <span>{shippingCost === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingCost}`}</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-green-600 font-bold text-xs">
              <span className="flex items-center gap-1"><BadgeCheck size={12}/> Discount</span>
              <span>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200 text-[#1C1917] mt-2">
            <span>Total to Pay</span>
            <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}