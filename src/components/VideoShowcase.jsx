import { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Shadcn Imports
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const videos = [
  {
    id: 1,
    // Added: f_auto,q_auto,w_720,br_2m
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069368/j5_ketdz3.mp4", 
    title: "Bridal BTS",
    price: "Shop The Look",
    link: "/shop"
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069341/j8_fjkfoe.mp4", 
    title: "Summer Walk",
    price: "View Collection",
    link: "/shop"
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069290/j2_hkesie.mp4", 
    title: "Festive Vibes",
    price: "Shop Festive",
    link: "/shop"
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dtnyrvshf/video/upload/f_auto,q_auto,w_720,br_2m/v1769069283/j11_t5m4rh.mp4", 
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
      <Link to={video.link}>
        <Card className="relative w-[280px] md:w-[320px] aspect-[9/16] overflow-hidden border-0 rounded-2xl bg-black/5 group cursor-pointer snap-center">
          <CardContent className="p-0 h-full">
            <video
              ref={videoRef}
              src={video.src}
              className="w-full h-full object-cover pointer-events-none"
              autoPlay loop muted={isMuted} playsInline
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 md:bg-black/20 md:group-hover:bg-black/40 transition-all duration-300"></div>

            {/* Audio Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-white/20 text-white hover:bg-white hover:text-[#FF2865] z-20 pointer-events-auto h-8 w-8"
              onClick={toggleAudio}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            {/* Bottom Content */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <Badge 
                variant="secondary" 
                className="bg-transparent border border-white/30 text-[#FF2865] hover:bg-white/10 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm"
              >
                In Motion
              </Badge>
              
              <h3 className="text-xl font-serif font-medium leading-tight">{video.title}</h3>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <p className="text-xs text-gray-300 font-medium">{video.price}</p>
                <ArrowUpRight className="w-4 h-4 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-[#1C1917]">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl md:text-5xl font-serif text-white">
            Runway <span className="italic text-[#FF2865]">Edits</span>
          </h2>
          <Badge variant="outline" className="hidden md:flex gap-2 border-white/20 text-white/50 text-xs py-1 px-3">
            <Play className="w-3 h-3 fill-current" /> Auto-playing
          </Badge>
        </div>

        {/* Shadcn Scroll Area */}
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-4 pb-4">
            
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}

            {/* View All Card */}
            <Link to="/shop">
              <Card className="w-[280px] md:w-[320px] aspect-[9/16] rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center snap-center">
                 <div className="w-12 h-12 rounded-full border border-[#FF2865] text-[#FF2865] flex items-center justify-center mb-4">
                   <ArrowUpRight className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-serif text-white">View All</h3>
                 <p className="text-xs text-gray-500 mt-1">Explore all stories</p>
              </Card>
            </Link>

          </div>
          
          {/* This hides the scrollbar visually but keeps scrolling enabled */}
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>

      </div>
    </section>
  );
}