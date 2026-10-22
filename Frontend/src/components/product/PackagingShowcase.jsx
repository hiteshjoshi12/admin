import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Shield, HeartHandshake, Box, Layers } from 'lucide-react';

export default function PackagingShowcase() {
  const [activeView, setActiveView] = useState('3d'); // '3d' or '2d'

  const packagingFeatures = [
    {
      icon: Gift,
      title: 'Bespoke Keepsake Box',
      description: 'Rigid paperboard adorned with custom floral watercolor artwork, gold foil lettering, and velvet-matte texture designed to be treasured on your vanity.'
    },
    {
      icon: Sparkles,
      title: 'Protective Satin Dust Bag',
      description: 'Every pair arrives cradled inside a breathable satin dust pouch with golden drawstrings, safeguarding delicate zardozi embroidery during festive travel.'
    },
    {
      icon: HeartHandshake,
      title: 'Complimentary Gift-Ready Presentation',
      description: 'Lined with imported silk tissue paper and an authenticity certificate card. Perfectly packaged for brides, anniversaries, and celebratory gifting.'
    }
  ];

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-[#EAE6DF]" id="premium-packaging">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#8B5E3C] block mb-1"
          >
            The Unboxing Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-serif text-[#1C1917]"
          >
            Signature Luxury Packaging
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs text-gray-500 mt-2 leading-relaxed"
          >
            We believe unwrapping your juttis should be as joyous as wearing them. Each pair is presented like an heirloom treasure.
          </motion.p>
        </div>

        {/* 2-Column Luxury Presentation Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 md:p-10 border border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Column: Interactive Image Stage (3D vs 2D) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* View Switcher Pills */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-full border border-gray-200 text-xs font-semibold mb-6 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveView('3d')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeView === '3d'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Studio Angle</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('2d')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeView === '2d'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'text-gray-500 hover:text-black'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Editorial Flat Lay</span>
              </button>
            </div>

            {/* Packaging Display Canvas */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center p-4 group">
              <AnimatePresence mode="wait">
                {activeView === '3d' ? (
                  <motion.img
                    key="3d-view"
                    src="https://ik.imagekit.io/hiteshh12/editorial/packaging-3d.png"
                    alt="Beads & Bloom Signature 3D Luxury Packaging Box"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-contain filter contrast-[1.02] drop-shadow-md group-hover:scale-102 transition-transform duration-500"
                  />
                ) : (
                  <motion.img
                    key="2d-view"
                    src="https://ik.imagekit.io/hiteshh12/editorial/packaging-2d.png"
                    alt="Beads & Bloom Signature 2D Packaging Artwork"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-contain filter contrast-[1.02] drop-shadow-md group-hover:scale-102 transition-transform duration-500"
                  />
                )}
              </AnimatePresence>

              {/* Quality Seal Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1C1917] border border-gray-200 shadow-2xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Complimentary With Every Order</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Features */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A059] block mb-2">
                Crafted For Treasuring
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-[#1C1917] leading-snug">
                Unwrap Heritage Elegance in Every Box
              </h3>
              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                Whether you're treating yourself or gifting a bride, every pair of Beads & Bloom Punjabi juttis arrives in our signature keepsake box, designed to protect your handcrafted footwear for years of celebrations.
              </p>
            </div>

            {/* Feature Blocks */}
            <div className="space-y-4 pt-2">
              {packagingFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] hover:border-[#D5CFC4] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[#8B5E3C] shrink-0 shadow-2xs">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1917] mb-0.5">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
