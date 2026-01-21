import { Instagram } from 'lucide-react';

const posts = [
  // Removed hardcoded rotations for mobile (added 'md:' prefix to rotation classes)
  { id: 1, img: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=600", style: "md:rotate-[-2deg] md:col-span-2 md:row-span-2 h-[300px] md:h-[500px]" }, 
  { id: 2, img: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=600", style: "md:rotate-[3deg] md:mt-12 h-[200px] md:h-[300px] z-10 shadow-xl" }, 
  { id: 3, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600", style: "md:rotate-[-1deg] h-[200px] md:h-[400px]" }, 
  { id: 4, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600", style: "md:rotate-[2deg] md:-mt-24 h-[200px] md:h-[350px] z-20 shadow-lg" }, 
  { id: 5, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600", style: "md:rotate-[-3deg] h-[200px] md:h-[300px]" }, 
];

// The official Instagram Gradient configuration
const instaGradientClass = "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]";

export default function InstagramFeed() {
  return (
    <section className="py-12 md:py-24 px-4 bg-[#F9F8F6] relative overflow-hidden border-t border-gray-200">
      
      {/* Decorative Stamp Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
           <path fill="#C5A059" d="M42.7,-62.3C54.1,-52.3,61.3,-38.4,66.6,-23.8C71.9,-9.2,75.3,6.1,71.8,19.4C68.4,32.7,58.1,43.9,46,52.4C33.9,60.9,20,66.6,5.2,68.3C-9.5,70,-24.1,67.6,-37.4,60.1C-50.7,52.6,-62.8,39.9,-70.2,24.5C-77.5,9.1,-80.2,-9,-75.5,-24.4C-70.8,-39.8,-58.8,-52.5,-44.8,-61.1C-30.9,-69.7,-15.4,-74.2,-0.2,-74.5C15,-74.8,31.3,-67.2,42.7,-62.3Z" transform="translate(100 100)" />
         </svg>
      </div>

      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Container */}
        <div className="text-center relative z-30 mb-8 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 bg-white px-4 py-2 rounded-full shadow-sm">
            {/* Using a simpler icon approach for stability */}
            <span className={`${instaGradientClass} bg-clip-text text-transparent`}>
              <Instagram className="w-4 h-4 text-[#833ab4]" /> {/* Fallback color if clip fails */}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black">@BeadsAndBloom</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-black mb-6">
            As Seen On You
          </h2>
        </div>

        {/* The Collage Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10 p-2 md:p-4">
            
            {posts.map((post) => (
              <div 
                key={post.id} 
                className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-500 
                  /* DESKTOP HOVER: Rotate to 0, Scale up */
                  md:hover:rotate-0 md:hover:scale-105 md:hover:shadow-2xl md:hover:z-50
                  
                  /* MOBILE DEFAULT: No rotation, normal scale */
                  rotate-0 scale-100 shadow-md
                  
                  /* Apply per-post custom styles (mostly rotations) only on MD screens */
                  ${post.style}
                `}
              >
                <img src={post.img} alt="Instagram Post" className="w-full h-full object-cover" />
                
                {/* Overlay: Always visible on mobile (slight dark tint), visible on hover for desktop */}
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300
                  bg-black/20 opacity-100  /* Mobile: Visible tint */
                  md:bg-black/40 md:opacity-0 md:group-hover:opacity-100 /* Desktop: Hidden until hover */
                ">
                   <Instagram className="text-white w-6 h-6 md:w-8 md:h-8 drop-shadow-lg" />
                </div>
              </div>
            ))}
            
            {/* Circular Sticker: Bottom Right on Mobile to avoid blocking content */}
            <a href="#" className="
              absolute z-40 group
              /* Mobile Position: Bottom Right, Fixed Size */
              bottom-0 right-4 translate-y-1/2
              
              /* Desktop Position: Center, Centered transform */
              md:top-1/2 md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2
            ">
              <div className={`
                w-24 h-24 md:w-40 md:h-40 rounded-full ${instaGradientClass} text-white 
                flex flex-col items-center justify-center text-center p-4 shadow-xl 
                transition-transform duration-300 
                active:scale-95 /* Mobile Click Effect */
                md:group-hover:scale-110 md:hover:rotate-12
              `}>
                <Instagram className="w-5 h-5 md:w-7 md:h-7 mb-1 md:mb-2" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-tight">Follow <br/> The Brand</span>
              </div>
            </a>

        </div>
      </div>
    </section>
  );
}