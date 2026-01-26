import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Tag, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';

export default function Offers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // <--- NEW: Track ID being edited
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: '',
    description: '',
    expirationDate: ''
  });

  const { userInfo } = useSelector((state) => state.auth);

  // --- FETCH COUPONS ---
  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [userInfo]);

  // --- TOGGLE STATUS ---
  const handleToggle = async (id) => {
    try {
      setCoupons(prev => prev.map(c => 
        c._id === id ? { ...c, isActive: !c.isActive } : c
      ));

      await fetch(`${API_BASE_URL}/api/coupons/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
    } catch (error) {
      alert("Failed to update status");
      fetchCoupons();
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- OPEN EDIT MODAL ---
  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount,
      description: coupon.description,
      // Format date to YYYY-MM-DD for input type="date"
      expirationDate: new Date(coupon.expirationDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  // --- SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine URL and Method
    const url = editId 
      ? `${API_BASE_URL}/api/coupons/${editId}` // Update URL (You need to add PUT route in backend)
      : `${API_BASE_URL}/api/coupons`;           // Create URL
    
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        setEditId(null); // Reset Edit Mode
        setFormData({ code: '', discountType: 'percentage', discountAmount: '', description: '', expirationDate: '' });
        fetchCoupons();
        alert(editId ? "Coupon Updated!" : "Coupon Created!");
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (error) {
      alert("Operation failed");
    }
  };

  // --- CLOSE MODAL ---
  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ code: '', discountType: 'percentage', discountAmount: '', description: '', expirationDate: '' });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Active Festivals & Offers</h2>
           <p className="text-sm text-gray-500 mt-1">Manage global discounts and coupon codes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#111827] text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* COUPON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
             
             {/* Background Decoration */}
             <Tag className="absolute -right-6 -top-6 w-32 h-32 text-gray-100 rotate-12 -z-0" />

             <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                   <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                   </span>
                   
                   {/* TOGGLE SWITCH */}
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={coupon.isActive} 
                        onChange={() => handleToggle(coupon._id)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111827]"></div>
                   </label>
                </div>

                <div className="mb-6">
                   <h3 className="text-xl font-bold text-gray-900 tracking-tight">{coupon.code}</h3>
                   <p className="text-sm text-gray-500 font-medium">{coupon.description}</p>
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Discount</p>
                      <p className="text-lg font-bold text-[#1C1917]">
                        {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`}
                      </p>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(coupon)} // <--- CONNECTED EDIT BUTTON
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                         <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
           <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-400">No active coupons found. Create one to get started.</p>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                 <h3 className="text-lg font-bold text-gray-800">
                   {editId ? 'Edit Coupon' : 'Create New Coupon'}
                 </h3>
                 <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                    <input 
                      required 
                      className="w-full p-3 border border-gray-200 rounded-lg uppercase font-mono text-sm focus:ring-2 focus:ring-black/5 outline-none"
                      placeholder="e.g. SUMMER25"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <input 
                      required 
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none"
                      placeholder="e.g. Summer Sale"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                       <select 
                         className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black/5 outline-none"
                         value={formData.discountType}
                         onChange={e => setFormData({...formData, discountType: e.target.value})}
                       >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                       <input 
                         required 
                         type="number"
                         className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none"
                         placeholder="e.g. 20"
                         value={formData.discountAmount}
                         onChange={e => setFormData({...formData, discountAmount: e.target.value})}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiration Date</label>
                    <input 
                      required 
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black/5 outline-none"
                      value={formData.expirationDate}
                      onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                    />
                 </div>

                 <button type="submit" className="w-full bg-[#111827] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors mt-2">
                    {editId ? 'Update Coupon' : 'Create Coupon'}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}