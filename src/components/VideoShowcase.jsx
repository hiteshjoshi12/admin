import { useState, useRef } from 'react';
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
        className="relative flex-none w-[280px] md:w-[320px] aspect-[9/16] group rounded-2xl overflow-hidden snap-center"
      >
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-cover pointer-events-none"
          autoPlay loop muted={isMuted} playsInline
        />

        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>

        <button 
          onClick={toggleAudio}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white z-20 pointer-events-auto"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-[#FF2865] text-[10px] font-bold uppercase tracking-widest mb-1">In Motion</p>
          <h3 className="text-xl font-serif">{video.title}</h3>
          <p className="text-xs text-gray-300 mt-2 border-b border-gray-400 inline-block">{video.price}</p>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-[#1C1917]">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl md:text-5xl font-serif text-white">
            Runway <span className="italic text-[#FF2865]">Edits</span>
          </h2>
          <div className="hidden md:flex text-white/50 text-xs uppercase gap-2">
            <Play className="w-3 h-3" /> Auto-playing
          </div>
        </div>

        {/* Added 'scrollbar-hide' class here */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}

          <Link to="/shop" className="flex-none w-[280px] md:w-[320px] aspect-9/16 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center snap-center">
             <div className="w-12 h-12 rounded-full border border-[#FF2865] text-[#FF2865] flex items-center justify-center mb-3">
               <ArrowUpRight className="w-5 h-5" />
             </div>
             <h3 className="text-xl font-serif text-white">View All</h3>
          </Link>

        </div>

      </div>

      {/* Internal CSS to Force Hide Scrollbars */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}



