import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../util/config";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  // UI State
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  // 1. Fetch Reviews & Check for User's Review
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`);
        const data = await res.json();
        setReviews(data);

        // Check if current user has already reviewed
        if (userInfo) {
          const myReview = data.find(r => r.user === userInfo._id);
          if (myReview) {
            setIsEditing(true);
            setEditReviewId(myReview._id);
            setRating(myReview.rating);
            setComment(myReview.comment);
          } else {
            // Reset if no review found (e.g. switch product)
            setIsEditing(false);
            setEditReviewId(null);
            setRating(5);
            setComment("");
          }
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    if (productId) fetchReviews();
  }, [productId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment) return;

    try {
      let res;
      
      // 2. INTELLIGENT SUBMIT (POST vs PUT)
      if (isEditing && editReviewId) {
        // UPDATE EXISTING REVIEW
        res = await fetch(`${API_BASE_URL}/api/reviews/${editReviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ rating, comment }),
        });
      } else {
        // CREATE NEW REVIEW
        res = await fetch(`${API_BASE_URL}/api/reviews/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ rating, comment }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");

      const successMsg = isEditing 
        ? "Review updated! It is now pending approval." 
        : "Review submitted! It will appear after approval.";

      setMessage(successMsg);
      toast.success(isEditing ? "Review Updated" : "Review Submitted");
      
      setShowForm(false);
      setError("");

      // Optional: Refresh list to show changes (or hide if it went to pending)
      // fetchReviews(); 

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-100 mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-[#1C1917]">
          Customer Reviews ({reviews.length})
        </h2>
        
        {userInfo ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-bold uppercase tracking-widest border-b border-[#1C1917] pb-1 hover:text-[#FF2865] transition-colors"
          >
            {showForm 
              ? "Cancel" 
              : isEditing 
                ? "Edit Your Review" 
                : "Write a Review"
            }
          </button>
        ) : (
          <Link
            to="/login"
            className="text-xs font-bold uppercase tracking-widest text-[#FF2865]"
          >
            Login to Review
          </Link>
        )}
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-sm font-bold">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-sm font-bold">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submitHandler}
          className="bg-[#F9F8F6] p-8 rounded-2xl mb-12 animate-fade-up"
        >
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
              {isEditing ? "Update Rating" : "Rating"}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${star <= rating ? "fill-[#FFCB45] text-[#FFCB45]" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 rounded-lg border border-gray-200 mb-4"
          ></textarea>
          <button className="bg-[#1C1917] text-white px-8 py-3 rounded-full font-bold uppercase text-xs hover:bg-[#FF2865] transition-colors">
            {isEditing ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-400 italic">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-6">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="flex text-[#FFCB45] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-[#1C1917]">
                    {review.name}
                    {/* Badge for User's own review */}
                    {userInfo && review.user === userInfo._id && (
                        <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>
                    )}
                  </h4>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}