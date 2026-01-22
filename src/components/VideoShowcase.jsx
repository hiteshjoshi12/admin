import { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const videos = [
  {
    id: 1,
    // Replace with your actual video file paths (e.g., "/videos/shoot1.mp4")
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069368/j5_ketdz3.mp4", 
    title: "Bridal BTS",
    price: "Shop The Look",
    link: "/shop"
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069341/j8_fjkfoe.mp4", 
    title: "Summer Walk",
    price: "View Collection",
    link: "/shop"
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069290/j2_hkesie.mp4", 
    title: "Festive Vibes",
    price: "Shop Festive",
    link: "/shop"
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069283/j11_t5m4rh.mp4", 
    title: "Close Up Details",
    price: "See Details",
    link: "/shop"
  }
];

export default function VideoShowcase() {
  const scrollRef = useRef(null);

  const VideoCard = ({ video }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleAudio = (e) => {
      e.preventDefault(); 
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    return (
      <Link 
        to={video.link}
        // FIX 1: Added 'snap-center' so it locks into place nicely
        className="relative flex-none w-[280px] md:w-[320px] aspect-[9/16] group rounded-2xl overflow-hidden cursor-pointer snap-center"
      >
        <video
          ref={videoRef}
          src={video.src}
          // FIX 2: Added 'pointer-events-none' so the video doesn't block your finger from scrolling
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60 group-hover:opacity-80 transition-opacity"></div>

        {/* Audio Toggle */}
        <button 
          onClick={toggleAudio}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#FF2865] transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#FF2865] text-[10px] font-bold uppercase tracking-widest mb-1">
                In Motion
              </p>
              <h3 className="text-xl font-serif text-white">{video.title}</h3>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white text-[#FF2865] flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-3 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
             <p className="text-xs text-gray-300 border-b border-gray-500 inline-block pb-1">
               {video.price}
             </p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-24 bg-[#1C1917] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF2865] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[#FF2865] text-xs font-bold uppercase tracking-widest mb-2 block">
              Campaign
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">
              Runway <span className="italic font-light text-[#FF2865]">Edits</span>
            </h2>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest">
            <Play className="w-3 h-3 fill-current" /> Auto-playing
          </div>
        </div>

        {/* FIX 3: Scroll Container - Added '-mx-6 px-6' for Edge-to-Edge scrolling on mobile */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x touch-pan-x -mx-6 px-6 md:mx-0 md:px-0"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          
          {/* End Card */}
          <div className="flex-none w-[280px] md:w-[320px] aspect-[9/16] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-colors snap-center">
            <Link to="/shop" className="p-4 w-full h-full flex flex-col items-center justify-center">
               <div className="w-16 h-16 rounded-full border border-[#FF2865] text-[#FF2865] flex items-center justify-center mb-4 group-hover:bg-[#FF2865] group-hover:text-white transition-all duration-300">
                 <ArrowUpRight className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-serif text-white mb-2">View All</h3>
               <p className="text-xs text-gray-400 uppercase tracking-widest">Stories & Reels</p>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}