import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, CreditCard, Smartphone, ArrowLeft, 
  ArrowRight, ShieldCheck, MapPin, Lock, AlertCircle 
} from 'lucide-react';

// REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingAddress, savePaymentMethod, clearCart } from '../redux/cartSlice';
import { createOrder, resetOrder } from '../redux/orderSlice';
import { saveAddressToProfile } from '../redux/authSlice'; 

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
  const { items: cartItems, totalAmount, shippingAddress = {} } = useSelector((state) => state.cart);
  const { loading, success, error, order } = useSelector((state) => state.order);

  // --- LOCAL STATE ---
  const [step, setStep] = useState(1); 
  const [paymentType, setPaymentType] = useState('upi');

  // Form State
  const [formData, setFormData] = useState({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '', 
    postalCode: shippingAddress?.postalCode || '',
    phoneNumber: shippingAddress?.phoneNumber || '',
    country: 'India'
  });

  // --- 1. SAFETY CHECK: EMPTY CART ---
  useEffect(() => {
    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
    }
  }, [cartItems, navigate, step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // --- AUTO-FILL LOGIC ---
  useEffect(() => {
    if (userInfo && userInfo.addresses && userInfo.addresses.length > 0) {
       const primaryAddress = userInfo.addresses.find(addr => addr.isPrimary) || userInfo.addresses[0];
       
       // Only autofill if Redux shipping address is empty
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

  // --- CALCULATIONS ---
  const itemsPrice = totalAmount;
  const shippingCost = totalAmount > 2000 ? 0 : 150;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const finalTotal = itemsPrice + shippingCost + taxPrice;

  // --- ORDER SUCCESS EFFECT ---
  useEffect(() => {
    if (success) {
      dispatch(clearCart());
      setStep(3);
      window.scrollTo(0, 0);
    }
  }, [success, dispatch]);

  // Reset order state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(formData));

    // Save to profile if user has no addresses yet
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
      totalPrice: finalTotal,
    };

    // NOTE: If paymentType is 'upi', Razorpay logic usually happens here or in the Action
    dispatch(createOrder(orderData));
  };

 
  // --- STEP 3: SUCCESS SCREEN ---
  if (step === 3) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 animate-fade-up">
        
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        
        <span className="text-[#FF2865] text-xs font-bold uppercase tracking-[0.2em] mb-2">Order Confirmed</span>
        <h1 className="text-4xl font-serif text-[#1C1917] mb-4">Thank You, {userInfo?.name}!</h1>
        
        <p className="text-gray-500 max-w-md mb-6">
          Your order has been placed successfully. Please save your Order ID to track your shipment.
        </p>

        {/* --- ORDER ID BOX (New) --- */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</p>
            <p className="font-mono text-sm sm:text-base font-bold text-[#1C1917] select-all">
              {order?._id} 
            </p>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(order?._id)}
            className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            title="Copy Order ID"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
        </div>
        
        <div className="bg-[#F9F8F6] p-6 rounded-2xl w-full max-w-md mb-8 text-left border border-gray-100">
           <div className="flex justify-between mb-2">
             <span className="text-gray-500 text-sm">Amount Paid</span>
             <span className="font-bold text-[#1C1917]">₹{finalTotal.toLocaleString()}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-gray-500 text-sm">Payment Method</span>
             <span className="font-bold text-[#1C1917] uppercase">{paymentType}</span>
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
            className="flex-1 bg-white border border-gray-200 text-[#1C1917] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all text-center"
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
                        {/* REPLACED TEXT INPUT WITH DROPDOWN */}
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
                  <h2 className="text-2xl font-serif text-[#1C1917]">Payment Method</h2>
                </div>

                <div className="space-y-4 mb-8">
                  <div onClick={() => setPaymentType('upi')} className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${paymentType === 'upi' ? 'border-[#FF2865] bg-[#FF2865]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'upi' ? 'border-[#FF2865]' : 'border-gray-300'}`}>
                      {paymentType === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF2865]"></div>}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-[#1C1917]">UPI (Razorpay Secure)</span>
                      </div>
                    </div>
                  </div>

                  <div onClick={() => setPaymentType('cod')} className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${paymentType === 'cod' ? 'border-[#FF2865] bg-[#FF2865]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === 'cod' ? 'border-[#FF2865]' : 'border-gray-300'}`}>
                      {paymentType === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF2865]"></div>}
                    </div>
                    <div>
                        <span className="font-bold text-[#1C1917]">Cash on Delivery</span>
                        <p className="text-xs text-gray-500 mt-1">Pay cash when the order arrives.</p>
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
                    className="bg-[#FF2865] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#1C1917] transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="w-full lg:w-1/3 sticky top-32">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="font-serif text-xl text-[#1C1917] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C1917] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.size}</p>
                    </div>
                    <div className="ml-auto text-sm font-bold whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</div>
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
                  {shippingCost === 0 ? <span className="text-green-600">Free</span> : <span>₹{shippingCost}</span>}
                </div>
                 <div className="flex justify-between text-gray-600">
                  <span>Taxes (5%)</span>
                  <span>₹{taxPrice}</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>

              <div className="flex justify-between text-xl font-bold text-[#1C1917] mb-6">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 text-gray-500 text-xs">
                 <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span>Secure Checkout with SSL Encryption</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}