import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Check, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

export const SIZE_DATA = [
  { eu: '36', uk: '3', us: '5', cm: '22.5', inches: '8.85' },
  { eu: '37', uk: '4', us: '6', cm: '23.2', inches: '9.13' },
  { eu: '38', uk: '5', us: '7', cm: '24.0', inches: '9.45' },
  { eu: '39', uk: '6', us: '8', cm: '24.7', inches: '9.72' },
  { eu: '40', uk: '7', us: '9', cm: '25.4', inches: '10.00' },
  { eu: '41', uk: '8', us: '10', cm: '26.0', inches: '10.24' },
];

export default function SizeGuideModal({ isOpen, onClose, selectedSize, onSelectSize, availableSizes = [] }) {
  const [unit, setUnit] = useState('cm'); // 'cm' or 'inches'

  if (!isOpen) return null;

  const handleSizeClick = (size) => {
    if (onSelectSize) {
      onSelectSize(size);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F9F8F6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#FF2865] border border-gray-100">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">Jutti Sizing & Fit Guide</h3>
                <p className="text-xs text-gray-500">Brand-confirmed measurements for bite-free comfort</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Unit Switcher & Active Size Tip */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Measure in:</span>
                <div className="bg-gray-100 p-0.5 rounded-lg flex text-xs font-bold">
                  <button 
                    onClick={() => setUnit('cm')} 
                    className={`px-3 py-1 rounded-md transition-colors ${unit === 'cm' ? 'bg-white shadow text-[#1C1917]' : 'text-gray-500'}`}
                  >
                    Centimeters (cm)
                  </button>
                  <button 
                    onClick={() => setUnit('inches')} 
                    className={`px-3 py-1 rounded-md transition-colors ${unit === 'inches' ? 'bg-white shadow text-[#1C1917]' : 'text-gray-500'}`}
                  >
                    Inches (in)
                  </button>
                </div>
              </div>

              {selectedSize && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Current Selection: EU {selectedSize}
                </span>
              )}
            </div>

            {/* Confirmed Size Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1C1917] text-white">
                    <th className="p-3.5 font-bold uppercase tracking-wider">Select</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">EU Size</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">UK / India</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">US Size</th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">
                      Foot Length ({unit})
                    </th>
                    <th className="p-3.5 font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SIZE_DATA.map((row) => {
                    const isSelected = String(selectedSize) === String(row.eu);
                    const stockItem = availableSizes.find(s => String(s.size) === String(row.eu));
                    const isOutOfStock = stockItem && stockItem.quantity === 0;

                    return (
                      <tr 
                        key={row.eu} 
                        onClick={() => !isOutOfStock && handleSizeClick(row.eu)}
                        className={`transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-[#FF2865]/10 font-bold text-[#1C1917]' 
                            : isOutOfStock 
                              ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                              : 'hover:bg-amber-50/50 text-gray-700'
                        }`}
                      >
                        <td className="p-3.5">
                          <button
                            type="button"
                            disabled={isOutOfStock}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                              isSelected 
                                ? 'bg-[#FF2865] border-[#FF2865] text-white' 
                                : isOutOfStock 
                                  ? 'border-gray-200 text-transparent' 
                                  : 'border-gray-300 hover:border-[#1C1917]'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </td>
                        <td className="p-3.5 font-bold font-mono text-sm">{row.eu}</td>
                        <td className="p-3.5">{row.uk}</td>
                        <td className="p-3.5">{row.us}</td>
                        <td className="p-3.5 font-semibold">
                          {unit === 'cm' ? `${row.cm} cm` : `${row.inches}"`}
                        </td>
                        <td className="p-3.5">
                          {isOutOfStock ? (
                            <span className="text-[10px] text-gray-400 font-semibold">Sold Out</span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 3-Step Illustrated Measuring Guide */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-100">
              <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" /> How to Measure Your Foot Length in 3 Simple Steps
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center mb-1.5">1</span>
                  <strong className="block text-gray-900 mb-0.5">Heel Against Wall</strong>
                  Place a piece of blank paper flat against a straight wall on a hard floor.
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center mb-1.5">2</span>
                  <strong className="block text-gray-900 mb-0.5">Mark Longest Toe</strong>
                  Stand upright and mark the tip of your longest toe on the paper with a pen.
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100">
                  <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center mb-1.5">3</span>
                  <strong className="block text-gray-900 mb-0.5">Compare & Pick</strong>
                  Measure the distance in centimeters and pick the matching EU size above.
                </div>
              </div>
            </div>

            {/* Important Fit Advice */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" /> Beads & Bloom Fit Guarantee:
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-gray-700">
                <li><strong>Broad or High Arch Feet:</strong> We strongly advise choosing <strong>one size larger</strong> for comfort.</li>
                <li><strong>Genuine Leather Footbed:</strong> Authentic handcrafted juttis will gently stretch and mold to your exact foot shape after 1–2 wears.</li>
                <li><strong>Easy 48-Hour Exchange:</strong> In case the fit isn't 100% perfect, request a free size exchange within 48 hours of delivery!</li>
              </ul>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {selectedSize ? `Selected: EU ${selectedSize}` : 'Click any size row to select'}
            </span>
            <button
              onClick={onClose}
              className="bg-[#1C1917] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#FF2865] transition-colors"
            >
              Confirm & Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
