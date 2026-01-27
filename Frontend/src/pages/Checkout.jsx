import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, CreditCard, Smartphone, ArrowLeft, 
  ArrowRight, ShieldCheck, MapPin, Lock, AlertCircle, ShoppingBag, Tag 
} from 'lucide-react';

// REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingAddress, savePaymentMethod, clearCart } from '../redux/cartSlice';
import { createOrder, resetOrder } from '../redux/orderSlice';
import { saveAddressToProfile } from '../redux/authSlice'; 
import { API_BASE_URL } from '../util/config';

// CONSTANTS
const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- REDUX STATE ---
  const { userInfo } = useSelector((state) => state.auth);
  // Get Coupon from Redux
  const { items: cartItems, totalAmount, shippingAddress = {}, coupon } = useSelector((state) => state.cart);
  const { loading, success, error, order } = useSelector((state) => state.order);

  // --- LOCAL STATE ---
  const [step, setStep] = useState(1); 
  const paymentType = 'upi'; 

  // Form State
  const [formData, setFormData] = useState({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '', 
    postalCode: shippingAddress?.postalCode || '',
    phoneNumber: shippingAddress?.phoneNumber || '',
    country: 'India'
  });

  // --- CALCULATIONS (With Breakdown) ---
  const itemsPrice = totalAmount; // Base price of items
  const shippingCost = totalAmount > 2000 ? 0 : 150;
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% Tax
  const discountAmount = coupon ? coupon.discountAmount : 0; // Discount Value
  
  // Final Math: (Items + Tax + Shipping) - Discount
  const finalTotal = (itemsPrice + taxPrice + shippingCost) - discountAmount;

  // --- RAZORPAY SCRIPT LOADER ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- RAZORPAY HANDLER ---
  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // A. INITIATE ORDER
      const initRes = await fetch(`${API_BASE_URL}/api/orders/${orderData._id}/pay/initiate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const initData = await initRes.json();

      if (!initRes.ok) throw new Error(initData.message || 'Payment initiation failed');

      // B. OPEN MODAL
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: initData.amount,
        currency: initData.currency,
        name: "Luxe Store",
        description: "Secure Payment",
        order_id: initData.id,
        
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/orders/${orderData._id}/pay/verify`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              dispatch(clearCart());
              setStep(3); // Success
              window.scrollTo(0, 0);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("Server error during verification.");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: formData.phoneNumber
        },
        theme: {
          color: "#1C1917"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong initializing payment.");
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
    }
  }, [cartItems, navigate, step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (userInfo && userInfo.addresses && userInfo.addresses.length > 0) {
       const primaryAddress = userInfo.addresses.find(addr => addr.isPrimary) || userInfo.addresses[0];
       if (primaryAddress && !shippingAddress.address) {
         setFormData({
           address: primaryAddress.address,
           city: primaryAddress.city,
           state: primaryAddress.state || '', 
           postalCode: primaryAddress.postalCode,
           phoneNumber: primaryAddress.phoneNumber,
           country: 'India'
         });
       }
    }
  }, [userInfo, shippingAddress]);

  useEffect(() => {
    if (success && order) {
        handleRazorpayPayment(order);
    }
    // eslint-disable-next-line
  }, [success, order]); 

  useEffect(() => {
    return () => {
      if(step === 3) dispatch(resetOrder());
    };
  }, [dispatch, step]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(formData));
    if (userInfo && (!userInfo.addresses || userInfo.addresses.length === 0)) {
       dispatch(saveAddressToProfile(formData));
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    dispatch(savePaymentMethod(paymentType));

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item.id || item.productId || item._id 
      })),
      shippingAddress: formData, 
      paymentMethod: paymentType,
      itemsPrice, 
      shippingPrice: shippingCost,
      taxPrice,
      totalPrice: finalTotal, // <--- Correct Total sent to backend
    };

    dispatch(createOrder(orderData));
  };

  // --- STEP 3: SUCCESS SCREEN ---
  if (step === 3 && order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 animate-fade-up">
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        
        <span className="text-green-600 text-xs font-bold uppercase tracking-[0.2em] mb-2">Payment Successful</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] mb-4">Thank You, {userInfo?.name?.split(' ')[0]}!</h1>
        
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          Your order has been confirmed. We've sent a confirmation email to 
          <span className="font-bold text-gray-800"> {userInfo?.email}</span>.
        </p>

        <div className="bg-[#F9F8F6] border border-gray-100 rounded-2xl w-full max-w-md mb-8 overflow-hidden">
           <div className="p-6 border-b border-gray-200">
             <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Number</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(order._id)}
                  className="text-[10px] text-[#FF2865] font-bold uppercase hover:underline"
                >
                  Copy
                </button>
             </div>
             <p className="font-mono text-lg font-bold text-[#1C1917] select-all tracking-wide">
                {order._id}
             </p>
           </div>
           
           <div className="p-6 bg-white">
             <div className="flex justify-between mb-3">
               <span className="text-gray-500 text-sm">Amount Paid</span>
               <span className="font-bold text-[#1C1917] text-lg">₹{order.totalPrice?.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-500 text-sm">Payment Method</span>
               <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <CreditCard className="w-3 h-3 text-gray-600" />
                  <span className="font-bold text-[#1C1917] text-xs uppercase">{order.paymentMethod}</span>
               </div>
             </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link 
            to="/myorders" 
            className="flex-1 bg-[#1C1917] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all shadow-lg text-center"
            >
            View My Orders
            </Link>
            <Link 
            to="/track-order" 
            className="flex-1 bg-white border border-gray-200 text-[#1C1917] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
            >
            Track Order
            </Link>
        </div>

      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-24">
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Breadcrumb / Stepper */}
        <div className="flex items-center gap-4 mb-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <span className={step >= 1 ? "text-[#FF2865]" : ""}>1. Shipping</span>
          <span className="w-8 h-[1px] bg-gray-300"></span>
          <span className={step >= 2 ? "text-[#FF2865]" : ""}>2. Payment</span>
          <span className="w-8 h-[1px] bg-gray-300"></span>
          <span className={step === 3 ? "text-[#FF2865]" : ""}>3. Confirm</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* --- LEFT COLUMN: FORMS --- */}
          <div className="w-full lg:w-2/3">
            
            {/* STEP 1: SHIPPING INFO */}
            {step === 1 && (
              <>
                {!userInfo ? (
                  <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center animate-fade-up">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1C1917]">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-[#1C1917] mb-2">Account Required</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Please sign in or create an account to securely save your shipping details.</p>
                    <div className="flex justify-center gap-4">
                      <Link to="/login" className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase text-xs hover:bg-[#FF2865] transition-colors">Log In</Link>
                      <Link to="/signup" className="border border-gray-300 px-8 py-3 rounded-full font-bold uppercase text-xs hover:border-black hover:bg-gray-50 transition-colors">Sign Up</Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNextStep} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-[#FF2865]/10 flex items-center justify-center text-[#FF2865]">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-serif text-[#1C1917]">Shipping Address</h2>
                    </div>

                    <div className="space-y-2 mb-6">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Address</label>
                      <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" placeholder="Flat / House No / Street" />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                       <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                      </div>
                       <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">State</label>
                        <div className="relative">
                          <select 
                            name="state" 
                            required 
                            value={formData.state} 
                            onChange={handleInputChange} 
                            className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pincode</label>
                        <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                        <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" placeholder="+91" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1917]">
                        <ArrowLeft className="w-4 h-4" /> Return to Cart
                      </Link>
                      <button type="submit" className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all flex items-center gap-2">
                        Proceed to Payment <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* STEP 2: PAYMENT OPTIONS */}
            {step === 2 && (
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
                 {error && (
                   <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2">
                     <AlertCircle className="w-4 h-4" /> {error}
                   </div>
                 )}

                 <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#FF2865]/10 flex items-center justify-center text-[#FF2865]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-serif text-[#1C1917]">Secure Payment</h2>
                </div>

                <div className="border-2 border-[#1C1917] bg-gray-50 rounded-2xl p-6 mb-8 relative overflow-hidden group cursor-default">
                    <div className="absolute right-0 top-0 bg-[#1C1917] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl">
                        Recommended
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                            <Smartphone className="w-6 h-6 text-[#1C1917]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[#1C1917]">UPI / Cards / NetBanking</h3>
                            <p className="text-sm text-gray-500">Secured by Razorpay. 100% Safe.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1917]">
                    <ArrowLeft className="w-4 h-4" /> Back to Shipping
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading}
                    className="bg-[#1C1917] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all shadow-lg flex items-center gap-3 disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : (
                        <>
                            Pay ₹{finalTotal.toLocaleString()} <ShieldCheck className="w-4 h-4" />
                        </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="w-full lg:w-1/3 sticky top-32">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Order Summary
              </h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1C1917] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right text-sm font-bold whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shippingCost === 0 ? <span className="text-green-600 font-bold">Free</span> : <span>₹{shippingCost}</span>}
                </div>
                 <div className="flex justify-between text-gray-600">
                  <span>Taxes (5%)</span>
                  <span>₹{taxPrice}</span>
                </div>
                
                {/* COUPON DISPLAY */}
                {coupon && (
                  <div className="flex justify-between text-[#FF2865] font-bold">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({coupon.code})</span>
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