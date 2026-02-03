import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { toast } from "react-hot-toast";

// REDUX IMPORTS
import { useSelector, useDispatch } from "react-redux";
import {
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
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

  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const paymentType = "upi";

  // Combined Form Data
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

  // --- NEW: DYNAMIC SHIPPING LOGIC ---
  const {
    itemsPrice,
    shippingCost,
    discountAmount,
    finalTotal,
    shippingLabel,
  } = useMemo(() => {
    const itemsPrice = totalAmount;
    let shipping = 150; // Default Pan India
    let label = "(Pan India)";

    // Priority 1: Free Shipping > 5000
    if (totalAmount > 5000) {
      shipping = 0;
      label = "Free";
    }
    // Priority 2: Location Based (Only check if pincode is 6 digits)
    else if (formData.postalCode && formData.postalCode.length === 6) {
      // Logic: Delhi (11), Gurgaon/Faridabad (12), Noida/Ghaziabad (201)
      const isNCR = /^(11|12|201)/.test(formData.postalCode);
      if (isNCR) {
        shipping = 100;
        label = "(Delhi NCR)";
      }
    }

    const discountAmount = coupon ? coupon.discountAmount : 0;
    const finalTotal = itemsPrice + shipping - discountAmount;

    return {
      itemsPrice,
      shippingCost: shipping,
      discountAmount,
      finalTotal,
      shippingLabel: label,
    };
  }, [totalAmount, coupon, formData.postalCode]); // <--- Re-run when Pincode changes

  // --- RAZORPAY SCRIPT LOADER ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- RAZORPAY HANDLER ---
  const handleRazorpayPayment = async (orderData) => {
    setPaymentProcessing(true);
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed. Check connection.");
      setPaymentProcessing(false);
      return;
    }

    try {
      // 1. INITIATE ORDER
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

      if (!initRes.ok)
        throw new Error(initData.message || "Payment initiation failed");

      // 2. OPEN RAZORPAY MODAL
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: initData.amount,
        currency: initData.currency,
        name: "Beads & Bloom",
        description: `Order #${orderData._id}`,
        order_id: initData.id,

        handler: async function (response) {
          try {
            // 3. VERIFY PAYMENT
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
              setStep(3); // Success Screen
              window.scrollTo(0, 0);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Server error during verification.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
            toast("Payment cancelled");
          },
        },
        prefill: {
          name: userInfo?.name || formData.name,
          email: userInfo?.email || formData.email,
          contact: formData.phoneNumber,
        },
        theme: { color: "#1C1917" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Payment initialization failed");
      setPaymentProcessing(false);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
      navigate("/cart");
    }
  }, [cartItems, navigate, step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        email: userInfo.email,
        name: userInfo.name,
      }));

      if (userInfo.addresses?.length > 0 && !shippingAddress.address) {
        const primaryAddress =
          userInfo.addresses.find((addr) => addr.isPrimary) ||
          userInfo.addresses[0];
        if (primaryAddress) {
          setFormData((prev) => ({
            ...prev,
            address: primaryAddress.address,
            city: primaryAddress.city,
            state: primaryAddress.state || "",
            postalCode: primaryAddress.postalCode,
            phoneNumber: primaryAddress.phoneNumber,
          }));
        }
      }
    }
  }, [userInfo, shippingAddress]);

  useEffect(() => {
    if (success && order && step === 2) {
      handleRazorpayPayment(order);
    }
  }, [success, order]);

  useEffect(() => {
    return () => {
      if (step === 3) dispatch(resetOrder());
    };
  }, [dispatch, step]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    const { email, name, ...shippingData } = formData;
    dispatch(saveShippingAddress(shippingData));
    if (userInfo && (!userInfo.addresses || userInfo.addresses.length === 0)) {
      dispatch(saveAddressToProfile(shippingData));
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (loading || paymentProcessing) return;
    dispatch(savePaymentMethod(paymentType));
    const addressPayload = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
    };
    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item.id || item.productId || item._id,
      })),
      shippingAddress: addressPayload,
      paymentMethod: paymentType,
      itemsPrice,
      shippingPrice: shippingCost, // Uses calculated cost
      totalPrice: finalTotal,
      guestEmail: formData.email,
      name: formData.name || "Guest",
    };
    dispatch(createOrder(orderData));
  };

  const handleCopyOrderId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      toast.success("Order ID copied to clipboard!");
    }
  };

  // --- STEP 3: SUCCESS SCREEN ---
  if (step === 3 && order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 animate-fade-up">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <span className="text-green-600 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          Payment Successful
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] mb-4">
          Thank You{formData.name ? `, ${formData.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          Your order has been confirmed. We've sent a receipt to{" "}
          <span className="font-bold text-gray-800">{formData.email}</span>.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center justify-between gap-4 max-w-xs w-full shadow-sm hover:shadow-md transition-shadow">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              Order ID
            </p>
            <p className="font-mono text-sm font-bold text-[#1C1917] break-all">
              {order._id}
            </p>
          </div>
          <button
            onClick={handleCopyOrderId}
            className="p-2 hover:bg-white hover:text-[#FF2865] rounded-lg transition-all border border-transparent hover:border-gray-200 text-gray-500"
            title="Copy Order ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {userInfo && (
            <Link
              to="/myorders"
              className="flex-1 bg-[#1C1917] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all shadow-lg text-center"
            >
              View Order
            </Link>
          )}
          <Link
            to="/shop"
            className="flex-1 bg-white border border-gray-200 text-[#1C1917] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Stepper */}
        <div className="flex items-center gap-4 mb-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <span className={step >= 1 ? "text-[#FF2865]" : ""}>1. Details</span>
          <span className="w-8 h-[1px] bg-gray-300"></span>
          <span className={step >= 2 ? "text-[#FF2865]" : ""}>2. Payment</span>
          <span className="w-8 h-[1px] bg-gray-300"></span>
          <span className={step === 3 ? "text-[#FF2865]" : ""}>3. Confirm</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* --- LEFT COLUMN --- */}
          <div className="w-full lg:w-2/3">
            {/* STEP 1: SHIPPING FORM */}
            {step === 1 && (
              <form
                onSubmit={handleNextStep}
                className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-up"
              >
                {/* 1. CONTACT INFO SECTION */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <Mail className="w-5 h-5 text-[#FF2865]" />
                    <h2 className="text-2xl font-serif text-[#1C1917]">
                      Contact Info
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-500">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!!userInfo}
                        className={`w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none ${userInfo ? "opacity-70 cursor-not-allowed" : ""}`}
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!!userInfo}
                        className={`w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none ${userInfo ? "opacity-70 cursor-not-allowed" : ""}`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  {!userInfo && (
                    <p className="text-xs text-gray-400 mt-3">
                      Already have an account?{" "}
                      <Link
                        to="/login?redirect=checkout"
                        className="text-[#FF2865] underline"
                      >
                        Log in
                      </Link>
                    </p>
                  )}
                </div>

                {/* 2. SHIPPING ADDRESS SECTION */}
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <MapPin className="w-5 h-5 text-[#FF2865]" />
                    <h2 className="text-2xl font-serif text-[#1C1917]">
                      Shipping Address
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-500">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none"
                        placeholder="Flat / House No / Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 outline-none"
                        placeholder="City"
                      />
                      <div className="relative">
                        <select
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 outline-none appearance-none"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {/* PINCODE INPUT - This triggers calculation */}
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={(e) => {
                          // Restrict to numbers only
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFormData({ ...formData, postalCode: val });
                        }}
                        maxLength={6}
                        className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF2865]/20 transition-all"
                        placeholder="Pincode"
                      />
                      <input
                        type="text"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 outline-none"
                        placeholder="Phone"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1917]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Cart
                  </Link>
                  <button
                    type="submit"
                    className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase text-xs hover:bg-[#FF2865] flex items-center gap-2"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm flex gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-8">
                  <CreditCard className="w-5 h-5 text-[#FF2865]" />
                  <h2 className="text-2xl font-serif text-[#1C1917]">
                    Secure Payment
                  </h2>
                </div>

                {/* Summary of Info */}
                <div className="bg-[#F9F8F6] p-4 rounded-xl mb-6 text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-bold text-[#1C1917]">Contact:</span>{" "}
                    {formData.email}
                  </p>
                  <p>
                    <span className="font-bold text-[#1C1917]">Ship to:</span>{" "}
                    {formData.address}, {formData.city}, {formData.postalCode}
                  </p>
                </div>

                <div className="border-2 border-[#1C1917] bg-gray-50 rounded-2xl p-6 mb-8 relative">
                  <div className="absolute right-0 top-0 bg-[#1C1917] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl">
                    Recommended
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Smartphone className="w-6 h-6 text-[#1C1917]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#1C1917]">
                        Razorpay Secure
                      </h3>
                      <p className="text-sm text-gray-500">
                        UPI / Cards / NetBanking / Wallets
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1917]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Details
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || paymentProcessing}
                    className="bg-[#1C1917] text-white px-8 py-4 rounded-full font-bold uppercase text-xs hover:bg-[#FF2865] transition-all shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading || paymentProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{finalTotal.toLocaleString()}{" "}
                        <ShieldCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <div className="w-full lg:w-1/3 sticky top-32">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1C1917] line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right text-sm font-bold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{itemsPrice.toLocaleString()}</span>
                </div>

                {/* --- MODIFIED SHIPPING SECTION --- */}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <div className="text-right">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-bold">Free</span>
                    ) : (
                      <span className="font-medium text-[#1C1917]">
                        ₹{shippingCost}
                      </span>
                    )}

                    {/* Show Label (e.g., Delhi NCR) if Pincode is valid */}
                    {formData.postalCode.length === 6 && (
                      <p className="text-[10px] text-green-600 font-medium">
                        {shippingLabel}
                      </p>
                    )}
                  </div>
                </div>

                {/* --- NEW: INFO MESSAGE FOR PINCODE --- */}
                {/* Show this ONLY if: Shipping is NOT free AND Pincode is incomplete */}
                {shippingCost !== 0 && formData.postalCode.length !== 6 && (
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex gap-2 items-start mt-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-600 leading-tight">
                      Standard shipping is ₹150. Enter your Pincode to check for{" "}
                      <b>Delhi NCR rates (₹100).</b>
                    </p>
                  </div>
                )}
                {/* ------------------------------------- */}

                {coupon && (
                  <div className="flex justify-between text-[#FF2865] font-bold mt-2">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Discount ({coupon.code})
                    </span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>

              <div className="flex justify-between text-xl font-bold text-[#1C1917] mb-6">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>

              <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 text-green-800 text-xs font-bold border border-green-100">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>SSL Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
