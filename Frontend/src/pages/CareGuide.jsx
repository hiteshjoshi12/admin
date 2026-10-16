import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Droplets, 
  Wind, 
  Sun, 
  PackageCheck, 
  HelpCircle, 
  ArrowRight, 
  Ruler, 
  HeartHandshake 
} from 'lucide-react';
import SEO from '../components/seo/SEO';
import { getBreadcrumbSchema, getFAQSchema } from '../components/seo/schemaUtils';

export default function CareGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const careFaqs = [
    {
      question: "Can I wash my handcrafted Punjabi juttis with water?",
      answer: "No. Never wash your juttis with water or submerge them. Beads & Bloom juttis feature 100% genuine leather soles and linings, which absorb water and may lose structural integrity or stain delicate embroidery when soaked. Always dry clean or spot clean gently with a dry, soft-bristled brush."
    },
    {
      question: "What should I do if my juttis accidentally get wet in the rain?",
      answer: "If exposed to dampness or rain, immediately pat dry with a clean cotton towel. Allow them to air-dry naturally at room temperature in a well-ventilated space. Never use hair dryers, heaters, or leave them under direct harsh sunlight, as intense heat hardens and cracks genuine leather."
    },
    {
      question: "How do I prevent metallic zardozi and dabka embroidery from tarnishing?",
      answer: "Always put your juttis on AFTER applying perfume, deodorants, hairspray, and foot lotions. Chemical sprays cause metallic zari, cut-dana, and dabka threads to oxidize and tarnish over time. Store each pair in a breathable muslin cloth bag with silica gel packets to keep moisture away."
    },
    {
      question: "How do I break in new juttis to ensure bite-free wear for weddings?",
      answer: "While Beads & Bloom juttis feature signature double-cushioned memory foam footbeds to eliminate shoe bites, authentic leather naturally conforms to your foot contours over time. We recommend wearing your new pair with thin cotton socks around the house for 20–30 minutes a couple of days before your big wedding or festive celebration."
    }
  ];

  const careSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Handcrafted Punjabi Jutti Care & Cleaning Guide',
        description: 'Complete maintenance, cleaning, storage, and bite-free care guide for handcrafted Indian juttis and bridal mojris by Beads & Bloom.',
        author: {
          '@type': 'Organization',
          name: 'Beads and Bloom',
          url: 'https://beadsandbloom.in/'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Beads and Bloom',
          logo: {
            '@type': 'ImageObject',
            url: 'https://beadsandbloom.in/logo.png'
          }
        },
        mainEntityOfPage: 'https://beadsandbloom.in/care-guide'
      },
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Care Guide', url: '/care-guide' }
      ]),
      getFAQSchema(careFaqs)
    ]
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-24">
      <SEO
        title="Jutti Care & Cleaning Guide — Preserve Handcrafted Mojris | Beads and Bloom"
        description="Learn how to care for your handcrafted Punjabi juttis. Expert instructions on cleaning embroidered velvet and silk, protecting leather soles, and bite-free storage."
        canonical="/care-guide"
        keywords="how to clean juttis, jutti care guide, cleaning embroidered juttis, store bridal mojris, prevent jutti shoe bite, leather jutti care india"
        schema={careSchema}
      />

      {/* --- HEADER HERO --- */}
      <div className="bg-white py-16 px-6 mb-16 text-center border-b border-[#EAE6DF]">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-[#FF2865] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Care Guide</span>
        </nav>
        <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
          Artisanal Footwear Preservation
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1917] mb-4">
          Handcrafted Jutti Care Guide
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed">
          Every pair of Beads & Bloom footwear is handcrafted by skilled Punjabi artisans. Follow these simple steps to preserve delicate embroidery and buttery-soft leather soles for years.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- 4 CORE CARE PILLARS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1: Moisture & Water Protection */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#FF2865] flex items-center justify-center mb-6">
                <Droplets className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-3">
                1. Moisture & Water Defense
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Our juttis are constructed with <strong>100% genuine leather soles and linings</strong>. Genuine leather breathes naturally and conforms to your feet, but prolonged exposure to moisture can cause stiffening or water stains.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-5 leading-relaxed">
                <li>Never submerge, wash, or clean juttis under running water.</li>
                <li>Avoid wearing delicate embroidered pairs outdoors in active rain or wet grass.</li>
                <li>If wet, pat dry with a soft cloth and let them dry naturally away from artificial heat.</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
              Leather Protection Tip
            </div>
          </div>

          {/* Card 2: Fabric & Embellishment Care */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FFF7E8] text-[#C5A059] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-3">
                2. Cleaning by Fabric & Craft
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Different materials require tailored cleaning techniques to protect intricate hand-embroidery, dabka, and mirror work:
              </p>
              <ul className="text-xs text-gray-500 space-y-2.5 list-disc pl-5 leading-relaxed">
                <li><strong>Velvet & Suede:</strong> Gently brush with a dry, soft toothbrush or velvet sponge in the direction of the nap to remove surface dust.</li>
                <li><strong>Pure Silk & Crepe:</strong> Wipe very lightly with a clean, slightly damp muslin cloth; never rub aggressively.</li>
                <li><strong>Zardozi, Cut-dana & Mirrors:</strong> Lightly dust with a soft makeup brush to remove dust from between metallic crevices without snagging threads.</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
              Embroidery Preservation
            </div>
          </div>

          {/* Card 3: Storage & Preservation */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#F0F7FF] text-[#2563EB] flex items-center justify-center mb-6">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-3">
                3. Storage & Humidity Control
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Proper seasonal storage prevents metallic zari tarnishing and preserves the silhouette of your juttis:
              </p>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-5 leading-relaxed">
                <li>Always store juttis in breathable cotton or muslin bags—never airtight plastic bags.</li>
                <li>Place silica gel sachets inside your shoe box during humid monsoon months.</li>
                <li>Stuff toe boxes loosely with acid-free butter paper to maintain their curved silhouette when not in use.</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
              Long-Term Storage
            </div>
          </div>

          {/* Card 4: Bite-Free Breaking-In */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-3">
                4. Breaking-In & Bite Prevention
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                All Beads & Bloom juttis feature signature <strong>double-cushioned memory foam footbeds</strong>. Here is how to achieve the absolute best comfort:
              </p>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-5 leading-relaxed">
                <li>Genuine leather stretches gently across the width after the first wear, contouring to your unique foot shape.</li>
                <li>For wedding ceremonies, wear your juttis for 20 minutes at home before the main event.</li>
                <li>Apply a tiny dab of mustard oil or petroleum jelly along inner seams if you have exceptionally sensitive skin.</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
              Signature Comfort
            </div>
          </div>

        </div>

        {/* --- CONTEXTUAL CROSS-LINK STRIP --- */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm mb-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
              Sizing & Fit Confidence
            </span>
            <h3 className="text-2xl font-serif text-[#1C1917] mb-2">
              Need Sizing Assistance for Your Next Pair?
            </h3>
            <p className="text-sm text-gray-500 font-light max-w-xl">
              Consult our step-by-step footwear size chart with EU 36-41 measurements, broad-foot sizing advice, and trial appointment details.
            </p>
          </div>
          <Link
            to="/size-chart"
            className="shrink-0 bg-[#1C1917] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#FF2865] transition-all shadow-md flex items-center gap-2"
          >
            <Ruler className="w-4 h-4" /> View Size Chart
          </Link>
        </div>

        {/* --- FREQUENTLY ASKED CARE QUESTIONS (AEO / FAQ SCHEMA) --- */}
        <section className="mt-16 pt-16 border-t border-gray-200" aria-label="Frequently Asked Jutti Care Questions">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
              Common Questions
            </span>
            <h2 className="text-3xl font-serif text-[#1C1917] mb-3">
              Frequently Asked Care Questions
            </h2>
            <p className="text-sm text-gray-500 font-light">
              Clear answers to help you maintain artisanal quality and all-day comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {careFaqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-serif text-lg text-[#1C1917] mb-2 flex items-start gap-2">
                  <span className="text-[#FF2865] font-bold font-sans text-sm mt-0.5">Q.</span>
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- COLLECTION EXPLORATION --- */}
        <div className="mt-20 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Explore Our Handcrafted Collections</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/collection/bridal" className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C] hover:text-[#1C1917] border-b border-[#8B5E3C] pb-0.5">
              Bridal Juttis (14) →
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/collection/festive" className="text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:text-[#1C1917] border-b border-[#C5A059] pb-0.5">
              Festive Juttis (22) →
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/collection/casual" className="text-xs font-bold uppercase tracking-wider text-[#1C1917] hover:text-[#FF2865] border-b border-[#1C1917] pb-0.5">
              Everyday Chic (8) →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
