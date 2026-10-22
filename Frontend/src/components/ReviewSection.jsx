import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  CheckCircle,
  ThumbsUp,
  Image as ImageIcon,
  Upload,
  X,
  Sparkles,
  Camera,
  Filter,
  ChevronDown,
  MessageSquareHeart,
  Loader2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../util/config";
import { getOptimizedImage } from "../util/imageUtils";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchParams] = useSearchParams();

  // Filter state
  const [starFilter, setStarFilter] = useState(null); // null or 1-5
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'with_photos', 'verified'

  // Photo Lightbox State
  const [zoomImage, setZoomImage] = useState(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [purchasedSize, setPurchasedSize] = useState("");
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Voted tracking (local storage cache so user doesn't multi-vote in same session)
  const [votedReviews, setVotedReviews] = useState(() => {
    try {
      const stored = localStorage.getItem("votedReviews");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const { userInfo } = useSelector((state) => state.auth);

  // Auto-open review form if query param has ?writeReview=true
  useEffect(() => {
    if (searchParams.get("writeReview") === "true") {
      setShowForm(true);
      const urlSize = searchParams.get("size");
      if (urlSize) setPurchasedSize(urlSize);
    }
  }, [searchParams]);

  // Fetch approved reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);

        // Check if user already reviewed
        if (userInfo) {
          const myReview = data.find((r) => r.user === userInfo._id);
          if (myReview) {
            setIsEditing(true);
            setEditReviewId(myReview._id);
            setRating(myReview.rating || 5);
            setTitle(myReview.title || "");
            setComment(myReview.comment || "");
            setPurchasedSize(myReview.purchasedSize || "");
            setImages(myReview.images || []);
          } else {
            setIsEditing(false);
            setEditReviewId(null);
            setRating(5);
            setTitle("");
            setComment("");
            setImages([]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, userInfo]);

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (images.length >= 3) {
      toast.error("You can upload up to 3 customer photos");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large (Max 15MB)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "reviews");

    setUploadingImage(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload/customer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setImages((prev) => [...prev, data.url]);
      toast.success("Photo attached!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploadingImage(false);
      e.target.value = null;
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Review Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter your review feedback");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = isEditing && editReviewId
        ? `${API_BASE_URL}/api/reviews/${editReviewId}`
        : `${API_BASE_URL}/api/reviews/${productId}`;

      const method = isEditing && editReviewId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
          purchasedSize,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error submitting review");

      toast.success(
        isEditing
          ? "Review updated! It is now pending verification."
          : "Review submitted! Thank you for sharing your experience.",
        { icon: "✨" }
      );

      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helpful Vote Handler
  const handleHelpfulVote = async (reviewId) => {
    if (votedReviews.includes(reviewId)) {
      toast("You already marked this review as helpful", { icon: "👍" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        // Optimistically update list
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, helpfulVotes: data.helpfulVotes } : r
          )
        );
        const updated = [...votedReviews, reviewId];
        setVotedReviews(updated);
        localStorage.setItem("votedReviews", JSON.stringify(updated));
        toast.success("Thank you for your feedback!");
      }
    } catch (err) {
      console.error("Helpful vote error", err);
    }
  };

  // Rating breakdown calculation
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
      : "0.0";

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating || 5);
    if (starCounts[star] !== undefined) {
      starCounts[star]++;
    }
  });

  // Extract all customer photos for the gallery strip
  const allCustomerPhotos = reviews.reduce((acc, r) => {
    if (Array.isArray(r.images) && r.images.length > 0) {
      r.images.forEach((img) => {
        acc.push({
          url: img,
          reviewer: r.name,
          rating: r.rating,
          title: r.title,
          size: r.purchasedSize,
        });
      });
    }
    return acc;
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (starFilter && Math.round(r.rating) !== starFilter) return false;
    if (activeTab === "with_photos" && (!r.images || r.images.length === 0)) return false;
    if (activeTab === "verified" && !r.isVerifiedPurchase) return false;
    return true;
  });

  const ratingDescriptions = {
    5: "Exceptional Fit & Craftsmanship",
    4: "Very Good - Satisfied",
    3: "Average - Good Value",
    2: "Below Expectations",
    1: "Poor - Not Satisfied",
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-gray-100">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B5E3C] block mb-1">
            Real Customer Impressions
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1C1917]">
            Verified Customer Reviews
          </h2>
        </div>

        {userInfo ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white hover:bg-[#FF2865] transition-all shadow-sm self-start md:self-auto"
          >
            {showForm ? "Close Form" : isEditing ? "Edit Your Review" : "Write a Review"}
          </button>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all self-start md:self-auto"
          >
            Sign in to Write a Review
          </Link>
        )}
      </div>

      {/* RATING BREAKDOWN & SUMMARY CARD */}
      {totalReviews > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F9F8F6] p-6 md:p-8 rounded-3xl border border-gray-200/80 mb-12">
          {/* Average Score */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:border-r lg:border-gray-200/80 lg:pr-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-serif font-bold text-[#1C1917]">
                {averageRating}
              </span>
              <span className="text-lg text-gray-400 font-medium">/ 5.0</span>
            </div>

            <div className="flex text-[#FFCB45] gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-[#FFCB45]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-gray-600 font-medium">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"} from verified buyers
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine Artisan Feedback
            </div>
          </div>

          {/* Star Progress Bars */}
          <div className="lg:col-span-8 flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star] || 0;
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              const isSelected = starFilter === star;

              return (
                <button
                  key={star}
                  onClick={() => setStarFilter(isSelected ? null : star)}
                  className={`flex items-center gap-3 w-full py-1 px-2 rounded-lg text-left transition-colors group ${
                    isSelected ? "bg-white shadow-2xs ring-1 ring-[#1C1917]" : "hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-1 w-16 text-xs font-bold text-gray-700">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-[#FFCB45] text-[#FFCB45]" />
                  </div>

                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1C1917] rounded-full transition-all duration-500 group-hover:bg-[#FF2865]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="w-14 text-right text-xs font-medium text-gray-500">
                    {count} ({percent}%)
                  </div>
                </button>
              );
            })}

            {starFilter && (
              <div className="mt-2 flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-600 font-medium">
                  Showing {starFilter}-star reviews only
                </span>
                <button
                  onClick={() => setStarFilter(null)}
                  className="text-xs text-[#FF2865] font-bold underline"
                >
                  Show all ratings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMER PHOTO GALLERY STRIP (IF ANY CUSTOMER PHOTOS EXIST) */}
      {allCustomerPhotos.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-[#1C1917] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#8B5E3C]" /> Customer Fit Photos ({allCustomerPhotos.length})
            </h3>
            <span className="text-xs text-gray-400">Click any photo to enlarge</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {allCustomerPhotos.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setZoomImage(item)}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 hover:scale-104 transition-transform group relative cursor-pointer"
              >
                <img
                  src={getOptimizedImage(item.url, 200)}
                  alt="Customer Review Shot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                  View
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* REVIEW SUBMISSION FORM MODAL / COLLAPSIBLE */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-[#FAF8F5] border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8B5E3C]" />
                  <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                    {isEditing ? "Update Your Review" : "Share Your Experience"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                {/* 1. Rating Selector with description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-115 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || rating)
                                ? "fill-[#FFCB45] text-[#FFCB45]"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-gray-600 ml-2">
                      {ratingDescriptions[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Review Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Review Title / Headline
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Stunning embroidery & zero bite!"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1C1917] bg-white text-sm"
                    />
                  </div>

                  {/* 3. Size Purchased */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Size Purchased (EU)
                    </label>
                    <select
                      value={purchasedSize}
                      onChange={(e) => setPurchasedSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1C1917] bg-white text-sm"
                    >
                      <option value="">Select size you wear</option>
                      {["36", "37", "38", "39", "40", "41"].map((s) => (
                        <option key={s} value={s}>
                          EU {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Detailed Comment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Your Review *
                  </label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell other shoppers how the juttis fit (true to size or snug?), how comfortable the cushioning felt during wear, and how the craft looks in person..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1C1917] bg-white text-sm leading-relaxed"
                    required
                  />
                </div>

                {/* 5. Customer Photo Upload (Up to 3) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#8B5E3C]" /> Upload Customer Photos (Optional, Max 3)
                    </label>
                    <span className="text-[11px] text-gray-400">{images.length}/3 attached</span>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
                      >
                        <img
                          src={getOptimizedImage(img, 150)}
                          alt={`Upload preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {images.length < 3 && (
                      <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1C1917] transition-colors bg-white">
                        {uploadingImage ? (
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase">
                              Add Photo
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Notice & Submit */}
                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[11px] text-gray-500">
                    🔒 Reviews are automatically matched against verified orders. Submitted reviews will appear once approved by our moderation team.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="px-8 py-3.5 bg-[#1C1917] text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-[#FF2865] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isEditing ? "Update Review" : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER TABS */}
      {totalReviews > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                activeTab === "all"
                  ? "bg-[#1C1917] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("with_photos")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "with_photos"
                  ? "bg-[#1C1917] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              With Photos ({allCustomerPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab("verified")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "verified"
                  ? "bg-[#1C1917] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Verified Buyers ({reviews.filter((r) => r.isVerifiedPurchase).length})
            </button>
          </div>

          <span className="text-xs text-gray-400">
            Showing {filteredReviews.length} of {totalReviews} reviews
          </span>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredReviews.length === 0 ? (
          /* AUTHENTIC EMPTY STATE (PER REPORT INSTRUCTIONS) */
          <div className="bg-[#FAF8F5] p-10 md:p-14 rounded-3xl border border-gray-200 text-center max-w-2xl mx-auto my-8">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xs border border-gray-100 text-[#8B5E3C]">
              <MessageSquareHeart className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#1C1917] mb-2">
              Be the First to Review this Pair
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              No customer reviews yet for this artisanal piece. Were you one of our first customers? Share your fit, sizing, and comfort feedback to guide fellow patrons!
            </p>
            {userInfo ? (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3.5 bg-[#1C1917] text-white rounded-full font-bold uppercase text-xs tracking-wider hover:bg-[#FF2865] transition-all shadow-sm"
              >
                Write a Review
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-block px-8 py-3.5 bg-[#1C1917] text-white rounded-full font-bold uppercase text-xs tracking-wider hover:bg-[#FF2865] transition-all shadow-sm"
              >
                Sign In to Review
              </Link>
            )}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs space-y-4 hover:border-gray-200 transition-colors"
            >
              {/* Header: Stars + Verified Badge + Date */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex text-[#FFCB45] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (review.rating || 5) ? "fill-current" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {review.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified Buyer
                    </span>
                  )}

                  {review.purchasedSize && (
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-semibold">
                      Size: EU {review.purchasedSize}
                    </span>
                  )}
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="font-bold text-base text-[#1C1917]">{review.title}</h4>
              )}

              {/* Review Comment */}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {review.comment}
              </p>

              {/* Customer Photos */}
              {Array.isArray(review.images) && review.images.length > 0 && (
                <div className="flex gap-2.5 pt-2">
                  {review.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setZoomImage({
                          url: img,
                          reviewer: review.name,
                          rating: review.rating,
                          title: review.title,
                          size: review.purchasedSize,
                        })
                      }
                      className="w-18 h-18 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 hover:scale-104 transition-transform cursor-zoom-in"
                    >
                      <img
                        src={getOptimizedImage(img, 200)}
                        alt={`Customer photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Footer: Reviewer Name & Helpful Vote Button */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-xs font-bold uppercase">
                    {review.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{review.name}</span>
                  {userInfo && review.user === userInfo._id && (
                    <span className="text-[10px] bg-[#FAF8F5] text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                      You
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleHelpfulVote(review._id)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    votedReviews.includes(review._id)
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({review.helpfulVotes || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULLSCREEN PHOTO ZOOM MODAL */}
      <AnimatePresence>
        {zoomImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomImage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full text-gray-700 hover:bg-white shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={zoomImage.url}
                  alt="Customer review zoom"
                  className="max-h-[65vh] max-w-full object-contain"
                />
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1C1917]">
                      {zoomImage.reviewer}
                    </span>
                    {zoomImage.size && (
                      <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        Size: EU {zoomImage.size}
                      </span>
                    )}
                  </div>
                  <div className="flex text-[#FFCB45]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (zoomImage.rating || 5) ? "fill-current" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {zoomImage.title && (
                  <p className="text-sm font-semibold text-gray-800">{zoomImage.title}</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}