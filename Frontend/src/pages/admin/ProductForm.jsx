import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { toast } from 'react-hot-toast';

import FileUpload from '../admin/FileUpload';
import { getOptimizedImage } from '../../util/imageUtils';

const CATEGORIES = ["Bridal", "Casual", "Party", "Festive", "Office","Everyday", "Limited Edition"];

export default function ProductForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categories: [], 
    image: '', 
    images: [], 
    isNewArrival: false,
    isBestSeller: false,
    stock: [{ size: '', quantity: 0 }] 
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products/admin/${id}`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          
          let categoryArray = [];
          if (Array.isArray(data.category)) {
             categoryArray = data.category;
          } else if (typeof data.category === 'string') {
             categoryArray = [data.category];
          }

          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            originalPrice: data.originalPrice || '',
            categories: categoryArray, 
            image: data.image,
            images: data.images || [],
            isNewArrival: data.isNewArrival || false,
            isBestSeller: data.isBestSeller || false,
            stock: data.stock && data.stock.length > 0 ? data.stock : [{ size: '', quantity: 0 }]
          });
        } catch (error) {
          console.error("Fetch Error:", error);
          toast.error("Could not load product data");
        }
      };
      fetchProduct();
    }
  }, [id, userInfo.token]);

  // --- 🔴 NEW: CLOUD DELETE HELPER ---
  const deleteImageFromCloud = async (url) => {
    if (!url || !url.includes('imagekit.io')) return; // Safety check
    
    try {
      await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ fileUrl: url })
      });
    } catch (error) {
      console.error("Failed to delete from cloud", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const toggleCategory = (cat) => {
    setFormData(prev => {
        const exists = prev.categories.includes(cat);
        const newCategories = exists 
          ? prev.categories.filter(c => c !== cat) 
          : [...prev.categories, cat];
        return { ...prev, categories: newCategories };
    });
  };

  const handleStockChange = (index, field, value) => {
    const newStock = [...formData.stock];
    newStock[index][field] = value;
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

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  // --- 🔴 UPDATED: Trigger Cloud Delete on Removal ---
  const handleRemoveImage = (index) => {
    const urlToRemove = formData.images[index];
    
    // If there is an actual URL, delete it from ImageKit
    if (urlToRemove) {
        deleteImageFromCloud(urlToRemove);
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.categories.length === 0) {
        toast.error("Please select at least one category");
        setLoading(false);
        return;
    }

    const totalStock = formData.stock.reduce((acc, item) => acc + Number(item.quantity), 0);
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: formData.stock.map(s => ({ size: String(s.size), quantity: Number(s.quantity) })),
      totalStock, 
      category: formData.categories, 
    };

    try {
      const url = id 
        ? `${API_BASE_URL}/api/products/admin/${id}` 
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
        toast.success(id ? "Product Updated Successfully" : "Product Created Successfully");
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

  // --- 🔴 UPDATED: Delete all images when deleting the product ---
  const handleDeleteProduct = async () => {
    if (!window.confirm("Warning: Are you sure you want to completely delete this product? This will also delete its images from cloud storage.")) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        // 1. Delete Main Image
        if (formData.image) deleteImageFromCloud(formData.image);
        
        // 2. Delete all Gallery Images
        formData.images.forEach(imgUrl => {
            if (imgUrl) deleteImageFromCloud(imgUrl);
        });

        toast.success("Product and Images Deleted Permanently");
        navigate('/admin/products');
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Network Error while deleting");
    } finally {
      setDeleteLoading(false);
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

            {/* --- MULTI-SELECT CATEGORIES --- */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Categories</label>
              <div className="flex flex-wrap gap-2">
                 {CATEGORIES.map((cat) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2
                                ${isSelected 
                                    ? "bg-[#1C1917] text-white border-[#1C1917]" 
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {isSelected && <Check size={14} />}
                            {cat}
                        </button>
                    );
                 })}
              </div>
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

        {/* SECTION 2: MEDIA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Product Media</h2>
           
           <div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <FileUpload 
                    label="Main Display Image *"
                    value={formData.image}
                    folderName={formData.name || "draft-product"}
                    onUpload={(url) => {
                        // 🔴 OPTIONAL: Delete the old main image if they replace it
                        // if (formData.image && formData.image !== url) {
                        //     deleteImageFromCloud(formData.image);
                        // }
                        setFormData({ ...formData, image: url })
                    }}
                  />
                </div>
                <div className="w-full md:w-32 h-40 md:h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {formData.image ? (
                    <img src={getOptimizedImage(formData.image, 300)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
              </div>
           </div>

           <div>
             <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold text-gray-500 uppercase">Gallery Images</label>
                <button type="button" onClick={handleAddImage} className="text-xs font-bold text-[#FF2865] flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
             </div>
             <div className="space-y-4">
               {formData.images.map((url, index) => (
                 <div key={index} className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-50 pb-4">
                   <div className="flex-1 w-full">
                     <FileUpload 
                       label={`Gallery Image #${index + 1}`}
                       value={url}
                       folderName={formData.name || "draft-product"}
                       onUpload={(newUrl) => handleImageChange(index, newUrl)}
                     />
                   </div>
                   <div className="flex gap-3 items-center mt-6">
                     {url && <img src={getOptimizedImage(url, 100)} className="w-12 h-12 rounded object-cover" />}
                     <button type="button" onClick={() => handleRemoveImage(index)} className="p-2 text-gray-400 hover:text-red-500" title="Remove image">
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* SECTION 3: STOCK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold text-gray-800">Inventory</h2>
              <button type="button" onClick={addStockRow} className="text-xs font-bold text-[#FF2865] flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Size
              </button>
           </div>
           <div className="space-y-3">
             {formData.stock.map((item, index) => (
               <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Size</label>
                    <input type="text" value={item.size} onChange={(e) => handleStockChange(index, 'size', e.target.value)} className="w-full p-2 border rounded outline-none" placeholder="e.g. XL, 38, Free Size" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qty</label>
                    <input type="number" value={item.quantity} onChange={(e) => handleStockChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded outline-none" />
                  </div>
                  <button type="button" onClick={() => removeStockRow(index)} className="p-2.5 bg-gray-50 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors" disabled={formData.stock.length === 1} title="Remove stock row">
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
               </div>
             ))}
           </div>
        </div>

        {/* SECTION 4: VISIBILITY */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
           <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Visibility</h2>
           <div className="flex gap-8">
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-5 h-5 accent-[#1C1917]"/>
               <span className="text-sm">Mark as New Arrival</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-5 h-5 accent-[#1C1917]"/>
               <span className="text-sm">Mark as Best Seller</span>
             </label>
           </div>
        </div>

        {/* SUBMIT & DELETE ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
           {id ? (
             <button 
               type="button"
               onClick={handleDeleteProduct}
               disabled={deleteLoading || loading}
               className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
             >
               {deleteLoading ? 'Deleting...' : <><AlertCircle className="w-5 h-5" /> Delete Product</>}
             </button>
           ) : (
             <div /> 
           )}
           
           <button 
             type="submit"
             disabled={loading || deleteLoading}
             className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white bg-[#1C1917] hover:bg-[#FF2865] transition-all flex items-center justify-center gap-2 shadow-lg"
           >
             {loading ? 'Saving...' : <><Save className="w-5 h-5" /> {id ? 'Update Product' : 'Publish Product'}</>}
           </button>
        </div>
      </form>
    </div>
  );
}