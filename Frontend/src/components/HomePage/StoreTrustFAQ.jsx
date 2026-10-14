import { useState } from 'react';
import { ChevronDown, MapPin, Globe, ShieldCheck, Sparkles, Truck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQ_DATA = [
  {
    question: "Where is the Beads & Bloom store located in Gurgaon?",
    answer: "Our retail studio is based in Sector 15, Gurgaon (Gurugram), Haryana 122001. We welcome brides, festive shoppers, and footwear connoisseurs for bridal trials, sizing consultations, and in-person retail shopping.",
  },
  {
    question: "What range of handcrafted juttis do you offer?",
    answer: "We offer a complete collection of handcrafted Punjabi juttis and ethnic footwear. Our range spans Royal Bridal Juttis (featuring zardozi, dabka, pearls, and cut-dana work), Festive & Sangeet Party Wear Juttis, and Lightweight Casual Juttis engineered for everyday chic.",
  },
  {
    question: "Do you ship handcrafted juttis worldwide?",
    answer: "Yes, we ship globally! We regularly deliver to our valued clients across the United States (USA), United Kingdom (UK), Canada, Australia, the United Arab Emirates (UAE), Europe, and Singapore via reliable international express couriers.",
  },
  {
    question: "Do you offer Cash on Delivery (COD) and Online Payments?",
    answer: "Yes, we offer Cash on Delivery (COD) across all serviceable pincodes in India. For online payments, we support 100% secure Razorpay checkout with UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, and Net Banking.",
  },
  {
    question: "Are your juttis bite-free and comfortable for long weddings?",
    answer: "Every single pair from Beads & Bloom features our signature double-cushioned memory foam footbed and buttery-soft genuine leather lining. They are specially engineered to eliminate shoe bites and provide all-day comfort for 10+ hours.",
  },
];

export default function StoreTrustFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-[#FAF8F5] border-t border-b border-[#ECE7E1]" aria-label="Store Information and FAQs">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        
        {/* 4 Trust Highlights (USPs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#FF2865] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm md:text-base font-semibold text-[#1C1917] mb-1">Gurgaon Studio</h3>
            <p className="text-xs text-gray-500">Sector 15, Gurugram Store & Bridal Trials</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFF7E8] text-[#C5A059] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm md:text-base font-semibold text-[#1C1917] mb-1">Complete Jutti Range</h3>
            <p className="text-xs text-gray-500">Bridal, Festive & Casual Handcrafted Styles</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F0F7FF] text-[#2563EB] flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm md:text-base font-semibold text-[#1C1917] mb-1">Worldwide Delivery</h3>
            <p className="text-xs text-gray-500">Express Shipping to USA, UK, UAE & Beyond</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm md:text-base font-semibold text-[#1C1917] mb-1">COD & Online Pay</h3>
            <p className="text-xs text-gray-500">Cash on Delivery across India + Secure UPI</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
            The Beads & Bloom Experience
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1C1917] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 font-light">
            Everything you need to know about our handcrafted Punjabi juttis, our Gurgaon studio, worldwide orders, and sizing.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-gray-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base md:text-lg text-[#1C1917] font-normal">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C5A059]' : ''}`} 
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
