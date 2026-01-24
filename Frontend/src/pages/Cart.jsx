import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';

export default function Cart() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  // 1. SELECT DATA FROM REDUX STORE
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  // --- HANDLERS ---
  const handleUpdateQty = (id, newQty) => {
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

 // 1. Update the handler to accept size
  const handleRemove = (id, size) => {
    dispatch(removeFromCart({ id, size })); // <--- Pass object {id, size}
  };

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === 'welcome10') {
      setDiscount(0.10); // 10%
      alert("Coupon Applied: 10% Off!");
    } else {
      alert("Invalid Coupon Code");
      setDiscount(0);
    }
  };

  // --- CALCULATIONS ---
  const discountAmount = Math.round(totalAmount * discount);
  const shipping = totalAmount > 2000 ? 0 : 150; 
  const finalTotal = totalAmount - discountAmount + shipping;

  // --- EMPTY STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif text-[#1C1917] mb-2">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't found your perfect pair yet.</p>
        <Link 
          to="/shop" 
          className="bg-[#1C1917] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-24">
      
      {/* Header */}
      <div className="px-6 mb-12 text-center md:text-left md:px-12 max-w-[1440px] mx-auto">
        <h1 className="text-4xl font-serif text-[#1C1917] mb-2">Shopping Bag</h1>
        <p className="text-gray-500 text-sm">
          <span className="font-bold text-[#FF2865]">{cartItems.length} items</span> in your bag
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* --- LEFT: CART ITEMS LIST --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} // This ID is unique (Product ID + Size)
                className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex gap-6 items-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg md:text-xl text-[#1C1917]">{item.name}</h3>
                    {/* 2. Update the button to pass item.size */}
                    <button 
                      onClick={() => handleRemove(item.id, item.size)} // <--- CRITICAL FIX HERE
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">Size: {item.size}</p>
                  
                  <div className="flex justify-between items-end">
                    {/* Quantity Control */}
                    <div className="flex items-center gap-4 bg-[#F9F8F6] rounded-lg p-2">
                      <button 
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-[#FF2865] disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-[#FF2865]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price Calculation */}
                    <p className="font-bold text-lg text-[#1C1917]">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF2865] mt-4 font-medium">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* --- RIGHT: ORDER SUMMARY (Sticky) --- */}
          <div className="w-full lg:w-1/3 sticky top-32">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="font-serif text-2xl text-[#1C1917] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-bold text-xs uppercase tracking-widest">Free</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#FF2865]">
                    <span>Discount (10%)</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="h-[1px] bg-gray-100 my-4"></div>
                
                <div className="flex justify-between text-xl font-bold text-[#1C1917]">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right mt-1">Including all taxes</p>
              </div>

              {/* Coupon Input */}
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Try WELCOME10" 
                    className="flex-grow bg-[#F9F8F6] border-0 rounded-xl px-4 py-3 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 outline-none uppercase placeholder:normal-case"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="bg-[#1C1917] text-white px-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link 
                to="/checkout"
                className="w-full bg-[#FF2865] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#1C1917] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
                 <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" className="h-6" alt="Visa" />
                 <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" className="h-6" alt="Mastercard" />
                 <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" className="h-6" alt="PayPal" />
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}