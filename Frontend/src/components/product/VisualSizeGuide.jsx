import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Check, Info, ArrowRight, Sparkles } from 'lucide-react';
import { SIZE_DATA } from './SizeGuideModal';

export default function VisualSizeGuide({ selectedSize, onSelectSize }) {
  const [unit, setUnit] = useState('cm'); // 'cm' or 'inches'

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-[#EAE6DF]" id="visual-size-guide">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#8B5E3C] block mb-1">
            Fit Guarantee & Assurance
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917]">
            Find Your Perfect Artisan Fit
          </h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Every pair is handcrafted true to EU/Indian standard sizes. Follow our simple foot measurement guide below to order with complete confidence.
          </p>
        </motion.div>

        {/* 2-Column Grid: Left Visual Measurement Image & Steps, Right Clear Size Chart */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          {/* Left: Step-by-Step with Editorial Guide Sketch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#EAE6DF] shadow-xs group aspect-[4/3] bg-[#FAF8F5]">
              <img
                src="https://ik.imagekit.io/hiteshh12/editorial/sketch-measurement.png"
                alt="Fine art fashion sketch of foot measurement for Punjabi Jutti sizing"
                className="w-full h-full object-contain filter contrast-[1.02] group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1C1917] border border-gray-200">
                ✏️ Artisan Measurement Sketch
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-900 block font-semibold">Step on Paper:</strong> Place a blank sheet of paper on a hard floor against a straight wall and step on it firmly.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-900 block font-semibold">Mark Heel to Toe:</strong> Mark the furthest point of your longest toe and the back of your heel with a pencil.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-900 block font-semibold">Match Length:</strong> Measure the distance between points in cm and find your corresponding EU size in the table.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Table & Fit Tip */}
          <div className="lg:col-span-7 lg:pl-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#1C1917] flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#8B5E3C]" /> Size Conversion Table
              </h3>

              {/* Unit Toggle */}
              <div className="flex items-center bg-[#FAF8F5] p-1 rounded-full border border-gray-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-full transition-all ${unit === 'cm' ? 'bg-[#1C1917] text-white font-bold' : 'text-gray-500 hover:text-black'
                    }`}
                >
                  Centimeters
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 rounded-full transition-all ${unit === 'inches' ? 'bg-[#1C1917] text-white font-bold' : 'text-gray-500 hover:text-black'
                    }`}
                >
                  Inches
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <th className="py-3 px-4 font-bold text-[#1C1917]">EU (Standard)</th>
                    <th className="py-3 px-4 font-bold">UK / India</th>
                    <th className="py-3 px-4 font-bold">US</th>
                    <th className="py-3 px-4 font-bold">Foot Length ({unit})</th>
                    <th className="py-3 px-4 font-bold text-right">Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SIZE_DATA.map((row) => {
                    const isSelected = selectedSize === row.eu;
                    return (
                      <tr
                        key={row.eu}
                        onClick={() => onSelectSize && onSelectSize(row.eu)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-50/70 font-bold' : 'hover:bg-[#FAF8F5]'
                          }`}
                      >
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 font-bold text-[#1C1917]">
                            EU {row.eu}
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2865]" />
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">UK {row.uk}</td>
                        <td className="py-3 px-4 text-gray-600">US {row.us}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {unit === 'cm' ? `${row.cm} cm` : `${row.inches}"`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${isSelected
                              ? 'bg-[#1C1917] text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-[#1C1917] hover:text-white'
                              }`}
                          >
                            {isSelected ? '✓ Selected' : 'Choose'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Fit Tip Callout */}
            <div className="mt-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-950 leading-relaxed">
                <strong className="block font-bold uppercase tracking-wider text-emerald-900 mb-0.5">
                  Artisan Sizing & Fit Advice:
                </strong>
                Our juttis fit true to size. Genuine leather gently softens and expands by approximately 1-2 mm after the first wear to mold around your foot. If you have broad feet or fall between sizes, select one size up for immediate plush comfort.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section >
  );
}
