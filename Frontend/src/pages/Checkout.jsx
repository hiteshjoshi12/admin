import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, CreditCard, Smartphone, Truck, ArrowLeft, 
  ArrowRight, ShieldCheck, ShoppingBag, MapPin 
} from 'lucide-react';

export default function Checkout() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Cart Data (In real app, get this from Context)
  const cartTotal = 4548; // Example total
  const shippingCost = 0; // Free shipping

  // --- HANDLERS ---
  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate Payment Gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      window.scrollTo(0, 0);
    }, 2000);
  };

  // --- STEP 3: SUCCESS SCREEN ---
  if (step === 3) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 animate-fade-up">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <span className="text-[#FF2865] text-xs font-bold uppercase tracking-[0.2em] mb-2">Order Confirmed</span>
        <h1 className="text-4xl font-serif text-[#1C1917] mb-4">Thank You, Priya!</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Your order <strong>#BB-2901</strong> has been placed successfully. We have sent a confirmation email to <strong>priya@example.com</strong>.
        </p>
        
        <div className="bg-[#F9F8F6] p-6 rounded-2xl w-full max-w-md mb-8 text-left border border-gray-100">
           <div className="flex justify-between mb-2">
             <span className="text-gray-500 text-sm">Estimated Delivery</span>
             <span className="font-bold text-[#1C1917]">Jan 30 - Feb 02</span>
           </div>
           <div className="flex justify-between">
             <span className="text-gray-500 text-sm">Payment Method</span>
             <span className="font-bold text-[#1C1917] uppercase">{paymentMethod}</span>
           </div>
        </div>

        <Link 
          to="/shop" 
          className="bg-[#1C1917] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all shadow-lg"
        >
          Continue Shopping
        </Link>
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
              <form onSubmit={handleNextStep} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#FF2865]/10 flex items-center justify-center text-[#FF2865]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-serif text-[#1C1917]">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">First Name</label>
                    <input type="text" required className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                    <input type="text" required className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address</label>
                  <input type="text" required className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" placeholder="Street, Apartment, Suite" />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                    <input type="text" required className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pincode</label>
                    <input type="text" required className="w-full bg-[#F9F8F6] border-0 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
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

            {/* STEP 2: PAYMENT OPTIONS */}
            {step === 2 && (
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-up">
                 <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#FF2865]/10 flex items-center justify-center text-[#FF2865]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-serif text-[#1C1917]">Payment Method</h2>
                </div>

                <div className="space-y-4 mb-8">
                  {/* UPI Option */}
                  <div 
                    onClick={() => setPaymentMethod('upi')}
                    className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#FF2865] bg-[#FF2865]/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#FF2865]' : 'border-gray-300'}`}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF2865]"></div>}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-[#1C1917]">UPI (GPay / PhonePe)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Pay securely via your preferred UPI app.</p>
                    </div>
                  </div>

                  {/* Card Option */}
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#FF2865] bg-[#FF2865]/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#FF2865]' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF2865]"></div>}
                    </div>
                    <div>
                       <span className="font-bold text-[#1C1917]">Credit / Debit Card</span>
                       <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, RuPay supported.</p>
                    </div>
                  </div>

                  {/* COD Option */}
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#FF2865] bg-[#FF2865]/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#FF2865]' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF2865]"></div>}
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
                    disabled={isProcessing}
                    className="bg-[#FF2865] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#1C1917] transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="w-full lg:w-1/3 sticky top-32">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="font-serif text-xl text-[#1C1917] mb-6">Order Summary</h3>
              
              {/* Product List Mockup */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1605218427368-35b866c24195?q=80&w=200" className="w-full h-full object-cover" alt="Item" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1917]">The Royal Jutti</p>
                    <p className="text-xs text-gray-500">Qty: 1 | Size: 38</p>
                  </div>
                  <div className="ml-auto text-sm font-bold">₹2,499</div>
                </div>
                 <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200" className="w-full h-full object-cover" alt="Item" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1917]">Velvet Mule</p>
                    <p className="text-xs text-gray-500">Qty: 1 | Size: 39</p>
                  </div>
                  <div className="ml-auto text-sm font-bold">₹1,899</div>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹4,398</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>₹150</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>

              <div className="flex justify-between text-xl font-bold text-[#1C1917] mb-6">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 text-gray-500 text-xs">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 <span>Secure Checkout with SSL Encryption</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}