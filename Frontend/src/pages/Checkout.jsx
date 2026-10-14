import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  CreditCard,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Loader2,
  Copy,
  ChevronDown,
  ChevronUp,
  Banknote,
  Lock,
  ShieldCheck,
  BadgeCheck,
  Tag,
  X,
  Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";

// REDUX IMPORTS
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress, clearCart, applyDiscount, removeDiscount } from "../redux/cartSlice";
import { createOrder, resetOrder } from "../redux/orderSlice";
import { saveAddressToProfile } from "../redux/authSlice";
import { API_BASE_URL } from "../util/config";
import SEO from "../components/seo/SEO";

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
  const location = useLocation();

  // --- REDUX STATE ---
  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems, totalAmount, coupon } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.order);

  // --- LOCAL STATE ---
  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [createdOrderId, setCreatedOrderId] = useState(null); 

  // --- DYNAMIC SHIPPING SETTINGS ---
  const [shippingSettings, setShippingSettings] = useState({
    standardShipping: 150,
    ncrShipping: 100,
    freeShippingThreshold: 5000,
    ncrPincodePrefixes: "11,12,201"
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.shippingSettings) {
          setShippingSettings({
            standardShipping: Number(data.shippingSettings.standardShipping) >= 0 ? Number(data.shippingSettings.standardShipping) : 150,
            ncrShipping: Number(data.shippingSettings.ncrShipping) >= 0 ? Number(data.shippingSettings.ncrShipping) : 100,
            freeShippingThreshold: Number(data.shippingSettings.freeShippingThreshold) >= 0 ? Number(data.shippingSettings.freeShippingThreshold) : 5000,
            ncrPincodePrefixes: data.shippingSettings.ncrPincodePrefixes || "11,12,201"
          });
        }
      })
      .catch((err) => console.error("Failed to load storefront shipping settings", err));
  }, []);

  // --- COUPON STATE & ACTIONS ---
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  // 1. Fetch available store coupons so user can see and click-to-apply
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/coupons/active`);
        if (res.ok) {
          const data = await res.json();
          setAvailableCoupons(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load active coupons", err);
      }
    };
    fetchActiveCoupons();
  }, []);

  // 2. Background Re-validation of applied coupon (e.g. on page refresh or total change)
  useEffect(() => {
    if (coupon && totalAmount > 0) {
      const validateCurrentCoupon = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(userInfo?.token && { Authorization: `Bearer ${userInfo.token}` }),
            },
            body: JSON.stringify({ code: coupon.code, cartTotal: totalAmount }),
          });

          const data = await res.json();
          if (!res.ok) {
            dispatch(removeDiscount());
            toast.error(`Coupon ${coupon.code} is no longer valid or has expired.`);
          } else if (data.discountAmount !== coupon.discountAmount) {
            dispatch(
              applyDiscount({
                code: data.code,
                discountAmount: data.discountAmount,
                type: data.type,
                value: data.value,
              })
            );
          }
        } catch (err) {
          console.error("Coupon verification error", err);
        }
      };
      validateCurrentCoupon();
    }
  }, [coupon?.code, totalAmount, dispatch, userInfo?.token]);

  // 3. Apply coupon handler
  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userInfo?.token && { Authorization: `Bearer ${userInfo.token}` }),
        },
        body: JSON.stringify({ code, cartTotal: totalAmount }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(
          applyDiscount({
            code: data.code,
            discountAmount: data.discountAmount,
            type: data.type,
            value: data.value,
          })
        );
        setCouponCodeInput("");
        setShowAvailableCoupons(false);
        toast.success(`Coupon "${data.code}" applied! Saved ₹${data.discountAmount.toLocaleString()}`);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10B981', '#1C1917', '#F59E0B']
          });
        } catch (e) {}
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (err) {
      toast.error("Failed to verify coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  // 4. Remove coupon handler
  const handleRemoveCoupon = () => {
    dispatch(removeDiscount());
    toast("Coupon removed");
  };
  
  // 1. ✅ GET PRIMARY ADDRESS (Prioritize 'isPrimary', fallback to first index)
  const getPrimaryAddress = (addresses) => {
      if (!addresses || addresses.length === 0) return {};
      // Find the one marked isPrimary, OR default to the first one
      return addresses.find(addr => addr.isPrimary) || addresses[0];
  };

  const dbAddress = getPrimaryAddress(userInfo?.addresses);

  const getInitialPincode = () => {
    return (
      dbAddress.postalCode ||
      location.state?.estimatedPincode ||
      localStorage.getItem('checkedPincode') ||
      ""
    );
  };

  const [formData, setFormData] = useState({
    email: userInfo?.email || "",
    name: userInfo?.name || "",
    // Populate strictly from DB profile, fallback to cart/saved postal code
    address: dbAddress.address || "",
    city: dbAddress.city || "",
    state: dbAddress.state || "",
    postalCode: getInitialPincode(),
    phoneNumber: dbAddress.phoneNumber || "",
    country: "India",
  });

  // 2. ✅ SYNC ON LOAD (With Primary Check & Cart Pincode Auto-population)
  useEffect(() => {
    const candidatePincode =
      location.state?.estimatedPincode ||
      localStorage.getItem('checkedPincode') ||
      "";

    if (userInfo && userInfo.addresses && userInfo.addresses.length > 0) {
      const addr = getPrimaryAddress(userInfo.addresses);
      setFormData((prev) => ({
        ...prev,
        address: addr.address || prev.address || "",
        city: addr.city || prev.city || "",
        state: addr.state || prev.state || "",
        postalCode: addr.postalCode || prev.postalCode || candidatePincode,
        phoneNumber: addr.phoneNumber || prev.phoneNumber || "",
        name: userInfo.name || prev.name,
        email: userInfo.email || prev.email,
      }));
    } else if (candidatePincode) {
      setFormData((prev) => ({
        ...prev,
        postalCode: prev.postalCode || candidatePincode,
      }));
    }
  }, [userInfo, location.state]);

  // --- DYNAMIC SHIPPING LOGIC (Configured by Admin in CMS) ---
  const { itemsPrice, shippingCost, discountAmount, finalTotal, shippingLabel } = useMemo(() => {
    const itemsPrice = totalAmount;
    let shipping = shippingSettings.standardShipping;
    let label = "(Pan India)";

    if (totalAmount > shippingSettings.freeShippingThreshold) {
      shipping = 0;
      label = "Free Shipping";
    } else if (formData.postalCode && formData.postalCode.length >= 2) {
      const prefixes = (shippingSettings.ncrPincodePrefixes || "").split(',').map((p) => p.trim()).filter(Boolean);
      const isNCR = prefixes.some((prefix) => String(formData.postalCode).startsWith(prefix));
      if (isNCR) {
        shipping = shippingSettings.ncrShipping;
        label = "Delhi NCR Rate";
      }
    }

    const discount = coupon ? coupon.discountAmount : 0;
    const total = Math.max(0, Math.round(itemsPrice + shipping - discount));

    return { itemsPrice, shippingCost: shipping, discountAmount: discount, finalTotal: total, shippingLabel: label };
  }, [totalAmount, coupon, formData.postalCode, shippingSettings]);

  // --- LIFECYCLE ---
  useEffect(() => { dispatch(resetOrder()); }, [dispatch]);
  useEffect(() => { if(error){ toast.error(error); } }, [error]);

  // --- RAZORPAY LOGIC ---
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

  // --- HANDLERS ---
  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length < 10) return toast.error("Invalid phone number");
    dispatch(saveShippingAddress(formData));
    // If user has no addresses yet, save this one to profile automatically
    if (userInfo && (!userInfo.addresses || userInfo.addresses.length === 0)) {
      dispatch(saveAddressToProfile(formData));
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (loading || paymentProcessing) return;
    if (cartItems.length === 0) return toast.error("Your cart is empty");
    if (paymentMethod === "cod" && finalTotal > 15000) {
      return toast.error("COD is only available on orders up to ₹15,000. Please choose Online Payment.");
    }

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
      <SEO
        title="Secure Checkout | Beads and Bloom"
        description="Encrypted and secure checkout for Beads and Bloom handcrafted footwear."
        canonical="/checkout"
        robots="noindex, nofollow"
      />
      
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
              <OrderSummaryContent
                items={cartItems}
                itemsPrice={itemsPrice}
                shippingCost={shippingCost}
                discount={discountAmount}
                total={finalTotal}
                coupon={coupon}
                label={shippingLabel}
                couponCodeInput={couponCodeInput}
                setCouponCodeInput={setCouponCodeInput}
                couponLoading={couponLoading}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                availableCoupons={availableCoupons}
                showAvailableCoupons={showAvailableCoupons}
                setShowAvailableCoupons={setShowAvailableCoupons}
              />
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
                    <input 
                      type="text" 
                      maxLength={6} 
                      required 
                      placeholder="Pincode" 
                      value={formData.postalCode} 
                      onChange={(e) => {
                        const pin = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, postalCode: pin });
                        localStorage.setItem('checkedPincode', pin);
                      }} 
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all text-sm" 
                    />
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
                  <div 
                    onClick={() => {
                      if (finalTotal > 15000) {
                        toast.error("COD is available on orders up to ₹15,000. Please choose Online Payment.");
                        return;
                      }
                      setPaymentMethod("cod");
                    }} 
                    className={`p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      finalTotal > 15000
                        ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                        : paymentMethod === "cod"
                        ? "cursor-pointer border-[#1C1917] bg-white shadow-md"
                        : "cursor-pointer border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "cod" ? "border-[#1C1917]" : "border-gray-300"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[#1C1917]">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {finalTotal > 15000 ? "Unavailable for orders over ₹15,000" : "Pay in cash when order arrives"}
                      </p>
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
              <OrderSummaryContent
                items={cartItems}
                itemsPrice={itemsPrice}
                shippingCost={shippingCost}
                discount={discountAmount}
                total={finalTotal}
                coupon={coupon}
                label={shippingLabel}
                couponCodeInput={couponCodeInput}
                setCouponCodeInput={setCouponCodeInput}
                couponLoading={couponLoading}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                availableCoupons={availableCoupons}
                showAvailableCoupons={showAvailableCoupons}
                setShowAvailableCoupons={setShowAvailableCoupons}
              />
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

function OrderSummaryContent({
  items,
  itemsPrice,
  shippingCost,
  discount,
  total,
  coupon,
  label,
  couponCodeInput,
  setCouponCodeInput,
  couponLoading,
  handleApplyCoupon,
  handleRemoveCoupon,
  availableCoupons,
  showAvailableCoupons,
  setShowAvailableCoupons
}) {
  return (
    <>
      <h3 className="font-serif text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-4 text-[#1C1917]">
         <ShoppingBag size={18} /> Order Summary
      </h3>
      <div className="space-y-4 mb-4 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item) => (
          <div key={item._id || `${item.id}-${item.size}`} className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
               <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[#1C1917]">{item.name}</p>
              <p className="text-[10px] text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
            </div>
            <p className="text-xs font-bold text-[#1C1917] flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* --- COUPON INPUT & MANAGEMENT --- */}
      <div className="py-3 border-t border-gray-100">
        {!coupon ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="COUPON CODE"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold tracking-wider text-[#1C1917] placeholder:font-sans placeholder:font-normal placeholder:text-gray-400 focus:border-[#1C1917] focus:bg-white outline-none transition-all uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => handleApplyCoupon()}
                disabled={couponLoading || !couponCodeInput?.trim()}
                className="bg-[#1C1917] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-40 transition-all flex items-center justify-center min-w-[70px] shadow-sm"
              >
                {couponLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            {/* View Available Offers */}
            {availableCoupons && availableCoupons.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{showAvailableCoupons ? "Hide available offers" : "View available offers"} ({availableCoupons.length})</span>
                </button>
                {showAvailableCoupons && (
                  <div className="mt-2 space-y-1.5 p-2 bg-amber-50/70 rounded-xl border border-amber-200/60 max-h-36 overflow-y-auto">
                    {availableCoupons.map((c) => (
                      <div
                        key={c._id || c.code}
                        className="flex items-center justify-between py-1 px-2 bg-white/80 rounded-lg border border-amber-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[10px] tracking-wider bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[#1C1917]">
                            {c.code}
                          </span>
                          <span className="text-[10px] text-gray-600">
                            {c.discountType === "percentage" ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} OFF`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          disabled={couponLoading}
                          className="text-[10px] font-bold uppercase tracking-wider text-green-700 hover:text-green-800 hover:underline"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#1C1917]">
                    {coupon.code}
                  </span>
                  <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Applied
                  </span>
                </div>
                <p className="text-[10px] text-emerald-700 font-medium">
                  ₹{discount.toLocaleString()} savings applied to order
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              title="Remove coupon"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2.5 text-sm border-t border-gray-100 pt-3">
        <div className="flex justify-between text-gray-500 text-xs"><span>Subtotal</span><span>₹{itemsPrice.toLocaleString()}</span></div>
        <div className="flex justify-between text-gray-500 text-xs">
          <span>Shipping <span className="text-[10px] text-gray-400">{label}</span></span>
          <span>{shippingCost === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingCost}`}</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-emerald-600 font-bold text-xs">
              <span className="flex items-center gap-1"><BadgeCheck size={12}/> Coupon Discount ({coupon.code})</span>
              <span>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200 text-[#1C1917] mt-1">
            <span>Total to Pay</span>
            <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}