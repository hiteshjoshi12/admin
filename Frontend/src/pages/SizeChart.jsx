import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, Search, ShoppingBag, HelpCircle } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { getBreadcrumbSchema, getFAQSchema } from '../components/seo/schemaUtils';

export default function SizeChart() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sizingFaqs = [
    {
      question: "How do I measure my foot size for Beads & Bloom juttis?",
      answer: "Place a measuring tape flat on the floor against a wall. Measure your foot length from the heel to the tip of your longest toe in centimeters. Compare this measurement with our EU size guide (sizes 36 to 41)."
    },
    {
      question: "What size should I choose if I have broad feet?",
      answer: "If you have broad feet or fall between two sizes, we recommend sizing up by one size for optimal comfort and fit."
    },
    {
      question: "Do handcrafted Punjabi juttis stretch over time?",
      answer: "Yes. Authentic handcrafted juttis with genuine leather or textile bases mold gently to the contours of your feet with wear, enhancing overall comfort over time."
    },
    {
      question: "Can I exchange my juttis if the size does not fit?",
      answer: "Yes, we accept exchanges for size within 48 hours of delivery, provided the juttis are unworn, in original packaging, and accompanied by a continuous unboxing video."
    }
  ];

  const sizeChartSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Size Guide', url: '/size-chart' }
      ]),
      getFAQSchema(sizingFaqs)
    ]
  };

  // Replace this with your actual image URL from the chat
  const sizeChartImage = "size chart.jpeg";

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-24">
      <SEO
        title="Jutti Size Chart & Footwear Guide | Beads and Bloom"
        description="Find your perfect fit with the Beads and Bloom footwear size chart. Step-by-step instructions on measuring foot length (EU 36-41) for bite-free jutti comfort."
        canonical="/size-chart"
        keywords="jutti size chart, punjabi jutti sizing, how to measure foot length, ethnic footwear size guide india, jutti size conversion"
        schema={sizeChartSchema}
      />
      
      {/* --- PAGE HEADER --- */}
      <div className="bg-white py-16 px-6 mb-16 text-center border-b border-gray-100">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-[#FF2865]">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Size Guide</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-4">Jutti Size Guide & Measurement</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs">Find your perfect fit for all-day comfort</p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* --- LEFT COLUMN: THE SIZE CHART IMAGE --- */}
          <div className="w-full lg:w-1/2 animate-fade-up">
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100">
              <img 
                src={sizeChartImage} 
                alt="Beads & Bloom Women's Footwear Size Chart" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
             <div className="mt-6 text-center lg:text-left">
              <a href="https://www.instagram.com/beadsnbloom.india" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#FF2865] hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                @beadsnbloom.india
              </a>
            </div>
          </div>

          {/* --- RIGHT COLUMN: INSTRUCTIONS & NOTE --- */}
          <div className="w-full lg:w-1/2 space-y-12 animate-fade-up delay-200">
            
    
            {/* How to Measure Steps */}
            <div>
              <h2 className="text-3xl font-serif text-[#1C1917] mb-8">How to Measure</h2>
              <div className="space-y-8">
                
                <Step 
                  number="1"
                  icon={Ruler}
                  title="Find your foot length"
                  desc="Place a measuring tape flat on the floor. Measure the distance between your heel and the tip of your longest toe."
                />
                
                <Step 
                  number="2"
                  icon={Search}
                  title="Match your size"
                  desc="Compare your measurement in inches or centimeters with the chart to find your corresponding size (36-41)."
                />
                
                <Step 
                  number="3"
                  icon={ShoppingBag}
                  title="Shop your perfect pair"
                  desc="Once you have your size, browse our collection and shop your perfect pair of Beads & Bloom footwear."
                />

              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Link 
                to="/shop" 
                className="inline-block bg-[#1C1917] text-white px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#FF2865] transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Start Shopping
              </Link>
            </div>

          </div>

        </div>

        {/* --- AEO / FAQ SECTION --- */}
        <section className="mt-20 pt-16 border-t border-gray-200" aria-label="Frequently Asked Sizing Questions">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif text-[#1C1917] mb-3">Frequently Asked Sizing Questions</h2>
            <p className="text-sm text-gray-500 font-light">Direct answers to help you choose the ideal size for maximum handcrafted comfort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {sizingFaqs.map((faq, index) => (
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

      </div>

    </div>
  );
}

// Helper Component for Steps
function Step({ number, icon: Icon, title, desc }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 relative">
        <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[#FF2865] shadow-sm z-10 relative">
          <Icon className="w-6 h-6" />
        </div>
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#FF2865] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-serif text-[#1C1917] mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}