import { useEffect, useState } from 'react';
import { Star, Check, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { toast } from 'react-hot-toast'; // Import Toast
import { confirmAction } from '../../util/toastUtils'; // Import Standard Confirm Helper

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'pending'

  const { userInfo } = useSelector((state) => state.auth);

  // --- FETCH ALL REVIEWS ---
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews");
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // --- APPROVE REVIEW ---
  const handleApprove = async (id) => {
    const toastId = toast.loading("Approving review...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, isApproved: true } : r));
        toast.success("Review Approved!", { id: toastId });
      } else {
        toast.error("Failed to approve", { id: toastId });
      }
    } catch (error) {
      toast.error("Server error occurred", { id: toastId });
    }
  };

  // --- DELETE REVIEW (UPDATED) ---
  const handleDelete = (id) => {
    confirmAction({
      title: "Delete this Review?",
      message: "This action cannot be undone. The review will be permanently removed.",
      confirmText: "Delete Review",
      onConfirm: async () => {
        const toastId = toast.loading("Deleting...");
        try {
          const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          if (res.ok) {
            setReviews(reviews.filter(r => r._id !== id));
            toast.success("Review deleted successfully", { id: toastId });
          } else {
            toast.error("Failed to delete", { id: toastId });
          }
        } catch (error) {
          toast.error("Server error occurred", { id: toastId });
        }
      }
    });
  };

  // --- FILTERING ---
  const displayedReviews = filter === 'pending' 
    ? reviews.filter(r => !r.isApproved) 
    : reviews;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 px-4 md:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Review Moderation</h2>
           <p className="text-sm text-gray-500">Approve customer feedback or remove spam.</p>
        </div>
        
        {/* Toggle Filter */}
        <div className="bg-gray-100 p-1 rounded-lg flex gap-1 self-start md:self-auto">
           <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow text-[#1C1917]' : 'text-gray-500 hover:text-gray-700'}`}
           >
             All Reviews
           </button>
           <button 
             onClick={() => setFilter('pending')}
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ${filter === 'pending' ? 'bg-white shadow text-[#1C1917]' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Pending <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full text-[10px]">
               {reviews.filter(r => !r.isApproved).length}
             </span>
           </button>
        </div>
      </div>

      {/* REVIEWS GRID */}
      {displayedReviews.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-400">No reviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
           {displayedReviews.map((review) => (
             <div key={review._id} className={`bg-white p-4 md:p-6 rounded-xl border transition-all ${review.isApproved ? 'border-gray-200' : 'border-yellow-300 ring-2 md:ring-4 ring-yellow-50'}`}>
                
                <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
                   
                   {/* LEFT: User & Content */}
                   <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                         {/* Status Badge */}
                         {review.isApproved ? (
                           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                             <Check className="w-3 h-3" /> Published
                           </span>
                         ) : (
                           <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                             <AlertCircle className="w-3 h-3" /> Pending
                           </span>
                         )}
                         <span className="text-gray-400 text-xs">• {new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                         <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                         </div>
                         <span className="font-bold text-gray-900 text-sm">{review.rating}/5</span>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        "{review.comment}"
                      </p>

                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            {review.user?.name ? review.user.name.charAt(0) : 'U'}
                         </div>
                         <span className="text-xs font-bold text-gray-500">{review.user?.name || review.name}</span>
                      </div>
                   </div>

                   {/* RIGHT: Product Context & Actions */}
                   <div className="flex md:flex-col items-center md:items-end justify-between gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      
                      {/* Product Snippet */}
                      <div className="flex items-center gap-3 md:text-right flex-1 md:flex-none min-w-0">
                         <img src={review.product?.image} alt="Product" className="w-10 h-10 md:w-12 md:h-12 rounded border border-gray-200 object-cover shrink-0 md:order-last" />
                         <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{review.product?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">ID: ...{review.product?._id.slice(-6)}</p>
                         </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 shrink-0">
                         {!review.isApproved && (
                           <button 
                             onClick={() => handleApprove(review._id)}
                             className="bg-[#1C1917] text-white px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-green-600 transition-colors flex items-center gap-2"
                           >
                             <Check className="w-4 h-4" /> <span className="hidden md:inline">Approve</span>
                           </button>
                         )}
                         <button 
                           onClick={() => handleDelete(review._id)}
                           className="bg-white border border-gray-200 text-gray-400 px-3 py-2 rounded-lg hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                           title="Delete Review"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>

                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}