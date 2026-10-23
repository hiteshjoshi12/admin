import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getOptimizedImage } from '../../util/imageUtils';

export default function BrandStory() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] border-t border-[#ECE7E1] overflow-hidden" aria-label="Brand Philosophy and Heritage">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Main Grid: Editorial Asymmetric Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Dual Layered Editorial Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#ECE7E1] shadow-lg">
              <img
                src={getOptimizedImage("https://ik.imagekit.io/beandandbloom/Media/IMG_9775_mebgcp.jpg", 900)}
                alt="Artisan hand-embroidering luxury Punjabi jutti with zardozi and beads"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/80 block mb-1">
                  The Atelier
                </span>
                <p className="font-serif text-xl sm:text-2xl font-light leading-snug">
                  Every stitch carries generational memory.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Inset Image */}
            <div className="hidden sm:block absolute -bottom-10 -right-6 lg:-right-10 w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src={getOptimizedImage("https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1867_zDyUavPbR.jpeg", 500)}
                alt="Close-up of double-cushioned genuine leather jutti sole"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 lg:pl-6">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
              Atelier Heritage & Philosophy
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1C1917] leading-[1.15] mb-6">
              Before it becomes fashion, <br />
              <span className="italic font-light text-[#8B5E3C]">it begins with heritage.</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light mb-6">
              Centuries ago, the royal courts of Punjab designed footwear without left or right — shoes crafted so purely from vegetable-tanned leather that they gently molded to the unique contours of the wearer's feet.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light mb-10">
              At <strong>Beads & Bloom</strong>, we honor that timeless tradition while solving its greatest historic flaw: stiffness. By marrying genuine buffalo leather soles with dual-layered memory cushioning, our karigars create heirloom juttis that offer all-day, bite-free grace from dawn ceremonies to midnight celebrations.
            </p>

            {/* 3 Editorial Hallmarks (Without Cartoon Icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E5DECE] mb-10">
              <div>
                <span className="font-serif text-2xl text-[#1C1917] block mb-1">01</span>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1917] mb-1">Pure Leather</h3>
                <p className="text-[11px] text-gray-500 font-light">Natural vegetable-tanned soles that breathe and mold.</p>
              </div>

              <div>
                <span className="font-serif text-2xl text-[#1C1917] block mb-1">02</span>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1917] mb-1">Double Cushion</h3>
                <p className="text-[11px] text-gray-500 font-light">Layered memory padding for 12+ hours of bite-free ease.</p>
              </div>

              <div>
                <span className="font-serif text-2xl text-[#1C1917] block mb-1">03</span>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1917] mb-1">Authentic Dabka</h3>
                <p className="text-[11px] text-gray-500 font-light">Heirloom metallic zardozi, pearls, and hand-cut stones.</p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#1C1917] text-white px-7 py-3.5 rounded-full hover:bg-[#8B5E3C] transition-colors shadow-sm"
              >
                Read Our Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#C5A059] border-b border-[#1C1917] pb-1 transition-colors"
              >
                Explore The Collection
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}