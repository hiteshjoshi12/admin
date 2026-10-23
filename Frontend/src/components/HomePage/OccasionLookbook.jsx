import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getOptimizedImage } from '../../util/imageUtils';

const OCCASIONS = [
  {
    title: "The Royal Bridal Suite",
    eyebrow: "Couture Wedding Mojaris",
    description: "Deep velvets, heirloom Dabka, and hand-strung pearls designed to complement royal wedding lehengas and bridal trousseaus.",
    image: "https://ik.imagekit.io/hiteshh12/Products/Ruby%20Heritage_12.jpg",
    link: "/collection/bridal",
    cta: "Explore Bridal Edit"
  },
  {
    title: "Sangeet & Mirrorwork Glow",
    eyebrow: "Celebration Essentials",
    description: "Intricate sheesh-work, champagne zardozi, and dual memory foam soles made to keep you dancing comfortably all night long.",
    image: "https://ik.imagekit.io/hiteshh12/Products/Noor-e-Aaina_10.jpg?updatedAt=1769400493945",
    link: "/collection/festive",
    cta: "Explore Festive Edit"
  },
  {
    title: "Daytime Pastels & Casual Chic",
    eyebrow: "Everyday Sophistication",
    description: "Breezy pastel silks, subtle threadwork florals, and pure leather flexibility for daytime brunches, work, and mehendi gatherings.",
    image: "https://ik.imagekit.io/hiteshh12/Products/Blush%20Mirage_05.jpg",
    link: "/collection/casual",
    cta: "Explore Casual Chic"
  }
];

export default function OccasionLookbook() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] border-t border-[#ECE7E1]" aria-label="Occasion Lookbook">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block mb-3">
            Curated Occasions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1C1917] leading-tight mb-4">
            Footwear for Your Defining Moments
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            From regal wedding vows to sunlit celebrations, discover pairs curated specifically for each Indian occasion.
          </p>
        </div>

        {/* 3 Asymmetric Lookbook Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OCCASIONS.map((item, index) => (
            <Link
              key={item.title}
              to={item.link}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#EAE3D2] shadow-xs hover:shadow-2xl transition-all duration-700 hover:-translate-y-1.5"
            >
              {/* Image Container with Editorial Aspect Ratio */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE7E1]">
                <img
                  src={getOptimizedImage(item.image, 700)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#FFD6A5] block mb-1.5">
                    {item.eyebrow}
                  </span>
                  <h3 className="font-serif text-2xl leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917] group-hover:text-[#8B5E3C] transition-colors">
                  <span>{item.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
