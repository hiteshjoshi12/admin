import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { API_BASE_URL } from "../util/config";

// UTILS IMPORT
import { getOptimizedImage } from "../util/imageUtils";

// LOADER IMPORTS
import { ProductDetailSkeleton } from "../components/loaders/SectionLoader";
import ReviewSection from "../components/ReviewSection";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductDetail() {
  const { id } = useParams();
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

  // GET WISHLIST STATE
  const wishlist = useSelector((state) => state.wishlist.items);
  const isWishlisted =
    currentProduct && wishlist.some((item) => item._id === currentProduct._id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // --- LOADING STATE ---
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

  // --- REAL-TIME STOCK CALCULATION ---
  const dbStock =
    selectedSize && currentProduct?.stock
      ? currentProduct.stock.find((s) => s.size === selectedSize)?.quantity || 0
      : 0;

  const cartItem = cart.items.find(
    (item) => item.id === currentProduct?._id && item.size === selectedSize,
  );
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const remainingStock = Math.max(0, dbStock - qtyInCart);

  // --- HANDLERS ---
  const openLightbox = (index) => {
    setActiveImage(index);
    setIsLightboxOpen(true);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  // Scroll Handler
  const scrollToReviews = () => {
    const element = document.getElementById('reviews-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWishlistToggle = () => {
    const willAdd = !isWishlisted;

    if (userInfo) {
      dispatch(toggleWishlistAPI(currentProduct))
        .unwrap()
        .then(() => {
          if (willAdd) toast.success("Added to Wishlist");
          else toast.success("Removed from Wishlist");
        })
        .catch(() => toast.error("Something went wrong"));
    } else {
      dispatch(toggleWishlistLocal(currentProduct));
      if (willAdd) toast.success("Added to Wishlist");
      else toast.success("Removed from Wishlist");
    }
  };

  const validateSelection = () => {
    if (!selectedSize) {
      toast.error("Please select a size first.");
      return null;
    }
    if (quantity > remainingStock) {
      toast.error(
        `Sorry, you can only add ${remainingStock} more of this size.`,
      );
      return null;
    }
    return {
      id: currentProduct._id,
      name: currentProduct.name,
      image: currentProduct.images[0],
      price: currentProduct.price,
      quantity: quantity,
      size: selectedSize,
      maxStock: dbStock,
    };
  };

  const handleAddToCart = () => {
    const item = validateSelection();
    if (item) {
      dispatch(addToCart(item));
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Added to Bag!</span>
          <span className="text-xs text-gray-500">
            You can continue shopping.
          </span>
        </div>,
        { icon: "🛍️" },
      );
    }
  };

  const handleBuyNow = () => {
    const item = validateSelection();
    if (item) {
      dispatch(addToCart(item));
      navigate("/cart");
    }
  };

  const optimizedImages = currentProduct.images.map((img) =>
    getOptimizedImage(img, 1000),
  );

  // Calculate Rating Display
  const avgRating = currentProduct.rating || 0;
  const numReviews = currentProduct.numReviews || 0;

  return (
    <div className="bg-white min-h-screen pt-20">
      {isLightboxOpen && (
        <Lightbox
          images={optimizedImages}
          initialIndex={activeImage}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}

      <div className="max-w-[1440px] mx-auto px-0 md:px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-12">
        {/* LEFT: IMAGE GALLERY */}
        <div className="w-full lg:w-3/5 relative">
          <button
            onClick={handleWishlistToggle}
            className="lg:hidden absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-600"}`}
            />
          </button>

          {/* MOBILE VIEW */}
          <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {optimizedImages.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center">
                <div className="aspect-[3/4] relative">
                  <img
                    src={img}
                    alt={`${currentProduct.name} - View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onClick={() => openLightbox(idx)}
                  />
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    {idx + 1} / {optimizedImages.length}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Grid Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-4 relative">
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform group"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-400 group-hover:text-[#FF2865]"}`}
              />
            </button>

            {optimizedImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`relative overflow-hidden cursor-zoom-in group ${idx === 0 ? "col-span-2 aspect-[4/3]" : "col-span-1 aspect-[3/4]"}`}
              >
                <img
                  src={img}
                  alt={`${currentProduct.name} - View ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-4 h-4 text-[#1C1917]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT DETAILS */}
        <div className="w-full lg:w-2/5 px-6 lg:px-0">
          <div className="sticky top-28 space-y-6">
            
            {/* Header Info with Rating Badge */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">
                {currentProduct.name}
              </h1>
              
              {/* --- NEW RATING BADGE --- */}
              <div 
                onClick={scrollToReviews}
                className="flex items-center gap-2 mt-2 cursor-pointer group w-fit"
              >
                <div className="flex items-center gap-1 bg-[#F9F8F6] px-2 py-1 rounded-md border border-gray-200 group-hover:border-[#FF2865] transition-colors">
                    <Star className="w-3.5 h-3.5 fill-[#FFCB45] text-[#FFCB45]" />
                    <span className="text-xs font-bold text-[#1C1917] pt-0.5">
                        {avgRating.toFixed(1)}
                    </span>
                </div>
                <span className="text-xs text-gray-500 underline decoration-gray-300 group-hover:text-[#FF2865] group-hover:decoration-[#FF2865] underline-offset-2 transition-all">
                    {numReviews} Reviews
                </span>
              </div>
              {/* ----------------------- */}

              <div className="flex items-center gap-4 mb-4 mt-4">
                <span className="text-2xl font-bold text-[#1C1917]">
                  ₹{currentProduct.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">
                  Select Size (EU)
                </span>
                <Link
                  to="/size-chart"
                  className="text-xs text-[#FF2865] underline decoration-1 underline-offset-2"
                >
                  Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {currentProduct.stock?.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => handleSizeSelect(item.size)}
                    disabled={item.quantity === 0}
                    className={`h-12 border flex items-center justify-center text-sm font-medium transition-all relative overflow-hidden
                      ${
                        item.quantity === 0
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100"
                          : selectedSize === item.size
                            ? "bg-[#1C1917] text-white border-[#1C1917]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#FF2865]"
                      }`}
                  >
                    {item.size}
                    {item.quantity === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-gray-300 rotate-45"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedSize && (
                <>
                  {remainingStock === 0 && dbStock > 0 ? (
                    <p className="text-xs text-orange-500 mt-2 font-bold animate-pulse">
                      You have all available items in your bag!
                    </p>
                  ) : remainingStock === 0 && dbStock === 0 ? (
                    <p className="text-xs text-red-500 mt-2 font-bold">
                      This size is currently Sold Out.
                    </p>
                  ) : remainingStock <= 5 ? (
                    <p className="text-xs text-orange-500 mt-2 font-bold">
                      Hurry! Only {remainingStock} pairs left.
                    </p>
                  ) : null}
                </>
              )}
            </div>

            {/* QUANTITY & BUTTONS SECTION */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Quantity
                </span>
                <div
                  className={`flex items-center border border-gray-200 rounded-lg h-10 w-32 ${!selectedSize || remainingStock === 0 ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1C1917]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="flex-1 text-center font-bold text-[#1C1917] text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(remainingStock, quantity + 1))
                    }
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1C1917]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {dbStock === 0 ? (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-400 h-14 rounded-lg font-bold uppercase tracking-widest text-xs cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Select Size
                </button>
              ) : remainingStock === 0 ? (
                <button
                  disabled
                  className="w-full bg-orange-100 text-orange-400 h-14 rounded-lg font-bold uppercase tracking-widest text-xs cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Max Limit Reached
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-14 rounded-lg font-bold uppercase tracking-widest text-xs transition-all shadow-sm border flex items-center justify-center gap-2
                      ${
                        !selectedSize
                          ? "bg-white border-gray-200 text-gray-400"
                          : "bg-white border-[#1C1917] text-[#1C1917] hover:bg-gray-50"
                      }
                    `}
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className={`flex-1 h-14 rounded-lg font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2
                      ${
                        !selectedSize
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#1C1917] text-white hover:bg-[#FF2865] animate-fade-in"
                      }
                    `}
                  >
                    <Zap className="w-4 h-4 fill-current" /> Buy Now
                  </button>
                </div>
              )}
            </div>

            {/* Info Rows */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <InfoRow
                icon={Truck}
                title="Free Shipping"
                text="On all orders above ₹999 across India."
              />
              <InfoRow
                icon={RefreshCcw}
                title="Easy Returns"
                text="7-day hassle-free return policy."
              />
              <InfoRow
                icon={ShieldCheck}
                title="Secure Payment"
                text="100% secure payment processing."
              />
            </div>

            {/* Care Guide */}
            <div className="bg-[#F9F8F6] p-6 rounded-xl mt-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <HeartHandshake className="w-5 h-5 text-[#FF2865]" />
                <h3 className="font-serif text-lg text-[#1C1917]">
                  Material & Care
                </h3>
              </div>
              <ul className="text-sm text-gray-600 leading-relaxed font-light space-y-2 list-disc pl-4 marker:text-gray-400">
                <li>
                  <strong>Avoid Water & Heat:</strong> Keep away from water and
                  direct sunlight to prevent damage.
                </li>
                <li>
                  <strong>Cleaning:</strong> Clean gently with a soft brush or
                  damp cloth. Spot clean stains with mild detergent.
                </li>
                <li className="text-[#FF2865] font-medium">
                  For heavy embroidered juttis, Dry Clean Only.
                </li>
              </ul>
            </div>

            {/* Editor's Note */}
            <div className="pt-4 border-t border-gray-100 mt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] mb-2">
                Editor's Note
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Components */}
      {/* 8. WRAP IN ID FOR SCROLLING */}
      <div id="reviews-section">
        <ReviewSection productId={id} />
      </div>
      
      {/* Pass current ID so we can filter it out */}
      <RelatedProducts currentId={currentProduct._id} />
    </div>
  );
}

function Lightbox({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2 hover:bg-white/10 rounded-full transition-all"
      >
        <X className="w-8 h-8" />
      </button>
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={images[currentIndex]}
          alt="Zoom View"
          className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out"
          style={{
            transform: isZoomed ? "scale(2.5)" : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`,
            cursor: isZoomed ? "zoom-out" : "zoom-in",
          }}
        />
      </div>
      {!isZoomed && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx ? "border-[#FF2865] scale-110" : "border-transparent opacity-50 hover:opacity-100"}`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt="thumb"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-gray-50 rounded-full text-[#FF2865]">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{text}</p>
      </div>
    </div>
  );
}