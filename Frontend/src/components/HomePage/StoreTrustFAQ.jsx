import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '../../data/faqData';
export { FAQ_DATA };

const TRUST_HALLMARKS = [
  {
    number: "01",
    title: "Handcrafted Heritage",
    subtitle: "Authentic Karigar Work",
    detail: "Handmade on traditional Punjabi wooden lasts with genuine leather soles."
  },
  {
    number: "02",
    title: "Bite-Free Comfort",
    subtitle: "Double Foam Cushioning",
    detail: "Dual memory padding protects against blisters during long wedding events."
  },
  {
    number: "03",
    title: "Worldwide Express",
    subtitle: "Doorstep International Delivery",
    detail: "Fast insured shipping to USA, UK, Canada, Australia, and the UAE."
  },
  {
    number: "04",
    title: "Pan-India COD",
    subtitle: "Hassle-Free Exchange",
    detail: "Cash on delivery available nationwide."
  }
];

export default function StoreTrustFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F5] border-t border-b border-[#ECE7E1]" aria-label="Store Information and FAQs">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">

        {/* 4 Clean Editorial Hallmarks (No colored bubble icons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TRUST_HALLMARKS.map((item) => (
            <div
              key={item.number}
              className="bg-white p-7 rounded-3xl border border-[#EAE3D2] shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md"
            >
              <div>
                <span className="font-serif text-2xl text-[#C5A059] block mb-2 font-light">
                  {item.number}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B5E3C] block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917] mb-2">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] block mb-2.5">
            Client Assistance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1917] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Essential information regarding sizing, worldwide shipping, bridal customization, and care.
          </p>
        </div>

        {/* Minimalist Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#EAE3D2] overflow-hidden shadow-xs transition-all duration-300 hover:border-[#1C1917]/30"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-7 py-5 flex items-center justify-between text-left gap-4 hover:bg-[#FAF8F5]/60 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-[#1C1917]">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full border border-gray-200 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1C1917] text-white border-[#1C1917]' : 'text-gray-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-7 pb-6 pt-1 text-sm text-gray-600 font-light leading-relaxed border-t border-gray-100/60">
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
