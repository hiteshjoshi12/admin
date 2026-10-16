import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Heart, 
  Crown, 
  MapPin, 
  Ruler, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  Gem,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/seo/SEO';
import { getBreadcrumbSchema, getFAQSchema } from '../components/seo/schemaUtils';

export default function BridalGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bridalFaqs = [
    {
      question: "Should I wear juttis or high heels for my wedding ceremony?",
      answer: "Most Indian brides now choose handcrafted juttis or keep a pair as their primary footwear for ceremonies. Heavy bridal lehengas (weighing 15–25 kg) combined with 4–6 hours of standing during the Anand Karaj or Pheras can cause severe foot fatigue in high heels. Handcrafted juttis with genuine leather soles and double-padded memory foam cushioning offer heirloom elegance without back or foot strain."
    },
    {
      question: "When should I order my bridal juttis relative to my lehenga fittings?",
      answer: "We recommend purchasing your bridal juttis at least 3 to 4 weeks before your final lehenga alteration. Take your wedding juttis to your lehenga trial so your master tailor can hem the skirt length accurately to grazing height, preventing any tripping hazard while walking down the aisle."
    },
    {
      question: "How do I match jutti embroidery with my bridal outfit?",
      answer: "Look at your outfit's primary metallic embellishments. If your lehenga features warm antique zardozi, choose juttis with dabka and antique gold cord work. If your lehenga highlights pearls, mirrors, or silver tilla work, opt for ivory or pearl-embellished pairs. For pastel outfits, matching or complementary tone-on-tone thread embroidery creates a cohesive royal look."
    },
    {
      question: "Can I book a bridal trial at your Gurgaon studio?",
      answer: "Yes. Brides and bridal parties in Delhi NCR can visit our physical studio in Sector 15, Gurugram (122001) for personalized sizing trials and bridal styling consultations. Please reach out via our Contact page or WhatsApp support to confirm appointment availability."
    }
  ];

  const bridalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Bridal Jutti Buying & Styling Guide for Indian Weddings',
        description: 'Comprehensive wedding footwear guide for Indian brides. How to choose handcrafted Punjabi juttis for lehengas, pheras comfort, and bridal ceremonies.',
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
        mainEntityOfPage: 'https://beadsandbloom.in/bridal-guide'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://beadsandbloom.in/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Bridal Guide',
            item: 'https://beadsandbloom.in/bridal-guide'
          }
        ]
      },
      getFAQSchema(bridalFaqs)
    ]
  };

  const weddingEvents = [
    {
      event: "Haldi & Mehendi",
      focus: "Playful Vibrance & Mirror Sparkle",
      desc: "Haldi and Mehendi celebrations require joyful colors and easy mobility. Opt for lightweight raw silk or satin juttis featuring mirrors, gotta patti, or lively floral threadwork that complement yellow, lime green, and fuchsia lehengas or shararas.",
      recommendation: "Shop bright festive accents and mirror-adorned flats.",
      link: "/collection/festive"
    },
    {
      event: "Sangeet & Cocktail Night",
      focus: "High-Octane Glamour & Dance-Floor Comfort",
      desc: "When dancing for hours to Bollywood beats, stilettos sink into banquet rugs or cause twisted ankles. Choose juttis loaded with iridescent cut-dana, bugle beads, and sequins that catch stage lights while keeping your arches cushioned.",
      recommendation: "Explore festive occasion pairs built for dancing.",
      link: "/collection/festive"
    },
    {
      event: "The Wedding Ceremony & Pheras",
      focus: "Heirloom Zardozi, Pearls & Royal Motifs",
      desc: "For the sacred Anand Karaj or Hindu Pheras, your footwear must honor traditional craftsmanship. Choose rich crimson, ruby red, or regal ivory pairs intricately detailed with genuine dabka, tilla, and seed pearls.",
      recommendation: "Browse curated handcrafted bridal juttis.",
      link: "/collection/bridal"
    },
    {
      event: "Reception & Post-Wedding Dinners",
      focus: "Understated Metallic Elegance",
      desc: "Modern reception lehengas, gowns, and tissue sarees call for subtle luxury. Champagne golds, rose aurum, and pastel champagne tones seamlessly complement contemporary evening palettes without stealing focus from your jewelry.",
      recommendation: "Discover champagne and pastel luxury styles.",
      link: "/collection/bridal"
    }
  ];

  const stylingTips = [
    {
      title: "Crimson & Deep Maroon Lehengas",
      advice: "Balance deep velvet and raw silk crimson silhouettes with warm antique gold zardozi, ruby crystal highlights, or traditional dabka work that mirrors your bridal jewelry."
    },
    {
      title: "Pastel, Blush & Mint Ensembles",
      advice: "For daylight summer weddings, soften the silhouette with blush pink, ivory, or powder-blue juttis adorned with delicate moti (pearls), silver cut-dana, and floral thread embroidery."
    },
    {
      title: "Ivory, Gold & Metallic Tissue Silks",
      advice: "Tissue sarees and metallic gold ensembles shine brightest when grounded with dual-toned champagne zari embroidery, keeping the overall bridal aesthetic modern and cohesive."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-24">
      <SEO
        title="Bridal Jutti Guide: Footwear for Lehengas & Weddings | Beads and Bloom"
        description="Expert bridal jutti styling and buying guide for Indian weddings. How to match handcrafted juttis with lehengas, 10-hour pheras comfort, and studio fittings."
        canonical="/bridal-guide"
        keywords="bridal jutti guide, wedding footwear for lehenga, bridal mojris comfort, pheras footwear india, punjabi juttis for brides, lehenga matching juttis"
        schema={bridalSchema}
      />

      {/* --- HEADER HERO --- */}
      <div className="bg-white py-16 px-6 mb-16 text-center border-b border-[#EAE6DF]">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-[#FF2865] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Bridal Guide</span>
        </nav>
        <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
          The Indian Bride's Footwear Guide
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1917] mb-4">
          Bridal Jutti Buying & Styling Guide
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
          From the mandap to the sangeet stage, Indian wedding celebrations demand hours on your feet. 
          Discover how handcrafted Punjabi juttis deliver royal bridal elegance with 10-hour bite-free comfort.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* --- SECTION 1: THE BRIDAL FOOTWEAR DILEMMA --- */}
        <section className="bg-white rounded-2xl p-8 md:p-12 border border-[#EAE6DF] shadow-sm mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#FF2865] text-xs font-bold uppercase tracking-wider block mb-2">
                Comfort Meets Tradition
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917] mb-4">
                Why Modern Brides Choose Juttis Over High Heels
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-light">
                <p>
                  A traditional bridal lehenga can easily weigh between 15 and 25 kilograms with its layered cancan, heavy dupatta, and dense zardozi embellishments. Standing on hard marble mandaps or walking across garden lawns in 4-inch stilettos places acute pressure on your lower back and knees.
                </p>
                <p>
                  Handcrafted Punjabi juttis ground your stride naturally. With genuine flat leather soles, soft leather linings, and signature double-cushioned memory foam footbeds, Beads & Bloom juttis ensure you walk down the aisle with poise, grace, and complete physical comfort.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>No Lawn Sinking</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Double Memory Foam</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>100% Genuine Leather Soles</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-xl border border-[#EAE6DF]/70">
              <h3 className="font-serif text-lg text-[#1C1917] mb-3 flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#C5A059]" />
                The Pheras Test
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                During Hindu Pheras or the Sikh Anand Karaj, rituals require removing shoes or walking around the sacred fire repeatedly. Handcrafted juttis slip on and off effortlessly, making transitional ceremonies smooth and stress-free.
              </p>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-[#1C1917] mb-1">Tailor Alteration Tip:</p>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Always take your wedding juttis to your lehenga trial. The height of flat footwear changes the hem drop by 3–4 inches compared to heels. Hemming to flats prevents tripping on your skirt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: EVENT-BY-EVENT GUIDE --- */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest block mb-1">
              Curated Wedding Trousseau
            </span>
            <h2 className="text-3xl font-serif text-[#1C1917]">
              Footwear for Every Wedding Function
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddingEvents.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-[#EAE6DF] shadow-xs hover:border-[#C5A059]/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-serif font-bold text-[#FF2865] uppercase tracking-wider">
                      {item.event}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-serif text-[#1C1917] mb-2">{item.focus}</h3>
                  <p className="text-xs text-gray-600 font-light leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{item.recommendation}</span>
                  <Link 
                    to={item.link} 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C1917] hover:text-[#FF2865] transition-colors"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: MATCHING JUTTIS WITH LEHENGAS --- */}
        <section className="bg-[#1C1917] text-white rounded-2xl p-8 md:p-12 mb-16 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest block mb-2">
              Color & Embellishment Harmony
            </span>
            <h2 className="text-2xl md:text-3xl font-serif mb-3">
              How to Coordinate with Bridal Fabrics
            </h2>
            <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
              When styling bridal juttis, harmony between your jewelry metals, embroidery zari, and shoe details creates a seamless royal silhouette.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stylingTips.map((tip, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-xs">
                <h3 className="text-sm font-serif text-[#C5A059] font-bold mb-2">{tip.title}</h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">{tip.advice}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-white/10">
            <Link 
              to="/collection/bridal" 
              className="inline-flex items-center gap-2 bg-[#FF2865] hover:bg-[#e02055] text-white text-xs font-bold px-8 py-3.5 rounded-full transition-all uppercase tracking-widest shadow-lg hover:shadow-xl"
            >
              <span>Explore The Bridal Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* --- SECTION 4: STUDIO FITTINGS & SIZING GUIDANCE --- */}
        <section className="bg-white rounded-2xl p-8 md:p-12 border border-[#EAE6DF] mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest block mb-2">
                Personalized Fitting Experience
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917] mb-4">
                Delhi NCR Bridal Studio Appointments
              </h2>
              <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed mb-4">
                We understand that every detail must be flawless for your big day. Brides visiting Delhi NCR can book an appointment at our physical studio in <strong>Sector 15, Gurugram (122001)</strong> to experience our full trousseau collection, test cushioned fits with wedding attire, and receive personalized styling guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-black text-white text-xs font-medium px-6 py-3 rounded-md transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Book Studio Fitting</span>
                </Link>
                <Link
                  to="/size-chart"
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-medium px-6 py-3 rounded-md transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5 text-gray-500" />
                  <span>Consult Online Size Chart</span>
                </Link>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[#EAE6DF]">
              <h3 className="font-serif text-base text-[#1C1917] mb-3">Bridal Order Timeline Checklist</h3>
              <ul className="space-y-3 text-xs text-gray-600 font-light">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#FF2865] shrink-0">4–6 Weeks Before:</span>
                  <span>Select and order bridal jutti designs to allow standard 3–7 day delivery across India.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#FF2865] shrink-0">2–3 Weeks Before:</span>
                  <span>Take your juttis to lehenga length hem fitting trials with your master tailor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#FF2865] shrink-0">1 Week Before:</span>
                  <span>Wear with thin socks for 20 minutes indoors to gently shape leather contours to your foot.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: FREQUENTLY ASKED QUESTIONS --- */}
        <section className="bg-white rounded-2xl p-8 md:p-12 border border-[#EAE6DF] mb-16">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Bridal Footwear Answers
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917] mb-6">
            Frequently Asked Bridal Questions
          </h2>

          <div className="divide-y divide-gray-100">
            {bridalFaqs.map((faq, idx) => (
              <div key={idx} className="py-5">
                <h3 className="font-serif text-base font-semibold text-[#1C1917] mb-2">
                  {faq.question}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 6: SUPPORTING LINKS FOOTER --- */}
        <div className="bg-white rounded-xl p-8 border border-[#EAE6DF] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-base font-serif text-[#1C1917] mb-1">
              Need Post-Wedding Care Advice?
            </h3>
            <p className="text-xs text-gray-500 font-light">
              Learn how to clean, store, and preserve your bridal pair in our dedicated care guide.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/care-guide"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Read Jutti Care Guide</span>
            </Link>
            <Link
              to="/collection/bridal"
              className="inline-flex items-center gap-2 bg-[#FF2865] hover:bg-[#e02055] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <span>Bridal Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
