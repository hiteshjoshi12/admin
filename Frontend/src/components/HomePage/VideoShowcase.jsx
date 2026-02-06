import { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../util/config';
import { getOptimizedVideo } from '../../util/videoUtils';

// Shadcn Imports
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// LOADER IMPORTS
import { VideoScrollSkeleton } from '../loaders/SectionLoader';

// --- SEO OPTIMIZED FALLBACK DATA (JUTTI ONLY) ---
const fallbackVideos = [
  {
    _id: 1,
    videoUrl: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069368/j5_ketdz3.mp4", 
    title: "Handcrafted Bridal Juttis", 
    ctaText: "Shop Bridal Edit",
    link: "/shop?category=Bridal"
  },
  {
    _id: 2,
    videoUrl: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069341/j8_fjkfoe.mp4", 
    title: "Daily Wear Punjabi Juttis", 
    ctaText: "View Collection",
    link: "/shop?category=Everyday"
  },
  {
    _id: 3,
    videoUrl: "https://res.cloudinary.com/dtnyrvshf/video/upload/v1769069290/j2_hkesie.mp4", 
    title: "Festive Embroidered Juttis", 
    ctaText: "Shop Festive",
    link: "/shop?category=Festive"
  }
];

export default function VideoShowcase() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cms/runway`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          setVideos(data);
        } else {
          setVideos(fallbackVideos);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
        setVideos(fallbackVideos);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchVideos();
  }, []);

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
      <Link to={video.link || '/shop'}>
        <Card className="relative w-[280px] md:w-[320px] aspect-[9/16] overflow-hidden border-0 rounded-2xl bg-black/5 group cursor-pointer snap-center">
          <CardContent className="p-0 h-full">
            <video
              ref={videoRef}
              src={getOptimizedVideo(video.videoUrl, 720)}
              className="w-full h-full object-cover pointer-events-none"
              autoPlay 
              loop 
              muted 
              playsInline
              aria-label={`Video showcasing ${video.title}`}
            />

            <div className="absolute inset-0 bg-black/40 md:bg-black/20 md:group-hover:bg-black/40 transition-all duration-300"></div>

            <Button
              variant="ghost"
              size="icon"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute top-4 right-4 rounded-full bg-white/20 text-white hover:bg-white hover:text-[#FF2865] z-20 pointer-events-auto h-8 w-8"
              onClick={toggleAudio}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <Badge 
                variant="secondary" 
                className="bg-transparent border border-white/30 text-[#FF2865] hover:bg-white/10 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm"
              >
                Runway
              </Badge>
              
              <h3 className="text-xl font-serif font-medium leading-tight">{video.title}</h3>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <p className="text-xs text-gray-300 font-medium">{video.ctaText}</p>
                <ArrowUpRight className="w-4 h-4 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading) return <VideoScrollSkeleton />;

  return (
    <section className="py-16 md:py-24 bg-[#1C1917]">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl md:text-5xl font-serif text-white">
            Juttis in <span className="italic text-[#FF2865]">Motion</span>
          </h2>
          <Badge variant="outline" className="hidden md:flex gap-2 border-white/20 text-white/50 text-xs py-1 px-3">
            <Play className="w-3 h-3 fill-current" /> Auto-playing
          </Badge>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-4 pb-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}

            <Link to="/shop">
              <Card className="w-[280px] md:w-[320px] aspect-[9/16] rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center snap-center">
                  <div className="w-12 h-12 rounded-full border border-[#FF2865] text-[#FF2865] flex items-center justify-center mb-4">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif text-white">Shop All Juttis</h3>
                  <p className="text-xs text-gray-500 mt-1">Explore the collection</p>
              </Card>
            </Link>
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
    </section>
  );
}