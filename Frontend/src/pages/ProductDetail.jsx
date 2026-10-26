import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  ChevronRight,
  Info,
  Sparkles,
  HeartHandshake,
  Ruler,
  Check,
  Tag,
  Shield,
  Layers
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

// SUB-COMPONENTS
import ProductGallery from "../components/product/ProductGallery";
import SizeGuideModal from "../components/product/SizeGuideModal";
import ProductOffers from "../components/product/ProductOffers";
import PincodeChecker from "../components/product/PincodeChecker";
import StickyMobileBar from "../components/product/StickyMobileBar";
import AddedToCartDrawer from "../components/product/AddedToCartDrawer";
import ArtisanalTriad from "../components/product/ArtisanalTriad";
import PackagingShowcase from "../components/product/PackagingShowcase";
import VisualSizeGuide from "../components/product/VisualSizeGuide";
import StyleLookbook from "../components/product/StyleLookbook";
import { ProductDetailSkeleton } from "../components/loaders/SectionLoader";
import ReviewSection from "../components/ReviewSection";
import RelatedProducts from "../components/RelatedProducts";
import SEO from "../components/seo/SEO";
import { getProductSchema, getBreadcrumbSchema } from "../components/seo/schemaUtils";

// CONFIG
const SITE_URL = "https://beadsandbloom.in";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // REDUX DATA
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
  const [showMaxReached, setShowMaxReached] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAddedDrawerOpen, setIsAddedDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [shakeSizeError, setShakeSizeError] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // --- RECENTLY VIEWED LOGIC ---
  useEffect(() => {
    if (currentProduct && currentProduct.slug === slug) {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        const existing = stored ? JSON.parse(stored) : [];
        const filtered = existing.filter((item) => item._id !== currentProduct._id);

        const updated = [
          {
            _id: currentProduct._id,
            name: currentProduct.name,
            slug: currentProduct.slug,
            image: currentProduct.image || (currentProduct.images && currentProduct.images[0]),
            price: currentProduct.price,
          },
          ...filtered,
        ].slice(0, 6);

        localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        setRecentlyViewed(updated.filter((item) => item._id !== currentProduct._id));
      } catch (err) {
        console.error("Recently Viewed Error:", err);
        localStorage.removeItem("recentlyViewed");
      }
    }
  }, [currentProduct, slug]);

  // SCROLL OBSERVER FOR MOBILE STICKY BAR
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once scrolled past 400px
      setShowStickyBar(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FETCH PRODUCT ON LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(null);
    setQuantity(1);
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
    setShakeSizeError(false);
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
    if (!selectedSize) {
      toast.error("Please select a size first", { icon: "📏" });
      setShakeSizeError(true);
      setTimeout(() => setShakeSizeError(false), 800);
      const sizeEl = document.getElementById("size-selector-area");
      if (sizeEl) {
        sizeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return null;
    }
    return {
      id: currentProduct._id,
      name: currentProduct.name,
      image: currentProduct.images?.[0] || currentProduct.image || '',
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
      setLastAddedItem(item);
      setIsAddedDrawerOpen(true);
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

  const productUrl = `${SITE_URL}/product/${currentProduct.slug}`;
  const mainImage = currentProduct.images?.[0] || currentProduct.image || `${SITE_URL}/logo.png`;
  const primaryCategory =
    Array.isArray(currentProduct.category) && currentProduct.category.length > 0
      ? currentProduct.category[0]
      : null;

  const knownCollections = {
    bridal: { name: 'The Bridal Edit', route: '/collection/bridal' },
    festive: { name: 'The Festive Edit', route: '/collection/festive' },
    casual: { name: 'Everyday Chic', route: '/collection/casual' },
    party: { name: 'The Festive Edit', route: '/collection/festive' },
    everyday: { name: 'Everyday Chic', route: '/collection/casual' },
  };

  const matchedCat = primaryCategory ? primaryCategory.toLowerCase() : null;
  const collectionInfo =
    matchedCat && knownCollections[matchedCat]
      ? knownCollections[matchedCat]
      : { name: primaryCategory || 'Collection', route: `/shop` };

  const collectionRoute = collectionInfo.route;
  const collectionName = collectionInfo.name;

  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getProductSchema(currentProduct),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Shop', url: '/shop' },
        ...(primaryCategory ? [{ name: collectionName, url: collectionRoute }] : []),
        { name: currentProduct.name, url: `/product/${currentProduct.slug}` },
      ]),
    ],
  };

  const availableSizesList = currentProduct.stock?.filter((s) => s.quantity > 0).map((s) => s.size) || [];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-20 text-[#1C1917]">
      <SEO
        title={
          (currentProduct.name + ' | Beads and Bloom').length <= 60
            ? `${currentProduct.name} | Beads and Bloom`
            : currentProduct.name
        }
        description={`Shop ${currentProduct.name}. Handcrafted Indian jutti with pure leather soles & double-cushioned comfort in EU sizes 36-41.`}
        canonical={`/product/${currentProduct.slug}`}
        type="product"
        image={getOptimizedImage(mainImage, 1000)}
        schema={productSchema}
      />

      {/* UNIVERSAL BREADCRUMBS */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400"
        >
          <Link to="/" className="hover:text-[#FF2865] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link to="/shop" className="hover:text-[#FF2865] transition-colors">
            Shop
          </Link>
          {primaryCategory && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link to={collectionRoute} className="hover:text-[#FF2865] transition-colors">
                {collectionName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900 font-bold truncate max-w-[220px] sm:max-w-none">
            {currentProduct.name}
          </span>
        </nav>
      </div>

      {/* MAIN PRODUCT DETAIL GRID */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col lg:flex-row items-start gap-10 xl:gap-14">
        {/* LEFT: GALLERY (Sticky on desktop to eliminate blank space as right info scrolls) */}
        <div className="w-full lg:w-3/5 lg:sticky lg:top-28 lg:self-start">
          <ProductGallery
            images={currentProduct.images || (currentProduct.image ? [currentProduct.image] : [])}
            productName={currentProduct.name}
            isWishlisted={isWishlisted}
            onToggleWishlist={handleWishlistToggle}
            imageDetails={currentProduct.imageDetails || []}
          />
        </div>

        {/* RIGHT: INFO & ACTIONS */}
        <div className="w-full lg:w-2/5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Link
                  to={collectionRoute}
                  className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B5E3C] hover:text-[#1C1917] transition-colors"
                >
                  {collectionName}
                </Link>
                {currentProduct.sku && (
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                    SKU: {currentProduct.sku}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">
                {currentProduct.name}
              </h1>

              {/* Rating count / Anchor */}
              <div className="flex items-center gap-3 mt-2.5">
                {currentProduct.numReviews > 0 ? (
                  <button
                    onClick={() =>
                      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 bg-[#F9F8F6] px-2 py-0.5 rounded-md border border-gray-200">
                      <Star className="w-3.5 h-3.5 fill-[#FFCB45] text-[#FFCB45]" />
                      <span className="text-xs font-bold text-gray-900">
                        {currentProduct.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 underline group-hover:text-[#FF2865] transition-colors">
                      {currentProduct.numReviews} Verified {currentProduct.numReviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-xs text-gray-400 hover:text-[#FF2865] flex items-center gap-1.5 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" /> Be the first to review
                  </button>
                )}
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-bold text-[#1C1917]">
                  ₹{currentProduct.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* PRODUCT OFFERS & COUPONS */}
            <ProductOffers
              productId={currentProduct._id}
              isNewArrival={currentProduct.isNewArrival}
              category={currentProduct.category}
            />

            {/* SIZE SELECTOR WITH GUIDE TRIGGER & SMOOTH SHAKE ON MISSING */}
            <div
              id="size-selector-area"
              className={`p-4 rounded-2xl transition-all duration-300 ${
                shakeSizeError
                  ? "bg-red-50 ring-2 ring-red-400 animate-shake"
                  : "bg-transparent"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">
                    Select Size (EU)
                  </span>
                  {selectedSize && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Selected: EU {selectedSize}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("visual-size-guide");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else {
                      setIsSizeGuideOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#FF2865] hover:text-[#1C1917] font-semibold underline underline-offset-4 transition-colors cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Visual Size Guide
                </button>
              </div>

              {/* Size Buttons Grid */}
              <div className="grid grid-cols-6 gap-2">
                {currentProduct.stock?.map((item) => {
                  const isOutOfStock = item.quantity === 0;
                  const isSelected = selectedSize === item.size;
                  return (
                    <button
                      key={item.size}
                      onClick={() => handleSizeSelect(item.size)}
                      disabled={isOutOfStock}
                      aria-label={`Select size EU ${item.size}${isOutOfStock ? ' (Out of stock)' : isSelected ? ' (Selected)' : ''}`}
                      className={`h-12 rounded-xl border flex flex-col items-center justify-center text-sm font-semibold transition-all relative ${
                        isOutOfStock
                          ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-[#1C1917] text-white border-[#1C1917] shadow-md scale-102"
                          : "bg-white text-gray-800 border-gray-200 hover:border-[#1C1917]"
                      }`}
                    >
                      <span>{item.size}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 bg-[#FF2865] rounded-full absolute bottom-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sizing / Fit Advice Notice */}
              <div className="mt-3.5 p-3 bg-[#F9F8F6] rounded-xl border border-gray-200 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  <strong className="text-gray-900 uppercase tracking-wider mr-1">
                    Fit Tip:
                  </strong>
                  {currentProduct.fitTip ||
                    "Our juttis fit true to EU sizes. If you have broad feet or fall between sizes, we recommend sizing up for effortless all-day comfort."}
                </p>
              </div>
            </div>

            {/* QUANTITY SECTION & ACTION BUTTONS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Quantity
                  </span>
                  {selectedSize && remainingStock > 0 && remainingStock <= 3 && (
                    <span className="text-[10px] text-orange-600 font-bold animate-pulse">
                      Only {remainingStock} left in size {selectedSize}!
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <motion.div
                    animate={showMaxReached ? { x: [-4, 4, -4, 4, 0] } : {}}
                    className={`flex items-center border rounded-xl h-12 w-36 transition-all ${
                      !selectedSize ? "opacity-50 pointer-events-none" : "border-gray-300"
                    }`}
                  >
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-12 h-full flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-20 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span
                      className={`flex-1 text-center font-bold text-sm ${
                        showMaxReached ? "text-orange-600" : "text-gray-900"
                      }`}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= remainingStock}
                      aria-label="Increase quantity"
                      className="w-12 h-full flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </motion.div>
                  <AnimatePresence>
                    {showMaxReached && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-bold text-orange-600"
                      >
                        Max available stock reached
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  aria-label={`Add ${currentProduct.name} to shopping bag`}
                  className="flex-1 h-14 rounded-xl font-bold uppercase text-xs tracking-wider border-2 border-[#1C1917] text-[#1C1917] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  aria-label={`Buy ${currentProduct.name} now`}
                  className="flex-1 h-14 rounded-xl font-bold uppercase text-xs tracking-wider bg-[#1C1917] text-white flex items-center justify-center gap-2 hover:bg-[#FF2865] transition-all shadow-md active:scale-98"
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>
              </div>
            </div>

            {/* PINCODE DELIVERY CHECKER */}
            <PincodeChecker productPrice={currentProduct.price} />

            {/* ARTISANAL SPECIFICATIONS & CRAFT ACCORDION */}
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                aria-expanded={isDescriptionOpen}
                aria-label="Toggle Artisanal Craft & Specifications details"
                className="w-full flex justify-between items-center py-4 group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] group-hover:text-[#FF2865] transition-colors">
                    Artisanal Craft & Specifications
                  </h3>
                </div>
                <motion.div
                  initial={false}
                  animate={{ rotate: isDescriptionOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDescriptionOpen ? (
                    <Minus className="w-4 h-4 text-gray-400 group-hover:text-[#FF2865]" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#FF2865]" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isDescriptionOpen && (
                  <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    {/* EDITORIAL ARTISAN NARRATIVE (Replacing plain ugly paragraph) */}
                    {currentProduct.description && (
                      <div className="mb-4 bg-[#FAF8F5] p-4.5 rounded-2xl border border-[#EAE6DF] shadow-2xs">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B5E3C] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                            Artisan Karigar Notes
                          </span>
                          <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                            Heritage Craft
                          </span>
                        </div>
                        <p className="text-xs md:text-[13px] text-gray-700 leading-relaxed font-sans border-l-2 border-[#C5A059] pl-3 py-0.5">
                          {currentProduct.description}
                        </p>
                        
                        {/* 3 Craft Quality Pills */}
                        <div className="mt-3.5 pt-3 border-t border-[#EAE6DF]/70 flex flex-wrap gap-2 text-[10px] font-bold text-[#1C1917]">
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-[#C5A059]" /> Hand-Embroidered
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs">
                            <Shield className="w-3 h-3 text-[#8B5E3C]" /> Pure Leather Sole
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs">
                            <Layers className="w-3 h-3 text-emerald-600" /> Double-Padded
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Specifications Grid */}
                    <div className="mt-2 pt-1 grid grid-cols-2 gap-2.5 text-xs">
                      {/* Material */}
                      <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 hover:border-[#D5CFC4] transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                          Upper Material
                        </span>
                        <span className="font-semibold text-[#1C1917] block">
                          {currentProduct.material || "Pure Silk / Velvet Dupion"}
                        </span>
                      </div>

                      {/* Embellishment */}
                      <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 hover:border-[#D5CFC4] transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                          Embellishment / Work
                        </span>
                        <span className="font-semibold text-[#1C1917] block">
                          {currentProduct.embellishment || "Hand-sewn Beads & Zardozi"}
                        </span>
                      </div>

                      {/* Sole & Lining */}
                      <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 hover:border-[#D5CFC4] transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                          Footbed & Sole
                        </span>
                        <span className="font-semibold text-[#1C1917] block">
                          {currentProduct.sole || currentProduct.lining || "100% Genuine Leather"}
                        </span>
                      </div>

                      {/* SKU */}
                      {currentProduct.sku && (
                        <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 hover:border-[#D5CFC4] transition-colors">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                            Artisan Code / SKU
                          </span>
                          <span className="font-mono font-bold text-[#1C1917] block">
                            {currentProduct.sku}
                          </span>
                        </div>
                      )}

                      {/* Color */}
                      <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 hover:border-[#D5CFC4] transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                          Primary Color
                        </span>
                        <span className="font-semibold text-[#1C1917] block">
                          {currentProduct.color || "Artisan Palette"}
                        </span>
                      </div>

                      {/* Occasions */}
                      <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 col-span-2 hover:border-[#D5CFC4] transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">
                          Ideal Occasions
                        </span>
                        <span className="font-semibold text-[#1C1917] block leading-relaxed">
                          {Array.isArray(currentProduct.occasions) && currentProduct.occasions.length > 0
                            ? currentProduct.occasions.join(", ")
                            : currentProduct.occasions || "Bridal, Festive Celebrations, Sangeet, Ceremonies"}
                        </span>
                      </div>

                      {/* COMFORT / CUSHIONING NOTE: ONLY DISPLAY IF CONFIRMED ON SAMPLE */}
                      {currentProduct.comfortNotes && currentProduct.comfortNotes.trim().length > 0 && (
                        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 col-span-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider mb-1">
                            Comfort & Cushioning (Confirmed on Sample)
                          </span>
                          <span className="font-medium text-emerald-950 text-xs leading-relaxed block">
                            {currentProduct.comfortNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MATERIAL & CARE GUIDE BOX */}
            <div className="bg-[#F9F8F6] p-5 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#FF2865]" />
                  <h3 className="font-serif text-base font-bold text-[#1C1917]">
                    Material & Care
                  </h3>
                </div>
                <Link
                  to="/care-guide"
                  className="text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] hover:text-[#1C1917] underline"
                >
                  Full Care Guide →
                </Link>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  {currentProduct.careInstructions ||
                    "Keep away from water and damp surfaces; authentic leather absorbs moisture."}
                </li>
                <li>
                  Store in the breathable cotton dust bag provided with silica gel packets.
                </li>
                <li>
                  Clean delicately with a soft, dry cotton cloth after wearing to maintain beadwork lustre.
                </li>
              </ul>
            </div>
          </div>
        </div>

      {/* THE ARTISANAL TRIAD (01, 02, 03 Numbered Feature Cards) */}
      <ArtisanalTriad product={currentProduct} />

      {/* SIGNATURE LUXURY PACKAGING SHOWCASE (3D & 2D Keepsake Box, Satin Dust Bag) */}
      <PackagingShowcase />

      {/* HOW TO STYLE YOUR JUTTIS (Curated Occasion Lookbook with Generated Editorial Images) */}
      <StyleLookbook productName={currentProduct.name} />

      {/* VISUAL ON-PAGE SIZE GUIDE (With Foot Measurement Photo & Interactive Table) */}
      <VisualSizeGuide
        selectedSize={selectedSize}
        onSelectSize={(size) => {
          setSelectedSize(size);
          setShakeSizeError(false);
          const el = document.getElementById("size-selector-area");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />

      {/* REVIEWS SECTION */}
      <div id="reviews-section">
        <ReviewSection productId={currentProduct._id} />
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts currentId={currentProduct._id} currentProduct={currentProduct} />

      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 border-t border-gray-100">
          <h2 className="text-2xl font-serif mb-8 text-[#1C1917]">Recently Viewed</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {recentlyViewed.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item.slug}`}
                className="min-w-[180px] md:min-w-[240px] group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-3 border border-gray-100">
                  <img
                    src={getOptimizedImage(item.image, 400)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  ₹{item.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* INTERACTIVE SIZE GUIDE MODAL */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={(size) => {
          setSelectedSize(size);
          setIsSizeGuideOpen(false);
          setShakeSizeError(false);
        }}
        availableSizes={availableSizesList}
      />

      {/* ADDED TO CART SLIDE-OVER DRAWER WITH FREE SHIPPING THRESHOLD METER */}
      <AddedToCartDrawer
        isOpen={isAddedDrawerOpen}
        onClose={() => setIsAddedDrawerOpen(false)}
        addedItem={lastAddedItem}
      />

      {/* MOBILE STICKY FLOATING BOTTOM BAR */}
      <StickyMobileBar
        isVisible={showStickyBar}
        product={currentProduct}
        selectedSize={selectedSize}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onAddToCart={handleAddToCart}
        onScrollToSizes={() => {
          const el = document.getElementById("size-selector-area");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />
    </div>
  );
}