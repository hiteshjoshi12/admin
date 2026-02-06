import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  Truck,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  X,
  ZoomIn,
  HeartHandshake,
  Zap,
  Heart,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";

// REDUX IMPORTS
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  clearProductDetails,
} from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import { toggleWishlistAPI, toggleWishlistLocal } from "../redux/wishlistSlice";

// UTILS IMPORT
import { getOptimizedImage } from "../util/imageUtils";

// LOADER IMPORTS
import { ProductDetailSkeleton } from "../components/loaders/SectionLoader";
import ReviewSection from "../components/ReviewSection";
import RelatedProducts from "../components/RelatedProducts";

// CONFIG
const SITE_URL = "https://beadsandbloom.in";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // GET DATA
  const {
    product: currentProduct,
    loading,
    error,
  } = useSelector((state) => state.products);

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // WISHLIST STATE
  const wishlist = useSelector((state) => state.wishlist.items);
  const isWishlisted =
    currentProduct && wishlist.some((item) => item._id === currentProduct._id);

  // LOCAL STATE
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showMaxReached, setShowMaxReached] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // --- RECENTLY VIEWED LOGIC ---
  useEffect(() => {
    if (currentProduct && currentProduct.slug === slug) {
      const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = existing.filter(item => item._id !== currentProduct._id);
      const updated = [
        {
          _id: currentProduct._id,
          name: currentProduct.name,
          slug: currentProduct.slug,
          image: currentProduct.image || currentProduct.images[0],
          price: currentProduct.price
        },
        ...filtered
      ].slice(0, 6); 

      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      setRecentlyViewed(updated.filter(item => item._id !== currentProduct._id));
    }
  }, [currentProduct, slug]);

  // FETCH PRODUCT ON LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      dispatch(fetchProductDetails(slug));
    }
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, slug]);

  // STOCK LOGIC
  const dbStock =
    selectedSize && currentProduct?.stock
      ? currentProduct.stock.find((s) => s.size === selectedSize)?.quantity || 0
      : 0;

  const cartItem = cart.items.find(
    (item) => item.id === currentProduct?._id && item.size === selectedSize
  );
  const remainingStock = Math.max(0, dbStock - (cartItem ? cartItem.quantity : 0));

  // QUANTITY HANDLERS
  const handleIncrement = () => {
    if (quantity < remainingStock) {
      setQuantity((prev) => prev + 1);
      setShowMaxReached(false);
    } else {
      setShowMaxReached(true);
      setTimeout(() => setShowMaxReached(false), 2500);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setShowMaxReached(false);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
    setShowMaxReached(false);
  };

  const handleWishlistToggle = () => {
    const willAdd = !isWishlisted;
    if (userInfo) {
      dispatch(toggleWishlistAPI(currentProduct))
        .unwrap()
        .then(() => toast.success(willAdd ? "Added to Wishlist" : "Removed from Wishlist"))
        .catch(() => toast.error("Something went wrong"));
    } else {
      dispatch(toggleWishlistLocal(currentProduct));
      toast.success(willAdd ? "Added to Wishlist" : "Removed from Wishlist");
    }
  };

  const validateSelection = () => {
    if (!selectedSize) { toast.error("Please select a size first."); return null; }
    return {
      id: currentProduct._id,
      name: currentProduct.name,
      image: currentProduct.images[0],
      price: currentProduct.price,
      quantity,
      size: selectedSize,
      maxStock: dbStock,
    };
  };

  const handleAddToCart = () => {
    const item = validateSelection();
    if (item) {
      dispatch(addToCart(item));
      toast.success("Added to Bag!", { icon: "🛍️" });
    }
  };

  const handleBuyNow = () => {
    const item = validateSelection();
    if (item) {
      dispatch(addToCart(item));
      navigate("/cart");
    }
  };

  if (loading) return <ProductDetailSkeleton />;

  if (error || !currentProduct)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-serif text-red-500">Product Not Found</p>
        <Link to="/shop" className="underline hover:text-[#FF2865]">
          Return to Shop
        </Link>
      </div>
    );

  const optimizedImages = currentProduct.images.map((img) => getOptimizedImage(img, 1000));
  const productUrl = `${SITE_URL}/product/${currentProduct.slug}`;

  return (
    <div className="bg-white min-h-screen pt-20">
      <title>{currentProduct.name} | Handcrafted Jutis | Beads and Bloom</title>
      <meta name="description" content={`Shop ${currentProduct.name}. Premium handcrafted ethnic footwear.`} />
      <link rel="canonical" href={productUrl} />

      <AnimatePresence>
        {isLightboxOpen && (
          <Lightbox images={optimizedImages} initialIndex={activeImage} onClose={() => setIsLightboxOpen(false)} />
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-0 md:px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-12">
        {/* LEFT: GALLERY */}
        <div className="w-full lg:w-3/5 relative">
          {/* MOBILE WISHLIST HEART */}
          <button onClick={handleWishlistToggle} className="lg:hidden absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-600"}`} />
          </button>

          {/* MOBILE SLIDER */}
          <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {optimizedImages.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center relative">
                <img src={img} alt={currentProduct.name} className="w-full aspect-[3/4] object-cover" onClick={() => { setActiveImage(idx); setIsLightboxOpen(true); }} />
              </div>
            ))}
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden lg:grid grid-cols-2 gap-4 relative">
            <nav className="col-span-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              <Link to="/" className="hover:text-[#FF2865]">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/shop" className="hover:text-[#FF2865]">Shop</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900">{currentProduct.name}</span>
            </nav>

            {/* DESKTOP WISHLIST HEART */}
            <button onClick={handleWishlistToggle} className="absolute top-16 right-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform group">
              <Heart className={`w-6 h-6 ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-400 group-hover:text-[#FF2865]"}`} />
            </button>

            {optimizedImages.map((img, idx) => (
              <div key={idx} onClick={() => { setActiveImage(idx); setIsLightboxOpen(true); }} className={`relative overflow-hidden cursor-zoom-in group ${idx === 0 ? "col-span-2 aspect-[4/3]" : "col-span-1 aspect-[3/4]"}`}>
                <img src={img} alt={currentProduct.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="w-4 h-4 text-[#1C1917]" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div className="w-full lg:w-2/5 px-6 lg:px-0">
          <div className="sticky top-28 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">{currentProduct.name}</h1>
              {currentProduct.numReviews > 0 ? (
                <div onClick={() => document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
                  <div className="flex items-center gap-1 bg-[#F9F8F6] px-2 py-1 rounded-md border border-gray-200">
                    <Star className="w-3.5 h-3.5 fill-[#FFCB45] text-[#FFCB45]" />
                    <span className="text-xs font-bold">{currentProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500 underline">{currentProduct.numReviews} Reviews</span>
                </div>
              ) : (
                <button onClick={() => document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth" })} className="mt-2 text-xs text-gray-400 hover:text-[#FF2865] flex items-center gap-1">
                  <Star className="w-3 h-3" /> Be the first to review
                </button>
              )}
              <div className="text-2xl font-bold text-[#1C1917] mt-4">₹{currentProduct.price.toLocaleString()}</div>
            </div>

            {/* SIZE SELECTOR */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">Select Size (EU)</span>
                <Link to="/size-chart" className="text-xs text-[#FF2865] underline font-medium">Size Guide</Link>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {currentProduct.stock?.map((item) => (
                  <button key={item.size} onClick={() => handleSizeSelect(item.size)} disabled={item.quantity === 0} className={`h-12 border flex items-center justify-center text-sm font-medium transition-all relative ${item.quantity === 0 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : selectedSize === item.size ? "bg-[#1C1917] text-white" : "bg-white hover:border-[#FF2865]"}`}>{item.size}</button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-[#F9F8F6] rounded-lg border border-[#E7E5E4] flex gap-3 items-start">
                <Info className="w-4 h-4 text-[#FF2865] shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  <strong className="text-gray-900 block mb-1 uppercase tracking-wider">Size & Fit Note:</strong>
                  Refer to the size chart before placing an order for size assurity.
                  <Link to="/size-chart" className="text-[#FF2865] ml-1 font-bold underline">View Size Chart.</Link>
                </p>
              </div>
            </div>

            {/* QUANTITY SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Quantity</span>
                  {selectedSize && remainingStock > 0 && remainingStock <= 3 && (
                    <span className="text-[10px] text-orange-600 font-bold animate-pulse">Only {remainingStock} left!</span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <motion.div animate={showMaxReached ? { x: [-4, 4, -4, 4, 0] } : {}} className={`flex items-center border rounded-lg h-12 w-36 transition-all ${!selectedSize ? "opacity-50 pointer-events-none" : "border-gray-200"}`}>
                    <button onClick={handleDecrement} disabled={quantity <= 1} className="w-12 h-full flex items-center justify-center disabled:opacity-20"><Minus className="w-4 h-4" /></button>
                    <span className={`flex-1 text-center font-bold ${showMaxReached ? "text-orange-600" : ""}`}>{quantity}</span>
                    <button onClick={handleIncrement} className="w-12 h-full flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                  </motion.div>
                  <AnimatePresence>{showMaxReached && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-orange-600">Max stock reached</motion.span>}</AnimatePresence>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="flex-1 h-14 rounded-lg font-bold uppercase text-xs border border-[#1C1917] flex items-center justify-center gap-2 hover:bg-gray-50"><ShoppingBag className="w-4 h-4" /> Add to Bag</button>
                <button onClick={handleBuyNow} className="flex-1 h-14 rounded-lg font-bold uppercase text-xs bg-[#1C1917] text-white flex items-center justify-center gap-2 hover:bg-[#FF2865]"><Zap className="w-4 h-4" /> Buy Now</button>
              </div>
            </div>

            {/* TRUST INFO */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <InfoRow icon={Truck} title="Free Shipping" text="On orders above ₹4999." />
              <InfoRow icon={RefreshCcw} title="Easy Exchanges" text="Request within 48 hrs with unboxing video." />
              <InfoRow icon={ShieldCheck} title="Secure Payment" text="100% secure processing." />
            </div>

            {/* CARE */}
            <div className="bg-[#F9F8F6] p-6 rounded-xl mt-6">
              <div className="flex items-center gap-3 mb-3">
                <HeartHandshake className="w-5 h-5 text-[#FF2865]" />
                <h3 className="font-serif text-lg">Material & Care</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>Avoid exposure to water or moisture.</li>
                <li>Clean gently with a soft brush or damp cloth.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SECTIONS */}
      <div id="reviews-section"><ReviewSection productId={currentProduct._id} /></div>
      
      {/* RELATED PRODUCTS RESTORED */}
      <RelatedProducts currentId={currentProduct._id} />

      {/* RECENTLY VIEWED HISTORY */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 border-t border-gray-100">
           <h2 className="text-2xl font-serif mb-8 text-[#1C1917]">Recently Viewed</h2>
           <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
             {recentlyViewed.map((item) => (
               <Link key={item._id} to={`/product/${item.slug}`} className="min-w-[180px] md:min-w-[240px] group">
                 <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 mb-3">
                   <img src={getOptimizedImage(item.image, 400)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                 <p className="text-sm font-bold text-gray-900 mt-1">₹{item.price.toLocaleString()}</p>
               </Link>
             ))}
           </div>
        </section>
      )}
    </div>
  );
}

// SUB-COMPONENTS
function InfoRow({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-gray-50 rounded-full text-[#FF2865]"><Icon className="w-4 h-4" /></div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function Lightbox({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setPosition({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-50"><X className="w-8 h-8" /></button>
      <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in" onMouseMove={handleMouseMove} onClick={() => setIsZoomed(!isZoomed)}>
        <img src={images[currentIndex]} alt="Zoom View" className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200" style={{ transform: isZoomed ? "scale(2.5)" : "scale(1)", transformOrigin: `${position.x}% ${position.y}%` }} />
      </div>
    </motion.div>
  );
}