/**
 * Semantic HTML Generators for SSR Injection into <div id="root">
 * Sourced strictly from MongoDB models and shared siteNavigation.json.
 * Zero cloaking: all markup matches user UI.
 */

const siteNavigation = require('../data/siteNavigation.json');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getOptimizedImageUrl(url, width = 600) {
  if (!url) return '';
  let safeUrl = String(url).trim().replace(/ /g, '%20');
  if (safeUrl.includes('ik.imagekit.io')) {
    const transformation = `tr=w-${width},f-webp,q-auto`;
    if (safeUrl.includes('?')) {
      if (safeUrl.includes('tr=')) return safeUrl;
      return `${safeUrl}&${transformation}`;
    }
    return `${safeUrl}?${transformation}`;
  }
  return safeUrl;
}

function getImageSrcSet(url, widths = [360, 600, 900, 1200]) {
  if (!url || !url.includes('ik.imagekit.io')) return '';
  return widths.map(w => `${getOptimizedImageUrl(url, w)} ${w}w`).join(', ');
}

/**
 * Global Semantic Server Navbar (Rendered inside #root, replaced seamlessly on React mount)
 */
function renderServerNavbar() {
  const brand = siteNavigation.brand;
  const navLinks = siteNavigation.navLinks;
  const announcement = siteNavigation.policies.announcement;

  return `
    <header class="w-full">
      <div class="bg-[#1C1917] text-white text-[10px] md:text-xs font-bold tracking-widest text-center py-2 transition-all duration-500 overflow-hidden h-8 opacity-100">
        ${escapeHtml(announcement)}
      </div>
      <div class="fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out top-8 pt-2 px-3">
        <nav class="relative flex items-center justify-between transition-all duration-500 ease-in-out w-full max-w-[1440px] rounded-full px-6 md:px-8 py-4 bg-white shadow-2xl border border-gray-100">
          <a href="${escapeHtml(brand.homeUrl)}" class="flex flex-col group z-50 relative shrink-0">
            <span class="font-serif text-xl font-bold tracking-wide text-[#1C1917] leading-none group-hover:text-gray-600 transition-colors">
              ${escapeHtml(brand.name)}
            </span>
            <span class="text-[0.5rem] md:text-[0.6rem] font-sans text-stone-500 tracking-[0.25em] uppercase mt-1">
              ${escapeHtml(brand.tagline)}
            </span>
          </a>
          <div class="hidden lg:flex items-center gap-7">
            ${navLinks.map(link => `
              <a href="${escapeHtml(link.path)}" class="text-xs uppercase tracking-widest relative py-1 px-1 flex items-center gap-1 font-bold ${link.isSpecial ? 'text-[#8B5E3C]' : 'text-gray-500 hover:text-[#1C1917]'} transition-colors">
                <span>${escapeHtml(link.name)}</span>
              </a>
            `).join('')}
          </div>
          <div class="flex items-center gap-3">
            <a href="/shop" class="text-xs uppercase tracking-widest text-gray-700 font-bold hover:text-[#FF2865] transition-colors">
              Explore Collection
            </a>
          </div>
        </nav>
      </div>
    </header>
  `;
}

/**
 * Global Semantic Server Footer (Rendered inside #root, replaced seamlessly on React mount)
 */
function renderServerFooter() {
  const brand = siteNavigation.brand;
  const colLinks = siteNavigation.footerSections.collections;
  const supportLinks = siteNavigation.footerSections.support;
  const legalLinks = siteNavigation.footerSections.legal.links;

  return `
    <footer class="bg-[#1C1917] text-white pt-20 pb-10 mt-16">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div class="md:col-span-1">
          <h3 class="text-2xl font-serif mb-4 tracking-wide">${escapeHtml(brand.name)}</h3>
          <p class="text-gray-400 text-sm leading-relaxed mb-4">${escapeHtml(brand.description)}</p>
          <div class="text-xs text-gray-400 space-y-1 mb-6 border-l-2 border-[#C5A059] pl-3">
            <p><span class="text-white font-medium">Artisan Atelier:</span> Handcrafted in India</p>
            <p><span class="text-white font-medium">Delivery:</span> Worldwide Express Shipping</p>
            <p><span class="text-white font-medium">Payments:</span> COD &amp; 100% Secure Online</p>
          </div>
        </div>
        <div>
          <h4 class="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">${escapeHtml(colLinks.title)}</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            ${colLinks.links.map(l => `
              <li><a href="${escapeHtml(l.path)}" class="hover:text-white transition-colors">${escapeHtml(l.name)}</a></li>
            `).join('')}
          </ul>
        </div>
        <div>
          <h4 class="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">${escapeHtml(supportLinks.title)}</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            ${supportLinks.links.map(l => `
              <li><a href="${escapeHtml(l.path)}" class="hover:text-white transition-colors">${escapeHtml(l.name)}</a></li>
            `).join('')}
          </ul>
        </div>
        <div>
          <h4 class="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-6">Stay in the Loop</h4>
          <p class="text-gray-400 text-sm mb-4">Subscribe for exclusive bridal edits &amp; festive releases.</p>
          <div class="text-xs text-gray-400 space-y-1 border-l-2 border-gray-700 pl-3">
            <p><span class="text-white font-medium">Support:</span> ${escapeHtml(brand.supportEmail)}</p>
            <p><span class="text-white font-medium">Orders:</span> Express Dispatched</p>
          </div>
        </div>
      </div>
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 pb-8 text-[11px] text-gray-400 leading-relaxed text-center md:text-left">
        <span class="text-gray-300 font-semibold">Specializing in:</span> ${escapeHtml(brand.specializingIn)}
      </div>
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 uppercase tracking-widest">
        <p>© 2026 ${escapeHtml(brand.name)}. All rights reserved.</p>
        <div class="flex gap-6 mt-4 md:mt-0">
          ${legalLinks.map(l => `
            <a href="${escapeHtml(l.path)}" class="hover:text-white transition-colors">${escapeHtml(l.name)}</a>
          `).join('')}
        </div>
      </div>
    </footer>
  `;
}

/**
 * 1. Homepage Semantic Markup
 */
function renderHomeRoot(siteContent, featuredProducts = []) {
  const slide = siteContent?.heroSlides?.[0] || {};
  const rawTitle = slide.title || 'Walk in Poetry';
  const words = rawTitle.trim().split(' ').filter(Boolean);
  const line1 = words.length > 0 ? words[0] : 'Handcrafted';
  const line2 = words.length > 1 ? words.slice(1).join(' ') : 'Juttis';
  const subtitle = slide.subtitle || 'New Arrivals';
  const cta = slide.cta || 'Shop The Collection';
  const link = slide.link || '/shop';
  const heroImage = slide.image || 'https://ik.imagekit.io/hiteshh12/editorial/banner1_7npLvX_g6.png';

  const productCardsHtml = featuredProducts.slice(0, 4).map(p => `
    <div class="group relative flex flex-col">
      <a href="/product/${p.slug}" class="block relative mb-4">
        <div class="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden rounded-xl">
          <img 
            src="${escapeHtml(getOptimizedImageUrl(p.image, 600))}" 
            srcset="${escapeHtml(getImageSrcSet(p.image, [360, 480, 600, 800]))}"
            sizes="(max-width: 768px) 50vw, 25vw"
            width="300"
            height="400"
            alt="${escapeHtml(p.name)}" 
            loading="lazy" 
            decoding="async" 
            class="w-full h-full object-cover" 
          />
        </div>
      </a>
      <div class="text-center">
        <a href="/product/${p.slug}" class="block">
          <h3 class="font-serif text-base text-[#1C1917] mb-1.5">${escapeHtml(p.name)}</h3>
          <span class="font-medium text-sm text-[#1C1917]">₹${Number(p.price).toLocaleString('en-IN')}</span>
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="bg-white">
      ${renderServerNavbar()}
      <!-- 1. Hero Showcase -->
      <section class="relative h-[88vh] md:h-screen w-full overflow-hidden bg-[#1C1917]">
        <div class="absolute inset-0">
          <img 
            src="${escapeHtml(getOptimizedImageUrl(heroImage, 1200))}" 
            srcset="${escapeHtml(getImageSrcSet(heroImage, [480, 768, 1200, 1600]))}"
            sizes="100vw"
            width="1200"
            height="800"
            alt="${escapeHtml(line1)} ${escapeHtml(line2)}" 
            fetchpriority="high" 
            class="w-full h-full object-cover object-center" 
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40"></div>
        </div>
        <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-16 md:pt-20">
          <div class="flex flex-col items-center max-w-4xl px-2">
            ${subtitle ? `
              <div class="inline-flex items-center gap-2 px-3.5 py-1 md:py-1.5 rounded-full bg-black/35 border border-white/20 text-[10px] md:text-xs font-sans font-semibold tracking-[0.28em] uppercase text-white/95 mb-4 md:mb-5 shadow-lg">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FD61A7]"></span>
                ${escapeHtml(subtitle)}
              </div>
            ` : ''}
            <h1 class="font-serif leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              <span class="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white">
                ${escapeHtml(line1)}
              </span>
              <span class="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl italic font-light mt-1 md:mt-2 text-[#FD61A7]">
                ${escapeHtml(line2)}
              </span>
            </h1>
            <div class="mt-6 md:mt-8">
              <a href="${escapeHtml(link)}" class="inline-flex items-center gap-2.5 bg-white text-[#1C1917] px-6 py-2.5 md:px-8 md:py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl">
                <span>${escapeHtml(cta)}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Brand Intro Section -->
      <section class="max-w-4xl mx-auto px-6 py-10 md:py-14 text-center">
        <h2 class="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#8B5E3C] mb-3">Handcrafted Punjabi Juttis &amp; Bridal Mojaris</h2>
        <p class="text-sm md:text-base text-gray-700 font-serif leading-relaxed">
          Beads &amp; Bloom crafts luxury handcrafted Punjabi juttis and bridal mojaris, embroidered by master artisans with pure leather soles and double-padded cushioning. Designed for modern weddings, festive occasions, and everyday elegance. Enjoy Cash on Delivery (COD) across India and express worldwide shipping for trousseaus across the globe.
        </p>
      </section>

      <!-- 3. Category Portals -->
      <section class="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div class="text-center max-w-xl mx-auto mb-12">
          <span class="text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-2 block">Curated Editions</span>
          <h2 class="text-3xl md:text-4xl font-serif text-[#1C1917]">Explore By Occasion</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a href="/collection/bridal" class="group block relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/5]">
            <img src="https://ik.imagekit.io/hiteshh12/editorial/banner1_7npLvX_g6.png" alt="Bridal Juttis" loading="lazy" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <span class="text-[10px] uppercase tracking-widest text-[#FD61A7] font-semibold mb-1">Couture Wedding</span>
              <h3 class="text-2xl font-serif">The Bridal Edit</h3>
            </div>
          </a>
          <a href="/collection/festive" class="group block relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/5]">
            <img src="https://ik.imagekit.io/hiteshh12/ecommerce_uploads/products/uncategorized/compressed_image_under7mb_eyHxarsAh.jpg" alt="Festive Juttis" loading="lazy" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <span class="text-[10px] uppercase tracking-widest text-[#FD61A7] font-semibold mb-1">Sangeet &amp; Celebrations</span>
              <h3 class="text-2xl font-serif">The Festive Edit</h3>
            </div>
          </a>
          <a href="/collection/casual" class="group block relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/5]">
            <img src="https://ik.imagekit.io/hiteshh12/ecommerce_uploads/IMG_1822_cMxk4rPfx.jpeg" alt="Casual Juttis" loading="lazy" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <span class="text-[10px] uppercase tracking-widest text-[#FD61A7] font-semibold mb-1">Everyday Comfort</span>
              <h3 class="text-2xl font-serif">Everyday Chic</h3>
            </div>
          </a>
        </div>
      </section>

      <!-- 4. Spotlight Products -->
      ${featuredProducts.length > 0 ? `
        <section class="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
          <div class="text-center max-w-xl mx-auto mb-10">
            <span class="text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-2 block">Handcrafted Excellence</span>
            <h2 class="text-3xl md:text-4xl font-serif text-[#1C1917]">Featured Designs</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${productCardsHtml}
          </div>
        </section>
      ` : ''}
      ${renderServerFooter()}
    </div>
  `;
}

/**
 * 2. Shop Page Semantic Markup
 */
function renderShopRoot(products = []) {
  const productCardsHtml = products.map((p, idx) => `
    <div class="group relative flex flex-col">
      <a href="/product/${p.slug}" class="block relative mb-4">
        <div class="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden rounded-xl">
          <img 
            src="${escapeHtml(p.image)}" 
            alt="${escapeHtml(p.name)}" 
            ${idx < 4 ? 'fetchpriority="high"' : 'loading="lazy"'} 
            decoding="async" 
            class="w-full h-full object-cover" 
          />
        </div>
      </a>
      <div class="text-center">
        <a href="/product/${p.slug}" class="block">
          <h3 class="font-serif text-base text-[#1C1917] mb-1.5">${escapeHtml(p.name)}</h3>
          <span class="font-medium text-sm text-[#1C1917]">₹${Number(p.price).toLocaleString('en-IN')}</span>
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="bg-white min-h-screen pt-20">
      ${renderServerNavbar()}
      <!-- Header Hero -->
      <div class="bg-[#fffdf9] py-16 px-6 text-center relative overflow-hidden mt-6">
        <div class="max-w-2xl mx-auto">
          <span class="text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Handcrafted Luxury</span>
          <h1 class="text-4xl md:text-6xl font-serif text-[#1C1917] mb-3">The Handcrafted Jutti Collection</h1>
          <p class="text-sm text-gray-500 font-light max-w-lg mx-auto mb-6">
            Artisanal Punjabi juttis and ethnic footwear crafted with double-cushioned comfort, genuine leather soles, and heirloom embroidery.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-2 mb-6">
            <a href="/collection/bridal" class="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-[#E7E5E4] text-[#8B5E3C] shadow-sm hover:border-[#1C1917]">Bridal Juttis</a>
            <a href="/collection/festive" class="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-[#E7E5E4] text-[#C5A059] shadow-sm hover:border-[#1C1917]">Festive Edit</a>
            <a href="/collection/casual" class="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-[#E7E5E4] text-[#1C1917] shadow-sm hover:border-[#1C1917]">Everyday Chic</a>
          </div>
          <div class="w-16 h-[1px] bg-[#1C1917] mx-auto opacity-20"></div>
        </div>
      </div>

      <!-- Main Products Grid -->
      <div class="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          ${productCardsHtml}
        </div>
        <div class="text-center mt-20 mb-12">
          <div class="flex items-center justify-center gap-4 opacity-40">
            <div class="h-[1px] w-16 bg-gray-900"></div>
            <span class="text-[10px] uppercase tracking-[0.3em] font-serif italic text-gray-700">All ${products.length} Artisanal Styles Displayed</span>
            <div class="h-[1px] w-16 bg-gray-900"></div>
          </div>
        </div>
      </div>
      ${renderServerFooter()}
    </div>
  `;
}

/**
 * 3. Collection Page Semantic Markup
 */
function renderCollectionRoot(displayName, description, products = []) {
  const productCardsHtml = products.map((p, idx) => `
    <div class="group relative flex flex-col">
      <a href="/product/${p.slug}" class="block relative mb-4">
        <div class="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden rounded-xl">
          <img 
            src="${escapeHtml(getOptimizedImageUrl(p.image, 600))}" 
            srcset="${escapeHtml(getImageSrcSet(p.image, [360, 480, 600, 800]))}"
            sizes="(max-width: 768px) 50vw, 25vw"
            width="300"
            height="400"
            alt="${escapeHtml(p.name)}" 
            ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} 
            decoding="async" 
            class="w-full h-full object-cover" 
          />
        </div>
      </a>
      <div class="text-center">
        <a href="/product/${p.slug}" class="block">
          <h3 class="font-serif text-base text-[#1C1917] mb-1.5">${escapeHtml(p.name)}</h3>
          <span class="font-medium text-sm text-[#1C1917]">₹${Number(p.price).toLocaleString('en-IN')}</span>
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="bg-white min-h-screen pt-20">
      ${renderServerNavbar()}
      <div class="bg-[#fffdf9] py-16 px-6 text-center mt-6">
        <div class="max-w-2xl mx-auto">
          <span class="text-[#8B5E3C] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Curated Edition</span>
          <h1 class="text-4xl md:text-6xl font-serif text-[#1C1917] mb-3">${escapeHtml(displayName)}</h1>
          <p class="text-sm text-gray-500 font-light max-w-lg mx-auto mb-6">
            ${escapeHtml(description)}
          </p>
          <div class="w-16 h-[1px] bg-[#1C1917] mx-auto opacity-20"></div>
        </div>
      </div>

      <div class="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          ${productCardsHtml}
        </div>
      </div>
      ${renderServerFooter()}
    </div>
  `;
}

/**
 * 4. Product Page Semantic Markup (Complete Data Parity with React UI)
 */
function renderProductRoot(product, relatedProducts = []) {
  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const mainImage = images[0] || 'https://beadsandbloom.in/logo.png';
  const totalStock = product.totalStock !== undefined 
    ? product.totalStock 
    : (Array.isArray(product.stock) ? product.stock.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0);
  const inStock = totalStock > 0;

  // Real sizes and stock from DB only
  const stockItems = Array.isArray(product.stock) ? product.stock : [];
  const sizesHtml = stockItems.map(item => {
    const isAvail = (item.quantity || 0) > 0;
    return `
      <span class="px-3.5 py-2 text-xs font-semibold rounded-lg border ${isAvail ? 'border-gray-200 text-gray-900 bg-white' : 'border-gray-100 text-gray-400 bg-gray-50 line-through'}">
        EU ${escapeHtml(item.size)}
      </span>
    `;
  }).join('');

  // Parent collection matching exact same rule as React ProductDetail.jsx
  const primaryCategory = Array.isArray(product.category) && product.category.length > 0
    ? product.category[0]
    : (typeof product.category === 'string' ? product.category : null);
  const matchedCat = primaryCategory ? primaryCategory.toLowerCase() : null;
  const collectionInfo = matchedCat && siteNavigation.knownCollections[matchedCat]
    ? siteNavigation.knownCollections[matchedCat]
    : { name: primaryCategory || 'The Collection', route: '/shop' };

  // Care instructions
  const careList = Array.isArray(product.careInstructions) && product.careInstructions.length > 0
    ? product.careInstructions
    : siteNavigation.policies.defaultCareInstructions;

  // Specifications
  const upperMaterial = product.material || 'Pure Silk / Velvet Dupion';
  const embellishment = product.embellishment || 'Hand-sewn Beads & Zardozi';
  const footbedSole = product.sole || product.lining || '100% Genuine Leather';
  const sku = product.sku || product.slug;
  const color = product.color || 'Artisan Palette';
  const occasions = Array.isArray(product.occasions) && product.occasions.length > 0
    ? product.occasions.join(', ')
    : (product.occasions || 'Bridal, Festive Celebrations, Sangeet, Ceremonies');
  const comfortNotes = product.comfortNotes || siteNavigation.policies.craftPillars[1].desc;
  const fitTip = product.fitTip || siteNavigation.policies.defaultFitTip;

  // Related products cards (same stable sort as React)
  const relatedCardsHtml = relatedProducts.slice(0, 4).map(p => `
    <div class="group relative flex flex-col">
      <a href="/product/${p.slug}" class="block relative mb-4">
        <div class="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden rounded-xl border border-gray-100">
          <img 
            src="${escapeHtml(getOptimizedImageUrl(p.image, 400))}" 
            width="300" 
            height="400" 
            alt="${escapeHtml(p.name)}" 
            loading="lazy" 
            decoding="async" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      </a>
      <div class="text-center">
        <a href="/product/${p.slug}" class="block">
          <h3 class="font-serif text-sm font-medium text-[#1C1917] mb-1 truncate">${escapeHtml(p.name)}</h3>
          <span class="font-bold text-sm text-[#1C1917]">₹${Number(p.price).toLocaleString('en-IN')}</span>
        </a>
      </div>
    </div>
  `).join('');

  return `
    <div class="bg-[#FAF9F6] min-h-screen pt-20 text-[#1C1917]">
      ${renderServerNavbar()}

      <!-- Breadcrumbs: Home > Shop > Parent Collection > Product Name -->
      <div class="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-6 mt-4">
        <nav aria-label="Breadcrumb" class="flex items-center flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
          <a href="/" class="hover:text-[#FF2865] transition-colors">Home</a>
          <span class="text-gray-300">/</span>
          <a href="/shop" class="hover:text-[#FF2865] transition-colors">Shop</a>
          ${primaryCategory ? `
            <span class="text-gray-300">/</span>
            <a href="${escapeHtml(collectionInfo.route)}" class="hover:text-[#FF2865] transition-colors">${escapeHtml(collectionInfo.name)}</a>
          ` : ''}
          <span class="text-gray-300">/</span>
          <span class="text-gray-900 font-bold truncate max-w-[220px] sm:max-w-none">${escapeHtml(product.name)}</span>
        </nav>
      </div>

      <!-- Main Product Detail Grid -->
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 flex flex-col lg:flex-row items-start gap-10 xl:gap-14">
        <!-- Left: Image Gallery -->
        <div class="w-full lg:w-3/5">
          <div class="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden rounded-2xl shadow-xs">
            <img 
              src="${escapeHtml(getOptimizedImageUrl(mainImage, 600))}" 
              srcset="${escapeHtml(getImageSrcSet(mainImage, [360, 600, 900, 1200]))}"
              sizes="(max-width: 768px) 100vw, 600px"
              width="600"
              height="600"
              alt="${escapeHtml(product.name)}" 
              fetchpriority="high" 
              class="w-full h-full object-cover object-center" 
            />
          </div>
          ${images.length > 1 ? `
            <div class="grid grid-cols-4 gap-3 mt-4">
              ${images.slice(0, 4).map(img => `
                <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src="${escapeHtml(getOptimizedImageUrl(img, 200))}" 
                    width="100" 
                    height="100" 
                    alt="${escapeHtml(product.name)}" 
                    loading="lazy" 
                    class="w-full h-full object-cover" 
                  />
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Right: Info, Specifications & Actions -->
        <div class="w-full lg:w-2/5 space-y-6">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <a href="${escapeHtml(collectionInfo.route)}" class="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B5E3C] hover:text-[#1C1917] transition-colors">
                ${escapeHtml(collectionInfo.name)}
              </a>
              ${sku ? `
                <span class="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                  SKU: ${escapeHtml(sku)}
                </span>
              ` : ''}
            </div>

            <h1 class="text-3xl md:text-4xl font-serif text-[#1C1917] leading-tight">
              ${escapeHtml(product.name)}
            </h1>

            <div class="flex items-baseline gap-3 mt-4">
              <span class="text-3xl font-bold text-[#1C1917]">
                ₹${Number(product.price).toLocaleString('en-IN')}
              </span>
              <span class="text-xs text-gray-400 uppercase tracking-wider">
                Inclusive of all taxes
              </span>
            </div>

${inStock ? `
            <div class="mt-3">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                In Stock — Handcrafted in India
              </span>
            </div>
            ` : ''}
          </div>

          <!-- Sizes & Fit Tip -->
          ${stockItems.length > 0 ? `
            <div class="border-t border-b border-gray-100 py-5">
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-[#1C1917]">Available EU Sizes</span>
                <a href="/size-chart" class="text-xs text-[#FF2865] hover:text-[#1C1917] font-semibold underline underline-offset-4 transition-colors">
                  Jutti Size Chart &amp; Fit Guide →
                </a>
              </div>
              <div class="flex flex-wrap gap-2">
                ${sizesHtml}
              </div>
              <div class="mt-3.5 p-3 bg-[#F9F8F6] rounded-xl border border-gray-200">
                <p class="text-[11px] text-gray-600 leading-relaxed">
                  <strong class="text-gray-900 uppercase tracking-wider mr-1">Fit Tip:</strong>
                  ${escapeHtml(fitTip)}
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Artisanal Specifications & Craft Details -->
          <div class="space-y-4 pt-2">
            <h2 class="text-xs font-bold uppercase tracking-widest text-[#1C1917]">
              Artisanal Craft &amp; Specifications
            </h2>

            <!-- Karigar Narrative Box -->
            ${product.description ? `
              <div class="bg-[#FAF8F5] p-4.5 rounded-2xl border border-[#EAE6DF]">
                <span class="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B5E3C] block mb-2">
                  Artisan Karigar Notes
                </span>
                <p class="text-xs md:text-[13px] text-gray-700 leading-relaxed border-l-2 border-[#C5A059] pl-3 py-0.5">
                  ${escapeHtml(product.description)}
                </p>
                <div class="mt-3.5 pt-3 border-t border-[#EAE6DF]/70 flex flex-wrap gap-2 text-[10px] font-bold text-[#1C1917]">
                  <span class="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                    Hand-Embroidered
                  </span>
                  <span class="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                    Pure Leather Sole
                  </span>
                  <span class="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                    Double-Padded Comfort
                  </span>
                </div>
              </div>
            ` : ''}

            <!-- 7-field specs grid -->
            <div class="grid grid-cols-2 gap-2.5 text-xs">
              <div class="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100">
                <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">Upper Material</span>
                <span class="font-semibold text-[#1C1917] block">${escapeHtml(upperMaterial)}</span>
              </div>
              <div class="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100">
                <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">Embellishment / Work</span>
                <span class="font-semibold text-[#1C1917] block">${escapeHtml(embellishment)}</span>
              </div>
              <div class="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100">
                <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">Footbed &amp; Sole</span>
                <span class="font-semibold text-[#1C1917] block">${escapeHtml(footbedSole)}</span>
              </div>
              <div class="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100">
                <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">Artisan Code / SKU</span>
                <span class="font-mono font-bold text-[#1C1917] block">${escapeHtml(sku)}</span>
              </div>
              <div class="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100">
                <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">Primary Color</span>
                <span class="font-semibold text-[#1C1917] block">${escapeHtml(color)}</span>
              </div>
              <div class="bg-[#FAF8F5] p-3.5 rounded-xl border border-gray-100 col-span-2">
                <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-1">Ideal Occasions</span>
                <span class="font-semibold text-[#1C1917] block leading-relaxed">${escapeHtml(occasions)}</span>
              </div>
              <div class="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 col-span-2">
                <span class="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider mb-1">Comfort &amp; Cushioning</span>
                <span class="font-medium text-emerald-950 text-xs leading-relaxed block">${escapeHtml(comfortNotes)}</span>
              </div>
            </div>
          </div>

          <!-- Material & Care Box -->
          <div class="bg-[#F9F8F6] p-5 rounded-2xl border border-gray-200">
            <div class="flex items-center justify-between mb-2.5">
              <h3 class="font-serif text-base font-bold text-[#1C1917]">Material &amp; Care</h3>
              <a href="/care-guide" class="text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] hover:text-[#1C1917] underline">
                Handcrafted Jutti Care Guide →
              </a>
            </div>
            <ul class="text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              ${careList.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
            </ul>
          </div>

          <!-- Shipping, COD & Returns Policy Box -->
          <div class="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
            <h3 class="font-serif text-base font-bold text-[#1C1917]">Shipping &amp; Exchange Policies</h3>
            <div class="text-xs text-gray-600 space-y-2 leading-relaxed">
              <p><strong class="text-gray-900">Dispatch:</strong> ${escapeHtml(siteNavigation.policies.shipping.dispatch)}</p>
              <p><strong class="text-gray-900">Payment:</strong> ${escapeHtml(siteNavigation.policies.shipping.cod)}. ${escapeHtml(siteNavigation.policies.shipping.freeThresholdNotice)}.</p>
              <p><strong class="text-gray-900">Exchange Window:</strong> ${escapeHtml(siteNavigation.policies.exchange.window)} (${escapeHtml(siteNavigation.policies.exchange.unboxingVideo)}).</p>
              <p><strong class="text-gray-900">Worldwide:</strong> ${escapeHtml(siteNavigation.policies.shipping.worldwide)}.</p>
            </div>
            <div class="pt-2 border-t border-gray-100">
              <a href="/terms" class="text-xs text-[#FF2865] hover:underline font-semibold">
                Read Full Shipping, Returns &amp; Exchange Terms →
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section (Curated Recommendations) -->
      ${relatedProducts.length > 0 ? `
        <section class="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-gray-100 bg-[#F9F8F6] mt-12 rounded-3xl" aria-label="Related Handcrafted Juttis">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">Curated Recommendations</span>
              <h2 class="text-2xl md:text-3xl font-serif text-[#1C1917]">You May Also Like</h2>
            </div>
            <a href="${escapeHtml(collectionInfo.route)}" class="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors">
              Explore ${escapeHtml(collectionInfo.name)} →
            </a>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${relatedCardsHtml}
          </div>
        </section>
      ` : ''}

      ${renderServerFooter()}
    </div>
  `;
}

/**
 * 5. About Page Semantic Markup
 */
function renderAboutRoot(aboutContent = {}) {
  const hero = aboutContent.hero || {};
  const mission = aboutContent.mission || {};
  const stats = Array.isArray(aboutContent.stats) && aboutContent.stats.length > 0 ? aboutContent.stats : [
    { number: "15,000+", label: "Happy Feet", desc: "Celebrated across India & 18+ international countries" },
    { number: "24+ Hrs", label: "Karigari Per Pair", desc: "Meticulous hand-embroidery by master artisans in Punjab" },
    { number: "100%", label: "Genuine Leather", desc: "Chemical-free, vegetable-tanned soles that naturally breathe" },
    { number: "4.9 ★", label: "Patron Rating", desc: "Consistently loved for 10+ hours of continuous, bite-free wear" }
  ];
  const pillars = Array.isArray(aboutContent.pillars) ? aboutContent.pillars : [];
  const values = Array.isArray(aboutContent.values) ? aboutContent.values : [];
  const founderNote = aboutContent.founderNote || {};

  const statsHtml = stats.map(s => `
    <div class="p-3">
      <span class="font-serif text-3xl md:text-4xl font-bold text-[#1C1917] block mb-1">${escapeHtml(s.number)}</span>
      <span class="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">${escapeHtml(s.label)}</span>
      <p class="text-[11px] text-gray-500 font-light leading-snug">${escapeHtml(s.desc)}</p>
    </div>
  `).join('');

  const pillarsHtml = pillars.map(p => `
    <div class="bg-white p-6 md:p-8 rounded-2xl border border-[#EAE0D0] shadow-sm">
      <span class="text-xs font-bold text-[#C5A059] uppercase tracking-widest block mb-2">${escapeHtml(p.tag || p.number || 'Craft')}</span>
      <h3 class="font-serif text-xl text-[#1C1917] mb-3">${escapeHtml(p.title)}</h3>
      <p class="text-sm text-gray-600 font-light leading-relaxed">${escapeHtml(p.desc)}</p>
    </div>
  `).join('');

  const valuesHtml = values.map(v => `
    <div class="bg-white/60 p-6 rounded-xl border border-[#EAE0D0]">
      <h4 class="font-serif text-lg text-[#1C1917] mb-2">${escapeHtml(v.title)}</h4>
      <p class="text-xs text-gray-600 font-light leading-relaxed">${escapeHtml(v.desc)}</p>
    </div>
  `).join('');

  return `
    <div class="bg-[#FAF8F5] text-[#1C1917] min-h-screen pt-20">
      ${renderServerNavbar()}
      <!-- 1. Hero Section -->
      <section class="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 px-6 md:px-12 bg-gradient-to-b from-[#FBF8F2] via-[#FAF6ED] to-[#FAF8F5] border-b border-[#EAE0D0]/80 mt-4">
        <div class="max-w-5xl mx-auto text-center">
          <nav aria-label="Breadcrumb" class="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold">
            <a href="/" class="hover:text-[#1C1917]">Home</a>
            <span class="opacity-40">/</span>
            <span class="text-[#1C1917] font-bold">About Us</span>
          </nav>
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0DC] border border-[#E4CE9E] text-[#8A5B28] text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
            <span>${escapeHtml(hero.badge || "The Story Behind Beads & Bloom")}</span>
          </div>
          <h1 class="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            ${escapeHtml(hero.title || "Handcrafted Luxury Rooted in Punjab's Timeless Karigari")}
          </h1>
          <p class="text-sm md:text-base text-gray-600 font-light max-w-3xl mx-auto leading-relaxed mb-10">
            ${escapeHtml(hero.subtitle || "Born from a passion to preserve authentic Indian needlecraft while solving the age-old problem of painful ethnic footwear. We engineer heirloom Punjabi juttis with pure leather soles and double-cushioned orthopedic comfort.")}
          </p>
          ${hero.heroImage ? `
            <div class="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-md border border-[#EAE0D0] relative aspect-[16/9] md:aspect-[21/9] bg-[#EFE8DD]">
              <img src="${escapeHtml(hero.heroImage)}" alt="Beads & Bloom Master Karigari" class="w-full h-full object-cover" />
            </div>
          ` : ''}
        </div>
      </section>

      <!-- 2. Trust Numbers -->
      <section class="bg-white border-b border-[#EAE0D0] py-8 px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
          ${statsHtml}
        </div>
      </section>

      <!-- 3. Brand Genesis / Mission -->
      ${mission.headline || mission.paragraph1 ? `
        <section class="py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <span class="text-xs font-bold uppercase tracking-[0.25em] text-[#8B5E3C] mb-3 block">${escapeHtml(mission.tagline || 'Artisan Heritage')}</span>
          <h2 class="text-2xl md:text-4xl font-serif text-[#1C1917] mb-6">${escapeHtml(mission.headline || 'Where Heritage Meets Cloud Comfort')}</h2>
          <div class="space-y-4 max-w-3xl mx-auto text-sm md:text-base text-gray-600 font-light leading-relaxed">
            ${mission.paragraph1 ? `<p>${escapeHtml(mission.paragraph1)}</p>` : ''}
            ${mission.paragraph2 ? `<p>${escapeHtml(mission.paragraph2)}</p>` : ''}
          </div>
          ${mission.quote ? `
            <blockquote class="mt-8 font-serif italic text-base md:text-lg text-[#8B5E3C] max-w-2xl mx-auto">
              "${escapeHtml(mission.quote)}"
            </blockquote>
          ` : ''}
        </section>
      ` : ''}

      <!-- 4. Craftsmanship Pillars -->
      ${pillars.length > 0 ? `
        <section class="py-16 px-6 md:px-12 max-w-6xl mx-auto">
          <div class="text-center max-w-xl mx-auto mb-12">
            <span class="text-xs font-bold uppercase tracking-[0.25em] text-[#8B5E3C] mb-2 block">Our Craft Principles</span>
            <h2 class="text-2xl md:text-3xl font-serif text-[#1C1917]">Heirloom Construction</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${pillarsHtml}
          </div>
        </section>
      ` : ''}

      <!-- 5. Core Values -->
      ${values.length > 0 ? `
        <section class="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <div class="text-center max-w-xl mx-auto mb-10">
            <h2 class="text-2xl md:text-3xl font-serif text-[#1C1917]">Our Commitment</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${valuesHtml}
          </div>
        </section>
      ` : ''}

      <!-- 6. Founder Note -->
      ${founderNote.message ? `
        <section class="py-16 px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-[#EAE0D0]">
          <h3 class="font-serif text-xl md:text-2xl text-[#1C1917] mb-4">${escapeHtml(founderNote.title || 'A Note from the Founder')}</h3>
          <p class="text-sm md:text-base text-gray-600 font-serif italic leading-relaxed max-w-2xl mx-auto mb-4">
            "${escapeHtml(founderNote.message)}"
          </p>
          <span class="text-xs font-bold uppercase tracking-widest text-[#8B5E3C] block">${escapeHtml(founderNote.signature || 'Founder, Beads & Bloom')}</span>
        </section>
      ` : ''}

      ${renderServerFooter()}
    </div>
  `;
}

/**
 * 6. 404 / Unknown Route Semantic Markup (Provides full navigation parity on fallback)
 */
function renderNotFoundRoot() {
  const brand = siteNavigation.brand;
  return `
    <div class="bg-white min-h-screen flex flex-col justify-between">
      ${renderServerNavbar()}
      <main class="max-w-2xl mx-auto px-6 py-28 text-center mt-12">
        <span class="text-[#FF2865] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Error 404</span>
        <h1 class="text-4xl md:text-6xl font-serif text-[#1C1917] mb-6">Page Not Found</h1>
        <p class="text-gray-600 font-light text-base mb-8 leading-relaxed">
          The handcrafted jutti design or editorial guide you are looking for has been relocated or is no longer available.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/" class="bg-[#1C1917] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#FF2865] transition-colors shadow-md">
            Return Home
          </a>
          <a href="/shop" class="bg-stone-100 text-[#1C1917] px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-stone-200 transition-colors border border-gray-200">
            Explore Collection
          </a>
        </div>
      </main>
      ${renderServerFooter()}
    </div>
  `;
}

module.exports = {
  renderHomeRoot,
  renderShopRoot,
  renderCollectionRoot,
  renderProductRoot,
  renderAboutRoot,
  renderNotFoundRoot,
  renderServerNavbar,
  renderServerFooter,
  escapeHtml,
  getOptimizedImageUrl,
  getImageSrcSet
};
