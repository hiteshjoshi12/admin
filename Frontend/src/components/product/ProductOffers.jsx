import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Sparkles, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../util/config';

export default function ProductOffers({ productId, isNewArrival = false, category = '' }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (isNewArrival) queryParams.append('isNewArrival', 'true');
        if (category) queryParams.append('category', Array.isArray(category) ? category[0] : category);

        const res = await fetch(`${API_BASE_URL}/api/coupons/active?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          // Filter coupons marked for product page display
          const eligible = data.filter(c => c.showOnProductPage !== false);
          setCoupons(eligible);
        }
      } catch (err) {
        console.error("Failed to load offers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [isNewArrival, category]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied! Apply at checkout.`, { icon: '🏷️' });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (loading || coupons.length === 0) {
    return (
      <div className="bg-[#FAF8F5] border border-amber-200/60 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-amber-900">
          <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span><strong>Handcrafted Luxury:</strong> Complimentary gift packaging on all prepaid orders.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B5E3C] flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#FF2865]" /> Available Offers & Savings
        </span>
        <span className="text-[10px] text-gray-400 font-semibold">
          {coupons.length} {coupons.length === 1 ? 'Offer' : 'Offers'} Available
        </span>
      </div>

      <div className="space-y-2">
        {coupons.map((coupon, idx) => {
          const isCopied = copiedCode === coupon.code;
          const isExpanded = expandedIndex === idx;

          return (
            <div 
              key={coupon._id || idx}
              className="bg-gradient-to-r from-amber-50/40 via-white to-pink-50/30 border border-amber-200/80 rounded-2xl p-3.5 shadow-2xs hover:border-[#FF2865]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Left: Code pill and discount */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-[#1C1917] text-white px-2.5 py-0.5 rounded-md tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-[#FF2865]">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountAmount}% OFF` 
                        : `SAVE ₹${coupon.discountAmount}`}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-gray-800 line-clamp-1">
                    {coupon.bannerText || coupon.description}
                  </p>

                  {coupon.minOrderAmount > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      On orders above ₹{coupon.minOrderAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Right: Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                    isCopied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-800 hover:border-[#FF2865] hover:text-[#FF2865]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> COPY
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Terms */}
              {coupon.terms && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                  <button 
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 font-semibold"
                  >
                    <span>Terms & Conditions</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <p className="mt-1 text-gray-600 bg-white/70 p-2 rounded-lg border border-gray-100 leading-relaxed">
                      {coupon.terms}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
