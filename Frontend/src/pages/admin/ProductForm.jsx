import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { toast } from 'react-hot-toast';

// 1. IMPORT FILE UPLOAD & OPTIMIZER
import FileUpload from '../admin/FileUpload';
import { getOptimizedImage } from '../../util/imageUtils';

export default function ProductForm() {
  const { id } = useParams(); // If ID exists, we are in EDIT mode
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Bridal',
    image: '', // Main Image URL
    images: [], // Gallery URLs
    isNewArrival: false,
    isBestSeller: false,
    stock: [{ size: '', quantity: 0 }] 
  });

  // --- FETCH DATA FOR EDIT MODE ---
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
          const data = await res.json();
          
          // Populate form (Ensure stock array exists)
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            originalPrice: data.originalPrice || '',
            category: data.category,
            image: data.image,
            images: data.images || [],
            isNewArrival: data.isNewArrival || false,
            isBestSeller: data.isBestSeller || false,
            stock: data.stock && data.stock.length > 0 ? data.stock : [{ size: '', quantity: 0 }]
          });
        } catch (error) {
          console.error("Failed to fetch product details", error);
          toast.error("Failed to load product");
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
    newStock[index][field] = value; // Keep as string for input, convert on submit
    setFormData({ ...formData, stock: newStock });
  };

  const addStockRow = () => {
    setFormData({ 
      ...formData, 
      stock: [...formData.stock, { size: '', quantity: 0 }] 
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
      images: [...formData.images, ''] // Add empty slot for new uploader
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

    // 1. Calculate Total Stock
    const totalStock = formData.stock.reduce((acc, item) => acc + Number(item.quantity), 0);
    
    // 2. Prepare Payload (Convert types)
    const productData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: formData.stock.map(s => ({ size: s.size, quantity: Number(s.quantity) })),
      totalStock, 
    };

    try {
      const url = id 
        ? `${API_BASE_URL}/api/products/${id}` 
        : `${API_BASE_URL}/api/products`;      
      
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
        toast.success(id ? "Product Updated" : "Product Created");
        navigate('/admin/products'); 
      } else {
        const err = await res.json();
        toast.error(err.message || 'Operation Failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4 md:px-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <button 
          onClick={() => navigate('/admin/products')}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
                {id ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-sm text-gray-500">
                {id ? 'Update inventory details' : 'Create a new listing'}
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        
        {/* SECTION 1: BASIC DETAILS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Product Name</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none" 
                placeholder="e.g. Royal Blue Velvet Jutti"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Original Price (Optional)</label>
              <input 
                type="number" 
                name="originalPrice" 
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
              <select 
                name="category" 
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none bg-white"
              >
                <option value="Bridal">Bridal</option>
                <option value="Casual">Casual</option>
                <option value="Party">Party</option>
                <option value="Festive">Festive</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
              <textarea 
                name="description" 
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none" 
                placeholder="Detailed description of the product..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: MEDIA (Images) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Product Media</h2>
           
           {/* 1. MAIN IMAGE - USING FILE UPLOAD */}
           <div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  {/* REPLACED MANUAL INPUT WITH FILE UPLOAD */}
                  <FileUpload 
                    label="Main Display Image *"
                    value={formData.image}
                    onUpload={(url) => setFormData({ ...formData, image: url })}
                  />
                </div>
                {/* PREVIEW */}
                <div className="w-full md:w-32 h-40 md:h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                  {formData.image ? (
                    <img src={getOptimizedImage(formData.image, 300)} alt="Main" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
              </div>
           </div>

           {/* 2. GALLERY IMAGES - USING FILE UPLOAD */}
           <div>
             <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold text-gray-500 uppercase">Gallery Images</label>
                <button 
                  type="button" 
                  onClick={handleAddImage}
                  className="text-xs font-bold text-[#FF2865] flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Image Slot
                </button>
             </div>

             <div className="space-y-4">
               {formData.images.map((url, index) => (
                 <div key={index} className="flex flex-col md:flex-row gap-4 items-start animate-fade-in border-b border-gray-50 pb-4 last:border-0">
                   
                   <div className="flex-1 w-full">
                      {/* REPLACED MANUAL INPUT WITH FILE UPLOAD */}
                      <FileUpload 
                        label={`Gallery Image #${index + 1}`}
                        value={url}
                        onUpload={(newUrl) => handleImageChange(index, newUrl)}
                      />
                   </div>

                   <div className="flex gap-3 w-full md:w-auto items-center justify-end md:mt-6">
                      {url && (
                        <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                           <img src={getOptimizedImage(url, 100)} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                 </div>
               ))}
             </div>
             
             {formData.images.length === 0 && (
               <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
                 No additional images. Click "Add Image Slot" to upload.
               </div>
             )}
           </div>
        </div>

        {/* SECTION 3: INVENTORY & STOCK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold text-gray-800">Inventory & Stock</h2>
              <button 
                type="button" 
                onClick={addStockRow}
                className="text-xs font-bold text-[#FF2865] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Size
              </button>
           </div>

           <div className="space-y-3">
             {formData.stock.map((item, index) => (
               <div key={index} className="flex gap-4 items-end animate-fade-in">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Size (EU)</label>
                    <input 
                      type="text" 
                      value={item.size}
                      onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:border-[#1C1917] outline-none text-sm"
                      placeholder="e.g. 38"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded focus:border-[#1C1917] outline-none text-sm"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeStockRow(index)}
                    className="p-2.5 mb-[1px] text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors"
                    disabled={formData.stock.length === 1} 
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             ))}
           </div>
        </div>

        {/* SECTION 4: SETTINGS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Visibility</h2>
           <div className="flex gap-8">
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="checkbox" 
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#1C1917]"
               />
               <span className="font-medium text-gray-700 text-sm">Mark as New Arrival</span>
             </label>

             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="checkbox" 
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#1C1917]"
               />
               <span className="font-medium text-gray-700 text-sm">Mark as Best Seller</span>
             </label>
           </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4">
           <button 
             type="submit"
             disabled={loading}
             className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white bg-[#1C1917] hover:bg-[#FF2865] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
           >
             {loading ? 'Saving...' : <><Save className="w-5 h-5" /> {id ? 'Update Product' : 'Publish Product'}</>}
           </button>
        </div>

      </form>
    </div>
  );
}