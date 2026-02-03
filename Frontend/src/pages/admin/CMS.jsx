import { useEffect, useState } from 'react';
import { Save, Layout, Instagram, Image as ImageIcon, Plus, Trash2, Star, Grid, Video, PlayCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { confirmAction } from '../../util/toastUtils';
import toast from 'react-hot-toast';

// 1. IMPORT OPTIMIZERS
import { getOptimizedImage } from '../../util/imageUtils';
import { getOptimizedVideo } from '../../util/videoUtils';

// 2. IMPORT FILE UPLOAD COMPONENT
import FileUpload from '../admin/FileUpload';

export default function CMS() {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('home'); 
  
  return (
    <div className="max-w-5xl mx-auto pb-12 px-4 md:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between sticky top-0 bg-[#F3F4F6] py-4 z-20 border-b border-gray-200 mb-6 gap-2">
         <div>
           <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
           <p className="text-sm text-gray-500">Manage your storefront content</p>
         </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto scrollbar-hide pb-1">
        <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Layout} label="Home & Socials" />
        <TabButton active={activeTab === 'bestsellers'} onClick={() => setActiveTab('bestsellers')} icon={Star} label="Best Sellers" />
        <TabButton active={activeTab === 'collections'} onClick={() => setActiveTab('collections')} icon={Grid} label="Collections" />
        <TabButton active={activeTab === 'runway'} onClick={() => setActiveTab('runway')} icon={Video} label="Runway" />
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'home' && <HomeCMS userInfo={userInfo} />}
      {activeTab === 'bestsellers' && <BestSellersCMS userInfo={userInfo} />}
      {activeTab === 'collections' && <CollectionsCMS userInfo={userInfo} />}
      {activeTab === 'runway' && <RunwayCMS userInfo={userInfo} />}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
   <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
        active ? 'border-[#1C1917] text-[#1C1917]' : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

// ==========================================
// 1. HOME & SOCIALS COMPONENT
// ==========================================
function HomeCMS({ userInfo }) {
  const [heroLoading, setHeroLoading] = useState(false);
  const [instaLoading, setInstaLoading] = useState(false);
  
  const [data, setData] = useState({ 
    heroSlides: [], 
    instagram: { photo1: '', photo2: '', reel: '', handle: '', profileLink: '' } 
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content`).then(res => res.json()).then(content => {
      if (content) setData(prev => ({ 
        heroSlides: content.heroSlides || [], 
        instagram: { ...prev.instagram, ...content.instagram } 
      }));
    });
  }, []);

  // --- HERO HANDLERS ---
  const handleHeroChange = (index, field, value) => {
    const newSlides = [...data.heroSlides];
    newSlides[index][field] = value;
    setData({ ...data, heroSlides: newSlides });
  };

  const addSlide = () => setData({ 
    ...data, 
    heroSlides: [...data.heroSlides, { image: '', title: 'New', subtitle: '', cta: 'Shop Now', link: '/shop' }] 
  });
  
  const removeSlide = (index) => {
    confirmAction({
        title: "Remove Slide?",
        message: "This slide will be removed.",
        confirmText: "Remove",
        onConfirm: () => {
        setData((prev) => ({
            ...prev,
            heroSlides: prev.heroSlides.filter((_, i) => i !== index),
        }));
        },
    });
  };

  const saveHero = async () => {
    setHeroLoading(true);
    try {
        await fetch(`${API_BASE_URL}/api/content`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            body: JSON.stringify({ heroSlides: data.heroSlides }), 
        });
        toast.success("Slider Updated Successfully!");
    } catch (e) {
        toast.error("Failed to update slider");
    } finally {
        setHeroLoading(false);
    }
  };

  // --- INSTAGRAM HANDLERS ---
  const handleInstaChange = (field, value) => {
    setData(prev => ({
      ...prev,
      instagram: { ...prev.instagram, [field]: value }
    }));
  };

  const saveInstagram = async () => {
    setInstaLoading(true);
    try {
        await fetch(`${API_BASE_URL}/api/content`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            body: JSON.stringify({ instagram: data.instagram }), 
        });
        toast.success("Instagram Feed Updated!");
    } catch (e) {
        toast.error("Failed to update Instagram");
    } finally {
        setInstaLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* --- HERO SLIDER SECTION --- */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
         <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b pb-4 gap-4">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layout className="w-5 h-5" /></div>
               <h3 className="text-lg font-bold text-gray-800">Home Page Slider</h3>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button onClick={addSlide} className="flex-1 md:flex-none justify-center text-[#FF2865] text-sm font-bold flex items-center gap-1 bg-pink-50 px-3 py-2 md:py-1.5 rounded hover:bg-pink-100 transition-colors">
                  <Plus className="w-4 h-4" /> Add Slide
               </button>
               <button onClick={saveHero} disabled={heroLoading} className="flex-1 md:flex-none justify-center bg-[#1C1917] text-white px-4 py-2 md:py-1.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#333]">
                  <Save className="w-4 h-4" /> {heroLoading ? 'Saving...' : 'Save Slider'}
               </button>
            </div>
         </div>

         {data.heroSlides.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 text-gray-400 text-sm italic">
               No slides added. Using default hardcoded banner.
            </div>
         ) : (
            <div className="space-y-6">
              {data.heroSlides.map((slide, i) => (
                <div key={i} className="p-4 md:p-6 border border-gray-200 rounded-xl bg-gray-50/30 relative hover:shadow-md transition-all">
                  <button onClick={() => removeSlide(i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2">
                      <Trash2 className="w-5 h-5"/>
                  </button>
                  
                  <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded mb-4 inline-block">SLIDE {i + 1}</span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                       {/* --- REPLACED: File Upload for Hero Image --- */}
                       <FileUpload 
                          label="Slide Image"
                          value={slide.image}
                          onUpload={(url) => handleHeroChange(i, 'image', url)}
                       />
                       {/* PREVIEW */}
                       {slide.image && (
                         <div className="mt-2">
                            <img src={getOptimizedImage(slide.image, 200)} alt="prev" className="w-full md:w-32 h-32 md:h-20 rounded object-cover border" />
                         </div>
                       )}
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                       <input className="w-full border p-2 rounded mt-1 text-sm" placeholder="Main Headline" value={slide.title} onChange={e=>handleHeroChange(i,'title',e.target.value)} />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                       <input className="w-full border p-2 rounded mt-1 text-sm" placeholder="Top small text" value={slide.subtitle} onChange={e=>handleHeroChange(i,'subtitle',e.target.value)} />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Button Text</label>
                       <input className="w-full border p-2 rounded mt-1 text-sm" placeholder="Shop Now" value={slide.cta} onChange={e=>handleHeroChange(i,'cta',e.target.value)} />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Link URL</label>
                       <input className="w-full border p-2 rounded mt-1 text-sm" placeholder="/shop" value={slide.link} onChange={e=>handleHeroChange(i,'link',e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
         )}
      </div>

      {/* --- INSTAGRAM SECTION --- */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
         <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b pb-4 gap-4">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Instagram className="w-5 h-5" /></div>
               <h3 className="text-lg font-bold text-gray-800">Instagram Feed</h3>
            </div>
            <button onClick={saveInstagram} disabled={instaLoading} className="w-full md:w-auto justify-center bg-[#1C1917] text-white px-4 py-2 md:py-1.5 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#333]">
               <Save className="w-4 h-4" /> {instaLoading ? 'Saving...' : 'Save Instagram'}
            </button>
         </div>

         <div className="space-y-6">
            <div>
               <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Instagram Handle</label>
               <input 
                 className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF2865] text-sm" 
                 placeholder="@your.handle" 
                 value={data.instagram.handle} 
                 onChange={e => handleInstaChange('handle', e.target.value)} 
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  {/* --- REPLACED: File Upload for Photo 1 --- */}
                  <FileUpload 
                    label="Photo 1 (Left)"
                    value={data.instagram.photo1}
                    onUpload={(url) => handleInstaChange('photo1', url)}
                  />
                  {/* OPTIMIZED PREVIEW */}
                  {data.instagram.photo1 && (
                    <img src={getOptimizedImage(data.instagram.photo1, 100)} alt="Preview" className="w-24 h-24 mt-2 rounded object-cover border" />
                  )}
               </div>

               <div>
                  {/* --- REPLACED: File Upload for Photo 2 --- */}
                  <FileUpload 
                    label="Photo 2 (Right)"
                    value={data.instagram.photo2}
                    onUpload={(url) => handleInstaChange('photo2', url)}
                  />
                  {/* OPTIMIZED PREVIEW */}
                  {data.instagram.photo2 && (
                    <img src={getOptimizedImage(data.instagram.photo2, 100)} alt="Preview" className="w-24 h-24 mt-2 rounded object-cover border" />
                  )}
               </div>

               <div className="md:col-span-2">
                  {/* --- REPLACED: File Upload for Reel (Video) --- */}
                  <FileUpload 
                    label="Reel Video (.mp4)"
                    value={data.instagram.reel}
                    accept="video/*"
                    onUpload={(url) => handleInstaChange('reel', url)}
                  />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. BEST SELLERS COMPONENT
// ==========================================
function BestSellersCMS({ userInfo }) {
  const [slots, setSlots] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cms/bestsellers`).then(res => res.json()).then(setSlots);
    fetch(`${API_BASE_URL}/api/products?pageSize=100`).then(res => res.json()).then(data => setProducts(data.products));
  }, []);

  const handleUpdateSlot = async (position, productId, tag) => {
    if(!productId) return toast.error("Please select a product");
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE_URL}/api/cms/bestsellers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            body: JSON.stringify({ position, productId, tag })
        });
        const updated = await res.json();
        setSlots(prev => {
            const filtered = prev.filter(p => p.position !== position);
            return [...filtered, updated].sort((a,b) => a.position - b.position);
        });
        toast.success(`Slot ${position} updated!`);
    } catch (e) {
        toast.error("Update failed");
    } finally {
        setLoading(false);
    }
  };

  const handleRemove = (position) => {
    confirmAction({
        title: "Clear this slot?",
        message: "This product will be removed from the Best Sellers.",
        confirmText: "Clear Slot",
        onConfirm: async () => {
        const toastId = toast.loading("Removing...");
        try {
            const res = await fetch(`${API_BASE_URL}/api/cms/bestsellers/${position}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            if (res.ok) {
            setSlots(prev => prev.filter(p => p.position !== position));
            toast.success("Slot cleared!", { id: toastId });
            } else {
            toast.error("Failed to clear", { id: toastId });
            }
        } catch (error) {
            toast.error("Server error", { id: toastId });
        }
        }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {[1, 2, 3].map(pos => {
        const currentSlot = slots.find(s => s.position === pos);
        return (
          <div key={pos} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
             <div className="flex justify-between">
                <span className="font-bold text-lg">Position #{pos}</span>
                {currentSlot && <button onClick={() => handleRemove(pos)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}
             </div>
             
             {/* Current Content Preview (Optimized) */}
             {currentSlot ? (
               <div className="mb-2">
                 <img 
                    src={getOptimizedImage(currentSlot.product?.image, 300)} 
                    alt="" 
                    className="w-full h-48 object-cover rounded-lg mb-2" 
                 />
                 <p className="font-bold text-sm truncate">{currentSlot.product?.name}</p>
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded">{currentSlot.tag}</span>
               </div>
             ) : (
               <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm mb-2">Empty Slot</div>
             )}

             <div className="mt-auto space-y-2 pt-4 border-t">
               <select id={`prod-${pos}`} className="w-full p-2 border rounded text-sm">
                 <option value="">Select Product...</option>
                 {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
               </select>
               <input id={`tag-${pos}`} className="w-full p-2 border rounded text-sm" placeholder="Tag (e.g. The Icon)" defaultValue={currentSlot?.tag || ''} />
               <button 
                 onClick={() => {
                   const pid = document.getElementById(`prod-${pos}`).value;
                   const tag = document.getElementById(`tag-${pos}`).value;
                   handleUpdateSlot(pos, pid, tag);
                 }}
                 disabled={loading}
                 className="w-full bg-[#1C1917] text-white py-2 rounded text-sm font-bold"
               >
                 Update Slot
               </button>
             </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 3. COLLECTIONS COMPONENT
// ==========================================
function CollectionsCMS({ userInfo }) {
  const [collections, setCollections] = useState([]);
  const [newCol, setNewCol] = useState({ name: '', image: '' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cms/collections`).then(res => res.json()).then(setCollections);
  }, []);

  const handleAdd = async () => {
    if(!newCol.name || !newCol.image) return toast.error("All fields required");
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/cms/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            body: JSON.stringify(newCol)
        });
        const saved = await res.json();
        setCollections([...collections, saved]);
        setNewCol({ name: '', image: '' });
        toast.success("Collection added!");
    } catch(e) {
        toast.error("Error adding collection");
    }
  };

  const handleDelete = (id) => {
    confirmAction({
        title: "Delete Collection?",
        message: "Permanently remove this collection.",
        confirmText: "Delete",
        onConfirm: async () => {
        const toastId = toast.loading("Deleting...");
        try {
            const res = await fetch(`${API_BASE_URL}/api/cms/collections/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            if (res.ok) {
                setCollections(prev => prev.filter(c => c._id !== id));
                toast.success("Deleted", { id: toastId });
            } else {
                toast.error("Failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Error", { id: toastId });
        }
        }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Add New Form */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 block mb-1">Collection Name</label>
            <input className="w-full p-2 border rounded" value={newCol.name} onChange={e => setNewCol({...newCol, name: e.target.value})} placeholder="e.g. Wedding Edit" />
          </div>
          <div className="flex-1">
            {/* --- REPLACED: File Upload for Collection Image --- */}
            <FileUpload 
               label="Collection Image"
               value={newCol.image}
               onUpload={(url) => setNewCol({...newCol, image: url})}
            />
          </div>
          <button onClick={handleAdd} className="w-full md:w-auto bg-[#1C1917] text-white px-6 py-2.5 rounded font-bold hover:bg-[#FF2865] transition-colors">Add</button>
       </div>

       {/* List Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {collections.map(c => (
            <div key={c._id} className="relative group rounded-xl overflow-hidden aspect-[4/5]">
               {/* OPTIMIZED IMAGE */}
               <img src={getOptimizedImage(c.image, 400)} alt={c.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white font-serif text-lg md:text-xl text-center px-2">{c.name}</h3>
               </div>
               <button onClick={() => handleDelete(c._id)} className="absolute top-2 right-2 bg-white p-2 rounded-full text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          ))}
       </div>
    </div>
  );
}


// ==========================================
// 4. RUNWAY CMS COMPONENT
// ==========================================
function RunwayCMS({ userInfo }) {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', videoUrl: '', ctaText: 'Shop The Look', link: '/shop' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cms/runway`)
      .then(res => res.json())
      .then(setVideos)
      .catch(err => console.error(err));
  }, []);

  const handleAdd = async () => {
    if(!newVideo.title || !newVideo.videoUrl) return toast.error("Title and Video URL required");
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/cms/runway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify(newVideo)
      });
      const saved = await res.json();
      setVideos([saved, ...videos]);
      setNewVideo({ title: '', videoUrl: '', ctaText: 'Shop The Look', link: '/shop' });
      toast.success("Video added!");
    } catch (error) {
      toast.error("Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAction({
        title: "Delete this Video?",
        message: "Permanently remove this video.",
        confirmText: "Delete",
        onConfirm: async () => {
        const toastId = toast.loading("Deleting...");
        try {
            const res = await fetch(`${API_BASE_URL}/api/cms/runway/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            if (res.ok) {
                setVideos(prev => prev.filter(v => v._id !== id));
                toast.success("Deleted", { id: toastId });
            } else {
                toast.error("Failed", { id: toastId });
            }
        } catch (error) {
            toast.error("Error", { id: toastId });
        }
        }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Add New Form */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#FF2865]" /> Add New Video
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Video Title</label>
              <input className="w-full p-2 border rounded mt-1" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} placeholder="e.g. Bridal BTS" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">CTA Text</label>
              <input className="w-full p-2 border rounded mt-1" value={newVideo.ctaText} onChange={e => setNewVideo({...newVideo, ctaText: e.target.value})} placeholder="e.g. Shop Now" />
            </div>
            <div className="md:col-span-2">
              {/* --- REPLACED: File Upload for Runway Video --- */}
              <FileUpload 
                 label="Video File (.mp4)"
                 value={newVideo.videoUrl}
                 accept="video/*"
                 onUpload={(url) => setNewVideo({...newVideo, videoUrl: url})}
              />
            </div>
          </div>
          <button onClick={handleAdd} disabled={loading} className="mt-4 bg-[#1C1917] text-white px-6 py-2 rounded font-bold hover:bg-[#FF2865] transition-colors w-full md:w-auto">
            {loading ? 'Adding...' : 'Add Video'}
          </button>
       </div>

       {/* Video Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {videos.map(v => (
            <div key={v._id} className="relative group rounded-xl overflow-hidden aspect-[9/16] bg-black">
               {/* OPTIMIZED VIDEO PREVIEW */}
               <video 
                 src={getOptimizedVideo(v.videoUrl, 400)} 
                 className="w-full h-full object-cover opacity-80" 
                 muted 
                 loop 
                 onMouseOver={e => e.target.play()} 
                 onMouseOut={e => e.target.pause()} 
               />
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-serif text-sm md:text-lg leading-tight">{v.title}</h3>
                  <p className="text-[#FF2865] text-[10px] md:text-xs font-bold uppercase mt-1">{v.ctaText}</p>
               </div>

               <button onClick={() => handleDelete(v._id)} className="absolute top-2 right-2 bg-white/20 hover:bg-white p-2 rounded-full text-white hover:text-red-500 transition-all z-20">
                 <Trash2 className="w-4 h-4" />
               </button>
               
               <div className="absolute top-2 left-2">
                 <PlayCircle className="w-5 h-5 text-white/50" />
               </div>
            </div>
          ))}
          
          {videos.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed">
              No videos added yet.
            </div>
          )}
       </div>
    </div>
  );
}