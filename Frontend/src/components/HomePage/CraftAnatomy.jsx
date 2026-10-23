import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getOptimizedImage } from '../../util/imageUtils';

const CRAFT_PILLARS = [
  {
    step: "01",
    title: "100% Pure Leather Soles",
    subtitle: "Natural & Breathable",
    description: "Every sole is cut from genuine vegetable-tanned buffalo leather. Unlike synthetic or rubber bases, pure leather breathes, flexes naturally with every step, and molds to your foot.",
    image: "https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1867_zDyUavPbR.jpeg",
    alt: "Genuine leather sole craftsmanship of Beads and Bloom Punjabi juttis"
  },
  {
    step: "02",
    title: "Dual Memory Cushioning",
    subtitle: "Bite-Free Guarantee",
    description: "Traditional juttis are notorious for shoe bites. We embed a proprietary dual-layer memory foam bed inside each pair, ensuring cloud-like comfort for 12+ hours during long wedding events.",
    image: "https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1822_cMxk4rPfx.jpeg",
    alt: "Double cushioned comfort inner lining of ethnic juttis"
  },
  {
    step: "03",
    title: "Heirloom Zardozi & Dabka",
    subtitle: "Hand-Embroidered Mastery",
    description: "No machines, no shortcuts. Generational karigars hand-stitch every metallic copper wire, French knot, glass pearl, and shimmering sequin over fine silks and royal velvets.",
    image: "https://ik.imagekit.io/beandandbloom/Media/IMG_9775_mebgcp.jpg",
    alt: "Artisan hand embroidery with authentic Zardozi and Dabka work"
  },
  {
    step: "04",
    title: "Symmetric Royal Last",
    subtitle: "Molds to Your Silhouette",
    description: "Crafted on authentic symmetric wooden lasts with no rigid left or right. Within a few hours of wear, the supple leather takes the custom silhouette of your unique feet.",
    image: "https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1947_xqkL-n36I.JPG",
    alt: "Handcrafted symmetrical Punjabi jutti last and tailoring"
  }
];

export default function CraftAnatomy() {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-[#ECE7E1]" aria-label="Craftsmanship and Anatomy">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block mb-3">
              Artisanal Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1C1917] leading-[1.15]">
              The Anatomy of a Handcrafted Jutti
            </h2>
          </div>
          <p className="text-sm text-gray-500 font-light max-w-md leading-relaxed">
            Four defining hallmarks that elevate Beads & Bloom from everyday ethnic footwear into collectible heirloom couture.
          </p>
        </div>

        {/* 4 Photo Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CRAFT_PILLARS.map((pillar) => (
            <div 
              key={pillar.step}
              className="group flex flex-col bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#EAE3D2] transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ECE7E1]">
                <img
                  src={getOptimizedImage(pillar.image, 600)}
                  alt={pillar.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-xs">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#1C1917]">
                    PILLAR {pillar.step}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B5E3C] block mb-1.5">
                    {pillar.subtitle}
                  </span>
                  <h3 className="font-serif text-xl text-[#1C1917] mb-3 group-hover:text-[#8B5E3C] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Editorial Callout */}
        <div className="mt-16 p-8 md:p-10 rounded-3xl bg-[#FAF8F5] border border-[#EAE3D2] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="font-serif text-xl md:text-2xl text-[#1C1917] mb-1">
              Curious about sizes and custom wedding trousseaus?
            </h4>
            <p className="text-xs md:text-sm text-gray-500 font-light">
              Explore our complete size guide or consult our bridal stylists for bespoke bridal pairings.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/size-chart"
              className="text-xs font-bold uppercase tracking-widest text-[#1C1917] border-b border-[#1C1917] pb-1 hover:text-[#C5A059] transition-colors"
            >
              View Size Chart
            </Link>
            <Link
              to="/bridal-guide"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#1C1917] text-white px-6 py-3 rounded-full hover:bg-[#8B5E3C] transition-colors shadow-xs"
            >
              Bridal Guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
