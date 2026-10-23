import { Instagram, Play, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { InstagramSkeleton } from "../loaders/SectionLoader";
import { API_BASE_URL } from "../../util/config";
import { getOptimizedImage } from "../../util/imageUtils";
import { ImageWithShimmer, VideoWithShimmer } from "../../util/ShimmerMedia";

const defaultContent = {
  photo1: "https://ik.imagekit.io/beandandbloom/Media/img1_cwdqem.jpg",
  photo2: "https://ik.imagekit.io/beandandbloom/Media/img2_rssgsc.jpg",
  reel: "https://ik.imagekit.io/beandandbloom/Media/reel_sqyodd.mp4",
  handle: "@beadsnbloom.india",
  link: "https://www.instagram.com/beadsnbloom.india",
};

export default function InstagramFeed() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();

        if (data && data.instagram && data.instagram.photo1) {
          setFeedData({
            photo1: data.instagram.photo1,
            photo2: data.instagram.photo2 || defaultContent.photo2,
            reel: data.instagram.reel || defaultContent.reel,
            handle: data.instagram.handle || defaultContent.handle,
            link: data.instagram.profileLink || defaultContent.link,
          });
        } else {
          setFeedData(defaultContent);
        }
      } catch (error) {
        console.error("Failed to load Instagram feed:", error);
        setFeedData(defaultContent);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };

    fetchInstagramData();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) return <InstagramSkeleton />;

  return (
    <section className="py-24 md:py-32 bg-white border-t border-[#ECE7E1]" aria-label="Social Atelier Journal">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block mb-2.5">
              The Living Atelier
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1C1917]">
              Follow @beadsnbloom.india
            </h2>
          </div>

          <a 
            href={feedData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest bg-[#1C1917] text-white px-7 py-3.5 rounded-full hover:bg-[#8B5E3C] transition-colors shadow-xs"
          >
            <Instagram className="w-4 h-4" />
            <span>Join Our Community</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Editorial Media Trio Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Photos Column */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#ECE7E1] shadow-xs">
              <ImageWithShimmer
                src={getOptimizedImage(feedData.photo1, 700)}
                alt="Beads and Bloom handcrafted juttis lifestyle photography"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-xs text-white font-serif tracking-wider">Bridal Heirloom Detail</span>
              </div>
            </div>

            <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#ECE7E1] shadow-xs sm:translate-y-8">
              <ImageWithShimmer
                src={getOptimizedImage(feedData.photo2, 700)}
                alt="Festive jutti styling and embroidered footwear"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-xs text-white font-serif tracking-wider">Pure Leather Craftsmanship</span>
              </div>
            </div>
          </div>

          {/* Reel Feature Column */}
          <div className="md:col-span-5 md:pl-6">
            <div
              className="relative w-full max-w-[360px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-xl border border-gray-100 cursor-pointer group bg-black"
              onClick={togglePlay}
            >
              <VideoWithShimmer
                ref={videoRef}
                src="https://ik.imagekit.io/hiteshh12/editorial/instareel_SKbvMlxutt.webm"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Atelier craftsmanship video reel"
              />

              <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md p-2 rounded-full text-white">
                <Instagram className="w-4 h-4" />
              </div>

              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
              >
                <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white pointer-events-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full border border-white/60 overflow-hidden bg-white">
                    <img src="/logo.png" alt="B&B Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-serif font-light tracking-wide">Behind the Craft</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">Tap to Play</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
