import { Instagram, Play, Heart } from 'lucide-react';
import { useRef, useState } from 'react';

// Configuration: 2 Photos, 1 Reel
const content = {
  photo1: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1769069569/img1_cwdqem.jpg", // Photo 1
  photo2: "https://res.cloudinary.com/dtnyrvshf/image/upload/v1769069569/img2_rssgsc.jpg", // Photo 2
  reel: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069585/vid1_kpiiu5.mp4" // The Reel
};

// Official Instagram Gradient
const instaGradientClass = "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]";

export default function InstagramFeed() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Toggle play/pause for the reel on click
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-24 px-4 bg-[#F9F8F6] relative overflow-hidden border-t border-gray-200">
      
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 bg-white px-4 py-2 rounded-full shadow-sm">
             <span className={`${instaGradientClass} bg-clip-text text-transparent`}>
                <Instagram className="w-4 h-4 text-[#833ab4]" /> 
             </span>
            <a href="https://www.instagram.com/beadsnbloom.india?igsh=MXhjdDBoeTN3ZGMxOA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer"><span className="text-[10px] font-bold uppercase tracking-widest text-brand-black">@beadsnbloom.india</span></a> 
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black">
            The Gram
          </h2>
        </div>

        {/* THE MOODBOARD LAYOUT */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: The Stacked Photos */}
          <div className="md:col-span-5 flex flex-col gap-8 relative z-10 px-4 md:px-0">
            
            {/* PHOTO 1: Tilted Left */}
            <div className="relative group w-full max-w-[320px] aspect-square bg-white p-3 shadow-xl transform rotate-[-3deg] hover:rotate-0 transition-all duration-500 ease-out hover:z-20 self-start">
               <div className="relative w-full h-full overflow-hidden bg-gray-100">
                  <img src={content.photo1} alt="Insta Photo 1" className="w-full h-full object-cover" />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Heart className="text-white w-8 h-8 fill-white" />
                  </div>
               </div>
            </div>

            {/* PHOTO 2: Tilted Right (Offset) */}
            <div className="relative group w-full max-w-[320px] aspect-[4/5] bg-white p-3 shadow-xl transform rotate-[4deg] hover:rotate-0 transition-all duration-500 ease-out hover:z-20 self-end md:-mt-12">
               <div className="relative w-full h-full overflow-hidden bg-gray-100">
                  <img src={content.photo2} alt="Insta Photo 2" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Heart className="text-white w-8 h-8 fill-white" />
                  </div>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: The Reel (Cinematic) */}
          <div className="md:col-span-7 relative z-0 md:pl-12">
             <div 
               className="relative w-full md:max-w-[400px] mx-auto aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
               onClick={togglePlay}
             >
                <video
                  ref={videoRef}
                  src={content.reel}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                
                {/* Reel UI Overlay */}
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full">
                   <Instagram className="w-5 h-5 text-white" />
                </div>
                
                {/* Play/Pause Indicator (Fades out when playing) */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                   <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                   </div>
                </div>

                {/* "Reel" Tag at bottom */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full border border-white overflow-hidden">
                      <img src="/logo.png" alt="B&B" className="w-full h-full object-cover bg-white" /> {/* Placeholder for logo */}
                   </div>
                   <span className="text-white text-xs font-bold tracking-widest drop-shadow-md">Watch Reel</span>
                </div>
             </div>
          </div>

          {/* THE STICKER: Floating Between Layers */}
          <a target="_blank"
             href="https://www.instagram.com/beadsnbloom.india?igsh=MXhjdDBoeTN3ZGMxOA%3D%3D&utm_source=qr" 
             className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group"
          >
             <div className={`
                w-28 h-28 md:w-36 md:h-36 rounded-full ${instaGradientClass} text-white 
                flex flex-col items-center justify-center text-center p-4 shadow-[0_10px_40px_-10px_rgba(255,40,101,0.5)]
                transition-transform duration-300 hover:scale-110 hover:rotate-12
             `}>
                <Instagram className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">Follow <br/>@beadsnbloom.india</span>
    
             </div>
          </a>

        </div>
      </div>
    </section>
  );
}