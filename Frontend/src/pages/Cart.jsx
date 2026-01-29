import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast'; 

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, applyDiscount, removeDiscount } from '../redux/cartSlice';
import { API_BASE_URL } from '../util/config';
import { getOptimizedImage } from '../util/imageUtils';

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

  // --- 1. NEW: RE-VALIDATE COUPON ON LOAD/LOGIN ---
  useEffect(() => {
    if (appliedCoupon) {
      const validateCoupon = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/coupons/verify`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Include token if user is logged in (for user-specific coupons)
                ...(userInfo && { Authorization: `Bearer ${userInfo.token}` }) 
            },
            body: JSON.stringify({ code: appliedCoupon.code, cartTotal: totalAmount }),
          });

          const data = await res.json();

          if (!res.ok) {
            // Coupon is no longer valid (Expired or User changed)
            dispatch(removeDiscount());
            toast.error(`Coupon ${appliedCoupon.code} has expired or is invalid.`);
          } else {
            // Optional: Update discount amount if logic depends on cart total
            if (data.discountAmount !== appliedCoupon.discountAmount) {
                 dispatch(applyDiscount({
                    code: data.code,
                    discountAmount: data.discountAmount,
                }));
            }
          }
        } catch (err) {
          // If server error or network issue, maybe remove to be safe?
          // Or just leave it. Usually safer to remove if validation fails.
          console.error("Coupon validation failed", err);
        }
      };

      validateCoupon();
    }
  }, [appliedCoupon?.code, totalAmount, userInfo, dispatch]);





  // --- CHECKOUT HANDLER (The Fork in the Road) ---
  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout'); // User is logged in -> Go to Checkout
    } else {
      navigate('/login?redirect=checkout'); // Guest -> Go to Login (which has Guest option)
    }
  };

  // --- UPDATED QUANTITY HANDLER ---
  const handleUpdateQty = (id, size, newQty, maxStock) => {
    if (newQty < 1) return;
    const limit = maxStock || 10; 

    if (newQty > limit) {
      toast.error(`Sorry, only ${limit} items available in stock!`);
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
        dispatch(
          applyDiscount({
            code: data.code,
            discountAmount: data.discountAmount,
          })
        );
        setCouponCode('');
        toast.success("Coupon Applied!");

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF2865', '#1C1917', '#ffffff'],
        });
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error("Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeDiscount());
    toast("Coupon removed");
  };

  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shipping = totalAmount > 5000 ? 0 : 150;
  const finalTotal = totalAmount - discountVal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24 animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mb-2">
          Your Bag is Empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm text-sm sm:text-base">
          Looks like you haven't found your perfect pair yet.
        </p>
        <Link
          to="/shop"
          className="bg-[#1C1917] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20 sm:pt-24 pb-20 sm:pb-24">
      {/* Header */}
      <div className="px-4 sm:px-6 mb-8 sm:mb-12 text-center md:text-left md:px-12 max-w-[1440px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1917] mb-2">
          Shopping Bag
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          <span className="font-bold text-[#FF2865]">
            {cartItems.length} items
          </span>{' '}
          in your bag
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* LEFT: CART ITEMS LIST */}
          <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                  className="bg-white p-3 sm:p-4 md:p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden mx-auto sm:mx-0 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <Link to={`/product/${item.id}`} className="font-serif text-base sm:text-lg md:text-xl text-[#1C1917] hover:text-[#FF2865] transition-colors">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase">Size: {item.size}</span>
                      {item.maxStock && item.quantity >= item.maxStock && (
                         <span className="text-[10px] text-orange-500 font-bold">Max Stock Reached</span>
                      )}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0">
                      
                      {/* Quantity Control */}
                      <div className="flex items-center gap-3 bg-[#F9F8F6] rounded-lg p-2 border border-gray-100">
                        <button
                          onClick={() =>
                            handleUpdateQty(item.id, item.size, item.quantity - 1, item.maxStock)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-[#FF2865] disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        <span className="font-bold text-sm w-6 text-center text-[#1C1917]">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() =>
                            handleUpdateQty(item.id, item.size, item.quantity + 1, item.maxStock)
                          }
                          disabled={item.maxStock && item.quantity >= item.maxStock}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-[#FF2865] disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                          <p className="font-bold text-base sm:text-lg text-[#1C1917]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-400">₹{item.price} / pair</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#1C1917] mt-2 sm:mt-4 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] mb-4 sm:mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                      Free
                    </span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>

                <AnimatePresence>
                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-[#FF2865] font-bold bg-pink-50 p-2 rounded-lg text-xs sm:text-sm"
                    >
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-wider">
                        <Tag className="w-3 h-3" /> {appliedCoupon.code} Applied
                      </span>
                      <span>- ₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-[1px] bg-gray-100 my-3 sm:my-4" />

                <div className="flex justify-between text-lg sm:text-xl font-bold text-[#1C1917]">
                  <span>Total</span>
                  <motion.span
                    key={finalTotal}
                    initial={{ scale: 1.2, color: '#FF2865' }}
                    animate={{ scale: 1, color: '#1C1917' }}
                    transition={{ duration: 0.3 }}
                  >
                    ₹{finalTotal.toLocaleString()}
                  </motion.span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 text-right mt-1">
                  Including all taxes
                </p>
              </div>

              {/* Coupon Input */}
              {!appliedCoupon ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 sm:mb-8">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                    Coupon Code
                  </label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Try WELCOME50"
                      className="flex-grow bg-[#F9F8F6] border-0 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 outline-none uppercase placeholder:normal-case text-xs sm:text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading}
                      className="bg-[#1C1917] text-white px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-70"
                    >
                      {loading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-[10px] sm:text-xs mt-2 ml-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 sm:mb-8 bg-green-50 border border-green-100 p-3 sm:p-4 rounded-xl flex justify-between items-center text-xs sm:text-sm"
                >
                  <div>
                    <p className="text-green-700 font-bold text-xs sm:text-sm">
                      Coupon Applied!
                    </p>
                    <p className="text-green-600 text-[10px] sm:text-xs mt-1">
                      You saved ₹{discountVal.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-400 hover:text-green-700"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </motion.div>
              )}

              {/* Checkout Button - UPDATED FOR GUEST CHECKOUT */}
              <button
                onClick={checkoutHandler}
                className="w-full bg-[#FF2865] text-white py-4 sm:py-5 rounded-xl font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-[#1C1917] transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xs sm:text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Trust Badges */}
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 opacity-60 grayscale">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
                  className="h-5 sm:h-6"
                  alt="Visa"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                  className="h-5 sm:h-6"
                  alt="Mastercard"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/196/196565.png"
                  className="h-5 sm:h-6"
                  alt="PayPal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}