import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Actions
import { addToCart } from '../redux/cartSlice';
import { toggleWishlistAPI, toggleWishlistLocal } from '../redux/wishlistSlice';
import { getOptimizedImage } from '../util/imageUtils';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get Data
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- HANDLERS ---
  
  const handleRemove = (product) => {
    if (userInfo) {
      dispatch(toggleWishlistAPI(product)); // Remove from DB
    } else {
      dispatch(toggleWishlistLocal(product)); // Remove from LocalStorage
    }
    toast.success("Removed from Wishlist");
  };

  const handleMoveToCart = (product) => {
    // 1. Add to Cart (Defaulting to first size if available, or force user to choose)
    // Since size selection is complex, it's safer to redirect to Product Detail
    // OR add with default size if your logic supports it.
    
    // Strategy: Redirect user to product page to select size
    navigate(`/product/${product._id}`);
    toast('Please select a size to add to bag', { icon: '📏' });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24 animate-fade-in">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6 text-[#FF2865]">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm text-sm sm:text-base">
          Save items you love here for later.
        </p>
        <Link
          to="/shop"
          className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3 mb-10">
            <Heart className="w-6 h-6 text-[#FF2865] fill-[#FF2865]" />
            <h1 className="text-3xl font-serif text-[#1C1917]">My Wishlist ({wishlistItems.length})</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {wishlistItems.map((product) => {
             // Handle case where product might be null (if deleted from DB)
             if(!product) return null;

             const image = product.images ? product.images[0] : product.image;
             
             return (
              <div key={product._id} className="group relative">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-4">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={getOptimizedImage(image, 600)} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Quick Action Overlay (Desktop) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
                     <button 
                       onClick={() => handleMoveToCart(product)}
                       className="w-full bg-white text-[#1C1917] py-3 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-[#1C1917] hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2"
                     >
                       <ShoppingBag className="w-4 h-4" /> View Product
                     </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-serif text-lg text-[#1C1917] truncate group-hover:text-[#FF2865] transition-colors">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  </div>
                  
                  {/* Mobile Only 'Move to Bag' Button */}
                  <button 
                     onClick={() => handleMoveToCart(product)}
                     className="lg:hidden mt-3 w-full border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold uppercase tracking-wide"
                  >
                     View Product
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}