import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Minus, Plus, Truck, RefreshCcw, 
  ShieldCheck, ShoppingBag, X, ZoomIn
} from 'lucide-react';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { API_BASE_URL } from '../util/config'; 

// UTILS IMPORT
import { getOptimizedImage } from '../util/imageUtils';

// LOADER IMPORTS
import { ProductDetailSkeleton } from '../components/loaders/SectionLoader';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // 1. GET DATA
  const { product: currentProduct, loading, error } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);

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

  // --- 1. LOADING STATE ---
  if (loading) return <ProductDetailSkeleton />;
  
  // Error State
  if (error || !currentProduct) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-serif text-red-500">Product Not Found</p>
        <Link to="/shop" className="underline hover:text-[#FF2865]">Return to Shop</Link>
    </div>
  );

  // --- REAL-TIME STOCK CALCULATION ---
  const dbStock = selectedSize && currentProduct?.stock
    ? currentProduct.stock.find(s => s.size === selectedSize)?.quantity || 0
    : 0;

  const cartItem = cart.items.find(
    item => item.id === currentProduct?._id && item.size === selectedSize
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (quantity > remainingStock) {
      alert(`Sorry, you can only add ${remainingStock} more of this size.`);
      return;
    }

    dispatch(addToCart({
      id: currentProduct._id,
      name: currentProduct.name,
      image: currentProduct.images[0], 
      price: currentProduct.price,
      quantity: quantity,
      size: selectedSize
    }));
  };

  // --- IMAGE OPTIMIZATION ---
  const optimizedImages = currentProduct.images.map(img => getOptimizedImage(img, 1000));

  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox 
          images={optimizedImages} 
          initialIndex={activeImage} 
          onClose={() => setIsLightboxOpen(false)} 
        />
      )}

      <div className="max-w-[1440px] mx-auto px-0 md:px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="w-full lg:w-3/5">
           
           {/* MOBILE VIEW: Horizontal Scroll Snap */}
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
           <div className="hidden lg:grid grid-cols-2 gap-4">
            {optimizedImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => openLightbox(idx)} 
                className={`relative overflow-hidden cursor-zoom-in group ${idx === 0 ? 'col-span-2 aspect-[4/3]' : 'col-span-1 aspect-[3/4]'}`}
              >
                <img 
                  src={img} 
                  alt={`${currentProduct.name} - View ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Zoom Icon Hint */}
                <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-4 h-4 text-[#1C1917]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT DETAILS */}
        <div className="w-full lg:w-2/5 px-6 lg:px-0">
          <div className="sticky top-28 space-y-8">
            
            {/* Header Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">{currentProduct.name}</h1>
              <div className="flex items-center gap-4 mb-4 mt-2">
                <span className="text-2xl font-bold text-[#1C1917]">₹{currentProduct.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">Select Size (EU)</span>
                <Link to="/size-chart" className="text-xs text-[#FF2865] underline decoration-1 underline-offset-2">Size Guide</Link>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {currentProduct.stock?.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => handleSizeSelect(item.size)}
                    disabled={item.quantity === 0}
                    className={`h-12 border flex items-center justify-center text-sm font-medium transition-all relative overflow-hidden
                      ${item.quantity === 0 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100'
                        : selectedSize === item.size 
                          ? 'bg-[#1C1917] text-white border-[#1C1917]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF2865]'
                      }`}
                  >
                    {item.size}
                    {item.quantity === 0 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1px] bg-gray-300 rotate-45"></div></div>}
                  </button>
                ))}
              </div>
              
              {/* --- DYNAMIC STOCK MESSAGES --- */}
              {selectedSize && (
                <>
                  {remainingStock === 0 && dbStock > 0 ? (
                    <p className="text-xs text-orange-500 mt-2 font-bold animate-pulse">
                      You have all available items in your bag!
                    </p>
                  ) : remainingStock === 0 && dbStock === 0 ? (
                    <p className="text-xs text-red-500 mt-2 font-bold">This size is currently Sold Out.</p>
                  ) : remainingStock <= 5 ? (
                    <p className="text-xs text-orange-500 mt-2 font-bold">
                      Hurry! Only {remainingStock} pairs left.
                    </p>
                  ) : null}
                </>
              )}
            </div>

            {/* Quantity & Cart Section */}
            <div className="flex gap-4">
              <div className={`flex items-center border border-gray-200 rounded-lg h-14 w-32 ${!selectedSize || remainingStock === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1C1917]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-bold text-[#1C1917]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(remainingStock, quantity + 1))} 
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#1C1917]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Button Logic */}
              {dbStock === 0 ? (
                 <button disabled className="flex-1 bg-gray-200 text-gray-400 h-14 rounded-lg font-bold uppercase tracking-widest text-xs cursor-not-allowed flex items-center justify-center gap-2">
                   Select Size
                 </button>
              ) : remainingStock === 0 ? (
                 <button disabled className="flex-1 bg-orange-100 text-orange-400 h-14 rounded-lg font-bold uppercase tracking-widest text-xs cursor-not-allowed flex items-center justify-center gap-2">
                   Max Limit Reached
                 </button>
              ) : (
                <button 
                  onClick={handleAddToCart} 
                  disabled={!selectedSize}
                  className={`flex-1 h-14 rounded-lg font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2
                    ${selectedSize ? 'bg-[#1C1917] text-white hover:bg-[#FF2865]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  <ShoppingBag className="w-4 h-4" /> {selectedSize ? 'Add to Bag' : 'Select Size'}
                </button>
              )}
            </div>

            {/* Info Rows */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <InfoRow icon={Truck} title="Free Shipping" text="On all orders above ₹999 across India." />
              <InfoRow icon={RefreshCcw} title="Easy Returns" text="7-day hassle-free return policy." />
              <InfoRow icon={ShieldCheck} title="Secure Payment" text="100% secure payment processing." />
            </div>

            {/* Editor's Note */}
            <div className="bg-[#F9F8F6] p-6 rounded-xl mt-4">
              <h3 className="font-serif text-lg mb-2">Editor's Note</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light">{currentProduct.description}</p>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Sub Components */}
      <ReviewSection productId={id} />
      <RelatedProducts currentId={currentProduct._id} />
    </div>
  );
}

// --- SUB COMPONENTS ---

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

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');

      setMessage("Review submitted! It will appear after approval.");
      setComment('');
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100 mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#1C1917]">Customer Reviews ({reviews.length})</h2>
        {userInfo ? (
          <button onClick={() => setShowForm(!showForm)} className="text-xs font-bold uppercase tracking-widest border-b border-[#1C1917] pb-1 hover:text-[#FF2865] transition-colors">
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        ) : (
          <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-[#FF2865]">Login to Review</Link>
        )}
      </div>

      {message && <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-sm font-bold">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-sm font-bold">{error}</div>}

      {showForm && (
        <form onSubmit={submitHandler} className="bg-[#F9F8F6] p-8 rounded-2xl mb-12 animate-fade-up">
           <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 cursor-pointer ${star <= rating ? 'fill-[#FFCB45] text-[#FFCB45]' : 'text-gray-300'}`} onClick={() => setRating(star)} />
              ))}
            </div>
           </div>
           <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review..." className="w-full p-3 rounded-lg border border-gray-200 mb-4"></textarea>
           <button className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase text-xs">Submit</button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? <p className="text-gray-400 italic">No reviews yet.</p> : reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-100 pb-6">
            <div className="flex justify-between mb-2">
              <div>
                <div className="flex text-[#FFCB45] mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />)}
                </div>
                <h4 className="font-bold text-[#1C1917]">{review.name}</h4>
              </div>
              <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProducts({ currentId }) {
  const { items } = useSelector((state) => state.products);
  const related = items.filter(p => p._id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-16 bg-[#F9F8F6]">
       <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-serif text-[#1C1917]">You May Also Like</h2><Link to="/shop" className="text-xs font-bold uppercase tracking-widest hover:text-[#FF2865]">View All</Link></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p, i) => {
               const optImg = getOptimizedImage(p.images ? p.images[0] : p.image, 400);
               return (
                  <Link to={`/product/${p._id}`} key={i} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-xl mb-3 relative aspect-[3/4]">
                        <img src={optImg} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="font-serif text-[#1C1917] group-hover:text-[#FF2865] transition-colors">{p.name}</h3><p className="text-sm font-bold text-gray-500">₹{p.price.toLocaleString()}</p>
                  </Link>
               );
            })}
          </div>
       </div>
    </section>
  );
}