import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Plus, Trash2, Check, AlertCircle, ArrowUp, ArrowDown, 
  Sparkles, Globe, Star, Tag, Layers, Camera
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { toast } from 'react-hot-toast'; 

import FileUpload from '../admin/FileUpload';
import { getOptimizedImage } from '../../util/imageUtils';

const DEFAULT_CATEGORIES = ["Bridal", "Casual", "Party", "Festive", "Office", "Everyday", "Limited Edition"];
const DEFAULT_OCCASIONS = ["Bridal", "Festive", "Sangeet & Mehendi", "Wedding Guest", "Everyday Chic", "Party", "Work/Office"];
const PERSPECTIVE_PRESETS = [
  "Main 3/4 Studio",
  "Close-up Embroidery",
  "Sole & Footbed",
  "Side Profile",
  "Top View",
  "Angle",
  "Editorial / On-Model",
  "Detail Craft"
];

const slugify = (text) => {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function ProductForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [customCategory, setCustomCategory] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    oldSlugs: [],
    description: '',
    price: '',
    originalPrice: '',
    categories: [], 
    image: '', 
    images: [], 
    imageDetails: [], // [{ url, perspective, isPrimary }]
    isNewArrival: false,
    isBestSeller: false,
    rating: 0,
    numReviews: 0,
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

          // Build synchronized imageDetails from DB or populate defaults from images array
          const rawImages = Array.isArray(data.images) ? data.images : [];
          const existingDetails = Array.isArray(data.imageDetails) ? data.imageDetails : [];
          const syncedDetails = rawImages.map((imgUrl, idx) => {
            const matched = existingDetails.find(d => d && d.url === imgUrl);
            return {
              url: imgUrl,
              perspective: matched?.perspective || (idx === 0 ? "Main 3/4 Studio" : idx === 1 ? "Sole & Footbed" : idx === 2 ? "Close-up Embroidery" : "Angle"),
              isPrimary: Boolean(matched?.isPrimary || idx === 0)
            };
          });

          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            oldSlugs: Array.isArray(data.oldSlugs) ? data.oldSlugs : [],
            description: data.description || '',
            price: data.price !== undefined ? data.price : '',
            originalPrice: data.originalPrice !== undefined ? data.originalPrice : '',
            categories: categoryArray, 
            image: data.image || '',
            images: rawImages,
            imageDetails: syncedDetails,
            isNewArrival: Boolean(data.isNewArrival),
            isBestSeller: Boolean(data.isBestSeller),
            rating: data.rating !== undefined ? data.rating : 0,
            numReviews: data.numReviews !== undefined ? data.numReviews : 0,
            stock: data.stock && data.stock.length > 0 ? data.stock : [{ size: '', quantity: 0 }],
            sku: data.sku || '',
            material: data.material || '',
            color: data.color || '',
            embellishment: data.embellishment || '',
            lining: data.lining || '',
            sole: data.sole || '',
            comfortNotes: data.comfortNotes || '',
            fitTip: data.fitTip || '',
            careInstructions: Array.isArray(data.careInstructions) 
              ? data.careInstructions.join('\n') 
              : (data.careInstructions || ''),
            occasions: Array.isArray(data.occasions) ? data.occasions : []
          });

          if (data.slug) {
            setIsSlugManuallyEdited(true);
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          toast.error("Could not load product data");
        }
      };
      fetchProduct();
    }
  }, [id, userInfo.token]);

  // Cloud image removal
  const deleteImageFromCloud = async (url) => {
    if (!url || !url.includes('imagekit.io')) return; 
    
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
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData(prev => {
      const autoSlug = (!id && !isSlugManuallyEdited) ? slugify(newName) : prev.slug;
      return { ...prev, name: newName, slug: autoSlug };
    });
  };

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true);
    setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const handleGenerateSlug = () => {
    const generated = slugify(formData.name);
    setFormData(prev => ({ ...prev, slug: generated }));
    setIsSlugManuallyEdited(true);
    toast.success("Slug generated from title", { icon: "🔗" });
  };

  // Categories
  const toggleCategory = (cat) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      const newCategories = exists 
        ? prev.categories.filter(c => c !== cat) 
        : [...prev.categories, cat];
      return { ...prev, categories: newCategories };
    });
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    if (!formData.categories.includes(trimmed)) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, trimmed] }));
      toast.success(`Category "${trimmed}" added`);
    }
    setCustomCategory('');
  };

  // Occasions
  const toggleOccasion = (occ) => {
    setFormData(prev => {
      const exists = prev.occasions.includes(occ);
      const newOccasions = exists ? prev.occasions.filter(o => o !== occ) : [...prev.occasions, occ];
      return { ...prev, occasions: newOccasions };
    });
  };

  const handleAddCustomOccasion = () => {
    const trimmed = customOccasion.trim();
    if (!trimmed) return;
    if (!formData.occasions.includes(trimmed)) {
      setFormData(prev => ({ ...prev, occasions: [...prev.occasions, trimmed] }));
      toast.success(`Occasion "${trimmed}" added`);
    }
    setCustomOccasion('');
  };

  // Inventory
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

  // Gallery & ImageDetails
  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
      imageDetails: [
        ...prev.imageDetails,
        { url: '', perspective: 'Angle', isPrimary: false }
      ]
    }));
  };

  const handleImageChange = (index, newUrl) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = newUrl;

      const newDetails = [...prev.imageDetails];
      if (!newDetails[index]) {
        newDetails[index] = { url: newUrl, perspective: 'Angle', isPrimary: false };
      } else {
        newDetails[index] = { ...newDetails[index], url: newUrl };
      }

      return { ...prev, images: newImages, imageDetails: newDetails };
    });
  };

  const handlePerspectiveChange = (index, perspective) => {
    setFormData(prev => {
      const newDetails = [...prev.imageDetails];
      if (newDetails[index]) {
        newDetails[index] = { ...newDetails[index], perspective };
      }
      return { ...prev, imageDetails: newDetails };
    });
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => {
      const targetUrl = prev.images[index];
      const newDetails = prev.imageDetails.map((item, idx) => ({
        ...item,
        isPrimary: idx === index
      }));
      return { 
        ...prev, 
        image: targetUrl || prev.image,
        imageDetails: newDetails 
      };
    });
    toast.success(`Gallery image #${index + 1} set as primary display image`);
  };

  const moveImage = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= formData.images.length) return;

    setFormData(prev => {
      const newImages = [...prev.images];
      const tempImg = newImages[index];
      newImages[index] = newImages[targetIdx];
      newImages[targetIdx] = tempImg;

      const newDetails = [...prev.imageDetails];
      const tempDetail = newDetails[index];
      newDetails[index] = newDetails[targetIdx];
      newDetails[targetIdx] = tempDetail;

      return { ...prev, images: newImages, imageDetails: newDetails };
    });
  };

  const handleRemoveImage = (index) => {
    const urlToRemove = formData.images[index];
    if (urlToRemove) {
      deleteImageFromCloud(urlToRemove);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageDetails: prev.imageDetails.filter((_, i) => i !== index)
    }));
  };

  // Form Submit
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
      toast.error("Please enter a valid positive product price");
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

    // Clean imageDetails array aligned with validImages
    const validImageDetails = validImages.map((imgUrl, idx) => {
      const match = formData.imageDetails.find(d => d && d.url === imgUrl);
      return {
        url: imgUrl,
        perspective: match?.perspective || (idx === 0 ? "Main 3/4 Studio" : "Angle"),
        isPrimary: Boolean(match?.isPrimary || imgUrl === formData.image)
      };
    });

    const finalSlug = slugify(formData.slug || formData.name);

    const productData = {
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
      price: priceNum,
      originalPrice: formData.originalPrice && !isNaN(Number(formData.originalPrice)) ? Number(formData.originalPrice) : 0,
      image: formData.image,
      images: validImages,
      imageDetails: validImageDetails,
      stock: validStock,
      totalStock, 
      category: formData.categories,
      categories: formData.categories,
      isNewArrival: Boolean(formData.isNewArrival),
      isBestSeller: Boolean(formData.isBestSeller),
      rating: formData.rating && !isNaN(Number(formData.rating)) ? Math.max(0, Math.min(5, Number(formData.rating))) : 0,
      numReviews: formData.numReviews && !isNaN(Number(formData.numReviews)) ? Math.max(0, Number(formData.numReviews)) : 0,
      // Craft Specifications
      sku: String(formData.sku || '').trim(),
      material: String(formData.material || '').trim(),
      color: String(formData.color || '').trim(),
      embellishment: String(formData.embellishment || '').trim(),
      sole: String(formData.sole || '').trim(),
      lining: String(formData.lining || '').trim(),
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
        if (formData.image) deleteImageFromCloud(formData.image);
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

  const currentTotalStock = formData.stock
    .filter(item => item && item.size)
    .reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4 md:px-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-8 pt-6 border-b pb-4 border-gray-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
            title="Return to Inventory"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {id ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {id ? `SKU / ID: ${formData.sku || id}` : 'Create a complete artisanal footwear listing'}
            </p>
          </div>
        </div>

        {formData.slug && (
          <a
            href={`/product/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#FF2865] bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" /> View on Storefront
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        
        {/* SECTION 1: BASIC DETAILS & SLUG */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#FF2865]" /> Basic Information & URL Slug
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">Step 1 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Product Name *
              </label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] outline-none text-sm transition-all" 
                placeholder="e.g. Noor-e-Zareen - Regal Zardozi Georgette Bridal Jutti"
              />
            </div>

            {/* URL Slug (Critical SEO field) */}
            <div className="md:col-span-2 bg-[#FAF9F6] p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  Custom URL Slug (Canonical Route: /product/:slug)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-xs text-[#8B5E3C] hover:text-[#1C1917] font-semibold underline self-start sm:self-auto"
                >
                  Regenerate from Name
                </button>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:border-[#1C1917] focus-within:ring-1 focus-within:ring-[#1C1917]">
                <span className="px-3 py-2 bg-gray-50 border-r border-gray-200 text-xs text-gray-500 font-mono shrink-0 select-none">
                  beadsandbloom.in/product/
                </span>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className="w-full p-2.5 text-xs font-mono text-gray-900 outline-none" 
                  placeholder="e.g. noor-e-zareen"
                />
              </div>

              {/* Old Slugs Badge List */}
              {formData.oldSlugs && formData.oldSlugs.length > 0 && (
                <div className="pt-2 border-t border-gray-200/70">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">
                    Preserved 301 Redirect Slugs (Zero 404 Fallback):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.oldSlugs.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-gray-200/80 text-gray-700 rounded text-[11px] font-mono">
                        /product/{s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Selling Price (₹) *
              </label>
              <input 
                type="number" 
                name="price" 
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm font-semibold" 
                placeholder="e.g. 3500"
              />
            </div>

            {/* Original / MRP Price */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Original MRP / Strike Price (₹) (Optional)
              </label>
              <input 
                type="number" 
                name="originalPrice" 
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. 4200"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                SKU / Artisan Style Code
              </label>
              <input 
                type="text" 
                name="sku" 
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm font-mono" 
                placeholder="e.g. BB-NRZ-B3F"
              />
            </div>

            {/* Rating & Review Seeding */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Customer Rating & Review Count
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating" 
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                  placeholder="Rating (0-5)"
                />
                <input 
                  type="number" 
                  min="0"
                  name="numReviews" 
                  value={formData.numReviews}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                  placeholder="Reviews (e.g. 12)"
                />
              </div>
            </div>

            {/* Multi-Select & Custom Categories */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                Categories * (Select preset chips or add custom tag)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                 {DEFAULT_CATEGORIES.map((cat) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5
                                ${isSelected 
                                    ? "bg-[#1C1917] text-white border-[#1C1917]" 
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {isSelected && <Check size={13} />}
                            {cat}
                        </button>
                    );
                 })}
                 {/* Display active custom categories */}
                 {formData.categories
                   .filter(c => !DEFAULT_CATEGORIES.includes(c))
                   .map((cat) => (
                     <button
                       key={cat}
                       type="button"
                       onClick={() => toggleCategory(cat)}
                       className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FF2865] text-white border border-[#FF2865] flex items-center gap-1.5"
                     >
                       <Check size={13} /> {cat}
                     </button>
                   ))}
              </div>

              {/* Add Custom Category Tag Input */}
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCategory(); }}}
                  placeholder="Type custom category..."
                  className="flex-1 p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#1C1917]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-lg transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Product Description *
              </label>
              <textarea 
                name="description" 
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm leading-relaxed" 
                placeholder="Detailed craft narrative and customer-facing description..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: MEDIA & PERSPECTIVES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
           <div className="flex items-center justify-between border-b pb-3">
             <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
               <Camera className="w-4 h-4 text-[#FF2865]" /> Product Media & Perspective Details
             </h2>
             <span className="text-[11px] text-gray-400 font-mono">Step 2 of 5</span>
           </div>
           
           {/* Main Display Image */}
           <div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <FileUpload 
                    label="Main Display Image *"
                    value={formData.image}
                    folderName={formData.slug || slugify(formData.name) || "products"}
                    onUpload={(url) => {
                        setFormData({ ...formData, image: url })
                    }}
                  />
                </div>
                <div className="w-full md:w-36 h-44 md:h-36 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 shadow-2xs">
                  {formData.image ? (
                    <img src={getOptimizedImage(formData.image, 300)} alt="Main Display Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
              </div>
           </div>

           {/* Gallery Images with ImageDetails & Perspectives */}
           <div className="pt-4 border-t border-gray-100">
             <div className="flex justify-between items-center mb-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Gallery Images & Perspective Tags
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Label perspective (e.g. 3/4 Studio, Sole & Footbed, Close-up Embroidery) to enrich customer gallery
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddImage} 
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#1C1917] hover:bg-[#FF2865] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Gallery Slot
                </button>
             </div>

             <div className="space-y-4">
               {formData.images.map((url, index) => {
                 const currentPerspective = formData.imageDetails[index]?.perspective || "Angle";
                 const isPrimary = formData.imageDetails[index]?.isPrimary || url === formData.image;

                 return (
                   <div key={index} className="p-4 bg-[#FAF9F6] rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-start">
                     {/* Preview Thumb */}
                     <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0 flex items-center justify-center">
                       {url ? (
                         <img src={getOptimizedImage(url, 150)} alt={`Gallery ${index+1}`} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-[10px] text-gray-400 text-center px-1">Slot #{index+1}</span>
                       )}
                     </div>

                     {/* Upload input + Perspective selector */}
                     <div className="flex-1 w-full space-y-3">
                       <FileUpload 
                         label={`Gallery Image #${index + 1}`}
                         value={url}
                         folderName={formData.slug || slugify(formData.name) || "products"}
                         onUpload={(newUrl) => handleImageChange(index, newUrl)}
                       />

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                             Perspective Tag
                           </label>
                           <select
                             value={currentPerspective}
                             onChange={(e) => handlePerspectiveChange(index, e.target.value)}
                             className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#1C1917]"
                           >
                             {PERSPECTIVE_PRESETS.map((p) => (
                               <option key={p} value={p}>{p}</option>
                             ))}
                           </select>
                         </div>

                         <div className="flex items-end gap-2">
                           <button
                             type="button"
                             onClick={() => handleSetPrimaryImage(index)}
                             disabled={!url || isPrimary}
                             className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                               isPrimary 
                                 ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                 : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                             }`}
                           >
                             <Check className="w-3.5 h-3.5" /> {isPrimary ? "Primary Display Image" : "Make Primary"}
                           </button>
                         </div>
                       </div>
                     </div>

                     {/* Reorder and Delete Controls */}
                     <div className="flex md:flex-col gap-1 items-center self-end md:self-start">
                       <button 
                         type="button" 
                         onClick={() => moveImage(index, -1)} 
                         disabled={index === 0}
                         className="p-1.5 border rounded-lg text-gray-500 hover:bg-white disabled:opacity-20 transition-opacity bg-gray-50" 
                         title="Move Up"
                       >
                         <ArrowUp className="w-4 h-4" />
                       </button>
                       <button 
                         type="button" 
                         onClick={() => moveImage(index, 1)} 
                         disabled={index === formData.images.length - 1}
                         className="p-1.5 border rounded-lg text-gray-500 hover:bg-white disabled:opacity-20 transition-opacity bg-gray-50" 
                         title="Move Down"
                       >
                         <ArrowDown className="w-4 h-4" />
                       </button>
                       <button 
                         type="button" 
                         onClick={() => handleRemoveImage(index)} 
                         className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" 
                         title="Remove image"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>

        {/* SECTION 3: ARTISANAL SPECIFICATIONS & CRAFT DETAILS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF2865]" /> Artisanal Specifications & Craft Details
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Precision craft specs displayed on the product page and accordion.
              </p>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">Step 3 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Primary Upper Material
              </label>
              <input 
                type="text" 
                name="material" 
                value={formData.material}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Pure Georgette & Organza / Pure Raw Silk / Velvet"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Color / Tone
              </label>
              <input 
                type="text" 
                name="color" 
                value={formData.color}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Champagne Gold / Ruby Red / Pastel Ivory"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Embellishment & Karigari Work
              </label>
              <input 
                type="text" 
                name="embellishment" 
                value={formData.embellishment}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Intricate Royal Zardozi, Cutdana, Seed Pearls & Zari Stitches"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Footbed & Outsole (Sole)
              </label>
              <input 
                type="text" 
                name="sole" 
                value={formData.sole}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. 100% Genuine Vegetable-Tanned Leather Sole"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Inner Lining
              </label>
              <input 
                type="text" 
                name="lining" 
                value={formData.lining}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Soft Genuine Leather Lining with Double-Density Cushioning"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Fit & Sizing Advice (Fit Tip)
              </label>
              <input 
                type="text" 
                name="fitTip" 
                value={formData.fitTip}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Fits true to EU sizes. If between sizes or broad feet, order one size up."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Comfort & Cushioning Notes (Sample Confirmed)
              </label>
              <input 
                type="text" 
                name="comfortNotes" 
                value={formData.comfortNotes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm" 
                placeholder="e.g. Double-padded memory foam footbed with arch support for bite-free, all-day comfort"
              />
            </div>

            {/* Occasions Multi-Select & Custom Tag */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                Suitable Occasions
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {DEFAULT_OCCASIONS.map((occ) => {
                  const isSelected = formData.occasions?.includes(occ);
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => toggleOccasion(occ)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5
                        ${isSelected 
                          ? "bg-[#1C1917] text-white border-[#1C1917]" 
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      {isSelected && <Check size={13} />}
                      {occ}
                    </button>
                  );
                })}
                {/* Active custom occasions */}
                {formData.occasions
                  .filter(o => !DEFAULT_OCCASIONS.includes(o))
                  .map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => toggleOccasion(occ)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#8B5E3C] text-white border border-[#8B5E3C] flex items-center gap-1.5"
                    >
                      <Check size={13} /> {occ}
                    </button>
                  ))}
              </div>

              {/* Add Custom Occasion Tag */}
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={customOccasion}
                  onChange={(e) => setCustomOccasion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomOccasion(); }}}
                  placeholder="Type custom occasion..."
                  className="flex-1 p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#1C1917]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomOccasion}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-lg transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Care Instructions (One instruction per line)
              </label>
              <textarea 
                name="careInstructions" 
                rows="4"
                value={formData.careInstructions}
                onChange={handleChange}
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:border-[#1C1917] outline-none text-sm leading-relaxed" 
                placeholder="Keep away from moisture, rain and direct water exposure&#10;Store in breathable muslin or satin dust bag provided&#10;Clean gently with a soft dry cotton cloth&#10;Air dry in shaded breeze if exposed to dampness"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: INVENTORY & STOCK BY SIZE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
           <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF2865]" /> Inventory by Size
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Total available units: <strong className="text-gray-900 font-mono">{currentTotalStock}</strong>
                </p>
              </div>
              <button 
                type="button" 
                onClick={addStockRow} 
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#1C1917] hover:bg-[#FF2865] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Size Row
              </button>
           </div>

           <div className="space-y-3">
             {formData.stock.map((item, index) => (
               <div key={index} className="flex gap-4 items-end bg-[#FAF9F6] p-3 rounded-xl border border-gray-200">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Size *</label>
                    <input 
                      type="text" 
                      required 
                      value={item.size} 
                      onChange={(e) => handleStockChange(index, 'size', e.target.value)} 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-sm font-semibold" 
                      placeholder="e.g. 36, 37, 38, 39, 40, 41, Free Size" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity in Stock *</label>
                    <input 
                      type="number" 
                      min="0" 
                      required 
                      value={item.quantity} 
                      onChange={(e) => handleStockChange(index, 'quantity', e.target.value)} 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-sm font-mono font-bold" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeStockRow(index)} 
                    className="p-2.5 bg-white rounded-lg hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors" 
                    disabled={formData.stock.length === 1} 
                    title="Remove stock row"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
               </div>
             ))}
           </div>
        </div>

        {/* SECTION 5: VISIBILITY & BADGES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
           <div className="border-b pb-3">
             <h2 className="text-base font-bold text-gray-900">Visibility & Catalog Badges</h2>
           </div>
           <div className="flex flex-wrap gap-8 pt-1">
             <label className="flex items-center gap-3 cursor-pointer select-none">
               <input 
                 type="checkbox" 
                 name="isNewArrival" 
                 checked={formData.isNewArrival} 
                 onChange={handleChange} 
                 className="w-5 h-5 accent-[#1C1917] rounded"
               />
               <div>
                 <span className="text-sm font-bold text-gray-900 block">Mark as New Arrival</span>
                 <span className="text-xs text-gray-400">Displays 'New In' badge across shop & homepage grids</span>
               </div>
             </label>

             <label className="flex items-center gap-3 cursor-pointer select-none">
               <input 
                 type="checkbox" 
                 name="isBestSeller" 
                 checked={formData.isBestSeller} 
                 onChange={handleChange} 
                 className="w-5 h-5 accent-[#1C1917] rounded"
               />
               <div>
                 <span className="text-sm font-bold text-gray-900 block">Mark as Best Seller</span>
                 <span className="text-xs text-gray-400">Featured in Best Sellers showcase and high-converting filters</span>
               </div>
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
               className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-200"
             >
               {deleteLoading ? 'Deleting...' : <><AlertCircle className="w-5 h-5" /> Delete Product</>}
             </button>
           ) : (
             <div /> 
           )}
           
           <button 
             type="submit"
             disabled={loading || deleteLoading}
             className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-white bg-[#1C1917] hover:bg-[#FF2865] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
           >
             {loading ? 'Saving...' : <><Save className="w-5 h-5" /> {id ? 'Save & Update Product' : 'Publish Product Listing'}</>}
           </button>
        </div>
      </form>
    </div>
  );
}