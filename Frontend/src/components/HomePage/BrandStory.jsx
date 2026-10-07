import { PenTool, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="py-24 px-4 bg-[#F9F8F6] border-t border-gray-200" aria-label="Brand Philosophy and Heritage">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Intro */}
        <div className="inline-block px-4 py-1 border border-brand-gold rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-8">
          Our Philosophy
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-brand-black mb-8">
          "Before it becomes fashion, <br />
          <span className="italic text-brand-gold">it begins with roots."</span>
        </h2>
        
        <p className="text-lg text-gray-600 leading-relaxed font-light mb-10 max-w-2xl mx-auto">
          Hands that remember. Heritage that refuses to fade. At <strong>Beads & Bloom</strong>, 
          we revive the ancient art of Indian craftsmanship for the modern woman who walks her own path.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#C5A059] border-b border-[#1C1917] pb-1 transition-colors"
          >
            Read Our Heritage Story <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1C1917] transition-colors"
          >
            Explore All Handcrafted Juttis
          </Link>
        </div>

        {/* 3 Pillars (Why Us) - Fixed Semantic H3 Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-300 pt-12">
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 text-brand-gold">
              <PenTool className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-serif mb-2 text-[#1C1917]">Handcrafted Detail</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Every bead sewn by hand</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 text-brand-gold">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-serif mb-2 text-[#1C1917]">Unmatched Comfort</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Double-cushioned soles</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 text-brand-gold">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-serif mb-2 text-[#1C1917]">Authentic Heritage</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Real Zardosi Techniques</p>
          </div>

        </div>

      </div>
    </section>
  );
}