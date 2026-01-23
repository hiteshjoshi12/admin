import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Minus, Plus, Heart, Truck, RefreshCcw, 
  ShieldCheck, ShoppingBag, X, ZoomIn, Droplets, Sun, Wind, Feather
} from 'lucide-react';

// --- DATABASE (J1 - J12) ---
// This acts as your product database. 
// In the future, this data will come from your Backend/CMS.
const productsDatabase = [
  {
    id: 1,
    name: "The Royal Silk Dabka",
    price: 4200,
    originalPrice: 5500,
    base: "Pure Silk",
    work: "Hand-done Dabka & Bead Work",
    description: "A regal masterpiece featuring intricate Dabka artistry on a luxurious pure silk base. Perfect for weddings and high-end soirées.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [36, 37, 38, 39, 40, 41]
  },
  {
    id: 2,
    name: "Gotta Pati Charm",
    price: 3800,
    originalPrice: 4500,
    base: "Pure Crepe",
    work: "Traditional Gotta Pati & Bead Work",
    description: "The vibrancy of Gotta Pati meets the sheen of pure crepe. A festive essential that captures the spirit of celebration.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [36, 37, 38, 39, 40]
  },
  {
    id: 3,
    name: "Bharwa Tanka Heritage",
    price: 4100,
    originalPrice: null,
    base: "Pure Crepe",
    work: "Bharwa Tanka Work with Beads",
    description: "Filled with history, the Bharwa Tanka technique creates a dense, rich texture that makes this pair a true collector's item.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [37, 38, 39, 40]
  },
  {
    id: 4,
    name: "Mirror & Bead Illusion",
    price: 3500,
    originalPrice: 4200,
    base: "Pure Crepe",
    work: "Real Mirror Work & Beads",
    description: "Reflecting light with every step, the real mirror work on pure crepe adds a glamorous sparkle to any outfit.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [36, 37, 38, 39, 40, 41]
  },
  {
    id: 5,
    name: "Chain Stitch Elegance",
    price: 3200,
    originalPrice: null,
    base: "Pure Crepe",
    work: "Chain Stitch, Sequins & Dabka",
    description: "A delicate fusion of chain stitch fluency and the sparkle of sequins, finished with a touch of antique Dabka.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [38, 39, 40]
  },
  {
    id: 6,
    name: "Golden Zari Classic",
    price: 3600,
    originalPrice: 4000,
    base: "Pure Crepe",
    work: "Traditional Zari with Gold Metallic Threads",
    description: "Timeless luxury. The gold-tone metallic threads woven into traditional Zari work create an aura of royalty.",
   images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [36, 37, 38, 39, 40, 41]
  },
  {
    id: 7,
    name: "Thread & Mirror Fusion",
    price: 3400,
    originalPrice: null,
    base: "Pure Crepe",
    work: "Mirror Work with Thread Detailing",
    description: "A playful yet sophisticated combination of mirrors and colorful thread detailing on a smooth crepe canvas.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [36, 37, 38, 39, 40]
  },
  {
    id: 8,
    name: "Floral Resham Beads",
    price: 3900,
    originalPrice: 4500,
    base: "Pure Crepe",
    work: "Seed Beads & Resham Outlining",
    description: "Tiny seed beads meet soft silk (Resham) threads to create delicate floral motifs that bloom on your feet.",
    images: ["https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071706/IMG_0705_odxdlw.jpg", "https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg","https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071749/IMG_0336_bqm5ue.jpg"],
    sizes: [36, 37, 38, 39, 40, 41]
  },
  {
    id: 9,
    name: "Silk Zardozi Cut-Dana",
    price: 4500,
    originalPrice: 6000,
    base: "Pure Silk",
    work: "Zardozi Bead, Cut Dana & Sequins",
    description: "Our premium offering. A silk base heavily embellished with a mix of Zardozi, sharp Cut Dana, and shimmering sequins.",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200"],
    sizes: [37, 38, 39, 40]
  },
  {
    id: 10,
    name: "Phulkari Shisha Edit",
    price: 3300,
    originalPrice: null,
    base: "Pure Crepe",
    work: "Phulkari Inspired Embroidery & Shisha",
    description: "Inspired by the vibrant heritage of Punjab, featuring Phulkari-style geometric patterns highlighted by Shisha glass work.",
    images: ["https://images.unsplash.com/photo-1600185365926-3a223ddc3410?q=80&w=1200"],
    sizes: [36, 37, 38, 39, 40, 41]
  },
  {
    id: 11,
    name: "Resham Zardozi Royale",
    price: 4400,
    originalPrice: 5200,
    base: "Pure Crepe",
    work: "Cut Dana Zardozi, Sequins & Resham",
    description: "An intricate dance of textures. Sharp cut dana and soft resham threads come together to create a multi-dimensional look.",
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1200"],
    sizes: [36, 37, 38, 39, 40]
  },
  {
    id: 12,
    name: "Silver Thread Zardozi",
    price: 4000,
    originalPrice: null,
    base: "Pure Crepe",
    work: "Zardozi & Silver Thread Embroidery",
    description: "Cool toned elegance. Silver threads woven into Zardozi patterns on crepe, perfect for evening wear.",
    images: ["https://images.unsplash.com/photo-1596253406560-c3d3284d7285?q=80&w=1200"],
    sizes: [36, 37, 38, 39, 40, 41]
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  
  // Find product by ID, default to first if not found (for safety)
  const product = productsDatabase.find(p => p.id === parseInt(id)) || productsDatabase[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    alert(`Added ${quantity} pair(s) of ${product.name} (Size ${selectedSize}) to cart!`);
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* --- LIGHTBOX --- */}
      {isLightboxOpen && (
        <Lightbox 
          images={product.images} 
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
              <img src={product.images[activeImage]} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full text-xs font-bold text-[#1C1917] pointer-events-none">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {product.images.map((_, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-[#FF2865] w-4' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {product.images.map((img, idx) => (
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
                <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">{product.name}</h1>
                <button className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#FF2865] transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-[#1C1917]">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="bg-[#FF2865]/10 text-[#FF2865] text-xs font-bold px-2 py-1 rounded-sm uppercase">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* --- SPECIFICATIONS CARD (New Professional Look) --- */}
            <div className="bg-[#F9F8F6] rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-600 font-medium">Base Material</span>
                  <span className="text-sm font-bold text-[#1C1917]">{product.base}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-600 font-medium">Craftsmanship</span>
                  <span className="text-sm font-bold text-[#1C1917] text-right max-w-[60%]">{product.work}</span>
                </div>
                <div className="flex justify-between pt-1">
                   <span className="text-sm text-gray-600 font-medium">Padding</span>
                   <span className="text-sm font-bold text-[#1C1917]">Double Cushioned</span>
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
                {product.sizes.map((size) => (
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

            {/* --- WASH & CARE GUIDE (Professional Layout) --- */}
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
      <RelatedProducts currentId={product.id} />

    </div>
  );
}

// --------------------------------------------------------------------------
// --- SUB COMPONENTS ---
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
        <div className="border-b border-gray-100 pb-6"><div className="flex justify-between items-start mb-2"><div><div className="flex text-[#FFCB45] mb-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}</div><h4 className="font-bold text-[#1C1917]">Ananya S.</h4></div><span className="text-xs text-gray-400">2 days ago</span></div><p className="text-gray-600 text-sm italic">"Absolutely stunning! The padding is so soft, I wore them for my entire Sangeet."</p></div>
      </div>
    </div>
  );
}

function RelatedProducts({ currentId }) {
  const products = [
    { id: 2, name: "Gotta Pati Charm", price: "₹3,800", img: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600" },
    { id: 3, name: "Bharwa Heritage", price: "₹4,100", img: "https://images.unsplash.com/photo-1605218427368-35b866c24195?q=80&w=600" },
    { id: 6, name: "Golden Zari Classic", price: "₹3,600", img: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=600" },
    { id: 9, name: "Silk Zardozi", price: "₹4,500", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600" }
  ].filter(p => p.id !== currentId).slice(0, 4);

  return (
    <section className="py-16 bg-[#F9F8F6]">
       <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-serif text-[#1C1917]">You May Also Like</h2><Link to="/shop" className="text-xs font-bold uppercase tracking-widest hover:text-[#FF2865]">View All</Link></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <Link to={`/product/${p.id}`} key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-xl mb-3 relative aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <h3 className="font-serif text-[#1C1917] group-hover:text-[#FF2865] transition-colors">{p.name}</h3><p className="text-sm font-bold text-gray-500">{p.price}</p>
              </Link>
            ))}
          </div>
       </div>
    </section>
  );
}