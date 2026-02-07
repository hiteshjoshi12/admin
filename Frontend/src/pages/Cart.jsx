import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Tag, X, MapPin, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast'; 

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, applyDiscount, removeDiscount } from '../redux/cartSlice';
import { API_BASE_URL } from '../util/config';

export default function Cart() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Get Redux State
  const { items: cartItems, totalAmount, coupon: appliedCoupon } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- NEW: SHIPPING & PINCODE STATE ---
  const [pincode, setPincode] = useState('');
  const [shippingCost, setShippingCost] = useState(150); // Default Pan India
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);

  // --- 1. NEW: LOGIC TO CALCULATE SHIPPING ---
  useEffect(() => {
    // Priority 1: Free Shipping on high value
    if (totalAmount > 5000) {
      setShippingCost(0);
    } 
    // Priority 2: If we haven't checked pincode yet, default to 150
    else if (!isPincodeChecked) {
      setShippingCost(150);
    }
    // Priority 3: Retain the calculated cost (handled by checkPincode)
  }, [totalAmount, isPincodeChecked]);

  const handleCheckPincode = () => {
    if (pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit Pincode");
      return;
    }

    // Logic: Delhi (11), Gurgaon/Faridabad (12), Noida/Ghaziabad (201)
    const isNCR = /^(11|12|201)/.test(pincode);

    if (totalAmount > 5000) {
      setShippingCost(0);
      toast.success("Free shipping applied on orders over ₹5000!");
    } else if (isNCR) {
      setShippingCost(100);
      toast.success(`Delhi NCR Location detected: Shipping ₹100`);
    } else {
      setShippingCost(150);
      toast.success(`Pan India Location: Shipping ₹150`);
    }
    setIsPincodeChecked(true);
  };

  // --- 2. EXISTING: RE-VALIDATE COUPON ---
  useEffect(() => {
    if (appliedCoupon) {
      const validateCoupon = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(userInfo && { Authorization: `Bearer ${userInfo.token}` }) 
            },
            body: JSON.stringify({ code: appliedCoupon.code, cartTotal: totalAmount }),
          });

          const data = await res.json();

          if (!res.ok) {
            dispatch(removeDiscount());
            toast.error(`Coupon ${appliedCoupon.code} has expired.`);
          } else {
            if (data.discountAmount !== appliedCoupon.discountAmount) {
                 dispatch(applyDiscount({
                    code: data.code,
                    discountAmount: data.discountAmount,
                }));
            }
          }
        } catch (err) {
          console.error("Coupon validation failed", err);
        }
      };
      validateCoupon();
    }
  }, [appliedCoupon?.code, totalAmount, userInfo, dispatch]);

  const checkoutHandler = () => {
    const stateData = { estimatedShipping: shippingCost };
    if (userInfo) {
      navigate('/checkout', { state: stateData });
    } else {
      navigate('/login?redirect=checkout', { state: stateData });
    }
  };

  const handleUpdateQty = (id, size, newQty, maxStock) => {
    if (newQty < 1) return;
    const limit = maxStock || 10; 
    if (newQty > limit) {
      toast.error(`Sorry, only ${limit} items available!`);
      return;
    }
    dispatch(updateQuantity({ id, size, quantity: newQty }));
    if (appliedCoupon) dispatch(removeDiscount());
  };

  const handleRemove = (id, size) => {
    dispatch(removeFromCart({ id, size }));
    if (appliedCoupon) dispatch(removeDiscount());
    toast.success("Item removed");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: totalAmount }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(applyDiscount({ code: data.code, discountAmount: data.discountAmount }));
        setCouponCode('');
        toast.success("Coupon Applied!");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FF2865', '#1C1917', '#ffffff'] });
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeDiscount());
    toast("Coupon removed");
  };

  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = totalAmount - discountVal + shippingCost;

  // --- EMPTY CART VIEW ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in bg-[#F8F9FA]">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 text-gray-300 shadow-sm border border-gray-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif text-[#1C1917] mb-3">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added any luxury pieces yet.</p>
        <Link to="/shop" className="bg-[#1C1917] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-24">
      
      {/* HEADER */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917] mb-2">Shopping Bag</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
             <span className="font-bold text-[#1C1917]">{cartItems.length} items</span> 
             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
             <span>Total: ₹{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT: CART ITEMS LIST */}
          <div className="w-full lg:w-2/3 space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                  className="bg-white p-4 sm:p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center group"
                >
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                          <Link to={`/product/${item.id}`} className="font-serif text-lg sm:text-xl text-[#1C1917] hover:text-[#FF2865] transition-colors line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">In Stock</p>
                      </div>
                      <button onClick={() => handleRemove(item.id, item.size)} className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4">
                      {/* Quantity & Size */}
                      <div className="flex items-center gap-4">
                         <span className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold uppercase text-gray-600">Size: {item.size}</span>
                         
                         <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-1">
                            <button onClick={() => handleUpdateQty(item.id, item.size, item.quantity - 1, item.maxStock)} disabled={item.quantity <= 1} 
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center text-[#1C1917]">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.id, item.size, item.quantity + 1, item.maxStock)} disabled={item.maxStock && item.quantity >= item.maxStock} 
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                         </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                          <p className="font-bold text-lg text-[#1C1917]">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">₹{item.price} / unit</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1917] font-medium transition-colors pl-2">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
              
              {/* Header */}
              <h3 className="font-serif text-xl text-[#1C1917] mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-400" /> Order Summary
              </h3>

              {/* Shipping Estimator */}
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> Estimate Shipping
                </label>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter Pincode"
                      className="flex-grow bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] transition-all"
                   />
                   <button onClick={handleCheckPincode} className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg font-bold uppercase hover:bg-gray-800 transition-colors">
                     Check
                   </button>
                </div>
              </div>

              {/* Financials */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  {totalAmount > 5000 ? (
                      <span className="text-green-600 font-bold text-xs uppercase">Free</span>
                  ) : (
                      <div className="text-right">
                        <span>₹{shippingCost}</span>
                        {!isPincodeChecked && <p className="text-[9px] text-gray-400">(Est.)</p>}
                      </div>
                  )}
                </div>

                <AnimatePresence>
                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-green-600 font-bold text-sm bg-green-50 p-2 rounded-lg"
                    >
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {appliedCoupon.code}</span>
                      <span>- ₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Coupon Input */}
              {!appliedCoupon ? (
                <div className="mb-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Try WELCOME50"
                      className="flex-grow bg-[#F9F8F6] border border-transparent rounded-lg px-3 py-2.5 text-[#1C1917] outline-none focus:border-[#1C1917] focus:bg-white transition-all uppercase text-xs font-bold"
                    />
                    <button onClick={handleApplyCoupon} disabled={loading} className="bg-[#1C1917] text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors">
                      {loading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-[10px] mt-2 ml-1">{error}</p>}
                </div>
              ) : (
                <div className="mb-6 bg-green-50 border border-green-100 p-3 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="text-green-700 font-bold">Coupon Applied!</p>
                    <p className="text-green-600 text-[10px]">You saved ₹{discountVal.toLocaleString()}</p>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-green-400 hover:text-green-700 p-1"><X className="w-4 h-4" /></button>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between text-xl font-bold text-[#1C1917] mb-6">
                  <span>Total</span>
                  <motion.span
                    key={finalTotal}
                    initial={{ scale: 1.1, color: '#FF2865' }}
                    animate={{ scale: 1, color: '#1C1917' }}
                  >
                    ₹{finalTotal.toLocaleString()}
                  </motion.span>
              </div>

              {/* Checkout Button */}
              <button onClick={checkoutHandler} className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-200 text-xs sm:text-sm">
                <Lock className="w-4 h-4" /> Secure Checkout
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                      <ShieldCheck className="w-5 h-5 text-gray-400" />
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Secure Pay</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <Truck className="w-5 h-5 text-gray-400" />
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Fast Ship</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <RotateCcw className="w-5 h-5 text-gray-400" />
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Easy Return</span>
                  </div>
              </div>

            </div>
            
            {/* Payment Logos */}
            <div className="mt-4 flex justify-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" className="h-6" alt="Visa" />
               <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" className="h-6" alt="Mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="h-6 object-contain" alt="UPI" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}