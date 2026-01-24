import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Minus, Plus, Heart, Truck, RefreshCcw, 
  ShieldCheck, ShoppingBag, X, ZoomIn, Droplets, Sun, Wind, Feather
} from 'lucide-react';

// 1. REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // 2. GET REAL DATA FROM REDUX
  // We renamed 'product' to 'currentProduct' to avoid confusion
  const { product: currentProduct, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    window.scrollTo(0, 0);
    // 3. FETCH DETAILS ON MOUNT
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    
    // Cleanup: Clear details when leaving page so next product doesn't flash old data
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  // --- STATE ---
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // --- HANDLERS ---
  const openLightbox = (index) => {
    setActiveImage(index);
    setIsLightboxOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    
    // ADD TO REDUX CART
    dispatch(addToCart({
      id: currentProduct._id,
      name: currentProduct.name,
      image: currentProduct.images[0],
      price: currentProduct.price,
      quantity: quantity,
      size: selectedSize
    }));

    alert("Added to Bag!");
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-red-500 mb-4">Product Not Found</h2>
        <Link to="/shop" className="underline">Back to Collection</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* --- LIGHTBOX --- */}
      {isLightboxOpen && (
        <Lightbox 
          images={currentProduct.images} 
          initialIndex={activeImage} 
          onClose={() => setIsLightboxOpen(false)} 
        />
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-[1440px] mx-auto px-0 md:px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="w-full lg:w-3/5">
          {/* Mobile Slider */}
          <div className="lg:hidden relative">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100" onClick={() => openLightbox(activeImage)}>
              <img src={currentProduct.images[activeImage]} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full text-xs font-bold text-[#1C1917] pointer-events-none">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {currentProduct.images.map((_, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-[#FF2865] w-4' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {currentProduct.images.map((img, idx) => (
              <div key={idx} onClick={() => openLightbox(idx)} className={`relative overflow-hidden cursor-zoom-in group ${idx === 0 ? 'col-span-2 aspect-[4/3]' : 'col-span-1 aspect-[3/4]'}`}>
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" /> Click to Zoom
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT DETAILS (Sticky) */}
        <div className="w-full lg:w-2/5 px-6 lg:px-0">
          <div className="sticky top-28 space-y-8">
            
            {/* Header Info */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">{currentProduct.name}</h1>
                <button className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#FF2865] transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-[#1C1917]">₹{currentProduct.price.toLocaleString()}</span>
                {currentProduct.originalPrice > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{currentProduct.originalPrice.toLocaleString()}</span>
                    <span className="bg-[#FF2865]/10 text-[#FF2865] text-xs font-bold px-2 py-1 rounded-sm uppercase">
                      {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* --- SPECIFICATIONS CARD --- */}
            <div className="bg-[#F9F8F6] rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-600 font-medium">Base Material</span>
                  <span className="text-sm font-bold text-[#1C1917]">{currentProduct.baseMaterial}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-600 font-medium">Craftsmanship</span>
                  <span className="text-sm font-bold text-[#1C1917] text-right max-w-[60%]">{currentProduct.craftsmanship}</span>
                </div>
                <div className="flex justify-between pt-1">
                   <span className="text-sm text-gray-600 font-medium">Category</span>
                   <span className="text-sm font-bold text-[#1C1917]">{currentProduct.category}</span>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">Select Size</span>
                <Link to="/size-chart" className="text-xs text-[#FF2865] underline decoration-1 underline-offset-2">Size Guide</Link>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {currentProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border flex items-center justify-center text-sm font-medium transition-all ${
                      selectedSize === size 
                        ? 'bg-[#1C1917] text-white border-[#1C1917]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF2865]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-xs text-red-500 mt-2 animate-pulse">* Please select a size</p>}
            </div>

            {/* Quantity & Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg h-14 w-32">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1C1917]"><Minus className="w-4 h-4" /></button>
                <span className="flex-1 text-center font-bold text-[#1C1917]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1C1917]"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-[#1C1917] text-white h-14 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all shadow-lg flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
            </div>

            {/* --- WASH & CARE GUIDE --- */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
               <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                 <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-[#FF2865]" /> Material & Care Guide
                 </h3>
               </div>
               <div className="p-5 space-y-4">
                 <p className="text-xs text-gray-500 leading-relaxed mb-4">
                   Your Beads & Bloom juttis are handcrafted treasures. Treat them with love to ensure they last a lifetime.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <CareItem icon={Droplets} text="Avoid Water" sub="Keep away from moisture" />
                    <CareItem icon={Sun} text="No Direct Sun" sub="Prevents color fading" />
                    <CareItem icon={Feather} text="Soft Brush" sub="For gentle cleaning" />
                    <CareItem icon={Wind} text="Air Dry" sub="Store in dust bag" />
                 </div>
                 <div className="bg-[#FF2865]/5 p-3 rounded-lg border border-[#FF2865]/10 mt-2">
                   <p className="text-[10px] text-gray-600">
                     <span className="font-bold text-[#FF2865]">Pro Tip:</span> For heavy embroidered pairs (Zardozi/Dabka), we strictly recommend <strong>Dry Clean Only</strong>. Rotate pairs regularly to prevent creasing.
                   </p>
                 </div>
               </div>
            </div>

            {/* Editor's Note */}
            <div className="bg-[#F9F8F6] p-6 rounded-xl mt-4">
              <h3 className="font-serif text-lg mb-2">Editor's Note</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light">{currentProduct.description}</p>
            </div>

            {/* Info Accordions */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <InfoRow icon={Truck} title="Shipping" text="Free shipping on orders over ₹2000. Delivered in 5-7 days." />
              <InfoRow icon={RefreshCcw} title="Returns" text="Exchange available within 48 hours for size issues." />
            </div>

          </div>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <ReviewSection />

      {/* --- RELATED PRODUCTS --- */}
      <RelatedProducts currentId={currentProduct._id} />

    </div>
  );
}

// --------------------------------------------------------------------------
// --- SUB COMPONENTS (Same as before, keep them here) ---
// --------------------------------------------------------------------------

function CareItem({ icon: Icon, text, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-[#1C1917]">{text}</p>
        <p className="text-[9px] text-gray-400 uppercase tracking-wide">{sub}</p>
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
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-8 h-8" /></button>
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in" onMouseMove={handleMouseMove} onClick={() => setIsZoomed(!isZoomed)}>
        <img src={images[currentIndex]} alt="Zoom View" className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out" style={{ transform: isZoomed ? 'scale(2.5)' : 'scale(1)', transformOrigin: `${position.x}% ${position.y}%`, cursor: isZoomed ? 'zoom-out' : 'zoom-in' }} />
      </div>
      {!isZoomed && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
          {images.map((img, idx) => (
            <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }} className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-[#FF2865] scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}>
              <img src={img} className="w-full h-full object-cover" alt="thumb" />
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
      <div className="p-2 bg-gray-50 rounded-full text-[#FF2865]"><Icon className="w-4 h-4" /></div>
      <div><h4 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] mb-1">{title}</h4><p className="text-xs text-gray-500 leading-relaxed max-w-xs">{text}</p></div>
    </div>
  );
}

function ReviewSection() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100 mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#1C1917]">Customer Reviews</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-xs font-bold uppercase tracking-widest border-b border-[#1C1917] pb-1 hover:text-[#FF2865] hover:border-[#FF2865] transition-colors">{showForm ? 'Cancel Review' : 'Write a Review'}</button>
      </div>
      {showForm && (
        <form className="bg-[#F9F8F6] p-8 rounded-2xl mb-12 animate-fade-up">
           <div className="mb-4"><label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Your Rating</label><div className="flex gap-2 text-gray-300">{[1,2,3,4,5].map(star => <Star key={star} className="w-6 h-6 hover:text-[#FFCB45] cursor-pointer transition-colors" />)}</div></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><input type="text" placeholder="Your Name" className="p-3 bg-white rounded-lg border border-gray-200 outline-none focus:border-[#FF2865]" /><input type="email" placeholder="Email Address" className="p-3 bg-white rounded-lg border border-gray-200 outline-none focus:border-[#FF2865]" /></div>
           <textarea rows="4" placeholder="How was the fit and comfort?" className="w-full p-3 bg-white rounded-lg border border-gray-200 outline-none focus:border-[#FF2865] mb-4"></textarea>
           <button className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase text-xs hover:bg-[#FF2865] transition-colors">Submit Review</button>
        </form>
      )}
      <div className="space-y-6">
        {/* We will connect real reviews later */}
        <div className="border-b border-gray-100 pb-6"><div className="flex justify-between items-start mb-2"><div><div className="flex text-[#FFCB45] mb-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}</div><h4 className="font-bold text-[#1C1917]">Ananya S.</h4></div><span className="text-xs text-gray-400">2 days ago</span></div><p className="text-gray-600 text-sm italic">"Absolutely stunning! The padding is so soft, I wore them for my entire Sangeet."</p></div>
      </div>
    </div>
  );
}

function RelatedProducts({ currentId }) {
  // We can eventually filter this from the Redux store too
  // For now, let's just show a few placeholder links to other products
  const { items } = useSelector((state) => state.products);
  const related = items.filter(p => p._id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-16 bg-[#F9F8F6]">
       <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-serif text-[#1C1917]">You May Also Like</h2><Link to="/shop" className="text-xs font-bold uppercase tracking-widest hover:text-[#FF2865]">View All</Link></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <Link to={`/product/${p._id}`} key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-xl mb-3 relative aspect-[3/4]"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <h3 className="font-serif text-[#1C1917] group-hover:text-[#FF2865] transition-colors">{p.name}</h3><p className="text-sm font-bold text-gray-500">₹{p.price}</p>
              </Link>
            ))}
          </div>
       </div>
    </section>
  );
}