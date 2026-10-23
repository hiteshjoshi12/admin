import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Heart, ShieldCheck, Globe, CreditCard,
  Truck, Award, ArrowRight, Layers, Check, Feather, Users
} from 'lucide-react';
import { API_BASE_URL } from '../util/config';
import SEO from '../components/seo/SEO';
import {
  getOrganizationSchema,
  getBreadcrumbSchema,
  getStoreSchema
} from '../components/seo/schemaUtils';
import { defaultAboutContent } from '../data/defaultAboutContent';

export default function About() {
  const [cmsContent, setCmsContent] = useState(defaultAboutContent);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch live About Page content from backend CMS
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        if (data && data.aboutContent && data.aboutContent.pillars?.length) {
          setCmsContent(data.aboutContent);
        }
      } catch (err) {
        console.error("Failed to load About CMS content, using defaults", err);
      }
    };
    fetchAboutData();
  }, []);

  // Derived content with safe fallbacks
  const hero = cmsContent.hero || defaultAboutContent.hero;
  const mission = cmsContent.mission || defaultAboutContent.mission;
  const stats = (cmsContent.stats && cmsContent.stats.length > 0)
    ? cmsContent.stats
    : defaultAboutContent.stats;
  const pillars = (cmsContent.pillars && cmsContent.pillars.length > 0)
    ? cmsContent.pillars
    : defaultAboutContent.pillars;
  const values = (cmsContent.values && cmsContent.values.length > 0)
    ? cmsContent.values
    : defaultAboutContent.values;
  const gallery = (cmsContent.gallery && cmsContent.gallery.length > 0)
    ? cmsContent.gallery
    : defaultAboutContent.gallery;
  const founderNote = cmsContent.founderNote || defaultAboutContent.founderNote;

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'Our Story & Artisan Heritage — Beads & Bloom',
        url: 'https://beadsandbloom.in/about',
        description: hero?.subtitle || 'Handcrafted luxury Punjabi juttis rooted in artisan heritage with worldwide delivery. Engineered with double memory foam cushioning and 100% genuine leather soles.',
        mainEntity: {
          '@type': 'Organization',
          name: 'Beads & Bloom',
          url: 'https://beadsandbloom.in',
          logo: 'https://beadsandbloom.in/favicon.ico',
          description: 'Artisanal Indian luxury footwear brand specializing in handcrafted Punjabi juttis, bridal mojris, and festive footwear engineered with orthopedic dual memory foam comfort.',
          foundingDate: '2023',
          founders: [
            {
              '@type': 'Person',
              name: 'Hitesh Joshi',
              jobTitle: 'Founder & Creative Director'
            }
          ],
          sameAs: [
            'https://www.instagram.com/beadsnbloom.india'
          ]
        }
      },
      getStoreSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
      ]),
    ],
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] min-h-screen pt-20 transition-colors duration-700 selection:bg-[#C5A059]/20 selection:text-[#1C1917]">
      <SEO
        title="Our Story & Artisan Heritage — Handcrafted Luxury Juttis | Beads & Bloom"
        description="Discover Beads & Bloom. Explore the comprehensive brand story, Punjab artisan heritage, orthopedic dual-density memory foam soles, and ethical craftsmanship behind our luxury juttis."
        canonical="/about"
        keywords="beads and bloom story, handcrafted juttis india, punjabi jutti craft, bridal jutti makers, double padded juttis, memory foam ethnic footwear, ethical artisan fashion India, genuine leather mojri"
        schema={aboutSchema}
      />

      {/* --- 1. HERO SECTION (LUXURY EDITORIAL ATELIER) --- */}
      <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 px-6 md:px-12 bg-gradient-to-b from-[#FBF8F2] via-[#FAF6ED] to-[#FAF8F5] border-b border-[#EAE0D0]/80 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            <Link to="/" className="hover:text-[#1C1917] transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <span className="text-[#1C1917] font-bold">About Us</span>
          </nav>

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0DC] border border-[#E4CE9E] text-[#8A5B28] text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>{hero.badge || "The Story Behind Beads & Bloom"}</span>
          </div>

          {/* Master H1 Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            {hero.title || "Handcrafted Luxury Rooted in Punjab's Timeless Karigari"}
          </h1>

          {/* Lead Paragraph */}
          <p className="text-sm md:text-base text-gray-600 font-light max-w-3xl mx-auto leading-relaxed mb-10">
            {hero.subtitle || "Born from a passion to preserve authentic Indian needlecraft while solving the age-old problem of painful ethnic footwear. We engineer heirloom Punjabi juttis with pure leather soles and double-cushioned orthopedic comfort."}
          </p>

          {/* Hero Feature Visual Showcase */}
          {hero.heroImage && (
            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-md border border-[#EAE0D0] relative aspect-[16/9] md:aspect-[21/9] bg-[#EFE8DD]">
              <img
                src={hero.heroImage}
                alt="Beads & Bloom Master Karigari & Silk Embroidery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-8">
                <span className="text-white text-xs md:text-sm font-serif italic tracking-wide">
                  "Where centuries of Punjabi needlecraft meet modern dance-floor comfort."
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- 2. TRUST NUMBERS & MILESTONES STRIP --- */}
      <section className="bg-white border-b border-[#EAE0D0] py-8 px-6" aria-label="Trust Signals">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-3">
              <span className="font-serif text-3xl md:text-4xl font-bold text-[#1C1917] block mb-1">
                {stat.number}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                {stat.label}
              </span>
              <p className="text-[11px] text-gray-500 font-light leading-snug">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. THE BRAND GENESIS & REVOLUTION --- */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#FAF0DC] border border-[#EAE0D0] shadow-sm relative group">
              <img
                src={gallery[0] || "https://ik.imagekit.io/beandandbloom/Media/IMG_9775_mebgcp.jpg"}
                alt="Artisan hands embroidering silk jutti"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E4CE9E]">
                  Authentic Karigari
                </span>
                <p className="text-xs font-light text-gray-200 mt-1">
                  Hand-stitched in Punjab with dabka wire, sitara sequins, and raw silk.
                </p>
              </div>
            </div>

            {/* Floating Floating Pill */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-lg border border-[#EAE0D0] max-w-[220px] hidden sm:block animate-fade-in">
              <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                <Sparkles className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold text-[#1C1917]">Bite-Free Promise</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                Dual memory foam footbed engineered for 10+ hours of continuous wear.
              </p>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">
                {mission.tagline || "Where Heritage Meets Cloud Comfort"}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1917] leading-snug">
              {mission.headline || "Some stories aren’t written. They are stitched."}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              {mission.paragraph1 || "Before Beads & Bloom becomes something you wear, it begins with hands that remember—generational master karigars rooted in Punjab, working with patience, precision, and cultural pride. For decades, wearing traditional ethnic footwear meant enduring painful shoe bites, stiff cardboard soles, and blisters after just an hour on the dance floor."}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              {mission.paragraph2 || "We set out to change this without losing the soul of the craft. We paired centuries-old dabka, zardozi, and authentic sheesha mirror work with modern orthopedic footbed engineering—giving every woman the freedom to celebrate India’s most joyous weddings, sangeets, and galas in pure, uncompromised comfort."}
            </p>

            {/* Philosophy Callout Quote */}
            <div className="p-5 rounded-2xl bg-[#FAF4EA] border-l-4 border-[#C5A059] text-[#1C1917]">
              <p className="font-serif italic text-base sm:text-lg">
                "{mission.quote || "We don't modernise by westernising. We refine what already belongs to us."}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. THE 4 CRAFTSMANSHIP PILLARS (ANATOMY) --- */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-[#EAE0D0]" aria-label="Craftsmanship Anatomy">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
              The Beads & Bloom Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1917] mb-3">
              The Anatomy of Our Footwear
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light">
              Every detail is engineered with thoughtful care to marry authentic Indian handwork with all-day foot wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#EAE0D0] flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFE8DD] relative">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                        {pillar.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="w-7 h-7 rounded-full bg-white/95 text-[#C5A059] font-serif font-bold text-xs flex items-center justify-center shadow-xs">
                        {pillar.number || `0${idx + 1}`}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-base text-[#1C1917] mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-[#EAE0D0]/50 flex items-center gap-1.5 text-[10px] font-semibold text-[#8B5E3C]">
                  <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Inspected for Perfection</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. BEHIND THE SEAMS: ATELIER WORKSHOP GALLERY --- */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto" aria-label="Atelier Workshop">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
            Behind the Seams
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1917] mb-3">
            Life in Our Workshop
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light">
            Moments of devotion, patience, and artistry captured directly from our artisan workshops in Punjab.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((imgUrl, idx) => (
            <div
              key={idx}
              className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#EFE8DD] border border-[#EAE0D0] group relative shadow-xs"
            >
              <img
                src={imgUrl}
                alt={`Beads & Bloom workshop artisan moment ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                  Handcrafted Karigari
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 6. CORE VALUES & ETHICAL COMMITMENT --- */}
      <section className="py-20 px-6 md:px-12 bg-[#F3EDE2] border-t border-[#EAE0D0]" aria-label="Core Values">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8A5B28] block mb-2">
              Our Compass
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1917] mb-3">
              Values We Live By
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light">
              From our artisan relationships to the sustainable materials we source, our values guide every decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#EAE0D0] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#C5A059] flex items-center justify-center mb-4">
                    {idx === 0 && <Users className="w-5 h-5" />}
                    {idx === 1 && <Sparkles className="w-5 h-5" />}
                    {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                    {idx === 3 && <Feather className="w-5 h-5" />}
                    {idx >= 4 && <Award className="w-5 h-5" />}
                  </div>
                  <h3 className="font-serif text-base text-[#1C1917] mb-2 font-medium">
                    {val.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 7. FOUNDER'S NOTE & INSPIRATION --- */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-4xl mx-auto text-center" aria-label="Founder Note">
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-3xl border border-[#EAE0D0] shadow-sm relative overflow-hidden">

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0DC] text-[#8A5B28] text-[10px] font-bold uppercase tracking-wider mb-6">
            <Heart className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span>{founderNote.headline || "A Message from Our Atelier"}</span>
          </div>

          <blockquote className="font-serif italic text-xl sm:text-2xl text-[#1C1917] max-w-2xl mx-auto leading-relaxed mb-6">
            "{founderNote.quote || "When a woman slips into Beads & Bloom for the first time, she doesn’t just feel style. She feels confidence, grace, and belonging."}"
          </blockquote>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light max-w-2xl mx-auto mb-8">
            {founderNote.body || "I started Beads & Bloom to bridge the gap between India's breathtaking textile heritage and the modern woman's lifestyle. You should never have to take off your shoes halfway through a wedding reception or compromise your comfort for beauty. Every stitch we place is an ode to who we are, where we come from, and the celebrations that unite us."}
          </p>

          <div className="pt-6 border-t border-gray-100 flex flex-col items-center">
            <span className="font-serif font-bold text-sm text-[#1C1917]">
              {founderNote.brand || "Beads & Bloom"}
            </span>
            <span className="text-[11px] text-[#C5A059] font-medium tracking-wider uppercase mt-0.5">
              {founderNote.author || "Founder & Creative Director"}
            </span>
          </div>
        </div>
      </section>

      {/* --- 8. WORLDWIDE REACH & SHOPPING PEACE OF MIND --- */}
      <section className="bg-white border-t border-[#EAE0D0] py-14 px-6 md:px-12" aria-label="Services & Reach">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] text-[#C5A059] flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#1C1917] mb-1">Global Shipping</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Reliable worldwide express courier delivery to the USA, UK, Canada, Australia, UAE, Europe, and beyond.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] text-[#C5A059] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#1C1917] mb-1">Pan-India COD</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Cash on Delivery available nationwide across India.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] text-[#C5A059] flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base text-[#1C1917] mb-1">Secure Checkout</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Encrypted UPI, Cards, Net Banking, and international payment gateways with zero hidden fees.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- 9. EXPLORE CURATED EDITS BANNER --- */}
      <section className="py-16 px-6 bg-[#1C1917] text-white text-center" aria-label="Explore Collections">
        <div className="max-w-3xl mx-auto space-y-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] block">
            Step Into Artisanal Luxury
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-white">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            Explore our curated edits from royal bridal trousseau to high-sparkle festive mojris and effortless casual flats.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/collection/festive"
              className="px-6 py-3 rounded-full bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B08E48] transition-colors"
            >
              The Festive Edit
            </Link>
            <Link
              to="/collection/bridal"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/20"
            >
              The Bridal Edit
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full bg-white text-[#1C1917] text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Shop All Pairs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}