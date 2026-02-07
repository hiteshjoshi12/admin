import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Loader2, Heart } from "lucide-react";
import { getOptimizedImage } from "../util/imageUtils";
import { toast } from "react-hot-toast";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistAPI, toggleWishlistLocal } from "../redux/wishlistSlice";
import { API_BASE_URL } from "../util/config";

// --- 🎨 COLLECTION CONFIGURATION ---
// NOTE: Removed 'image' property as it is no longer needed.
const collectionConfig = {
  bridal: {
    title: "The Bridal Edit",
    subtitle: "Handcrafted Luxury for Your Special Day",
    description: "Every step down the aisle deserves perfection. Discover intricate embroidery and timeless silhouettes.",
    theme: "bg-[#FDF8F6]", // Warm Cream Background
    text: "text-[#8B5E3C]", // Bronze/Gold Text
    accent: "text-[#D4AF37]", // Gold Accent
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

export default function Collection() {
  const { category } = useParams();
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
        const res = await fetch(`${API_BASE_URL}/api/products?category=${category}&sort=${sortOption}`);
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

  return (
    // The main container sets the solid background color based on the theme
    <div className={`min-h-screen mt-23 ${config.theme} transition-colors duration-700`}>
      
      {/* --- HERO SECTION (Clean, No Image) --- */}
      {/* Adjusted height slightly as it's now a solid color block */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex items-end pb-12 justify-center overflow-hidden">
       
        {/* Hero Content - Updated text color to use config.text instead of white */}
        <div className={`relative z-10 text-center px-6 max-w-4xl ${config.text} animate-fade-up`}>
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
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                wishlist={wishlistItems} 
                textColor={config.text}
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
      </div>
    </div>
  );
}

// --- REUSABLE PRODUCT CARD (Matches Shop.jsx) ---
function ProductCard({ product, wishlist, textColor }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const isWishlisted = Array.isArray(wishlist) && wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.totalStock === 0;

  const optimizedMain = getOptimizedImage(product.image, 600);
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
               alt={product.name} 
               className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOutOfStock ? "grayscale opacity-80" : "group-hover:scale-105"} ${optimizedHover !== optimizedMain ? "group-hover:opacity-0" : ""}`} 
             />
             
             {optimizedHover !== optimizedMain && !isOutOfStock && (
                <img 
                  src={optimizedHover} 
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