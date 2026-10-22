import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOptimizedImage } from '../../util/imageUtils';

export default function AddedToCartDrawer({ isOpen, onClose, addedItem }) {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const freeShippingThreshold = 5000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);
  const progressPercent = Math.min(100, Math.round((totalAmount / freeShippingThreshold) * 100));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#F9F8F6]">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-[#1C1917]">Added to Bag!</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="p-4 bg-amber-50/60 border-b border-amber-100">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#8B5E3C]" />
                  {amountToFreeShipping === 0 ? (
                    <span>🎉 You've Unlocked Free Pan-India Delivery!</span>
                  ) : (
                    <span>Add ₹{amountToFreeShipping.toLocaleString()} more for Free Delivery!</span>
                  )}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-amber-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1C1917] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Added Item Preview */}
            <div className="p-6 flex-1 overflow-y-auto">
              {addedItem && (
                <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 mb-6">
                  <img 
                    src={getOptimizedImage(addedItem.image, 160)} 
                    alt={addedItem.name} 
                    className="w-20 h-24 object-cover rounded-xl border border-gray-200 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#1C1917] truncate">{addedItem.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Size: <strong className="text-gray-900">EU {addedItem.size}</strong></p>
                    <p className="text-xs text-gray-500">Qty: {addedItem.quantity}</p>
                    <p className="text-sm font-bold text-[#FF2865] mt-2">₹{(addedItem.price * addedItem.quantity).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Bag Summary */}
              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Bag Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-gray-900">
                    {totalAmount >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-100 bg-[#F9F8F6] space-y-3">
              <button
                onClick={() => { onClose(); navigate('/checkout'); }}
                className="w-full py-4 bg-[#1C1917] hover:bg-[#FF2865] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { onClose(); navigate('/cart'); }}
                className="w-full py-3.5 bg-white border border-[#1C1917] text-[#1C1917] hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Shopping Bag</span>
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-900 py-1 font-medium transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
