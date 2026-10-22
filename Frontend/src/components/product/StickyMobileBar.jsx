import React from 'react';
import { ShoppingBag, ChevronUp } from 'lucide-react';
import { getOptimizedImage } from '../../util/imageUtils';

export default function StickyMobileBar({
  isVisible,
  product,
  selectedSize,
  onOpenSizeGuide,
  onAddToCart,
  onScrollToSizes
}) {
  if (!isVisible || !product) return null;

  const displayImage = product.images?.[0] || product.image || '';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-slide-up">
      <div className="flex items-center gap-3">
        {/* Thumbnail & Title/Price */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            <img 
              src={getOptimizedImage(displayImage, 100)} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-[#FF2865]">₹{product.price.toLocaleString()}</span>
              {selectedSize ? (
                <span className="text-[10px] font-bold bg-[#1C1917] text-white px-2 py-0.5 rounded-full">
                  EU {selectedSize}
                </span>
              ) : (
                <button 
                  type="button"
                  onClick={onScrollToSizes}
                  className="text-[10px] text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5"
                >
                  Pick Size <ChevronUp className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={onAddToCart}
          className="bg-[#1C1917] hover:bg-[#FF2865] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
}
