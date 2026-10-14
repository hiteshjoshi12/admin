import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Anchor, MapPin, Globe, CreditCard } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { getOrganizationSchema, getBreadcrumbSchema, getStoreSchema } from '../components/seo/schemaUtils';

export default function About() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'Our Heritage, Craft & Studio — Beads and Bloom',
        url: 'https://beadsandbloom.in/about',
        description:
          'Handcrafted Punjabi juttis rooted in artisan heritage, based in Sector 15 Gurgaon with worldwide delivery. Complete range from casual to bridal footwear.',
      },
      getStoreSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ]),
    ],
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20">
      <SEO
        title="Our Story, Studio & Handcrafted Range | Beads and Bloom Gurgaon"
        description="Discover Beads and Bloom. Handcrafted Punjabi juttis crafted with love, available at our Sector 15 Gurgaon studio and shipped worldwide with COD."
        canonical="/about"
        keywords="beads and bloom gurgaon, jutti store sector 15 gurgaon, handmade juttis india, bridal jutti makers gurgaon, worldwide shipping ethnic shoes, punjabi jutti craft"
        schema={aboutSchema}
      />
      
      {/* 1. LOAD ONE PREMIUM FONT (Playfair Display) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
          .font-luxury { font-family: 'Playfair Display', serif; }
        `}
      </style>

      {/* --- HERO SECTION --- */}
      <section className="relative py-24 md:py-32 px-6 text-center overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF2865] rounded-full blur-[180px] opacity-[0.03] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[#FF2865] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-6 block animate-fade-up">
            BRAND STORY
          </span>
          
          {/* 2. CLEANER, HIGH-FASHION TYPOGRAPHY */}
          <h1 className="font-luxury text-[#1C1917] leading-tight animate-fade-up delay-100">
            {/* Top Line: Bold, Uppercase, Wide Spacing */}
            <span className="block text-4xl md:text-6xl font-semibold tracking-widest uppercase mb-2">
              Threads of
            </span>
            
            {/* Bottom Line: Italic, Elegant, Accent Color */}
            <span className="block text-5xl md:text-7xl italic font-normal text-[#FF2865]">
              Tradition
            </span>
          </h1>

          <div className="w-[1px] h-16 bg-[#1C1917] mx-auto mt-10 mb-8 animate-fade-up delay-200 opacity-20"></div>
          
          <p className="max-w-xl mx-auto text-gray-500 font-serif italic text-lg animate-fade-up delay-300">
            "Where heritage meets modern grace."
          </p>
        </div>
      </section>

      {/* --- THE NARRATIVE --- */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid - Kept Clean */}
          <div className="relative h-[500px] md:h-[600px] hidden md:block animate-fade-up delay-300">
             <div className="absolute top-0 right-0 w-3/4 h-3/4 overflow-hidden rounded-t-[10rem] border border-white shadow-xl">
               <img 
                 src="https://ik.imagekit.io/beandandbloom/Media/IMG_9775_mebgcp.jpg" 
                 alt="Artisan embroidery" 
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
               />
             </div>
             <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white p-3 shadow-2xl rotate-[-3deg] z-10 rounded-lg">
                <img 
                  src="https://ik.imagekit.io/beandandbloom/Media/IMG_0279_l2cibn.webp" 
                  alt="Hands working" 
                  className="w-full h-full object-cover rounded-sm"
                />
             </div>
          </div>

          {/* The Text - Improved Readability */}
          <div className="font-luxury text-2xl md:text-3xl leading-relaxed text-[#1C1917] space-y-10 text-center md:text-left">
            <div className="animate-fade-up delay-100">
              <p className="text-gray-400 text-xs font-sans font-bold uppercase tracking-widest mb-4">The Beginning</p>
              <p>
                Some stories aren’t written.<br />
                They’re <span className="italic text-[#FF2865] font-semibold">stitched.</span>
              </p>
            </div>
            
            <div className="animate-fade-up delay-200">
              <p className="text-lg md:text-xl font-sans font-light text-gray-600 leading-8">
                Before Beads & Bloom becomes something you wear,
                it begins with hands that remember—artisans rooted in Punjab, working with patience, precision, and pride.
              </p>
            </div>

            <div className="animate-fade-up delay-300 pl-0 md:pl-8 border-l-0 md:border-l-4 border-[#FF2865]/30">
              <p className="text-xl md:text-2xl italic text-gray-800">
                We don’t modernise by westernising.
                We refine what already belongs to us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOUNDER SECTION --- */}
      <section className="bg-[#1C1917] py-24 px-6 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="font-luxury text-4xl md:text-6xl mb-8 leading-tight">
            A Connection Deeper<br/> 
            <span className="italic text-[#FF2865]">Than Fashion.</span>
          </h2>
          
          <div className="space-y-8 text-gray-300 font-light leading-relaxed text-lg">
            <p className="font-luxury italic text-2xl text-white">
              "When a woman slips into Beads & Bloom for the first time,
              she doesn’t just feel style. She feels belonging."
            </p>
            <p className="max-w-2xl mx-auto">
              I started this journey to build a bridge between the heritage I grew up with and the modern world we live in. It is a quiet confidence. A celebration of where we come from.
            </p>
          </div>
        </div>
      </section>

      {/* --- GURGAON STUDIO & REACH --- */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
            Our Presence
          </span>
          <h2 className="font-luxury text-3xl md:text-5xl text-[#1C1917] mb-6">
            From Sector 15, Gurgaon <span className="italic text-[#FF2865]">to the World</span>
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Nestled in <strong>Sector 15, Gurgaon (Gurugram)</strong>, our boutique studio is a sanctuary for authentic Indian footwear craftsmanship. 
            From bridal wear and sangeet celebrations to effortless everyday casual juttis, each pair is brought to life with passion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-[#F9F8F6] border border-gray-200/70">
              <div className="w-10 h-10 rounded-full bg-[#FFF0F4] text-[#FF2865] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1C1917] mb-2">Gurgaon Studio</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Visit us in Sector 15, Gurgaon for exclusive bridal styling, custom fit appointments, and bridal party orders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9F8F6] border border-gray-200/70">
              <div className="w-10 h-10 rounded-full bg-[#F0F7FF] text-[#2563EB] flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1C1917] mb-2">Worldwide Shipping</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We deliver to homes across the USA, UK, Canada, Australia, UAE, Europe, and India with reliable express shipping.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9F8F6] border border-gray-200/70">
              <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#1C1917] mb-2">COD & Easy Payments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Enjoy Cash on Delivery (COD) across India alongside secure UPI, Debit/Credit Card, and Net Banking options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="relative z-20 py-24 w-full bg-brand-bg">
        <div className="w-full px-4 md:px-16 text-center">
          
          <div className="w-full flex flex-col md:flex-row justify-around items-center gap-12 mb-20">
             <ValueCard icon={Anchor} title="Rooted" desc="Deeply connected to the soil and soul of Punjab." />
             <ValueCard icon={Heart} title="Resilient" desc="Crafted to endure, just like the stories we tell." />
             <ValueCard icon={Sparkles} title="Refined" desc="Ancient techniques, perfected for the modern foot." />
          </div>

          <div className="inline-block p-1 border border-[#FF2865]/20 rounded-full">
            <Link 
              to="/shop" 
              className="block bg-[#FF2865] text-white px-12 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1C1917] transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Experience the Collection
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center group cursor-default max-w-xs">
      <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#FF2865] group-hover:border-[#FF2865] group-hover:text-white group-hover:scale-110 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-2xl font-luxury mb-3 group-hover:text-[#FF2865] transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}