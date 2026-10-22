import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Feather, ShieldCheck } from 'lucide-react';

export default function ArtisanalTriad({ product }) {
  if (!product) return null;

  const upperMaterial = product.material || 'Pure Silk / Velvet Dupion';
  const embellishmentText = product.embellishment || 'Floral Zardozi, Beads & Pearls';
  const comfortText = product.comfortNotes && product.comfortNotes.trim().length > 0
    ? product.comfortNotes
    : 'Double-padded memory foam embedded throughout the footbed for all-day comfort';
  const soleText = product.sole || '100% Genuine Leather Sole & Lining';

  const cards = [
    {
      num: '01',
      icon: Sparkles,
      image: 'https://ik.imagekit.io/hiteshh12/editorial/anatomy-zardozi.jpg',
      imageAlt: 'Handcrafted Zardozi, Beads and Pearl Embroidery',
      title: 'Handcrafted Zardozi & Embellishments',
      subtitle: 'Artisanal Embroidery',
      description: `Intricately hand-embroidered with metallic zardozi, beads, and delicate cutdana by master karigars. ${embellishmentText}.`,
      pill: upperMaterial,
      pillLabel: 'Upper'
    },
    {
      num: '02',
      icon: Feather,
      image: 'https://ik.imagekit.io/hiteshh12/editorial/anatomy-cushion.jpg',
      imageAlt: 'Double-Padded Memory Foam Footbed Cushioning',
      title: 'Double-Padded Cloud Cushioning',
      subtitle: 'All-Day Bite-Free Comfort',
      description: `${comfortText}. Engineered with double-density cushioning from heel to toe so you can dance through sangeet and weddings effortlessly.`,
      pill: 'Dual-Layer Memory Foam',
      pillLabel: 'Comfort Tech'
    },
    {
      num: '03',
      icon: ShieldCheck,
      image: 'https://ik.imagekit.io/hiteshh12/editorial/anatomy-sole.jpg',
      imageAlt: '100% Genuine Vegetable-Tanned Leather Sole & Lining',
      title: '100% Genuine Leather Lining & Sole',
      subtitle: 'Organic Foot Contouring',
      description: `Authentic vegetable-tanned leather sole and lining that breathe naturally, absorb moisture, and mold organically to the unique contours of your foot.`,
      pill: soleText,
      pillLabel: 'Footbed & Sole'
    }
  ];

  return (
    <section className="py-12 border-t border-[#EAE6DF]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#8B5E3C] block mb-1">
            Artisanal Heritage & Craftsmanship
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917]">
            The Anatomy of a Beads & Bloom Jutti
          </h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Every pair is handcrafted over 24+ artisan hours, blending regal heritage embroidery with contemporary cloud-cushioned comfort.
          </p>
        </div>

        {/* 3 Numbered Triad Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-[#EAE6DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#D5CFC4] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top row with numeral and icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-serif font-bold text-[#C5A059] tracking-wider">
                      {card.num}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#8B5E3C] group-hover:bg-[#1C1917] group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Craft Photography */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-[#FAF8F5] border border-[#EAE6DF]">
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#1C1917] mb-3 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Sub-spec Pill */}
                <div className="mt-6 pt-4 border-t border-[#F2EFE9] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                    {card.pillLabel}
                  </span>
                  <span className="font-bold text-[#1C1917] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE6DF]">
                    {card.pill}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
