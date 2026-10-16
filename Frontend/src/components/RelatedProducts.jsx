import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Heart, ArrowRight, Ruler } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { toggleWishlistAPI, toggleWishlistLocal } from '../redux/wishlistSlice';
import { getOptimizedImage } from '../util/imageUtils';
import { API_BASE_URL } from '../util/config';

export default function RelatedProducts({ currentId, currentProduct }) {
  const { items } = useSelector((state) => state.products);
  const wishlist = useSelector((state) => state.wishlist.items);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [fetchedRelated, setFetchedRelated] = useState([]);

  // Extract primary category
  const categories = Array.isArray(currentProduct?.category) ? currentProduct.category : [];
  const primaryCategory = categories.length > 0 ? categories[0] : null;

  // Determine collection hub link
  const collectionHubMap = {
    bridal: { name: 'Bridal Juttis', route: '/collection/bridal' },
    festive: { name: 'Festive Juttis', route: '/collection/festive' },
    casual: { name: 'Casual Juttis', route: '/collection/casual' },
    party: { name: 'Festive Juttis', route: '/collection/festive' },
    everyday: { name: 'Casual Juttis', route: '/collection/casual' },
  };

  const matchedHub = primaryCategory && collectionHubMap[primaryCategory.toLowerCase()]
    ? collectionHubMap[primaryCategory.toLowerCase()]
    : { name: 'All Juttis', route: '/shop' };

  // 1. If Redux items is empty (e.g. direct crawl / page entry), fetch from API
  useEffect(() => {
    let isMounted = true;

    const loadRelatedFromAPI = async () => {
      try {
        const queryCat = primaryCategory ? encodeURIComponent(primaryCategory) : '';
        const url = queryCat
          ? `${API_BASE_URL}/api/products?category=${queryCat}&pageSize=6`
          : `${API_BASE_URL}/api/products?pageSize=6`;

        const res = await fetch(url);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || [];
        const filtered = list.filter((p) => p._id !== currentId).slice(0, 4);

        if (isMounted) {
          if (filtered.length >= 2) {
            setFetchedRelated(filtered);
          } else {
            // Fallback: general products
            const fallbackRes = await fetch(`${API_BASE_URL}/api/products?pageSize=6`);
            const fallbackData = await fallbackRes.json();
            const fallbackList = Array.isArray(fallbackData) ? fallbackData : fallbackData.products || [];
            if (isMounted) {
              setFetchedRelated(fallbackList.filter((p) => p._id !== currentId).slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error("Related products fetch failed:", err);
      }
    };

    if (!items || items.length === 0) {
      loadRelatedFromAPI();
    }
    return () => { isMounted = false; };
  }, [currentId, primaryCategory, items]);

  // 2. Select best candidate items
  let displayProducts = [];
  if (items && items.length > 0) {
    // Priority: products sharing at least one category
    const categoryMatches = items.filter(
      (p) => p._id !== currentId && p.category && p.category.some((c) => categories.includes(c))
    );
    const otherProducts = items.filter((p) => p._id !== currentId && !categoryMatches.includes(p));
    displayProducts = [...categoryMatches, ...otherProducts].slice(0, 4);
  } else {
    displayProducts = fetchedRelated;
  }

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#F9F8F6] border-t border-gray-100" aria-label="Related Handcrafted Juttis">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
              Curated Recommendations
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917]">
              You May Also Like
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={matchedHub.route}
              className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors"
            >
              Explore {matchedHub.name} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((p) => {
            const optImg = getOptimizedImage(
              p.images && p.images.length > 0 ? p.images[0] : p.image,
              400
            );
            const isWishlisted = wishlist.some((item) => item._id === p._id);

            const toggleLike = (e) => {
              e.preventDefault();
              const willAdd = !isWishlisted; 

              if (userInfo) {
                dispatch(toggleWishlistAPI(p))
                  .unwrap()
                  .then(() => toast.success(willAdd ? "Added to Wishlist" : "Removed from Wishlist"))
                  .catch(() => toast.error("Could not update wishlist"));
              } else {
                dispatch(toggleWishlistLocal(p));
                toast.success(willAdd ? "Added to Wishlist" : "Removed from Wishlist");
              }
            };

            return (
              <div key={p._id} className="group relative flex flex-col">
                <Link to={`/product/${p.slug}`} className="block relative">
                  <div className="overflow-hidden rounded-xl mb-3 relative aspect-[3/4] bg-gray-100 shadow-sm">
                    <img
                      src={optImg}
                      alt={`${p.name} - Handcrafted Indian Jutti`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={toggleLike}
                  aria-label={`Save ${p.name} to wishlist`}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-[#FF2865] text-[#FF2865]" : "text-gray-700 hover:text-[#FF2865]"}`}
                  />
                </button>

                <div>
                  <Link to={`/product/${p.slug}`} className="block">
                    <h3 className="font-serif text-sm md:text-base text-[#1C1917] group-hover:text-[#8B5E3C] transition-colors truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#1C1917] mt-1">
                      ₹{p.price.toLocaleString()}
                    </p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sizing Help Contextual Strip */}
        <div className="mt-12 pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#8B5E3C]" />
            Unsure about sizing? Handcrafted Punjabi juttis stretch gently to fit.
          </p>
          <Link to="/size-chart" className="font-bold uppercase tracking-widest text-[#1C1917] hover:text-[#FF2865] underline">
            View Sizing Chart & Measure Guide →
          </Link>
        </div>

      </div>
    </section>
  );
}