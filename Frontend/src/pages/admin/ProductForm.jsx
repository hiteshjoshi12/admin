import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, Check, AlertCircle, ArrowUp, ArrowDown, Sparkles, HelpCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { toast } from 'react-hot-toast';

import FileUpload from '../admin/FileUpload';
import { getOptimizedImage } from '../../util/imageUtils';

const CATEGORIES = ["Bridal", "Casual", "Party", "Festive", "Office","Everyday", "Limited Edition"];
const OCCASIONS = ["Bridal", "Festive", "Sangeet & Mehendi", "Wedding Guest", "Everyday Chic", "Party", "Work/Office"];

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
    stock: [{ size: '', quantity: 0 }],
    // Artisanal Specifications
    sku: '',
    material: '',
    color: '',
    embellishment: '',
    lining: '',
    sole: '',
    comfortNotes: '',
    fitTip: '',
    careInstructions: '',
    occasions: []
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
            name: data.name || '',
            description: data.description || '',
            price: data.price || '',
            originalPrice: data.originalPrice || '',
            categories: categoryArray, 
            image: data.image || '',
            images: data.images || [],
            isNewArrival: data.isNewArrival || false,
            isBestSeller: data.isBestSeller || false,
            stock: data.stock && data.stock.length > 0 ? data.stock : [{ size: '', quantity: 0 }],
            sku: data.sku || '',
            material: data.material || '',
            color: data.color || '',
            embellishment: data.embellishment || '',
            lining: data.lining || data.sole || '',
            sole: data.sole || data.lining || '',
            comfortNotes: data.comfortNotes || '',
            fitTip: data.fitTip || '',
            careInstructions: Array.isArray(data.careInstructions) ? data.careInstructions.join('\n') : (data.careInstructions || ''),
            occasions: Array.isArray(data.occasions) ? data.occasions : []
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

  const toggleOccasion = (occ) => {
    setFormData(prev => {
      const exists = prev.occasions.includes(occ);
      const newOccasions = exists ? prev.occasions.filter(o => o !== occ) : [...prev.occasions, occ];
      return { ...prev, occasions: newOccasions };
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

  const moveImage = (index, direction) => {
    const newImages = [...formData.images];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newImages.length) return;
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;
    setFormData({ ...formData, images: newImages });
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

    if (!formData.name?.trim()) {
      toast.error("Please enter a product name");
      setLoading(false);
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a Main Display Image");
      setLoading(false);
      return;
    }

    if (!formData.categories || formData.categories.length === 0) {
      toast.error("Please select at least one category");
      setLoading(false);
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid product price");
      setLoading(false);
      return;
    }

    // Filter valid stock items (exclude rows with empty size)
    const validStock = formData.stock
      .filter((item) => item && String(item.size || '').trim() !== '')
      .map((item) => ({
        size: String(item.size).trim(),
        quantity: Math.max(0, Number(item.quantity) || 0)
      }));

    if (validStock.length === 0) {
      toast.error("Please enter at least one size in Inventory (e.g. 38, Free Size, Standard)");
      setLoading(false);
      return;
    }

    const totalStock = validStock.reduce((acc, item) => acc + item.quantity, 0);

    const validImages = Array.isArray(formData.images)
      ? formData.images.filter((img) => img && String(img).trim() !== '')
      : [];

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: priceNum,
      originalPrice: formData.originalPrice && !isNaN(Number(formData.originalPrice)) ? Number(formData.originalPrice) : 0,
      image: formData.image,
      images: validImages,
      stock: validStock,
      totalStock, 
      category: formData.categories,
      categories: formData.categories,
      isNewArrival: Boolean(formData.isNewArrival),
      isBestSeller: Boolean(formData.isBestSeller),
      // Craft Specifications
      sku: String(formData.sku || '').trim(),
      material: String(formData.material || '').trim(),
      color: String(formData.color || '').trim(),
      embellishment: String(formData.embellishment || '').trim(),
      sole: String(formData.sole || formData.lining || '').trim(),
      lining: String(formData.lining || formData.sole || '').trim(),
      comfortNotes: String(formData.comfortNotes || '').trim(),
      fitTip: String(formData.fitTip || '').trim(),
      careInstructions: formData.careInstructions 
        ? formData.careInstructions.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      occasions: formData.occasions || []
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

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">SKU / Product Code</label>
              <input 
                type="text" 
                name="sku" 
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none" 
                placeholder="e.g. BB-ZIV-01"
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
                <label className="block text-xs font-bold text-gray-500 uppercase">Gallery Images (Aim for 5–8 consistent images)</label>
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
                   <div className="flex gap-2 items-center mt-6">
                     <button 
                       type="button" 
                       onClick={() => moveImage(index, -1)} 
                       disabled={index === 0}
                       className="p-2 border rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-opacity" 
                       title="Move Up"
                     >
                       <ArrowUp className="w-4 h-4" />
                     </button>
                     <button 
                       type="button" 
                       onClick={() => moveImage(index, 1)} 
                       disabled={index === formData.images.length - 1}
                       className="p-2 border rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-20 transition-opacity" 
                       title="Move Down"
                     >
                       <ArrowDown className="w-4 h-4" />
                     </button>
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

        {/* SECTION 3: ARTISANAL SPECIFICATIONS & CRAFT DETAILS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF2865]" /> Artisanal Specifications & Craft Details
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Add precise craft details as required by the product page guidelines to build customer trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Primary Material</label>
              <input 
                type="text" 
                name="material" 
                value={formData.material}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Pure Raw Silk / Velvet / Vegan Leather"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Color / Tone</label>
              <input 
                type="text" 
                name="color" 
                value={formData.color}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Champagne Gold / Ruby Red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Embellishment / Work</label>
              <input 
                type="text" 
                name="embellishment" 
                value={formData.embellishment}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Handcrafted Zardozi, Pearls, Moti work"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Footbed & Outsole (Sole)</label>
              <input 
                type="text" 
                name="sole" 
                value={formData.sole}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. 100% Genuine Vegetable-Tanned Leather Sole"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Inner Lining</label>
              <input 
                type="text" 
                name="lining" 
                value={formData.lining}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Soft Genuine Leather Lining with Double Cushioning"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Comfort & Cushioning Notes
                </label>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                  ⚠️ Mention comfort/cushioning only when confirmed on sample
                </span>
              </div>
              <input 
                type="text" 
                name="comfortNotes" 
                value={formData.comfortNotes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Double-cushioned memory foam footbed for bite-free all-day comfort"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Fit & Sizing Advice</label>
              <input 
                type="text" 
                name="fitTip" 
                value={formData.fitTip}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Fits true to size. If you have broad feet or fall between sizes, order one size up."
              />
            </div>

            {/* Occasions Multi-Select */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Suitable Occasions</label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occ) => {
                  const isSelected = formData.occasions?.includes(occ);
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => toggleOccasion(occ)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5
                        ${isSelected 
                          ? "bg-[#1C1917] text-white border-[#1C1917]" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      {isSelected && <Check size={14} />}
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Care Instructions (One per line)</label>
              <textarea 
                name="careInstructions" 
                rows="3"
                value={formData.careInstructions}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#1C1917] outline-none text-sm" 
                placeholder="Keep away from moisture & water&#10;Store in breathable muslin dust bag&#10;Clean with soft, dry cloth"
              />
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
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Size *</label>
                    <input type="text" required value={item.size} onChange={(e) => handleStockChange(index, 'size', e.target.value)} className="w-full p-2 border rounded outline-none" placeholder="e.g. 38, 39, XL, Free Size" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qty *</label>
                    <input type="number" min="0" required value={item.quantity} onChange={(e) => handleStockChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded outline-none" />
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