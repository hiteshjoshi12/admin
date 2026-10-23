import { useState, useEffect } from 'react';
import { 
  Save, Sparkles, ExternalLink, BookOpen, Layers, 
  Heart, Image as ImageIcon, Plus, Trash2, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../util/config';
import { confirmAction } from '../../util/toastUtils';
import FileUpload from './FileUpload';

export default function AboutCMS({ userInfo }) {
  const [subTab, setSubTab] = useState('hero'); // 'hero', 'mission', 'stats', 'pillars', 'values', 'gallery', 'founder'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [aboutContent, setAboutContent] = useState({
    hero: {
      badge: "The Story Behind Beads & Bloom",
      title: "Handcrafted Luxury Rooted in Punjab's Timeless Karigari",
      subtitle: "Born from a passion to preserve authentic Indian needlecraft while solving the age-old problem of painful ethnic footwear. We engineer heirloom Punjabi juttis with pure leather soles and double-cushioned orthopedic comfort.",
      heroImage: "https://ik.imagekit.io/beandandbloom/Media/IMG_9775_mebgcp.jpg"
    },
    mission: {
      tagline: "Where Heritage Meets Cloud Comfort",
      headline: "Some stories aren’t written. They are stitched.",
      paragraph1: "Before Beads & Bloom becomes something you wear, it begins with hands that remember—generational master karigars rooted in Punjab, working with patience, precision, and cultural pride. For decades, wearing traditional ethnic footwear meant enduring painful shoe bites, stiff cardboard soles, and blisters after just an hour on the dance floor.",
      paragraph2: "We set out to change this without losing the soul of the craft. We paired centuries-old dabka, zardozi, and authentic sheesha mirror work with modern orthopedic footbed engineering—giving every woman the freedom to celebrate India’s most joyous weddings, sangeets, and galas in pure, uncompromised comfort.",
      quote: "We don't modernise by westernising. We refine what already belongs to us."
    },
    stats: [],
    pillars: [],
    values: [],
    gallery: [],
    founderNote: {
      headline: "A Message from Our Atelier",
      quote: "When a woman slips into Beads & Bloom for the first time, she doesn’t just feel style. She feels confidence, grace, and belonging.",
      body: "I started Beads & Bloom to bridge the gap between India's breathtaking textile heritage and the modern woman's lifestyle. You should never have to take off your shoes halfway through a wedding reception or compromise your comfort for beauty. Every stitch we place is an ode to who we are, where we come from, and the celebrations that unite us.",
      author: "Founder & Creative Director",
      brand: "Beads & Bloom"
    }
  });

  // Fetch CMS Content
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content`)
      .then((res) => res.json())
      .then((content) => {
        if (content && content.aboutContent) {
          setAboutContent(content.aboutContent);
        }
      })
      .catch((err) => {
        console.error("Failed to load About CMS", err);
        toast.error("Failed to load about page content");
      })
      .finally(() => setLoading(false));
  }, []);

  // Save to API
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({ aboutContent })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save about page content");
      }

      toast.success("About Page updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update about page content");
    } finally {
      setSaving(false);
    }
  };

  // 1. Hero Field Handlers
  const handleHeroChange = (field, val) => {
    setAboutContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val }
    }));
  };

  // 2. Mission Field Handlers
  const handleMissionChange = (field, val) => {
    setAboutContent((prev) => ({
      ...prev,
      mission: { ...prev.mission, [field]: val }
    }));
  };

  // 3. Stats Handlers
  const handleStatChange = (idx, field, val) => {
    setAboutContent((prev) => {
      const stats = [...(prev.stats || [])];
      stats[idx] = { ...stats[idx], [field]: val };
      return { ...prev, stats };
    });
  };

  // 4. Craft Pillars Handlers
  const handlePillarChange = (idx, field, val) => {
    setAboutContent((prev) => {
      const pillars = [...(prev.pillars || [])];
      pillars[idx] = { ...pillars[idx], [field]: val };
      return { ...prev, pillars };
    });
  };

  const addPillar = () => {
    const newP = {
      number: `0${(aboutContent.pillars?.length || 0) + 1}`,
      title: "Artisanal Technique",
      desc: "Describe this craftsmanship technique and material details.",
      tag: "Craft Standard",
      image: ""
    };
    setAboutContent((prev) => ({
      ...prev,
      pillars: [...(prev.pillars || []), newP]
    }));
  };

  const removePillar = (idx) => {
    confirmAction({
      title: "Remove Craft Pillar?",
      message: "This pillar will be removed from the craft anatomy section.",
      confirmText: "Remove",
      onConfirm: () => {
        setAboutContent((prev) => ({
          ...prev,
          pillars: prev.pillars.filter((_, i) => i !== idx)
        }));
      }
    });
  };

  // 5. Values Handlers
  const handleValueChange = (idx, field, val) => {
    setAboutContent((prev) => {
      const vals = [...(prev.values || [])];
      vals[idx] = { ...vals[idx], [field]: val };
      return { ...prev, values: vals };
    });
  };

  const addValue = () => {
    const newV = {
      title: "Core Commitment",
      desc: "Explain how Beads & Bloom honors this ethical or artisanal standard."
    };
    setAboutContent((prev) => ({
      ...prev,
      values: [...(prev.values || []), newV]
    }));
  };

  const removeValue = (idx) => {
    confirmAction({
      title: "Remove Value?",
      message: "This value will be removed from the about page.",
      confirmText: "Remove",
      onConfirm: () => {
        setAboutContent((prev) => ({
          ...prev,
          values: prev.values.filter((_, i) => i !== idx)
        }));
      }
    });
  };

  // 6. Gallery Handlers
  const handleGalleryChange = (idx, url) => {
    setAboutContent((prev) => {
      const g = [...(prev.gallery || [])];
      g[idx] = url;
      return { ...prev, gallery: g };
    });
  };

  const addGalleryImage = () => {
    setAboutContent((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), ""]
    }));
  };

  const removeGalleryImage = (idx) => {
    setAboutContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx)
    }));
  };

  // 7. Founder Note Handlers
  const handleFounderChange = (field, val) => {
    setAboutContent((prev) => ({
      ...prev,
      founderNote: { ...prev.founderNote, [field]: val }
    }));
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C1917]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sticky Header with Action & Live Page Link */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-lg font-bold text-gray-800">About Page Content Management</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your comprehensive brand story, karigari anatomy, mission, and trust signals for <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-[#8B5E3C]">/about</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1C1917] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save About Page
          </button>
        </div>
      </div>

      {/* Sub-Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar pb-1">
        <button
          onClick={() => setSubTab('hero')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'hero' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Hero & Header
        </button>

        <button
          onClick={() => setSubTab('mission')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'mission' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Brand Genesis & Mission
        </button>

        <button
          onClick={() => setSubTab('stats')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'stats' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Trust Stats ({aboutContent.stats?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('pillars')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'pillars' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Craft Pillars ({aboutContent.pillars?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('values')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'values' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Core Values ({aboutContent.values?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('gallery')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'gallery' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Workshop Gallery ({aboutContent.gallery?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('founder')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            subTab === 'founder' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Founder's Note
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO TAB */}
      {/* ============================================================== */}
      {subTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-800">Hero Section & Taglines</h3>
            <p className="text-xs text-gray-500">Configure top banner headline, mission subtitle, and hero photography.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Eyebrow Tagline</label>
              <input
                type="text"
                value={aboutContent.hero?.badge || ''}
                onChange={(e) => handleHeroChange('badge', e.target.value)}
                placeholder="The Story Behind Beads & Bloom"
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Main H1 Title</label>
              <input
                type="text"
                value={aboutContent.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                placeholder="Handcrafted Luxury Rooted in Punjab's Timeless Karigari"
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Introductory Mission Statement</label>
            <textarea
              rows={3}
              value={aboutContent.hero?.subtitle || ''}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none leading-relaxed"
            />
          </div>

          <FileUpload
            label="Hero Section Photography"
            value={aboutContent.hero?.heroImage || ''}
            folderName="about-cms"
            onUpload={(url) => handleHeroChange('heroImage', url)}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. BRAND GENESIS & MISSION TAB */}
      {/* ============================================================== */}
      {subTab === 'mission' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-800">The Genesis Story & Brand Philosophy</h3>
            <p className="text-xs text-gray-500">Share why Beads & Bloom was founded, solving the shoe bite problem while honoring heritage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Tagline</label>
              <input
                type="text"
                value={aboutContent.mission?.tagline || ''}
                onChange={(e) => handleMissionChange('tagline', e.target.value)}
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Headline Hook</label>
              <input
                type="text"
                value={aboutContent.mission?.headline || ''}
                onChange={(e) => handleMissionChange('headline', e.target.value)}
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Narrative Paragraph 1 (Artisans & Origins)</label>
            <textarea
              rows={4}
              value={aboutContent.mission?.paragraph1 || ''}
              onChange={(e) => handleMissionChange('paragraph1', e.target.value)}
              className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Narrative Paragraph 2 (Comfort Revolution)</label>
            <textarea
              rows={4}
              value={aboutContent.mission?.paragraph2 || ''}
              onChange={(e) => handleMissionChange('paragraph2', e.target.value)}
              className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Brand Mantra / Core Quote</label>
            <input
              type="text"
              value={aboutContent.mission?.quote || ''}
              onChange={(e) => handleMissionChange('quote', e.target.value)}
              placeholder="We don't modernise by westernising. We refine what already belongs to us."
              className="w-full bg-[#FAF8F5] border border-[#EAE0D0] rounded-xl px-3.5 py-2.5 text-xs italic font-serif text-[#1C1917] focus:bg-white outline-none"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TRUST STATS TAB */}
      {/* ============================================================== */}
      {subTab === 'stats' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-800">Trust Numbers & Milestones</h3>
            <p className="text-xs text-gray-500">Key metrics displayed in the prominent trust signals strip.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(aboutContent.stats || []).map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D0] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Metric #{idx + 1}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Big Number</label>
                    <input
                      type="text"
                      value={stat.number || ''}
                      onChange={(e) => handleStatChange(idx, 'number', e.target.value)}
                      placeholder="15,000+"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-bold text-[#1C1917] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                      placeholder="Happy Feet"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Description Context</label>
                  <input
                    type="text"
                    value={stat.desc || ''}
                    onChange={(e) => handleStatChange(idx, 'desc', e.target.value)}
                    placeholder="Brief description..."
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-600 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CRAFT PILLARS TAB */}
      {/* ============================================================== */}
      {subTab === 'pillars' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Footwear Craftsmanship Pillars</h3>
              <p className="text-xs text-gray-500">Detail your 4 pillars: Needlecraft, Memory Foam, Genuine Leather, and Snag-Free Finish.</p>
            </div>
            <button
              onClick={addPillar}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Pillar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(aboutContent.pillars || []).map((pillar, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF0DC] text-[#C5A059] font-bold text-xs flex items-center justify-center font-serif">
                      {pillar.number || `0${idx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-gray-800">Pillar #{idx + 1}</span>
                  </div>
                  <button
                    onClick={() => removePillar(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Remove pillar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Index</label>
                    <input
                      type="text"
                      value={pillar.number || ''}
                      onChange={(e) => handlePillarChange(idx, 'number', e.target.value)}
                      placeholder="01"
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs font-bold text-center outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Pillar Title</label>
                    <input
                      type="text"
                      value={pillar.title || ''}
                      onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                      placeholder="Pillar title"
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={pillar.tag || ''}
                    onChange={(e) => handlePillarChange(idx, 'tag', e.target.value)}
                    placeholder="Tag"
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={pillar.desc || ''}
                    onChange={(e) => handlePillarChange(idx, 'desc', e.target.value)}
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs leading-relaxed outline-none"
                  />
                </div>

                <FileUpload
                  label="Pillar Detail Photography"
                  value={pillar.image || ''}
                  folderName="about-craft"
                  onUpload={(url) => handlePillarChange(idx, 'image', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. CORE VALUES TAB */}
      {/* ============================================================== */}
      {subTab === 'values' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Company Mission & Ethical Values</h3>
              <p className="text-xs text-gray-500">State your commitments to fair wages, slow fashion, comfort, and sustainable packaging.</p>
            </div>
            <button
              onClick={addValue}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Value
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(aboutContent.values || []).map((val, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-[#8B5E3C]">Commitment #{idx + 1}</span>
                  <button
                    onClick={() => removeValue(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Remove value"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Value Title</label>
                  <input
                    type="text"
                    value={val.title || ''}
                    onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                    placeholder="Value title"
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Explanation</label>
                  <textarea
                    rows={3}
                    value={val.desc || ''}
                    onChange={(e) => handleValueChange(idx, 'desc', e.target.value)}
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs leading-relaxed outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. ATELIER WORKSHOP GALLERY TAB */}
      {/* ============================================================== */}
      {subTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Behind the Seams — Atelier Gallery</h3>
              <p className="text-xs text-gray-500">Showcase authentic photography of hands at work, sole buffing, and embroidery.</p>
            </div>
            <button
              onClick={addGalleryImage}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(aboutContent.gallery || []).map((imgUrl, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">Photo #{idx + 1}</span>
                  <button
                    onClick={() => removeGalleryImage(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {imgUrl ? (
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={imgUrl} alt={`Workshop ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                    No image uploaded
                  </div>
                )}

                <FileUpload
                  label="Upload / Change"
                  value={imgUrl || ''}
                  folderName="about-gallery"
                  onUpload={(url) => handleGalleryChange(idx, url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. FOUNDER NOTE TAB */}
      {/* ============================================================== */}
      {subTab === 'founder' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-800">Founder's Note & Personal Message</h3>
            <p className="text-xs text-gray-500">A warm, authentic note creating personal connection and E-E-A-T brand authority.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Headline</label>
              <input
                type="text"
                value={aboutContent.founderNote?.headline || ''}
                onChange={(e) => handleFounderChange('headline', e.target.value)}
                placeholder="A Message from Our Atelier"
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Author Title</label>
              <input
                type="text"
                value={aboutContent.founderNote?.author || ''}
                onChange={(e) => handleFounderChange('author', e.target.value)}
                placeholder="Founder & Creative Director"
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Prominent Quote</label>
            <input
              type="text"
              value={aboutContent.founderNote?.quote || ''}
              onChange={(e) => handleFounderChange('quote', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EAE0D0] rounded-xl px-3.5 py-2.5 text-xs italic font-serif text-[#1C1917] focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Full Letter Body</label>
            <textarea
              rows={5}
              value={aboutContent.founderNote?.body || ''}
              onChange={(e) => handleFounderChange('body', e.target.value)}
              className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3 text-xs leading-relaxed text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
