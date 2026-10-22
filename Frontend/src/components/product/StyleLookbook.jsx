import React from 'react';
import { motion } from 'framer-motion';

export default function StyleLookbook({ productName }) {
  const stylingItems = [
    {
      id: 'lehenga',
      title: 'Lehenga',
      image: 'https://ik.imagekit.io/hiteshh12/editorial/sketch-lehenga.jpg',
      description: 'Pairs effortlessly with almost any lehenga colourway, from soft pastel pinks to regal bridal silhouettes.'
    },
    {
      id: 'anarkali',
      title: 'Anarkali',
      image: 'https://ik.imagekit.io/hiteshh12/editorial/sketch-anarkali.jpg',
      description: 'Suits graceful evening anarkalis in jewel and pastel tones for effortless statement festive dressing.'
    },
    {
      id: 'indowestern',
      title: 'Indo-Western dresses',
      image: 'https://ik.imagekit.io/hiteshh12/editorial/sketch-indowestern.jpg',
      description: 'Works as easily with an evening dress and draped modern silhouettes as with traditional wear.'
    }
  ];

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-[#EAE6DF]" id="how-to-style">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Editorial Section Header matching Coral Haze inspiration */}
        <div className="mb-12">
          <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#8B5E3C] block mb-2">
            Styling
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917]">
            Pairs beautifully with
          </h2>
        </div>

        {/* 3 Fashion Line Art Sketches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stylingItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group flex flex-col items-center"
            >
              {/* Line Art Fashion Illustration Container */}
              <div className="w-full aspect-[3/4] md:aspect-[4/5] flex items-center justify-center overflow-hidden rounded-2xl bg-[#FAF8F5] p-2 transition-all duration-500 group-hover:-translate-y-1">
                <img
                  src={item.image}
                  alt={`${item.title} styling pairing`}
                  className="w-full h-full object-contain mix-blend-multiply filter contrast-[1.05] group-hover:scale-102 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Title & Pairing Description */}
              <div className="text-center mt-4 px-2">
                <h3 className="font-bold text-sm md:text-base text-[#1C1917] mb-1.5 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto font-sans">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
