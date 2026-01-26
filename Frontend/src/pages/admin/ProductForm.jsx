import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, 
  UploadCloud, AlertCircle 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';

export default function ProductForm() {
  const { id } = useParams(); // If ID exists, we are in EDIT mode
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: 'Bridal', // Default
    image: '',
    images: [],
    isNewArrival: false,
    isBestSeller: false,
    stock: [{ size: 36, quantity: 0 }] // Start with one stock row
  });

  // --- FETCH DATA FOR EDIT MODE ---
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
          const data = await res.json();
          
          // Populate form
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            originalPrice: data.originalPrice || 0,
            category: data.category,
            image: data.image,
            images: data.images || [],
            isNewArrival: data.isNewArrival || false,
            isBestSeller: data.isBestSeller || false,
            // If stock is empty (legacy data), provide default row
            stock: data.stock && data.stock.length > 0 ? data.stock : [{ size: 36, quantity: 0 }]
          });
        } catch (error) {
          console.error("Failed to fetch product details", error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- STOCK MANAGEMENT HANDLERS ---
  const handleStockChange = (index, field, value) => {
    const newStock = [...formData.stock];
    newStock[index][field] = Number(value);
    setFormData({ ...formData, stock: newStock });
  };

  const addStockRow = () => {
    setFormData({ 
      ...formData, 
      stock: [...formData.stock, { size: 0, quantity: 0 }] 
    });
  };

  const removeStockRow = (index) => {
    const newStock = formData.stock.filter((_, i) => i !== index);
    setFormData({ ...formData, stock: newStock });
  };

  // --- IMAGE ARRAY HANDLERS ---
  const handleAddImage = () => {
    setFormData({ 
      ...formData, 
      images: [...formData.images, ''] // Add empty string for new URL
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };




  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Calculate Total Stock automatically
    const totalStock = formData.stock.reduce((acc, item) => acc + item.quantity, 0);
    
    // 2. Prepare Payload
    const productData = {
      ...formData,
      totalStock, // <--- Important: backend expects this
    };

    try {
      const url = id 
        ? `${API_BASE_URL}/api/products/${id}` // PUT
        : `${API_BASE_URL}/api/products`;      // POST
      
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        navigate('/admin/products'); // Redirect to Inventory
      } else {
        const err = await res.json();
        alert(err.message || 'Operation Failed');
      }
    } catch (error) {
      console.error(error);
      alert('Network Error');
    } finally {
      setLoading(false);
    }
  };

  // --- MOCK IMAGE UPLOAD (For now, text input) ---
  // Ideally, you would have a function here that uploads to Cloudinary/ImageKit
  // and sets setFormData({ ...formData, image: url })

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BASIC DETAILS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none" 
                placeholder="e.g. Royal Blue Velvet Jutti"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none" 
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (Optional)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none" 
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                name="category" 
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none bg-white"
              >
                <option value="Bridal">Bridal</option>
                <option value="Casual">Casual</option>
                <option value="Party">Party</option>
                <option value="Festive">Festive</option>
                <option value="Office">Office</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none" 
                placeholder="Detailed description of the product..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: MEDIA (Images) */}
       {/* SECTION 2: MEDIA (Images) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Product Media</h2>
           
           {/* 1. MAIN IMAGE */}
           <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Main Display Image <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-start">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="image" 
                    required
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5" 
                    placeholder="https://ik.imagekit.io/..."
                  />
                </div>
                {/* Main Preview */}
                {formData.image && (
                  <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                    <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
           </div>

           {/* 2. GALLERY IMAGES ARRAY */}
           <div>
             <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-gray-700">Gallery Images</label>
                <button 
                  type="button" 
                  onClick={handleAddImage}
                  className="text-sm font-bold text-[#FF2865] flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Image
                </button>
             </div>

             <div className="space-y-3">
               {formData.images.map((url, index) => (
                 <div key={index} className="flex gap-4 items-start animate-fade-in">
                    
                    {/* Index Number */}
                    <span className="pt-3 text-xs font-bold text-gray-400">#{index + 1}</span>

                    {/* Input Field */}
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5" 
                        placeholder="Paste additional image URL..."
                      />
                    </div>

                    {/* Small Preview (Only if URL exists) */}
                    {url && (
                      <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                         <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Delete Button */}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(index)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))}
             </div>
             
             {/* Empty State Message */}
             {formData.images.length === 0 && (
               <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
                 No gallery images added. Click "Add Image" to upload more angles.
               </div>
             )}
           </div>
        </div>

        {/* SECTION 3: INVENTORY & STOCK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-gray-800">Inventory & Stock</h2>
              <button 
                type="button" 
                onClick={addStockRow}
                className="text-sm font-bold text-[#FF2865] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Size
              </button>
           </div>

           <div className="space-y-3">
             {formData.stock.map((item, index) => (
               <div key={index} className="flex items-center gap-4 animate-fade-in">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Size (EU)</label>
                    <input 
                      type="number" 
                      value={item.size}
                      onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="pt-5">
                    <button 
                      type="button" 
                      onClick={() => removeStockRow(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={formData.stock.length === 1} // Prevent deleting last row
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             ))}
           </div>
           
           <div className="mt-6 p-4 bg-gray-50 rounded-lg text-right">
              <span className="text-gray-500 font-medium mr-2">Total Calculated Stock:</span>
              <span className="text-xl font-bold text-gray-900">
                {formData.stock.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
           </div>
        </div>

        {/* SECTION 4: SETTINGS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Visibility</h2>
           <div className="flex gap-8">
             <label className="flex items-center gap-3 cursor-pointer">
               <input 
                  type="checkbox" 
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#1C1917]"
               />
               <span className="font-medium text-gray-700">Mark as New Arrival</span>
             </label>

             <label className="flex items-center gap-3 cursor-pointer">
               <input 
                  type="checkbox" 
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#1C1917]"
               />
               <span className="font-medium text-gray-700">Mark as Best Seller</span>
             </label>
           </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end gap-4">
           <button 
             type="button"
             onClick={() => navigate('/admin/products')}
             className="px-6 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors"
           >
             Cancel
           </button>
           <button 
             type="submit"
             disabled={loading}
             className="px-8 py-3 rounded-lg font-bold text-white bg-[#1C1917] hover:bg-[#FF2865] transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
           >
             {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Product</>}
           </button>
        </div>

      </form>
    </div>
  );
}