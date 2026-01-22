import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, Search, ShoppingBag } from 'lucide-react';

export default function SizeChart() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Replace this with your actual image URL from the chat
  const sizeChartImage = "size chart.jpeg";

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-24">
      
      {/* --- PAGE HEADER --- */}
      <div className="bg-white py-16 px-6 mb-16 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-4">Size Guide</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs">Find your perfect fit</p>
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
            
            {/* Important Note */}
            <div className="bg-[#FF2865]/10 p-8 rounded-2xl border-l-4 border-[#FF2865]">
              <h3 className="text-xl font-serif text-[#1C1917] mb-3">Important Note</h3>
              <p className="text-lg text-[#1C1917] font-medium">
                If you are in between sizes, then <span className="text-[#FF2865] font-bold">go for a size bigger.</span>
              </p>
            </div>

            {/* How to Measure Steps */}
            <div>
              <h2 className="text-3xl font-serif text-[#1C1917] mb-8">How to Measure</h2>
              <div className="space-y-8">
                
                <Step 
                  number="1"
                  icon={Ruler}
                  title="Find your foot length"
                  desc="Place a ruler flat on the floor. Measure the distance between your heel and the tip of your longest toe."
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