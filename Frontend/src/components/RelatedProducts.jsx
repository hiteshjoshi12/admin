import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Heart } from 'lucide-react'; // 👈 Import Icon
import { toast } from 'react-hot-toast'; // 👈 Import Toast

// Import Redux Actions
import { toggleWishlistAPI, toggleWishlistLocal } from '../redux/wishlistSlice';

// Import Utility
import { getOptimizedImage } from '../util/imageUtils';

export default function RelatedProducts({ currentId }) {
  // Get all products to filter from (or you might fetch specific related ones)
  const { items } = useSelector((state) => state.products);
  
  // Get Wishlist & Auth
  const wishlist = useSelector((state) => state.wishlist.items);
  const { userInfo } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();

  // Filter: exclude current product, take first 4
  const related = items.filter((p) => p._id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-16 bg-[#F9F8F6]">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif text-[#1C1917]">
            You May Also Like
          </h2>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest hover:text-[#FF2865]"
          >
            View All
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p) => {
            // 1. Optimize Image
            const optImg = getOptimizedImage(
              p.images ? p.images[0] : p.image,
              400
            );

            // 2. Check Wishlist Status
            const isWishlisted = wishlist.some((item) => item._id === p._id);

            // 3. Toggle Handler (Prevents Double Toast)
            const toggleLike = (e) => {
              e.preventDefault(); // Stop navigation to product page
              const willAdd = !isWishlisted; 

              if (userInfo) {
                // Logged In: API
                dispatch(toggleWishlistAPI(p))
                  .unwrap()
                  .then(() => {
                    if (willAdd) toast.success("Added to Wishlist");
                    else toast.success("Removed from Wishlist");
                  })
                  .catch(() => toast.error("Could not update wishlist"));
              } else {
                // Guest: Local Storage
                dispatch(toggleWishlistLocal(p));
                if (willAdd) toast.success("Added to Wishlist");
                else toast.success("Removed from Wishlist");
              }
            };

            return (
              <div key={p._id} className="group relative">
                <Link to={`/product/${p._id}`} className="block">
                  <div className="overflow-hidden rounded-xl mb-3 relative aspect-[3/4] bg-gray-100">
                    <img
                      src={optImg}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-[#1C1917] group-hover:text-[#FF2865] transition-colors truncate">
                    {p.name}
                  </h3>
                  <p className="text-sm font-bold text-gray-500">
                    ₹{p.price.toLocaleString()}
                  </p>
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={toggleLike}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-600"}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}