import { useState, useEffect } from 'react';
import {
  Save, Plus, Trash2, Sparkles, ExternalLink,
  Layers, Award, MessageSquare, HelpCircle, BookOpen,
  Star, ChevronDown, ChevronUp, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../util/config';
import { confirmAction } from '../../util/toastUtils';
import FileUpload from './FileUpload';

export default function FestiveCMS({ userInfo }) {
  const [subTab, setSubTab] = useState('hero'); // 'hero', 'occasions', 'craft', 'reviews', 'faqs'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [festiveContent, setFestiveContent] = useState({
    hero: {
      eyebrow: "The Celebration Atelier",
      title: "Handcrafted Festive Juttis & Sangeet Mojris",
      subtitle: "Celebrate India’s joyful weddings, sangeet dances, and festive galas in artisanal luxury. Masterfully hand-embroidered with authentic mirror work, dabka, and zardozi, engineered with our signature bite-free double memory foam cushioning.",
      storyTitle: "Artisan Heritage & Craft",
      storyParagraph1: "Celebrate India’s most joyous moments in handcrafted splendor. At Beads & Bloom, our festive jutti collection is born from an obsession with authentic Punjabi karigari and modern orthopedic comfort. Every pair is individually hand-embroidered by master artisans using genuine raw silks, plush micro-velvet, metallic dabka wire, sitara sequins, and authentic sheesha mirror work.",
      storyParagraph2: "Built on 100% genuine vegetable-tanned leather soles with our signature dual-layer memory foam footbed, experience 10+ hours of continuous, bite-free dancing through wedding sangeets, haldi ceremonies, and Diwali galas. Step into all-day celebration luxury designed to keep you shining from dusk till dawn.",
      storyImage: "https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1867_zDyUavPbR.jpeg"
    },
    trustPoints: [
      "10+ Hr Bite-Free Dance Cushioning",
      "100% Pure Leather Soles",
      "Heirloom Zardozi & Mirror Work",
      "Pan-India COD"
    ],
    occasions: [],
    craftPillars: [],
    reviews: [],
    faqs: []
  });

  // Fetch CMS Content
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content`)
      .then((res) => res.json())
      .then((content) => {
        if (content && content.festiveContent) {
          setFestiveContent(content.festiveContent);
        }
      })
      .catch((err) => {
        console.error("Failed to load festive CMS", err);
        toast.error("Failed to load festive content");
      })
      .finally(() => setLoading(false));
  }, []);

  // Save Festive Content to API
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify({ festiveContent })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save festive content");
      }

      toast.success("Festive Collection Page updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update festive content");
    } finally {
      setSaving(false);
    }
  };

  // 1. Hero Field Handlers
  const handleHeroChange = (field, val) => {
    setFestiveContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val
      }
    }));
  };

  const handleTrustPointChange = (idx, val) => {
    setFestiveContent((prev) => {
      const points = [...(prev.trustPoints || [])];
      points[idx] = val;
      return { ...prev, trustPoints: points };
    });
  };

  // 2. Occasion Handlers
  const handleOccasionChange = (idx, field, val) => {
    setFestiveContent((prev) => {
      const occs = [...(prev.occasions || [])];
      occs[idx] = { ...occs[idx], [field]: val };
      return { ...prev, occasions: occs };
    });
  };

  const handleOccasionRecommendedChange = (occIdx, recIdx, field, val) => {
    setFestiveContent((prev) => {
      const occs = [...(prev.occasions || [])];
      const recs = [...(occs[occIdx].recommended || [])];
      recs[recIdx] = { ...recs[recIdx], [field]: val };
      occs[occIdx] = { ...occs[occIdx], recommended: recs };
      return { ...prev, occasions: occs };
    });
  };

  const addOccasion = () => {
    const newOcc = {
      id: `occasion-${Date.now()}`,
      badge: "New Celebration Vibe",
      title: "Signature Styling Headline",
      desc: "Describe the styling aesthetics, fabric choices, and occasion mood here.",
      pairing: "Shararas, Silk sarees, Bandhani kurtas",
      heroImage: "https://ik.imagekit.io/hiteshh12/Products/Noor-e-Aaina_10.jpg?updatedAt=1769400493945",
      heroName: "Featured Product Name",
      heroPrice: 3500,
      heroSlug: "festive-jutti-slug",
      recommended: [
        { name: "Curated Design 1", slug: "slug-1", price: 3200, image: "" },
        { name: "Curated Design 2", slug: "slug-2", price: 3400, image: "" },
        { name: "Curated Design 3", slug: "slug-3", price: 3600, image: "" }
      ]
    };
    setFestiveContent((prev) => ({
      ...prev,
      occasions: [...(prev.occasions || []), newOcc]
    }));
  };

  const removeOccasion = (idx) => {
    confirmAction({
      title: "Delete Occasion Guide?",
      message: "This occasion and its lookbook pairings will be removed from the festive page.",
      confirmText: "Delete",
      onConfirm: () => {
        setFestiveContent((prev) => ({
          ...prev,
          occasions: prev.occasions.filter((_, i) => i !== idx)
        }));
      }
    });
  };

  // 3. Craft Pillar Handlers
  const handleCraftPillarChange = (idx, field, val) => {
    setFestiveContent((prev) => {
      const pillars = [...(prev.craftPillars || [])];
      pillars[idx] = { ...pillars[idx], [field]: val };
      return { ...prev, craftPillars: pillars };
    });
  };

  const addCraftPillar = () => {
    const newPillar = {
      number: `0${(festiveContent.craftPillars?.length || 0) + 1}`,
      title: "Artisanal Detail",
      desc: "Describe the craftsmanship technique and premium material used.",
      image: "",
      tag: "Craft Standard"
    };
    setFestiveContent((prev) => ({
      ...prev,
      craftPillars: [...(prev.craftPillars || []), newPillar]
    }));
  };

  const removeCraftPillar = (idx) => {
    confirmAction({
      title: "Remove Craft Pillar?",
      message: "This pillar will be removed from the craft anatomy section.",
      confirmText: "Remove",
      onConfirm: () => {
        setFestiveContent((prev) => ({
          ...prev,
          craftPillars: prev.craftPillars.filter((_, i) => i !== idx)
        }));
      }
    });
  };

  // 4. Review Handlers
  const handleReviewChange = (idx, field, val) => {
    setFestiveContent((prev) => {
      const revs = [...(prev.reviews || [])];
      revs[idx] = { ...revs[idx], [field]: val };
      return { ...prev, reviews: revs };
    });
  };

  const addReview = () => {
    const newRev = {
      name: "Customer Name",
      city: "City, State",
      review: "Wore these juttis to a wedding reception and danced all night in pure comfort!",
      product: "Product Name",
      slug: "product-slug",
      image: "",
      rating: 5
    };
    setFestiveContent((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), newRev]
    }));
  };

  const removeReview = (idx) => {
    confirmAction({
      title: "Delete Testimonial?",
      message: "This customer testimonial will be removed.",
      confirmText: "Delete",
      onConfirm: () => {
        setFestiveContent((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((_, i) => i !== idx)
        }));
      }
    });
  };

  // 5. FAQ Handlers
  const handleFaqChange = (idx, field, val) => {
    setFestiveContent((prev) => {
      const faqs = [...(prev.faqs || [])];
      faqs[idx] = { ...faqs[idx], [field]: val };
      return { ...prev, faqs };
    });
  };

  const addFaq = () => {
    const newFaq = {
      question: "Frequently asked question regarding festive footwear or sizing?",
      answer: "Provide a detailed answer with helpful styling, care, or delivery information."
    };
    setFestiveContent((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq]
    }));
  };

  const removeFaq = (idx) => {
    confirmAction({
      title: "Delete FAQ?",
      message: "This FAQ will be removed from the page and Google Rich Snippet schema.",
      confirmText: "Delete",
      onConfirm: () => {
        setFestiveContent((prev) => ({
          ...prev,
          faqs: prev.faqs.filter((_, i) => i !== idx)
        }));
      }
    });
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
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-lg font-bold text-gray-800">Festive Collection Content Management</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage live editorial stories, occasion lookbook guides, craft anatomy, and rich FAQs for <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-[#8B5E3C]">/collection/festive</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/collection/festive"
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
            Save Festive Content
          </button>
        </div>
      </div>

      {/* Sub-Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar pb-1">
        <button
          onClick={() => setSubTab('hero')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${subTab === 'hero' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Hero & Atelier Story
        </button>

        <button
          onClick={() => setSubTab('occasions')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${subTab === 'occasions' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Occasion Guides ({festiveContent.occasions?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('craft')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${subTab === 'craft' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          <Layers className="w-3.5 h-3.5" /> Craft Pillars ({festiveContent.craftPillars?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('reviews')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${subTab === 'reviews' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Testimonials ({festiveContent.reviews?.length || 0})
        </button>

        <button
          onClick={() => setSubTab('faqs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${subTab === 'faqs' ? 'bg-[#1C1917] text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> FAQs ({festiveContent.faqs?.length || 0})
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO & ATELIER STORY TAB */}
      {/* ============================================================== */}
      {subTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-800">Hero Header & Narrative Editorial</h3>
            <p className="text-xs text-gray-500">Configure the festive page banner, story toggle, and trust points.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Eyebrow Tagline</label>
              <input
                type="text"
                value={festiveContent.hero?.eyebrow || ''}
                onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
                placeholder="The Celebration Atelier"
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Main H1 Title</label>
              <input
                type="text"
                value={festiveContent.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                placeholder="Handcrafted Festive Juttis & Sangeet Mojris"
                className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:border-[#1C1917] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Lead Introductory Paragraph</label>
            <textarea
              rows={3}
              value={festiveContent.hero?.subtitle || ''}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none leading-relaxed"
            />
          </div>

          {/* Atelier Expandable Story Box */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE0D0] space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <h4 className="text-sm font-bold text-[#1C1917]">Expandable Atelier Story</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Story Header</label>
                <input
                  type="text"
                  value={festiveContent.hero?.storyTitle || ''}
                  onChange={(e) => handleHeroChange('storyTitle', e.target.value)}
                  placeholder="Artisan Heritage & Craft"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:border-[#1C1917] outline-none"
                />
              </div>

              <div>
                <FileUpload
                  label="Story Atelier Image"
                  value={festiveContent.hero?.storyImage || ''}
                  folderName="festive-cms"
                  onUpload={(url) => handleHeroChange('storyImage', url)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Story Paragraph 1 (Heritage & Karigari)</label>
              <textarea
                rows={3}
                value={festiveContent.hero?.storyParagraph1 || ''}
                onChange={(e) => handleHeroChange('storyParagraph1', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:border-[#1C1917] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Story Paragraph 2 (Comfort & Soles)</label>
              <textarea
                rows={3}
                value={festiveContent.hero?.storyParagraph2 || ''}
                onChange={(e) => handleHeroChange('storyParagraph2', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:border-[#1C1917] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Trust Points (4 Badges) */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Trust Ribbon Badges (4 Points)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(festiveContent.trustPoints || []).map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F9F8F6] p-2 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 pl-2">#{idx + 1}</span>
                  <input
                    type="text"
                    value={pt || ''}
                    onChange={(e) => handleTrustPointChange(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-medium outline-none text-[#1C1917]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. OCCASION GUIDES & STYLING STUDIO TAB */}
      {/* ============================================================== */}
      {subTab === 'occasions' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Celebration Occasions & Lookbook</h3>
              <p className="text-xs text-gray-500">Curate occasion tabs, featured lookbook juttis, and outfit recommendations.</p>
            </div>
            <button
              onClick={addOccasion}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Occasion
            </button>
          </div>

          <div className="space-y-6">
            {(festiveContent.occasions || []).map((occ, occIdx) => (
              <div key={occ.id || occIdx} className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-5 relative">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Occasion #{occIdx + 1}: {occ.badge || 'Untitled'}
                  </span>
                  <button
                    onClick={() => removeOccasion(occIdx)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove occasion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Occasion Badge / Tab Title</label>
                    <input
                      type="text"
                      value={occ.badge || ''}
                      onChange={(e) => handleOccasionChange(occIdx, 'badge', e.target.value)}
                      placeholder="Sangeet & Dance Floor"
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#1C1917] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Headline Title</label>
                    <input
                      type="text"
                      value={occ.title || ''}
                      onChange={(e) => handleOccasionChange(occIdx, 'title', e.target.value)}
                      placeholder="High-Sparkle Mirror Work & Dance Cushioning"
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-[#1C1917] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Stylist Advice & Guidance</label>
                    <textarea
                      rows={3}
                      value={occ.desc || ''}
                      onChange={(e) => handleOccasionChange(occIdx, 'desc', e.target.value)}
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Recommended Outfit Pairings</label>
                    <textarea
                      rows={3}
                      value={occ.pairing || ''}
                      onChange={(e) => handleOccasionChange(occIdx, 'pairing', e.target.value)}
                      placeholder="Flared mirror-work lehengas, tiered sharara suits..."
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3 text-xs text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Featured Silhouette */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D0] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5B28] block">
                    Spotlight Featured Silhouette
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block mb-1">Product Name</label>
                      <input
                        type="text"
                        value={occ.heroName || ''}
                        onChange={(e) => handleOccasionChange(occIdx, 'heroName', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={occ.heroPrice || ''}
                        onChange={(e) => handleOccasionChange(occIdx, 'heroPrice', Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block mb-1">Product URL Slug</label>
                      <input
                        type="text"
                        value={occ.heroSlug || ''}
                        onChange={(e) => handleOccasionChange(occIdx, 'heroSlug', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium outline-none"
                      />
                    </div>
                  </div>

                  <FileUpload
                    label="Featured Silhouette Photo"
                    value={occ.heroImage || ''}
                    folderName="festive-occasions"
                    onUpload={(url) => handleOccasionChange(occIdx, 'heroImage', url)}
                  />
                </div>

                {/* Recommended 3 Pairs */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-2">
                    Curated Pairs for this Occasion (3 items)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(occ.recommended || []).map((rec, recIdx) => (
                      <div key={recIdx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                        <span className="text-[9px] font-bold uppercase text-gray-400">Curated #{recIdx + 1}</span>
                        <input
                          type="text"
                          value={rec.name || ''}
                          onChange={(e) => handleOccasionRecommendedChange(occIdx, recIdx, 'name', e.target.value)}
                          placeholder="Pair Name"
                          className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs outline-none font-medium"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={rec.slug || ''}
                            onChange={(e) => handleOccasionRecommendedChange(occIdx, recIdx, 'slug', e.target.value)}
                            placeholder="product-slug"
                            className="w-full bg-white border border-gray-200 rounded p-1.5 text-[10px] outline-none"
                          />
                          <input
                            type="number"
                            value={rec.price || ''}
                            onChange={(e) => handleOccasionRecommendedChange(occIdx, recIdx, 'price', Number(e.target.value))}
                            placeholder="Price ₹"
                            className="w-full bg-white border border-gray-200 rounded p-1.5 text-[10px] outline-none font-medium"
                          />
                        </div>
                        <FileUpload
                          label="Thumbnail"
                          value={rec.image || ''}
                          folderName="festive-rec"
                          onUpload={(url) => handleOccasionRecommendedChange(occIdx, recIdx, 'image', url)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CRAFT PILLARS TAB */}
      {/* ============================================================== */}
      {subTab === 'craft' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">The Anatomy of Craftsmanship</h3>
              <p className="text-xs text-gray-500">Highlight your 4 craftsmanship pillars: silks, karigari, memory foam, and genuine leather soles.</p>
            </div>
            <button
              onClick={addCraftPillar}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Pillar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(festiveContent.craftPillars || []).map((pillar, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF0DC] text-[#C5A059] font-bold text-xs flex items-center justify-center font-serif">
                      {pillar.number || `0${idx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-gray-800">Pillar #{idx + 1}</span>
                  </div>
                  <button
                    onClick={() => removeCraftPillar(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Remove pillar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Index No.</label>
                    <input
                      type="text"
                      value={pillar.number || ''}
                      onChange={(e) => handleCraftPillarChange(idx, 'number', e.target.value)}
                      placeholder="01"
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs font-serif font-bold text-center outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Pillar Title</label>
                    <input
                      type="text"
                      value={pillar.title || ''}
                      onChange={(e) => handleCraftPillarChange(idx, 'title', e.target.value)}
                      placeholder="Lustrous Silks & Velvets"
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={pillar.tag || ''}
                    onChange={(e) => handleCraftPillarChange(idx, 'tag', e.target.value)}
                    placeholder="Raw Silk & Micro-Velvet"
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={pillar.desc || ''}
                    onChange={(e) => handleCraftPillarChange(idx, 'desc', e.target.value)}
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs leading-relaxed outline-none"
                  />
                </div>

                <FileUpload
                  label="Pillar Detail Photography"
                  value={pillar.image || ''}
                  folderName="festive-craft"
                  onUpload={(url) => handleCraftPillarChange(idx, 'image', url)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. REVIEWS & TESTIMONIALS TAB */}
      {/* ============================================================== */}
      {subTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Customer Testimonials & Social Proof</h3>
              <p className="text-xs text-gray-500">Showcase real reviews from sangeets, weddings, and dance floors.</p>
            </div>
            <button
              onClick={addReview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(festiveContent.reviews || []).map((rev, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-3 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <div className="flex items-center gap-1 text-[#C5A059]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <button
                      onClick={() => removeReview(idx)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={rev.name || ''}
                        onChange={(e) => handleReviewChange(idx, 'name', e.target.value)}
                        placeholder="Customer Name"
                        className="w-full bg-[#F9F8F6] border border-gray-200 rounded p-1.5 text-xs font-bold outline-none"
                      />
                      <input
                        type="text"
                        value={rev.city || ''}
                        onChange={(e) => handleReviewChange(idx, 'city', e.target.value)}
                        placeholder="City"
                        className="w-full bg-[#F9F8F6] border border-gray-200 rounded p-1.5 text-xs outline-none"
                      />
                    </div>

                    <textarea
                      rows={4}
                      value={rev.review || ''}
                      onChange={(e) => handleReviewChange(idx, 'review', e.target.value)}
                      placeholder="Review text..."
                      className="w-full bg-[#F9F8F6] border border-gray-200 rounded-lg p-2 text-xs leading-relaxed italic outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={rev.product || ''}
                      onChange={(e) => handleReviewChange(idx, 'product', e.target.value)}
                      placeholder="Product Name"
                      className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[11px] font-semibold outline-none"
                    />
                    <input
                      type="text"
                      value={rev.slug || ''}
                      onChange={(e) => handleReviewChange(idx, 'slug', e.target.value)}
                      placeholder="Product slug"
                      className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[10px] outline-none"
                    />
                  </div>

                  <FileUpload
                    label="Product Photo"
                    value={rev.image || ''}
                    folderName="festive-reviews"
                    onUpload={(url) => handleReviewChange(idx, 'image', url)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. FESTIVE FAQS TAB */}
      {/* ============================================================== */}
      {subTab === 'faqs' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-800">Festive FAQs & Google Rich Results Schema</h3>
              <p className="text-xs text-gray-500">These questions render on the page accordion and automatically feed the Google FAQPage schema.</p>
            </div>
            <button
              onClick={addFaq}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {(festiveContent.faqs || []).map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-3 relative">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-[#8B5E3C]">Question #{idx + 1}</span>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Remove FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Question</label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    placeholder="Enter customer question..."
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:border-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={faq.answer || ''}
                    onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                    placeholder="Enter detailed answer..."
                    className="w-full bg-[#F9F8F6] border border-gray-200 rounded-xl p-3 text-xs leading-relaxed text-gray-700 focus:bg-white focus:border-[#1C1917] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
