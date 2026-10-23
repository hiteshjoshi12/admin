export default function EditorialBanner() {
  const hallmarks = [
    "Pure Leather Soles",
    "Dual Memory Cushioning",
    "Bite-Free Guarantee",
    "Generational Karigar Craft",
    "Worldwide Express Delivery",
    "Cash on Delivery Across India"
  ];

  return (
    <div className="bg-[#1C1917] text-[#FAF8F5] py-4 border-y border-[#332E2A] overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 sm:gap-x-8 text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-stone-300">
          {hallmarks.map((item, index) => (
            <div key={item} className="flex items-center gap-6 sm:gap-8">
              <span>{item}</span>
              {index < hallmarks.length - 1 && (
                <span className="text-[#C5A059] font-sans text-xs">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
