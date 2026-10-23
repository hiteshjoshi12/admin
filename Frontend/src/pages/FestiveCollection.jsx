import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Heart, 
  Sparkles, 
  Crown,
  Sun,
  Gem,
  Tag,
  ShieldCheck, 
  Truck, 
  Star, 
  Layers, 
  Award, 
  ArrowRight, 
  SlidersHorizontal, 
  Check, 
  BookOpen, 
  X, 
  MessageCircle 
} from "lucide-react";
import { getOptimizedImage } from "../util/imageUtils";
import { toast } from "react-hot-toast";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistAPI, toggleWishlistLocal } from "../redux/wishlistSlice";
import { API_BASE_URL } from "../util/config";
import SEO from "../components/seo/SEO";
import { 
  getCollectionSchema, 
  getBreadcrumbSchema, 
  getFAQSchema,
  getItemListSchema 
} from "../components/seo/schemaUtils";
import { defaultFestiveContent } from "../data/defaultFestiveContent";

export default function FestiveCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [activeVibe, setActiveVibe] = useState("all");
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Dynamic CMS Content State (loaded from backend DB with robust fallbacks)
  const [cmsContent, setCmsContent] = useState(defaultFestiveContent);

  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Dynamic data derivations from CMS
  const occasions = useMemo(() => {
    return (cmsContent.occasions && cmsContent.occasions.length > 0)
      ? cmsContent.occasions
      : defaultFestiveContent.occasions;
  }, [cmsContent.occasions]);

  const craftPillars = useMemo(() => {
    return (cmsContent.craftPillars && cmsContent.craftPillars.length > 0)
      ? cmsContent.craftPillars
      : defaultFestiveContent.craftPillars;
  }, [cmsContent.craftPillars]);

  const reviews = useMemo(() => {
    return (cmsContent.reviews && cmsContent.reviews.length > 0)
      ? cmsContent.reviews
      : defaultFestiveContent.reviews;
  }, [cmsContent.reviews]);

  const faqs = useMemo(() => {
    return (cmsContent.faqs && cmsContent.faqs.length > 0)
      ? cmsContent.faqs
      : defaultFestiveContent.faqs;
  }, [cmsContent.faqs]);

  const hero = cmsContent.hero || defaultFestiveContent.hero;
  const trustPoints = (cmsContent.trustPoints && cmsContent.trustPoints.length > 0)
    ? cmsContent.trustPoints
    : defaultFestiveContent.trustPoints;

  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0]?.id || "sangeet");

  // Keep selected occasion valid if list is updated in CMS
  useEffect(() => {
    if (occasions.length > 0 && !occasions.some((o) => o.id === selectedOccasion)) {
      setSelectedOccasion(occasions[0].id);
    }
  }, [occasions, selectedOccasion]);

  // Fetch CMS content from backend
  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        if (data && data.festiveContent && data.festiveContent.occasions?.length) {
          setCmsContent(data.festiveContent);
        }
      } catch (err) {
        console.error("Failed to load CMS content, using defaults", err);
      }
    };
    fetchCMS();
  }, []);

  // Fetch all festive products
  useEffect(() => {
    const fetchFestiveProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?category=festive&pageSize=100&sort=${sortOption}`);
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
      } catch (err) {
        console.error("Failed to fetch festive products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFestiveProducts();
  }, [sortOption]);

  // Vibe Filter Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeVibe === "mirror") {
      list = list.filter((p) => {
        const text = `${p.name} ${p.slug} ${p.description || ""}`.toLowerCase();
        return text.includes("sheesh") || text.includes("mirror") || text.includes("aaina");
      });
    } else if (activeVibe === "zardozi") {
      list = list.filter((p) => {
        const text = `${p.name} ${p.slug} ${p.description || ""}`.toLowerCase();
        return (
          text.includes("zardozi") || 
          text.includes("dabka") || 
          text.includes("zari") || 
          text.includes("zareen") ||
          text.includes("tajvira")
        );
      });
    } else if (activeVibe === "haldi") {
      list = list.filter((p) => {
        const text = `${p.name} ${p.slug} ${p.description || ""}`.toLowerCase();
        return (
          text.includes("peela") || 
          text.includes("peacock") || 
          text.includes("pari") || 
          text.includes("rang") ||
          text.includes("gul-kairi")
        );
      });
    } else if (activeVibe === "velvet") {
      list = list.filter((p) => {
        const text = `${p.name} ${p.slug} ${p.description || ""}`.toLowerCase();
        return (
          text.includes("velvet") || 
          text.includes("rani") || 
          text.includes("surkh") || 
          text.includes("ruby") || 
          text.includes("mirage") ||
          text.includes("sheesh-noir")
        );
      });
    } else if (activeVibe === "under3500") {
      list = list.filter((p) => p.price <= 3500);
    }

    // Client-side Sort
    return list.sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      if (sortOption === "popular") return (b.numReviews || 0) - (a.numReviews || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, activeVibe, sortOption]);

  // Vibe counter helper
  const vibeCounts = useMemo(() => {
    return {
      all: products.length,
      mirror: products.filter((p) => {
        const t = `${p.name} ${p.slug}`.toLowerCase();
        return t.includes("sheesh") || t.includes("mirror") || t.includes("aaina");
      }).length,
      zardozi: products.filter((p) => {
        const t = `${p.name} ${p.slug}`.toLowerCase();
        return t.includes("zardozi") || t.includes("dabka") || t.includes("zari") || t.includes("zareen");
      }).length,
      haldi: products.filter((p) => {
        const t = `${p.name} ${p.slug}`.toLowerCase();
        return t.includes("peela") || t.includes("peacock") || t.includes("pari") || t.includes("rang");
      }).length,
      velvet: products.filter((p) => {
        const t = `${p.name} ${p.slug}`.toLowerCase();
        return t.includes("velvet") || t.includes("rani") || t.includes("surkh") || t.includes("ruby") || t.includes("mirage");
      }).length,
      under3500: products.filter((p) => p.price <= 3500).length,
    };
  }, [products]);

  // Currently selected occasion object
  const activeOccasionData = useMemo(() => {
    return occasions.find((o) => o.id === selectedOccasion) || occasions[0] || defaultFestiveContent.occasions[0];
  }, [occasions, selectedOccasion]);

  // Structured Data Schemas for Google Rich Results
  const collectionSchema = {
    "@context": "https://schema.org",
    "@graph": [
      getCollectionSchema(
        hero?.title || "The Festive Edit — Handcrafted Festive Juttis & Sangeet Mojris",
        hero?.subtitle || "Celebrate India's most joyous moments in handcrafted splendor.",
        "/collection/festive"
      ),
      getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        { name: "Festive Juttis", url: "/collection/festive" },
      ]),
      getFAQSchema(faqs),
      getItemListSchema(filteredProducts.slice(0, 16), "Handcrafted Festive Juttis & Party Wear Mojris"),
    ],
  };

  const TRUST_ICONS = [Sparkles, ShieldCheck, Award, Truck];

  return (
    <div className="min-h-screen mt-23 bg-[#FAF8F5] text-[#1C1917] transition-colors duration-700 selection:bg-[#C5A059]/20 selection:text-[#1C1917]">
      <SEO
        title="Buy Festive Juttis Online — Handcrafted Party Wear Mojris | Beads and Bloom"
        description="Shop luxury handcrafted festive juttis & party wear mojris at Beads and Bloom. Featuring authentic mirror work (sheesha), zardozi, dabka & double-cushioned memory foam soles. Cash on delivery & express shipping across India."
        canonical="/collection/festive"
        keywords="buy festive juttis online, festive juttis, party wear mojris, sangeet footwear, punjabi juttis for women, mirror work juttis, comfortable wedding flats, ethnic mojari India, haldi footwear, mehendi juttis, designer celebration footwear"
        schema={collectionSchema}
      />

      {/* --- LUXURY ATELIER HERO (CLEAN, AIRY, EDITORIAL) --- */}
      <section className="relative w-full pt-8 pb-10 md:pt-12 md:pb-14 px-6 md:px-12 bg-gradient-to-b from-[#FBF8F2] via-[#FAF6ED] to-[#FAF8F5] border-b border-[#EAE0D0]/80">
        <div className="max-w-5xl mx-auto text-center">
          {/* Visual Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            <Link to="/" className="hover:text-[#1C1917] transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <Link to="/shop" className="hover:text-[#1C1917] transition-colors">Shop</Link>
            <span className="opacity-40">/</span>
            <span className="text-[#1C1917] font-bold">The Festive Edit</span>
          </nav>

          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0DC] border border-[#E4CE9E] text-[#8A5B28] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>{hero?.eyebrow || "The Celebration Atelier"}</span>
          </div>

          {/* Main H1 Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-tight mb-4">
            {hero?.title || "Handcrafted Festive Juttis & Sangeet Mojris"}
          </h1>

          {/* Concise Lead Paragraph */}
          <p className="text-sm md:text-base text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-5">
            {hero?.subtitle || "Celebrate India’s joyful weddings, sangeet dances, and festive galas in artisanal luxury. Masterfully hand-embroidered with authentic mirror work, dabka, and zardozi, engineered with our signature bite-free double memory foam cushioning."}
          </p>

          {/* Expandable Editorial Story Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setIsStoryExpanded(!isStoryExpanded)}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B5E3C] hover:text-[#1C1917] transition-colors cursor-pointer py-1.5 px-4 rounded-full border border-[#EAE0D0] hover:bg-white bg-white/60 shadow-xs"
              aria-expanded={isStoryExpanded}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isStoryExpanded ? "Close Atelier Story" : "Read The Atelier Story & Craft"}</span>
              {isStoryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Collapsible Story Card with Visuals */}
            {isStoryExpanded && (
              <div className="mt-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE0D0] shadow-sm max-w-4xl mx-auto text-left text-xs sm:text-sm text-gray-700 leading-relaxed font-light animate-fade-in relative overflow-hidden">
                <button
                  onClick={() => setIsStoryExpanded(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer p-1"
                  aria-label="Close story"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                        {hero?.storyTitle || "Artisan Heritage & Craft"}
                      </span>
                    </div>
                    <p className="mb-3 text-gray-700">
                      {hero?.storyParagraph1 || "Celebrate India’s most joyous moments in handcrafted splendor. At Beads & Bloom, our festive jutti collection is born from an obsession with authentic Punjabi karigari and modern orthopedic comfort. Every pair is individually hand-embroidered by master artisans using genuine raw silks, plush micro-velvet, metallic dabka wire, sitara sequins, and authentic sheesha mirror work."}
                    </p>
                    <p className="text-gray-700">
                      {hero?.storyParagraph2 || "Built on 100% genuine vegetable-tanned leather soles with our signature dual-layer memory foam footbed, experience 10+ hours of continuous, bite-free dancing through wedding sangeets, haldi ceremonies, and Diwali galas. Step into all-day celebration luxury designed to keep you shining from dusk till dawn."}
                    </p>
                  </div>
                  <div className="md:col-span-4 rounded-2xl overflow-hidden aspect-[4/3] bg-[#FAF8F5] border border-[#EAE0D0]">
                    <img
                      src={hero?.storyImage || "https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1867_zDyUavPbR.jpeg"}
                      alt="Artisan Handcrafted Zari & Pearl Detail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Minimalist Trust Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-[11px] font-medium text-gray-600 pt-4 border-t border-[#EAE0D0]/60">
            {trustPoints.map((pointText, idx) => {
              const IconComp = TRUST_ICONS[idx % TRUST_ICONS.length];
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  <IconComp className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{pointText}</span>
                  {idx < trustPoints.length - 1 && (
                    <span className="hidden sm:inline text-gray-300 ml-3.5">•</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- STICKY FILTER TOOLBAR (WITH BULLETPROOF NO-SCROLLBAR RULES & CLEAN ICONS) --- */}
      <div className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8D9C0] px-4 md:px-12 py-3 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Quick Vibe Filter Chips (Zero Emojis, Pure Lucide Vector Icons) */}
          <div 
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide no-scrollbar py-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => setActiveVibe("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeVibe === "all"
                  ? "bg-[#1C1917] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-[#F3EDE2] border border-[#E8D9C0]"
              }`}
            >
              <span>All Festive</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeVibe === "all" ? "bg-white/20 text-white" : "bg-[#F3EDE2] text-gray-600"}`}>
                {vibeCounts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveVibe("mirror")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeVibe === "mirror"
                  ? "bg-[#C5A059] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-[#F3EDE2] border border-[#E8D9C0]"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeVibe === "mirror" ? "text-white" : "text-[#C5A059]"}`} />
              <span>Mirror Work</span>
              {vibeCounts.mirror > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeVibe === "mirror" ? "bg-white/20 text-white" : "bg-[#F3EDE2] text-gray-600"}`}>
                  {vibeCounts.mirror}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveVibe("zardozi")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeVibe === "zardozi"
                  ? "bg-[#C5A059] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-[#F3EDE2] border border-[#E8D9C0]"
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${activeVibe === "zardozi" ? "text-white" : "text-[#C5A059]"}`} />
              <span>Zardozi & Dabka</span>
              {vibeCounts.zardozi > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeVibe === "zardozi" ? "bg-white/20 text-white" : "bg-[#F3EDE2] text-gray-600"}`}>
                  {vibeCounts.zardozi}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveVibe("haldi")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeVibe === "haldi"
                  ? "bg-[#C5A059] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-[#F3EDE2] border border-[#E8D9C0]"
              }`}
            >
              <Sun className={`w-3.5 h-3.5 ${activeVibe === "haldi" ? "text-white" : "text-[#C5A059]"}`} />
              <span>Haldi & Mehendi</span>
              {vibeCounts.haldi > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeVibe === "haldi" ? "bg-white/20 text-white" : "bg-[#F3EDE2] text-gray-600"}`}>
                  {vibeCounts.haldi}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveVibe("velvet")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeVibe === "velvet"
                  ? "bg-[#C5A059] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-[#F3EDE2] border border-[#E8D9C0]"
              }`}
            >
              <Gem className={`w-3.5 h-3.5 ${activeVibe === "velvet" ? "text-white" : "text-[#C5A059]"}`} />
              <span>Royal Velvet</span>
              {vibeCounts.velvet > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeVibe === "velvet" ? "bg-white/20 text-white" : "bg-[#F3EDE2] text-gray-600"}`}>
                  {vibeCounts.velvet}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveVibe("under3500")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeVibe === "under3500"
                  ? "bg-[#C5A059] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-[#F3EDE2] border border-[#E8D9C0]"
              }`}
            >
              <Tag className={`w-3.5 h-3.5 ${activeVibe === "under3500" ? "text-white" : "text-[#C5A059]"}`} />
              <span>Under ₹3,500</span>
              {vibeCounts.under3500 > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeVibe === "under3500" ? "bg-white/20 text-white" : "bg-[#F3EDE2] text-gray-600"}`}>
                  {vibeCounts.under3500}
                </span>
              )}
            </button>
          </div>

          {/* Counts & Sort Selector */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Design" : "Designs"}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-[#E8D9C0] text-[11px] font-medium text-gray-800 py-1.5 pl-3 pr-7 rounded-lg cursor-pointer outline-none hover:border-[#C5A059] transition-colors"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Loved</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-12 py-10 md:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Curating Festive Designs...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FAF0DC] text-[#C5A059] flex items-center justify-center mx-auto mb-3">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-[#1C1917] mb-2">No Festive Pairs Found</h3>
            <p className="text-xs text-gray-600 mb-5">No designs match this filter. Clear filters to explore all pairs.</p>
            <button
              onClick={() => setActiveVibe("all")}
              className="px-5 py-2 rounded-full bg-[#1C1917] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-7 md:gap-y-14">
            {filteredProducts.map((product) => (
              <FestiveProductCard 
                key={product._id} 
                product={product} 
                wishlist={wishlistItems} 
              />
            ))}
          </div>
        )}

        {/* --- OCCASION STYLING STUDIO (NO UGLY SCROLLBAR + RICH VISUAL LOOKBOOK) --- */}
        <section className="mt-20 pt-14 border-t border-[#E8D9C0]" aria-label="Festive Styling Studio">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1.5">
              Curated Wardrobe Pairings
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mb-2">
              How to Style Juttis for Indian Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light">
              Select an occasion below for expert footwear styling advice and recommended handcrafted silhouettes.
            </p>
          </div>

          {/* Interactive Occasion Tabs (Flex Wrap & Zero Ugly Scrollbar) */}
          <div 
            className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-8 px-2 scrollbar-hide no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {occasions.map((occ) => (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  selectedOccasion === occ.id
                    ? "bg-[#1C1917] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-[#EAE0D0] hover:border-[#C5A059]"
                }`}
              >
                {occ.badge}
              </button>
            ))}
          </div>

          {/* Spotlight Occasion Feature Card (Visual Lookbook Layout) */}
          <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden border border-[#EAE0D0] shadow-sm animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Hero Editorial Photography of the Featured Silhouette */}
              <div className="lg:col-span-5 relative bg-[#F7F3EC] min-h-[320px] lg:min-h-[440px] overflow-hidden group">
                <img
                  src={activeOccasionData.heroImage}
                  alt={activeOccasionData.heroName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle Gradient & Badge Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E4CE9E] mb-1">
                    Featured Silhouette
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-normal mb-1">
                    {activeOccasionData.heroName}
                  </h4>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold">₹{Number(activeOccasionData.heroPrice).toLocaleString()}</span>
                    <Link
                      to={`/product/${activeOccasionData.heroSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#1C1917] text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-white transition-colors"
                    >
                      <span>View Pair</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Styling Narrative & Recommended Pairs Grid */}
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FAF4EA] text-[#8A5B28] text-[10px] font-bold uppercase tracking-wider border border-[#EEDFC8]">
                      {activeOccasionData.badge}
                    </span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-[#C5A059] font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Stylist Guidance
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] mb-3 leading-snug">
                    {activeOccasionData.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light mb-5">
                    {activeOccasionData.desc}
                  </p>

                  {/* Outfit Pairing Advice */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE0D0]/80 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Recommended Ensemble Pairings:
                    </span>
                    <p className="text-xs text-[#8B5E3C] font-medium leading-relaxed">
                      {activeOccasionData.pairing}
                    </p>
                  </div>
                </div>

                {/* Visual Recommended Pairs Grid */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                    Explore Curated Pairs for This Occasion:
                  </span>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {(activeOccasionData.recommended || []).map((item, idx) => (
                      <Link
                        key={idx}
                        to={`/product/${item.slug}`}
                        className="group/item flex flex-col p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF0DC]/60 border border-[#EAE0D0]/70 hover:border-[#C5A059]/40 transition-all text-center"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-[#EFE8DD] relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-[#1C1917] group-hover/item:text-[#8B5E3C] transition-colors line-clamp-1">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">₹{Number(item.price).toLocaleString()}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- THE ANATOMY OF A FESTIVE JUTTI (WITH HIGH-DEF CRAFT IMAGERY) --- */}
        <section className="mt-20 py-12 px-6 sm:px-10 bg-white rounded-3xl border border-[#EAE0D0]" aria-label="Craftsmanship Anatomy">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              Artisanal Craftsmanship
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">
              The Anatomy of a Festive Jutti
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-light">
              Crafted with authentic hand techniques for exceptional beauty and dance-ready comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {craftPillars.map((pillar, idx) => (
              <div key={idx} className="flex flex-col bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#EAE0D0]/80 group hover:shadow-sm transition-all">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFE8DD] relative">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                      {pillar.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="w-6 h-6 rounded-full bg-white/90 text-[#C5A059] font-serif font-bold text-xs flex items-center justify-center shadow-xs">
                      {pillar.number}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base text-[#1C1917] mb-1.5">{pillar.title}</h3>
                    <p className="text-xs text-gray-600 font-light leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[11px] text-gray-500 font-medium">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C5A059]" /> 100% Handcrafted in India</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C5A059]" /> Tested Snag-Free for Fine Lehengas</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C5A059]" /> Zero Harsh Chemicals or Synthetic Lining</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#C5A059]" /> True-to-Size Indian Foot Dimensions</span>
          </div>
        </section>

        {/* --- REAL CUSTOMER REVIEWS (WITH PRODUCT VISUALS) --- */}
        <section className="mt-20" aria-label="Customer Reviews">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              Customer Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">
              Loved on the Dance Floor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {reviews.map((rev, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#EAE0D0] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#C5A059] mb-3">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                    "{rev.review}"
                  </p>
                </div>
                
                {/* Reviewer & Product Mini Card */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1917]">{rev.name}</h4>
                    <span className="text-[10px] text-gray-400">{rev.city}</span>
                  </div>

                  <Link 
                    to={`/product/${rev.slug}`}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF0DC]/80 transition-colors border border-[#EAE0D0]/80 group"
                  >
                    <img 
                      src={rev.image} 
                      alt={rev.product} 
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="text-[10px] font-semibold text-[#8B5E3C] pr-1 group-hover:text-[#1C1917]">
                      {rev.product}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FREQUENTLY ASKED QUESTIONS & CONCIERGE (2-COLUMN SPLIT) --- */}
        <section className="mt-20 max-w-5xl mx-auto" aria-label="Frequently Asked Questions">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sizing Concierge & Promise Card */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE0D0] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
                Assistance & Sizing
              </span>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-3">
                Festive FAQs & Fit Concierge
              </h2>
              <p className="text-xs text-gray-600 font-light leading-relaxed mb-5">
                Have questions regarding comfort, lehenga coordination, or selecting sizes for broad feet? Connect with our studio stylist.
              </p>
              
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C1917] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact Sizing Concierge</span>
              </Link>
            </div>

            {/* Right Column: Sleek FAQ Accordion */}
            <div className="lg:col-span-8 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl border border-[#EAE0D0] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-sm sm:text-base text-[#1C1917] font-medium leading-snug">
                        {faq.question}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#FAF4EA] text-[#C5A059] flex items-center justify-center shrink-0 border border-[#EEDFC8]">
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 animate-fade-in font-light">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- EXPLORE OTHER CURATED EDITS (MINIMALIST GALLERY STRIP) --- */}
        <section className="mt-20 pt-12 border-t border-[#E8D9C0]" aria-label="Other Collections">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              Curated Edits
            </span>
            <h2 className="text-2xl font-serif text-[#1C1917]">
              Explore Other Handcrafted Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <Link
              to="/collection/bridal"
              className="p-5 rounded-2xl bg-white border border-[#EAE0D0] shadow-xs hover:shadow-md transition-all text-center group"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5A059] block mb-1">Wedding Trousseau</span>
              <h3 className="font-serif text-base text-[#1C1917] group-hover:text-[#C5A059] transition-colors mb-1">
                The Bridal Edit
              </h3>
              <p className="text-xs text-gray-500 mb-2">Royal Zardosi & Dabka Mojris</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C]">
                Explore Bridal Designs <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              to="/collection/casual"
              className="p-5 rounded-2xl bg-white border border-[#EAE0D0] shadow-xs hover:shadow-md transition-all text-center group"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5A059] block mb-1">Everyday Chic</span>
              <h3 className="font-serif text-base text-[#1C1917] group-hover:text-[#C5A059] transition-colors mb-1">
                Everyday Chic
              </h3>
              <p className="text-xs text-gray-500 mb-2">Minimalist Threadwork & Work Flats</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C]">
                Explore Casual Pairs <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              to="/shop"
              className="p-5 rounded-2xl bg-[#1C1917] text-white shadow-xs hover:bg-black transition-all text-center group flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5A059] block mb-1">Master Catalog</span>
                <h3 className="font-serif text-base text-white mb-1">
                  Complete Catalog
                </h3>
                <p className="text-xs text-gray-300">Browse All 34 Handcrafted Pairs</p>
              </div>
              <span className="inline-flex items-center justify-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                Shop Master Catalog <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-gray-500">
            <Link to="/size-chart" className="hover:text-[#1C1917] underline underline-offset-4">Jutti Size Guide & Foot Measurement</Link>
            <span>•</span>
            <Link to="/care-guide" className="hover:text-[#1C1917] underline underline-offset-4">Embroidered Jutti Cleaning & Care Guide</Link>
            <span>•</span>
            <Link to="/sale" className="hover:text-[#1C1917] underline underline-offset-4">Archive Festive Sale (Exclusive Offers)</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- LUXURY FESTIVE PRODUCT CARD ---
function FestiveProductCard({ product, wishlist }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const isWishlisted = Array.isArray(wishlist) && wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.totalStock === 0;

  const optimizedMain = getOptimizedImage(product.image, 600);
  const optimizedHover = product.images?.[1] ? getOptimizedImage(product.images[1], 600) : optimizedMain;
  
  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Determine craftsmanship badge based on name/slug
  const craftTag = useMemo(() => {
    const text = `${product.name} ${product.slug}`.toLowerCase();
    if (text.includes("sheesh") || text.includes("aaina") || text.includes("mirror")) return "Mirror Work";
    if (text.includes("zardozi") || text.includes("dabka")) return "Pure Dabka";
    if (text.includes("velvet") || text.includes("rani") || text.includes("ruby")) return "Royal Velvet";
    if (text.includes("peela") || text.includes("sitara")) return "Sitara Sparkle";
    if (text.includes("pearl") || text.includes("nazakat")) return "River Pearls";
    return "Handcrafted";
  }, [product.name, product.slug]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userInfo) {
      dispatch(toggleWishlistAPI(product)).unwrap().then(() => toast.success(isWishlisted ? "Removed" : "Saved"));
    } else {
      dispatch(toggleWishlistLocal(product));
      toast.success(isWishlisted ? "Removed" : "Saved");
    }
  };

  return (
    <div className="group relative flex flex-col cursor-pointer animate-fade-in">
      <Link to={`/product/${product.slug}`} className="block relative mb-2.5">
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] bg-[#F2EDE4] overflow-hidden rounded-2xl border border-[#EFE8DD] shadow-xs group-hover:shadow-md transition-shadow duration-500">
          <img 
            src={optimizedMain} 
            alt={product.name} 
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOutOfStock ? "grayscale opacity-80" : "group-hover:scale-105"
            } ${optimizedHover !== optimizedMain ? "group-hover:opacity-0" : ""}`} 
          />
          
          {optimizedHover !== optimizedMain && !isOutOfStock && (
            <img 
              src={optimizedHover} 
              alt={product.name} 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100 group-hover:scale-105" 
            />
          )}

          {/* Floating Craftsmanship Badge */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-[#1C1917] border border-[#E8D9C0] shadow-xs">
              {craftTag}
            </span>
          </div>

          {/* Floating Wishlist Button */}
          <button 
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs opacity-90 sm:opacity-0 sm:translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1C1917] group/btn"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#1C1917] group-hover/btn:text-white"}`} />
          </button>

          {/* Comfort Indicator Pill */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
            <div className="px-2 py-0.5 rounded-md bg-[#1C1917]/85 backdrop-blur-md text-white text-[9px] font-semibold text-center tracking-wider">
              Double Memory Foam • Leather Sole
            </div>
          </div>

          {/* Sold Out Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
              <div className="bg-[#1C1917] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md">
                Sold Out
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* TYPOGRAPHY & PRICING */}
      <div className="text-center px-1">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="font-serif text-sm sm:text-base text-[#1C1917] mb-1 transition-colors duration-300 group-hover:text-[#C5A059] line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[#1C1917]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through font-light">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
