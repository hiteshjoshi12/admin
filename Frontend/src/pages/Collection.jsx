import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ChevronDown, Loader2, Heart, Sparkles, HeartHandshake, Ruler } from "lucide-react";
import { getOptimizedImage, getImageSrcSet } from "../util/imageUtils";
import { toast } from "react-hot-toast";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistAPI, toggleWishlistLocal } from "../redux/wishlistSlice";
import { API_BASE_URL } from "../util/config";
import SEO from "../components/seo/SEO";
import { getCollectionSchema, getBreadcrumbSchema } from "../components/seo/schemaUtils";
import FestiveCollection from "./FestiveCollection";

// --- 🎨 COLLECTION CONFIGURATION ---
const collectionConfig = {
  bridal: {
    title: "The Bridal Edit",
    subtitle: "Handcrafted Luxury for Your Special Day",
    description: "Every step down the aisle deserves perfection. Discover intricate embroidery and timeless silhouettes.",
    theme: "bg-[#FDF8F6]", // Warm Cream Background
    text: "text-[#8B5E3C]", // Bronze/Gold Text
    accent: "text-[#D4AF37]", // Gold Accent
  },
  festive: {
    title: "The Festive Edit",
    subtitle: "Celebration & Occasion Mojris",
    description: "Handcrafted sparkle and timeless embroidery designed for weddings, sangeet nights, and festive celebrations.",
    theme: "bg-[#FFFDF9]", // Soft Warm Ivory
    text: "text-[#1C1917]", // Sharp Charcoal
    accent: "text-[#C5A059]", // Festive Gold
  },
  casual: {
    title: "Everyday Chic",
    subtitle: "Effortless Style for Daily Wear",
    description: "Comfort meets contemporary design. Elevate your daily rotation with our handcrafted essentials.",
    theme: "bg-white", 
    text: "text-[#1C1917]", // Sharp Black
    accent: "text-[#FF2865]", // Pop of Red/Pink
  },
  default: {
    title: "Curated Collection",
    subtitle: "Explore Our Latest Arrivals",
    description: "Browse our handcrafted selection of premium footwear designed for elegance.",
    theme: "bg-[#FAFAFA]",
    text: "text-gray-900",
    accent: "text-black",
  }
};

const collectionGuides = {
  bridal: {
    heading: "Bridal Footwear Craft & Styling Guide",
    subheading: "Designed for royal wedding ceremonies, pheras, and all-day celebrations.",
    cards: [
      {
        icon: Sparkles,
        title: "Heirloom Embroidery",
        desc: "Each bridal pair features intricate zardozi, dabka, cut-dana, and pearl beadwork hand-stitched by master artisans onto rich velvet and pure silk bases.",
      },
      {
        icon: HeartHandshake,
        title: "10+ Hour Bite-Free Comfort",
        desc: "Engineered with our signature double-cushioned memory foam footbed and soft genuine leather lining, eliminating shoe bites for all-day ceremony wear.",
      },
      {
        icon: Ruler,
        title: "Bridal Sizing & Concierge Advice",
        desc: "Handcrafted juttis mold gently to your feet. For broad feet or half-sizes, size up by 1 EU size. Explore our detailed size guide or connect with our bridal concierge.",
        link: "/size-chart",
        linkText: "View Size Guide →",
      },
    ],
  },
  festive: {
    heading: "Festive & Sangeet Footwear Guide",
    subheading: "Vibrant craftsmanship engineered for celebrations, sangeet nights, and festivals.",
    cards: [
      {
        icon: Sparkles,
        title: "Celebration Artistry",
        desc: "Showcases dazzling mirror work (sheesha), gota patti, metallic zari, and resham threadwork designed to sparkle under celebration chandeliers.",
      },
      {
        icon: HeartHandshake,
        title: "Dance-Ready Cushioning",
        desc: "Lightweight and flexible with plush dual-density padding, ensuring you can dance all night through sangeet and mehendi without foot fatigue.",
      },
      {
        icon: Ruler,
        title: "Versatile Festive Styling",
        desc: "Pairs effortlessly with festive lehengas, anarkalis, and sharara suits. Check our sizing guide or contact our team for styling assistance.",
        link: "/size-chart",
        linkText: "Check Footwear Sizing →",
      },
    ],
  },
  casual: {
    heading: "Everyday Chic & Office Wear Guide",
    subheading: "Effortless handcrafted comfort for daily rotations and modern ethnic styling.",
    cards: [
      {
        icon: Sparkles,
        title: "Subtle Handcrafted Accents",
        desc: "Features delicate threadwork, subtle bead details, and versatile neutral tones that blend seamlessly with both ethnic wear and western casuals.",
      },
      {
        icon: HeartHandshake,
        title: "Breathable Genuine Leather",
        desc: "Pure leather footbeds and soft textile linings that breathe naturally, keeping your feet comfortable and cool throughout long workdays.",
      },
      {
        icon: Ruler,
        title: "Day-to-Night Fit",
        desc: "True to size fit that contours to your foot shape after the first wear. Step out in style with kurtis, straight trousers, or relaxed denim.",
        link: "/size-chart",
        linkText: "Find Your Everyday Fit →",
      },
    ],
  },
};

export default function Collection() {
  const { category } = useParams();

  // Redirect /collection/sale to canonical /sale
  if (category?.toLowerCase() === 'sale') {
    return <Navigate to="/sale" replace />;
  }

  // Render dedicated redesigned Festive Collection page
  if (category?.toLowerCase() === 'festive') {
    return <FestiveCollection />;
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");

  // Get Config or Fallback
  const config = collectionConfig[category?.toLowerCase()] || collectionConfig.default;
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?category=${category}&pageSize=100&sort=${sortOption}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sortOption]);

  // Handle Sort (Client-side sorting for smoothness if API doesn't handle it yet)
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  const isBridal = category?.toLowerCase() === 'bridal';
  const isFestive = category?.toLowerCase() === 'festive';
  const isCasual = category?.toLowerCase() === 'casual';

  const seoTitle = isBridal
    ? "The Bridal Edit — Luxury Wedding Juttis & Mojris | Beads and Bloom"
    : isFestive
    ? "The Festive Edit — Festive & Occasion Juttis | Beads and Bloom"
    : isCasual
    ? "Everyday Chic — Casual & Office Wear Juttis | Beads and Bloom"
    : `${config.title} — Handcrafted Juttis | Beads and Bloom`;

  const seoDescription = isBridal
    ? "Walk down the aisle in sublime comfort. Shop exquisite handcrafted bridal juttis featuring heavy zardosi, pearls, and double-padded soles for wedding ceremonies."
    : isFestive
    ? "Celebrate every special occasion in artisanal luxury. Shop handcrafted festive juttis featuring dabka, zari, and pearl embroidery with double-cushioned comfort."
    : isCasual
    ? "Step into effortless elegance with our casual handcrafted juttis. Designed for daily wear and office rotations with lightweight, bite-free cushioned soles."
    : config.description;

  const seoKeywords = isBridal
    ? "bridal juttis, wedding juttis online, bridal mojaris, punjabi bridal jutti, dulhan footwear, embroidered wedding juttis, bridal shoes india"
    : isFestive
    ? "festive juttis, sangeet footwear, party wear mojaris, embroidered ethnic flats, zari work juttis, celebration shoes women"
    : "casual juttis, everyday juttis, daily wear footwear women, ethnic flat juttis, soft leather punjabi juttis, comfortable work flats";

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getCollectionSchema(config.title, config.description, `/collection/${category}`),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Shop', url: '/shop' },
        { name: config.title, url: `/collection/${category}` },
      ]),
    ],
  };

  return (
    // The main container sets the solid background color based on the theme
    <div className={`min-h-screen mt-23 ${config.theme} transition-colors duration-700`}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`/collection/${category}`}
        keywords={seoKeywords}
        schema={collectionSchema}
      />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex items-end pb-12 justify-center overflow-hidden">
       
        {/* Hero Content */}
        <div className={`relative z-10 text-center px-6 max-w-4xl ${config.text} animate-fade-up`}>
          {/* Visual Breadcrumb for UX & Internal Linking */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest opacity-70">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:underline">Shop</Link>
            <span>/</span>
            <span className="font-bold opacity-100">{config.title}</span>
          </nav>

          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block opacity-80">
            {config.subtitle}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm md:text-lg opacity-80 leading-relaxed font-light max-w-xl mx-auto">
            {config.description}
          </p>
          {/* Decorative separator */}
          <div className={`w-16 h-[1px] ${config.text === 'text-white' ? 'bg-white' : 'bg-current'} mx-auto mt-8 opacity-30`}></div>
        </div>
      </div>

      {/* --- STICKY TOOLBAR --- */}
      <div className={`sticky top-20 z-30 ${config.theme}/90 backdrop-blur-md border-b border-gray-100/50 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-500 shadow-sm`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${config.text}`}>
          {products.length} Designs
        </span>

        <div className={`flex items-center gap-2 group cursor-pointer ${config.text}`}>
          <span className="text-[10px] uppercase font-bold opacity-60 hidden md:inline">Sort by</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-transparent text-[10px] font-bold uppercase tracking-widest pr-5 cursor-pointer outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${config.text} opacity-50`} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 opacity-50">
            <h3 className={`text-2xl font-serif ${config.text}`}>No products found</h3>
            <p className="text-sm mt-2 ${config.text}">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {sortedProducts.map((product, idx) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                wishlist={wishlistItems} 
                textColor={config.text}
                isLcp={idx === 0}
              />
            ))}
          </div>
        )}
        
        {/* End Marker */}
        {!loading && products.length > 0 && (
           <div className="flex items-center justify-center gap-4 opacity-20 mt-24">
              <div className={`h-[1px] w-16 ${config.text === 'text-white' ? 'bg-white' : 'bg-current'}`}></div>
              <span className={`text-[9px] uppercase tracking-[0.3em] font-serif ${config.text}`}>End</span>
              <div className={`h-[1px] w-16 ${config.text === 'text-white' ? 'bg-white' : 'bg-current'}`}></div>
           </div>
        )}

        {/* --- CRAFTSMANSHIP & OCCASION GUIDE (Helpful Content) --- */}
        {collectionGuides[category?.toLowerCase()] && (
          <section className="mt-20 pt-16 border-t border-gray-200/60" aria-label="Craftsmanship & Occasion Guide">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
                Buying & Styling Considerations
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917] mb-3">
                {collectionGuides[category?.toLowerCase()].heading}
              </h2>
              <p className="text-sm text-gray-500 font-light">
                {collectionGuides[category?.toLowerCase()].subheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {collectionGuides[category?.toLowerCase()].cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#C5A059] flex items-center justify-center mb-4 border border-gray-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-lg text-[#1C1917] mb-2">{card.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                    </div>
                    {card.link && (
                      <div className="mt-4 pt-3 border-t border-gray-50">
                        <Link to={card.link} className="text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] hover:text-[#1C1917] transition-colors">
                          {card.linkText}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* --- EXPLORE OTHER COLLECTIONS (Contextual Internal Linking) --- */}
        <div className="mt-24 pt-16 border-t border-gray-200/50">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
              Curated Edits
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917]">
              Explore Other Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {category?.toLowerCase() !== 'bridal' && (
              <Link
                to="/collection/bridal"
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#C5A059] transition-colors mb-1">
                  The Bridal Edit
                </h3>
                <p className="text-xs text-gray-500">Royal Zardosi & Wedding Mojris</p>
                <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C]">
                  View 14 Designs →
                </span>
              </Link>
            )}
            {category?.toLowerCase() !== 'festive' && (
              <Link
                to="/collection/festive"
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#C5A059] transition-colors mb-1">
                  The Festive Edit
                </h3>
                <p className="text-xs text-gray-500">Celebration & Sangeet Footwear</p>
                <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C]">
                  View 22 Designs →
                </span>
              </Link>
            )}
            {category?.toLowerCase() !== 'casual' && (
              <Link
                to="/collection/casual"
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <h3 className="font-serif text-lg text-[#1C1917] group-hover:text-[#C5A059] transition-colors mb-1">
                  Everyday Chic
                </h3>
                <p className="text-xs text-gray-500">Casual & Office Wear Juttis</p>
                <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C]">
                  View 8 Designs →
                </span>
              </Link>
            )}
            <Link
              to="/shop"
              className="p-6 rounded-2xl bg-[#1C1917] text-white shadow-sm hover:bg-black transition-all text-center group flex flex-col justify-center"
            >
              <h3 className="font-serif text-lg text-white mb-1">
                Complete Catalog
              </h3>
              <p className="text-xs text-gray-300">Browse All 34 Handcrafted Pairs</p>
              <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                Shop Entire Collection →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REUSABLE PRODUCT CARD (Matches Shop.jsx) ---
function ProductCard({ product, wishlist, textColor, isLcp = false }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const isWishlisted = Array.isArray(wishlist) && wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.totalStock === 0;

  const optimizedMain = getOptimizedImage(product.image, 600);
  const srcSetMain = getImageSrcSet(product.image, [360, 480, 600, 800]);
  const optimizedHover = product.images?.[1] ? getOptimizedImage(product.images[1], 600) : optimizedMain;
  
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
       <Link to={`/product/${product.slug}`} className="block relative mb-4">
          
          {/* IMAGE CONTAINER - Soft Rounded Corners & Physics Transition */}
          <div className="relative aspect-[3/4] bg-[#f0f0f0] overflow-hidden rounded-xl">
             <img 
               src={optimizedMain} 
               srcSet={srcSetMain}
               sizes="(max-width: 768px) 50vw, 25vw"
               width="300"
               height="400"
               loading={isLcp ? "eager" : "lazy"}
               fetchPriority={isLcp ? "high" : "auto"}
               alt={product.name} 
               className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOutOfStock ? "grayscale opacity-80" : "group-hover:scale-105"} ${optimizedHover !== optimizedMain ? "group-hover:opacity-0" : ""}`} 
             />
             
             {optimizedHover !== optimizedMain && !isOutOfStock && (
                <img 
                  src={optimizedHover} 
                  loading="lazy"
                  width="300"
                  height="400"
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100 group-hover:scale-105" 
                />
             )}
             
             {/* Floating Wishlist Button */}
             <button 
                onClick={handleWishlist}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out hover:bg-black group/btn"
             >
                <Heart className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-black group-hover/btn:text-white"}`} />
             </button>

             {/* Sold Out Overlay */}
             {isOutOfStock && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                   <div className="bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md">Sold Out</div>
                </div>
             )}
          </div>
       </Link>

       {/* INFO - Minimal Typography */}
       <div className="text-center">
          <Link to={`/product/${product.slug}`} className="block">
             <h3 className={`font-serif text-base mb-1.5 transition-colors duration-300 ${textColor} group-hover:opacity-70`}>
               {product.name}
             </h3>
             <div className="flex items-center justify-center gap-3">
                <span className={`font-medium text-sm ${textColor}`}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                   <span className="text-xs text-gray-400 line-through font-light">₹{product.originalPrice.toLocaleString()}</span>
                )}
             </div>
          </Link>
       </div>
    </div>
  );
}