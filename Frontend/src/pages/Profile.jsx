import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, MapPin, Plus, Trash2, Edit2, X, CheckCircle } from 'lucide-react';
import { logout, saveAddressToProfile, updateAddressInProfile, deleteAddressFromProfile } from '../redux/authSlice';
import { clearCart } from '../redux/cartSlice';

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // If null, we are adding new

  // Form State
  const [formData, setFormData] = useState({
    address: '', city: '', postalCode: '', phoneNumber: '', country: 'India', isPrimary: false
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // --- HANDLERS ---
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({ address: '', city: '', postalCode: '', phoneNumber: '', country: 'India', isPrimary: false });
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr._id);
    setFormData({
      address: addr.address, city: addr.city, postalCode: addr.postalCode, 
      phoneNumber: addr.phoneNumber, country: addr.country, isPrimary: addr.isPrimary
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingAddress) {
      // Update Existing
      dispatch(updateAddressInProfile({ id: editingAddress, addressData: formData }));
    } else {
      // Add New
      dispatch(saveAddressToProfile(formData));
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddressFromProfile(id));
    }
  };

  const handleSetPrimary = (addr) => {
    dispatch(updateAddressInProfile({ 
      id: addr._id, 
      addressData: { ...addr, isPrimary: true } 
    }));
  };

  if (!userInfo) return null;

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-12 relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#1C1917]">My Profile</h1>
            <p className="text-gray-500 text-sm">Manage your account and addresses</p>
          </div>
          <button onClick={handleLogout} className="text-red-500 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: User Info & Orders */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-[#1C1917] text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-4">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-[#1C1917]">{userInfo.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{userInfo.email}</p>
            </div>

            <div 
              onClick={() => navigate('/myorders')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#FF2865] transition-all group"
            >
              <div className="bg-gray-50 p-3 rounded-full group-hover:bg-[#FF2865]/10 group-hover:text-[#FF2865] transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1917] group-hover:text-[#FF2865]">My Orders</h3>
                <p className="text-xs text-gray-400">View recent purchases</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Address Manager */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#1C1917] flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Saved Addresses
                </h3>
                <button onClick={openAddModal} className="text-xs font-bold uppercase tracking-widest bg-[#1C1917] text-white px-4 py-2 rounded-full hover:bg-[#FF2865] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              <div className="space-y-4">
                {userInfo.addresses && userInfo.addresses.length > 0 ? (
                  userInfo.addresses.map((addr) => (
                    <div key={addr._id} className={`border rounded-xl p-5 relative transition-all ${addr.isPrimary ? 'border-[#FF2865] bg-[#FF2865]/5' : 'border-gray-100 hover:border-gray-300'}`}>
                      
                      {/* Primary Badge */}
                      {addr.isPrimary && (
                        <div className="absolute top-0 right-0 bg-[#FF2865] text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl">
                          PRIMARY
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[#1C1917]">{addr.city}, {addr.postalCode}</p>
                          <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                          <p className="text-xs text-gray-400 mt-2">Phone: {addr.phoneNumber}</p>
                        </div>

                        <div className="flex gap-2 mt-6 md:mt-0">
                          <button onClick={() => openEditModal(addr)} className="p-2 text-gray-400 hover:text-[#1C1917] bg-gray-50 hover:bg-gray-200 rounded-full transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(addr._id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Set Primary Button */}
                      {!addr.isPrimary && (
                        <button 
                          onClick={() => handleSetPrimary(addr)}
                          className="mt-4 text-xs font-bold text-gray-400 hover:text-[#FF2865] flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" /> Set as Primary
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No addresses saved yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-scale-up">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-[#1C1917] p-2">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-serif text-[#1C1917] mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address Line</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" placeholder="House No, Street, Area" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pincode</label>
                  <input type="text" required value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                <input type="text" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-[#F9F8F6] border-0 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#FF2865]/20 outline-none" placeholder="+91" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="primary" checked={formData.isPrimary} onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})} className="w-4 h-4 accent-[#1C1917]" />
                <label htmlFor="primary" className="text-sm text-gray-600">Make this my default address</label>
              </div>

              <button type="submit" className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-colors mt-4">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}