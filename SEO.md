# SEO MASTER DOCUMENTATION & IMPLEMENTATION BLUEPRINT
## Beads and Bloom — Handcrafted Juttis & Ethnic Footwear
**Website Domain:** `https://beadsandbloom.in`  
**Framework:** React 19 + Vite 7 (SPA with React Router DOM v7)  
**Tailwind CSS:** Tailwind v4 (`@tailwindcss/vite`)  
**Backend:** Node.js / Express 5 + MongoDB  
**Author / Lead:** Senior Technical SEO & AEO/GEO Architect  
**Last Updated:** October 2026

---

## 1. Project Overview

- **Website:** Beads and Bloom (`https://beadsandbloom.in/`)
- **Brand Identity:** Artisanal luxury footwear brand specializing in handcrafted Indian juttis, bridal mojris, and embroidered ethnic footwear blending heritage Punjabi craftsmanship with modern double-cushioned comfort.
- **Framework:** React 19.2.0
- **Build System:** Vite 7.2.4 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Rendering Architecture:** Single Page Application (Client-Side Rendering) with Node.js Express static server in production and dynamic sitemap generation.
- **Routing Architecture:** React Router DOM v7 (`BrowserRouter`, lazy-loaded page chunks via `React.lazy` and `Suspense`).
- **SEO Architecture:** Centralized Head & Metadata Management via dedicated `SEO` component utilizing React 19 native document metadata hoisting, canonical synchronization, Open Graph/Twitter social card injection, and JSON-LD structured data generators.
- **Current SEO Maturity (Before Audit):** Low-to-Moderate (basic static meta tags in `index.html` referencing only the homepage, missing route-level metadata on inner pages, missing `public/sitemap.xml`, incomplete `robots.txt` AI crawler directives, skipped heading hierarchies, hardcoded `loading="lazy"` on LCP images, parse5 HTML error in `<head>`, missing schema on collections/pages).
- **Overall SEO Score Before:** **48 / 100**
- **Target SEO Score After Implementation:** **94+ / 100**

---

## 2. SEO Objectives

1. **Establish Organic Topical Authority:** Dominate search engine results pages (SERPs) for primary transactional and commercial search queries related to handcrafted Punjabi juttis, bridal mojris, and comfortable ethnic footwear in India.
2. **Eliminate SPA Indexation & Crawling Deficits:** Provide 100% route-level metadata uniqueness, self-referencing canonical URLs, valid XML sitemaps, clean robot directives, and structured data for every public indexable route.
3. **Capture Generative & Answer Engine Visibility (AEO & GEO):** Position Beads & Bloom as the primary cited brand entity in ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini, and Claude for queries regarding jutti sizing, wedding footwear comfort, Punjabi craftsmanship, and zardosi embroidery.
4. **Optimize Core Web Vitals (CWV):** Remove LCP render blocking, eliminate lazy loading on above-the-fold hero banners, fix image dimension aspect ratios, prevent cumulative layout shifts (CLS), and streamline font delivery.
5. **Protect Crawl Budget & Index Hygiene:** Enforce `noindex, nofollow` on non-public transactional and administrative routes (`/admin/*`, `/profile`, `/cart`, `/checkout`, `/myorders`, `/login`, `/signup`, `/forgot-password`, `/resetpassword/*`).

---

## 3. Complete URL Inventory

| Route | Page Name | Page Type | Primary Purpose | Primary Keyword | Search Intent | Target Location | Indexable | Canonical | Schema | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | HomePage | Hub / Homepage | Brand showcase, featured collections, bestsellers, social proof | Handcrafted Juttis | Commercial / Navigational | India (Nationwide) | Yes | `https://beadsandbloom.in/` | WebSite, Organization, SearchAction | 1.0 |
| `/shop` | Shop | Catalog / Category Hub | Full product catalog, filterable by size, price, and category | Handcrafted Jutti Collection | Commercial / Transactional | India (Nationwide) | Yes | `https://beadsandbloom.in/shop` | CollectionPage, BreadcrumbList | 0.9 |
| `/collection/bridal` | Bridal Collection | Topical Cluster Hub | Bridal edit, wedding mojris, zardosi embroidery for brides | Bridal Juttis & Wedding Mojris | Commercial / Transactional | India (Nationwide) | Yes | `https://beadsandbloom.in/collection/bridal` | CollectionPage, BreadcrumbList | 0.9 |
| `/collection/casual` | Casual Collection | Topical Cluster Hub | Daily wear juttis, comfortable ethnic flats for office & everyday | Casual Punjabi Juttis | Commercial / Transactional | India (Nationwide) | Yes | `https://beadsandbloom.in/collection/casual` | CollectionPage, BreadcrumbList | 0.8 |
| `/sale` | Archive Sale | Promotion / Commercial Hub | Limited-time markdowns, archival juttis, exclusive coupon offers | Juttis On Sale & Offers | Transactional / Deal | India (Nationwide) | Yes | `https://beadsandbloom.in/sale` | OfferCatalog, BreadcrumbList | 0.8 |
| `/product/:slug` | ProductDetail | Product Detail Page (PDP) | Specific jutti SKU showcase, sizing, cart addition, review submissions | [Product Name] Handcrafted Jutti | Transactional | India (Nationwide) | Yes | `https://beadsandbloom.in/product/:slug` | Product, BreadcrumbList | 0.8 |
| `/about` | About | Brand & E-E-A-T Pillar | Brand philosophy, artisan heritage of Punjab, craftsmanship standards | Artisanal Jutti Makers Punjab | Informational / Brand | India (Nationwide) | Yes | `https://beadsandbloom.in/about` | AboutPage, Organization, BreadcrumbList | 0.7 |
| `/contact` | Contact | Customer Care & Support | Customer support, inquiry form, Instagram and email touchpoints | Contact Beads and Bloom | Navigational / Support | India (Nationwide) | Yes | `https://beadsandbloom.in/contact` | ContactPage, BreadcrumbList | 0.6 |
| `/size-chart` | SizeChart | Customer Guide & AEO Asset | Measuring foot length in EU sizes (36-41), fit guide, jutti sizing tips | Jutti Size Chart & Footwear Guide | Informational / Guidance | India (Nationwide) | Yes | `https://beadsandbloom.in/size-chart` | HowTo, FAQPage, BreadcrumbList | 0.6 |
| `/terms` | Terms & Policies | Legal & Trust Asset | Terms & conditions, shipping policy, 48-hr unboxing video exchange rule | Beads and Bloom Shipping & Exchange Policy | Informational / Policy | India (Nationwide) | Yes | `https://beadsandbloom.in/terms` | WebPage, FAQPage, BreadcrumbList | 0.5 |
| `/track-order` | TrackOrder | Order Utility | Live order tracking via Order ID and billing email | Track Beads and Bloom Order | Utility / Navigational | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/track-order` | None | 0.2 |
| `/login` | Login | Auth | Customer account authentication | Customer Login | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/login` | None | 0.1 |
| `/signup` | Signup | Auth | Customer registration | Create Customer Account | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/signup` | None | 0.1 |
| `/forgot-password` | ForgotPassword | Auth Utility | Password recovery | Forgot Password | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/forgot-password` | None | 0.1 |
| `/resetpassword/:token`| ResetPassword | Auth Utility | Secure token password reset | Reset Password | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/login` | None | 0.1 |
| `/cart` | Cart | Transactional Funnel | Shopping cart review and SKU checkout initiation | Shopping Cart | Transactional | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/cart` | None | 0.1 |
| `/checkout` | Checkout | Transactional Funnel | Razorpay & shipping address checkout funnel | Checkout | Transactional | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/checkout` | None | 0.1 |
| `/wishlist` | Wishlist | User Utility | Saved footwear wishlist items | Saved Wishlist | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/wishlist` | None | 0.1 |
| `/profile` | Profile | User Account | Customer profile & shipping details | Account Profile | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/profile` | None | 0.1 |
| `/myorders` | MyOrders | User Account | Historical order list | My Order History | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/myorders` | None | 0.1 |
| `/order/:id` | OrderDetails | User Account | Granular customer order breakdown | Order Details | Utility | India | No (`noindex, nofollow`) | `https://beadsandbloom.in/myorders` | None | 0.1 |
| `/admin/*` | Admin Routes | Internal Portal | Management of inventory, orders, CMS, reviews, coupons | Admin Portal | Internal | N/A | No (`noindex, nofollow`) | None | None | 0.0 |
| `*` | NotFound | 404 Error State | Broken link recovery and navigation back to Home / Shop | 404 Page Not Found | Error State | India | No (`noindex, nofollow`) | None | None | 0.0 |

---

## 4. Keyword Strategy

### A. Homepage (`/`)
- **Primary Keyword:** Handcrafted Juttis
- **Secondary Keywords:** Punjabi juttis online, ethnic footwear India, bridal mojris, designer khussa, comfortable juttis
- **Long-tail Keywords:** Buy handcrafted Punjabi juttis online in India, double cushioned juttis for wedding, authentic hand embroidered ethnic shoes
- **Semantic / Entity Keywords:** Zardosi embroidery, Dabka work, artisanal shoemakers, double-cushioned sole, raw silk footwear, festive slip-ons
- **Search Intent:** Commercial Investigation & Brand Navigation

### B. Shop All (`/shop`)
- **Primary Keyword:** Handcrafted Jutti Collection
- **Secondary Keywords:** Designer juttis online, ethnic footwear shop, women's traditional flats, embroidered mojri collection
- **Long-tail Keywords:** Buy designer handcrafted juttis online India, festive embroidered ethnic juttis for women
- **Semantic / Entity Keywords:** Velvet juttis, sequined mojris, pastel wedding footwear, traditional Indian shoes
- **Search Intent:** Commercial / Transactional

### C. Bridal Edit (`/collection/bridal`)
- **Primary Keyword:** Bridal Juttis
- **Secondary Keywords:** Wedding mojris, bridal ethnic footwear, gold embroidered bridal shoes, dulhan jutti
- **Long-tail Keywords:** Designer bridal juttis with double cushioning, heavy zardosi wedding mojris for bride, comfortable bridal footwear India
- **Semantic / Entity Keywords:** Dulhan footwear, lehenga matching juttis, pearl work, kundan embellishments, gold thread embroidery
- **Search Intent:** High Commercial / Transactional

### D. Casual & Everyday Edit (`/collection/casual`)
- **Primary Keyword:** Casual Punjabi Juttis
- **Secondary Keywords:** Everyday ethnic flats, comfortable daily juttis, office wear juttis, minimal embroidered shoes
- **Long-tail Keywords:** Soft cushioned juttis for daily wear, light ethnic flats for office and kurtis
- **Semantic / Entity Keywords:** Breathable insole, minimal threadwork, daily ethnic shoes, bite-free juttis
- **Search Intent:** Commercial / Transactional

### E. Archive Sale (`/sale`)
- **Primary Keyword:** Juttis on Sale
- **Secondary Keywords:** Ethnic footwear discount, bridal jutti offers, clearance mojris, designer jutti coupon
- **Long-tail Keywords:** Handcrafted juttis sale online India, discount on embroidered bridal mojris
- **Semantic / Entity Keywords:** Markdowns, archive sale, limited edition discounts, promo code INAUGURAL10
- **Search Intent:** Transactional

### F. Product Detail Pages (`/product/:slug`)
- **Primary Keyword:** `[Product Name] Handcrafted Jutti`
- **Secondary Keywords:** `Buy [Product Name] mojri`, `[Product Name] ethnic shoes online`
- **Long-tail Keywords:** `Buy [Product Name] double cushioned handcrafted jutti online in India`
- **Search Intent:** Pure Transactional

### G. Brand Story & Heritage (`/about`)
- **Primary Keyword:** Artisanal Jutti Makers Punjab
- **Secondary Keywords:** Beads and Bloom story, traditional Indian footwear craftsmanship, handcrafted zardosi artisans
- **Long-tail Keywords:** Story of handcrafted Punjabi jutti makers in Punjab, ethical artisan footwear brand India
- **Search Intent:** Informational / Brand Trust

### H. Size Guide (`/size-chart`)
- **Primary Keyword:** Jutti Size Chart
- **Secondary Keywords:** Punjabi jutti sizing guide, foot measurement for ethnic shoes, EU to India footwear conversion
- **Long-tail Keywords:** How to measure foot length for Punjabi juttis, do juttis stretch after wearing
- **Search Intent:** Informational / Answer Engine

### I. Customer Care & Policies (`/terms`)
- **Primary Keyword:** Beads and Bloom Shipping & Exchange Policy
- **Secondary Keywords:** Jutti exchange rules, mandatory unboxing video requirement, shipping timeline ethnic footwear
- **Search Intent:** Informational / Trust

---

## 5. Metadata Strategy

Every public indexable page requires dedicated, non-duplicated meta tags, social Open Graph tags, Twitter card directives, and canonical URLs.

| Page | Title Tag (50-60 chars) | Meta Description (150-160 chars) | Canonical URL | Robots | OG Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** | Handcrafted Juttis & Ethnic Footwear \| Beads and Bloom | Discover luxurious handcrafted Punjabi juttis and bridal mojris at Beads and Bloom. Meticulous hand embroidery, double-cushioned soles, and timeless heritage. | `https://beadsandbloom.in/` | `index, follow` | `website` |
| **Shop** | The Collection — Handcrafted Juttis & Mojris \| Beads and Bloom | Explore our complete catalog of handcrafted juttis. From opulent bridal zardosi to chic everyday ethnic flats, find your perfect pair with cushioned comfort. | `https://beadsandbloom.in/shop` | `index, follow` | `website` |
| **Bridal** | The Bridal Edit — Luxury Wedding Juttis & Mojris \| Beads and Bloom | Walk down the aisle in sublime comfort. Shop exquisite handcrafted bridal juttis featuring heavy zardosi, pearls, and double-padded soles for wedding ceremonies. | `https://beadsandbloom.in/collection/bridal` | `index, follow` | `website` |
| **Casual** | Everyday Chic — Casual & Office Wear Juttis \| Beads and Bloom | Step into effortless elegance with our casual handcrafted juttis. Designed for daily wear and office rotations with lightweight, bite-free cushioned soles. | `https://beadsandbloom.in/collection/casual` | `index, follow` | `website` |
| **Sale** | Archive Sale — Exclusive Offers on Handcrafted Juttis \| Beads and Bloom | Limited-time archive event. Enjoy exceptional prices on handcrafted juttis and artisanal mojris. Use code INAUGURAL10 for an extra 10% discount while stocks last. | `https://beadsandbloom.in/sale` | `index, follow` | `website` |
| **Product** | [Product Name] Handcrafted Jutti \| Beads and Bloom | Shop the [Product Name] handcrafted jutti at Beads and Bloom. Artisanal Indian embroidery, premium materials, and plush double-cushioned comfort in sizes 36-41. | `https://beadsandbloom.in/product/[slug]` | `index, follow` | `product` |
| **About** | Our Heritage & Craft — Artisanal Jutti Makers \| Beads and Bloom | Learn the story behind Beads and Bloom. Honoring the generational artisans of Punjab, ancient zardosi embroidery, and modern comfort engineered for the discerning woman. | `https://beadsandbloom.in/about` | `index, follow` | `website` |
| **Contact** | Contact Customer Support & Inquiries \| Beads and Bloom | Have questions regarding jutti sizing, custom orders, or your delivery? Reach out to Beads and Bloom support via email or Instagram DM. We reply promptly. | `https://beadsandbloom.in/contact` | `index, follow` | `website` |
| **Size Chart**| Jutti Size Chart & Measuring Guide \| Beads and Bloom | Find your perfect fit with the Beads and Bloom footwear size chart. Step-by-step instructions on measuring foot length (EU 36-41) for bite-free jutti comfort. | `https://beadsandbloom.in/size-chart` | `index, follow` | `article` |
| **Terms** | Terms of Service, Shipping & Exchange Policy \| Beads and Bloom | Read Beads and Bloom policies covering nationwide delivery, 48-hour exchange window, mandatory unboxing video requirements, and footwear care instructions. | `https://beadsandbloom.in/terms` | `index, follow` | `article` |
| **Utility** | [Utility Name] \| Beads and Bloom | Secure portal for account access, order tracking, and cart management at Beads and Bloom. | `https://beadsandbloom.in/[route]` | `noindex, nofollow`| `website` |

---

## 6. Heading Architecture

### A. Current Deficiencies Identified:
1. **Homepage:** If CMS hero slide titles were empty or fallback active, no `<h1>` rendered on the page. In `Hero.jsx`, `<h1>` was wrapped inside a conditional `hasContent` check.
2. **Skipped Hierarchy in `BrandStory.jsx`:** Jumped directly from `<h2>` (Philosophy) to `<h4>` for pillar cards ("Handcrafted Detail", "Unmatched Comfort", "Authentic Heritage"), completely skipping `<h3>`.
3. **Shop Page:** Rendered minimal `<h1>The Collection</h1>` without descriptive entity context.
4. **Product Detail Page:** Excellent `<h1>{product.name}</h1>`, but accordion sections used generic headers.

### B. Required Semantic Heading Standards:
- **Rule 1:** Exactly one `<h1>` per page, placed above the fold, featuring the primary target entity and brand context.
- **Rule 2:** `<h2>` reserved for major page sections (e.g., "Handcrafted Jutti Collections", "Curated Favorites", "The Craft & Heritage", "Customer Reviews").
- **Rule 3:** `<h3>` used for product titles, collection cards, and feature titles. No skipping from `<h2>` to `<h4>`.
- **Rule 4:** `<h4>` strictly for sub-attributes, badges, or informational rows.

---

## 7. Technical SEO Audit

| Technical Dimension | Audit Finding | Risk Severity | Implementation Fix |
| :--- | :--- | :--- | :--- |
| **Crawlability & SPA Discovery** | Vite SPA renders client-side. HTML delivered contains empty `<div id="root"></div>`. Crawlers without JavaScript need static hints and pre-crawlable static URLs. | High | Provide static `public/sitemap.xml`, clean semantic links `<Link to="...">`, server fallback in Express, and route metadata hydration. |
| **HTML Syntax in `<head>`** | Parse5 error during build: `<noscript><img ... /></noscript>` was placed inside `<head>` in `index.html`. Violates HTML5 spec. | Medium | Relocate Meta Pixel `<noscript>` into `<body>` immediately after opening tag. |
| **Sitemap Accessibility** | `public/sitemap.xml` was non-existent. Backend route `/sitemap.xml` existed with gzip compression, but static crawlers hitting CDN/static edge failed. | High | Generate static, production-grade `public/sitemap.xml` containing all indexable canonical URLs with correct priorities and lastmod timestamps. |
| **Robots.txt Quality** | Basic robots.txt existed, but did not disallow private auth/utility routes and lacked explicit directives for generative AI crawlers. | Medium | Rewrite `public/robots.txt` with designated sections for Googlebot, Bingbot, GPTBot, PerplexityBot, ClaudeBot, and proper Disallow rules. |
| **Canonical URL Integrity** | Only `index.html` hardcoded canonical to root domain. Inner routes had no canonical tag updates (except basic link in `ProductDetail.jsx`). | High | Implement centralized `SEO` component injecting exact canonical `https://beadsandbloom.in${pathname}` on every route. |
| **Trailing Slash Consistency** | Internal links use non-trailing slashes (e.g. `/shop`, `/about`). Canonical URLs must strictly adhere to the non-trailing slash convention. | Low | Enforce non-trailing slash canonicals across the application. |
| **404 Response Handling** | React Router handles 404 via `<Route path="*" element={<NotFound />} />`. | Medium | Ensure `NotFound` sets `<meta name="robots" content="noindex, nofollow" />` and provides intuitive recovery navigation to Home and Shop. |
| **Orphan Pages** | `/about` was missing from the footer links in `Footer.jsx` and only linked in `App.jsx` routes. | Medium | Add `/about` into `Footer.jsx` and homepage `BrandStory.jsx` internal linking ecosystem. |

---

## 8. Core Web Vitals & Performance SEO

1. **Largest Contentful Paint (LCP):**
   - **Issue:** Hero slider in `Hero.jsx` utilized `ImageWithShimmer` where `<img loading="lazy" />` was hardcoded. This delayed browser scheduling for the primary hero banner.
   - **Resolution:** Add `priority` / `eager` prop to `ImageWithShimmer`, enabling `loading="eager"` and `fetchpriority="high"` for the active above-the-fold hero slide image.
2. **Cumulative Layout Shift (CLS):**
   - **Resolution:** Preserve exact aspect ratios (`aspect-[3/4]`, `aspect-[4/3]`, `aspect-[9/16]`) across all card skeletons and media containers to eliminate layout shifts when network requests resolve.
3. **Font Loading Performance:**
   - **Resolution:** Google Fonts (`Inter` and `Playfair Display`) are imported via `@import` in `index.css`. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `index.html` to eliminate DNS and SSL negotiation latency.
4. **Media Payloads:**
   - ImageKit query parameter transformations (`w-[width],f-webp,q-auto`) are utilized in `imageUtils.js`. Local public images should be properly budgeted.

---

## 9. Image SEO Architecture

1. **Alt Text Standards:** Every product image and collection banner must feature descriptive, keyword-relevant, non-stuffed alt text (e.g., `alt="Gulabi Meenakari Handcrafted Bridal Jutti - Beads and Bloom"`).
2. **Decorative Images:** Purely decorative icons (Lucide SVG icons) must use `aria-hidden="true"`.
3. **Responsive Dimensioning:** Images served via ImageKit will continue using dynamic width breakpoints (e.g., `100px` for search previews, `400px` for related cards, `600px` for category grids, `1000px` for PDP zoom displays, `1600px` for desktop hero banners).

---

## 10. Internal Linking Architecture

```
                    [ Home (/) ]
                    /    |    \
                   /     |     \
       [ /shop ] <-------+------> [ /about ]
        /     \          |           |
       /       \         |       [ /contact ]
[ /collection/bridal ]   |           |
[ /collection/casual ]   |      [ /size-chart ]
        \      /         |           |
         \    /          |       [ /terms ]
     [ /product/:slug ] -+
```

### Internal Linking Enhancements:
1. **Footer:** Link to `/about`, `/contact`, `/size-chart`, `/terms`, `/shop`, `/collection/bridal`, `/collection/casual`, and `/sale`.
2. **Homepage BrandStory:** Add contextual CTA links: "Read Our Full Heritage Story" linking to `/about` and "Explore All Handcrafted Juttis" linking to `/shop`.
3. **Product Detail Pages:** Add explicit breadcrumb trail links: `Home` > `Shop` > `[Product Name]`. Add related product tiles with descriptive anchor tags.
4. **Size Chart:** Add direct shopping CTA linking back to `/shop`.

---

## 11. Structured Data / Schema Strategy

### Schemas Implemented:
1. **`WebSite` Schema:**
   - Implemented on root domain.
   - Includes `name`, `url`, `potentialAction` (`SearchAction` querying `https://beadsandbloom.in/shop?keyword={search_term_string}`).
2. **`Organization` / `LocalBusiness` Schema:**
   - Brand entity: `Beads and Bloom`.
   - Category: Luxury Artisanal Footwear Label.
   - Logo: `https://beadsandbloom.in/logo.png`.
   - Contact email: `connect@beadsandbloom.in`.
   - Social links: `sameAs` referencing official Instagram `@beadsnbloom.india`.
3. **`BreadcrumbList` Schema:**
   - Implemented across all inner public pages (`/shop`, `/collection/*`, `/product/*`, `/about`, `/contact`, `/size-chart`, `/terms`).
4. **`Product` Schema:**
   - Implemented on `/product/:slug`.
   - Name, image array, description, brand (`Beads and Bloom`), SKU/Slug, Offers (`InStock`/`OutOfStock`, INR currency, price), AggregateRating & Reviews (if available in database).
5. **`CollectionPage` / `OfferCatalog` Schema:**
   - Implemented on `/shop`, `/collection/bridal`, `/collection/casual`, and `/sale`.
6. **`FAQPage` Schema:**
   - Implemented on `/size-chart` and `/terms` to feed Google's rich snippets and AI Answer Engines with authoritative answers on sizing, unboxing requirements, shipping, and footwear care.

---

## 12. AEO (Answer Engine Optimization)

Answer engines (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews) reward concise, factual, structured answers directly following an intent-rich heading.

### Key Answer Engine Targets:
1. **"Are Beads & Bloom juttis comfortable for weddings?"**
   - *Target Direct Answer:* "Yes. Beads & Bloom juttis are engineered with double-cushioned memory-foam insoles to prevent shoe bites, making them comfortable for 12+ hour wedding celebrations and bridal ceremonies."
2. **"How do I choose the right Punjabi jutti size?"**
   - *Target Direct Answer:* "Measure foot length in centimeters from heel to the tip of the longest toe, then match against European sizing (EU 36-41). If you have broad feet or fall between two sizes, choose one size up."
3. **"What is the return and exchange policy for Beads and Bloom?"**
   - *Target Direct Answer:* "Beads & Bloom offers exchanges within 48 hours of delivery for damaged or incorrect items. A continuous, uncut unboxing video recorded from the moment the package is opened is strictly required."
4. **"How should I clean and care for embroidered juttis?"**
   - *Target Direct Answer:* "Keep handcrafted juttis away from water and moisture. Clean delicate zardosi, threadwork, and bead embroidery using a dry, soft-bristle brush or gently wipe with a dry muslin cloth. Store in cotton dust bags."

---

## 13. GEO (Generative Engine Optimization)

To optimize knowledge-graph extraction by generative AI models:
1. **Explicit Entity Triples:**
   - `Beads and Bloom` (Subject) -> `is an artisanal manufacturer of` (Predicate) -> `Handcrafted Indian Juttis & Bridal Mojris` (Object).
   - `Beads and Bloom` (Subject) -> `employs` (Predicate) -> `Traditional Zardosi Artisans in Punjab, India` (Object).
   - `Beads and Bloom Footwear` (Subject) -> `features` (Predicate) -> `Double-Cushioned Ergonomic Insoles` (Object).
2. **Brand & Contact Uniformity:**
   - Consistent brand nomenclature: "Beads and Bloom" across all documents, schemas, footers, titles, and legal policies.
   - Official customer service: `connect@beadsandbloom.in`.
   - Official social presence: `https://www.instagram.com/beadsnbloom.india`.

---

## 14. Local SEO & Geographic Relevance

- **Primary Market:** India (All States & Union Territories).
- **Artisan Roots:** Punjab, India.
- **Currency:** Indian Rupee (`INR`, `₹`).
- **Shipping Logistics:** Pan-India courier delivery via Shiprocket with tracking integrations.
- **Local Schema:** `OnlineStore` and `Organization` registered in India, serving nationwide postal codes with standard delivery timelines.

---

## 15. E-E-A-T (Experience, Expertise, Authoritativeness, Trust)

- **Experience:** Highlighting generational artisan embroidery techniques from Punjab passed down through master craftspeople.
- **Expertise:** Documenting specific shoe construction elements: double-cushioned padding, raw silk lining, authentic zardosi and dabka hand embroidery.
- **Authoritativeness:** Clear brand philosophy, curated collections, active social verification (`@beadsnbloom.india`), and transparent care instructions.
- **Trust Signals:** Transparent exchange policies, mandatory unboxing verification, secure 100% encrypted Razorpay gateway, real customer reviews on product pages.

---

## 16. Content Architecture & Topical Map

```
Pillar: Handcrafted Ethnic Footwear India
├── Cluster 1: Bridal & Wedding Footwear
│   ├── The Bridal Edit (/collection/bridal)
│   ├── Heavy Zardosi Mojris (Product SKUs)
│   └── Sizing for Brides (/size-chart)
├── Cluster 2: Casual & Everyday Wear
│   ├── Everyday Chic (/collection/casual)
│   ├── Minimal Work Everyday Flats (Product SKUs)
│   └── Bite-Free Footwear Care (/terms)
├── Cluster 3: Festive & Limited Editions
│   ├── Festival Collections (/shop?category=Festive)
│   └── Archive Promotions (/sale)
└── Cluster 4: Brand Trust & Customer Guidance
    ├── Heritage & Story (/about)
    ├── Comprehensive Size Chart (/size-chart)
    └── Support & Inquiries (/contact)
```

---

## 17. Blog SEO Architecture (Future Recommendation)

While the website does not currently host an active blog engine, the recommended architecture for maximum organic search capture is:
- **Directory:** `/blog` (Indexable hub)
- **Article Pattern:** `/blog/:slug`
- **Recommended Initial Pillars:**
  1. *How to Pick the Perfect Bridal Jutti for Your Lehenga*
  2. *The History of Punjabi Juttis: From Royal Courts to Modern Runways*
  3. *5 Proven Ways to Prevent Shoe Bites in Traditional Indian Juttis*
  4. *What is Zardosi Embroidery? Behind the Scenes of Indian Footwear Art*

---

## 18. Sitemap Strategy

- **Static Root Location:** `Frontend/public/sitemap.xml`
- **Backend Dynamic Endpoint:** `https://beadsandbloom.in/sitemap.xml` (via Node Express)
- **Protocol:** Standard Sitemap XML 0.9 format.
- **Included Routes:**
  - `https://beadsandbloom.in/` (priority 1.0, daily)
  - `https://beadsandbloom.in/shop` (priority 0.9, daily)
  - `https://beadsandbloom.in/collection/bridal` (priority 0.9, weekly)
  - `https://beadsandbloom.in/collection/casual` (priority 0.8, weekly)
  - `https://beadsandbloom.in/sale` (priority 0.8, daily)
  - `https://beadsandbloom.in/about` (priority 0.7, monthly)
  - `https://beadsandbloom.in/size-chart` (priority 0.6, monthly)
  - `https://beadsandbloom.in/contact` (priority 0.6, monthly)
  - `https://beadsandbloom.in/terms` (priority 0.5, monthly)
- **Excluded Routes:**
  - `/admin/*`, `/profile`, `/myorders`, `/order/*`, `/cart`, `/checkout`, `/wishlist`, `/login`, `/signup`, `/forgot-password`, `/resetpassword/*`, `/track-order`.

---

## 19. Robots.txt Strategy

The `public/robots.txt` must explicitly grant search and AI crawlers full access to public assets while protecting sensitive customer account routes.

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /profile
Disallow: /myorders
Disallow: /order/
Disallow: /cart
Disallow: /checkout
Disallow: /wishlist
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /resetpassword/
Disallow: /track-order

# AI Discovery & Search Crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot
Allow: /

Sitemap: https://beadsandbloom.in/sitemap.xml
```

---

## 20. AI Crawler Strategy

AI search crawlers (OpenAI GPTBot, PerplexityBot, Anthropic ClaudeBot, Applebot, Google-Extended) index content to feed conversational retrieval engines.
- **Policy:** **Allow full read access** to all public catalogs, about pages, size guides, and terms.
- **Rationale:** Beads & Bloom relies on discovery for queries like *"Where can I buy comfortable bridal juttis in India?"* Blocking AI crawlers directly harms discovery in modern AI-assisted shopping experiences.

---

## 21. Social & Open Graph Architecture

For every public route, social graph protocols must specify:
- `og:site_name`: "Beads and Bloom"
- `og:type`: `website` or `product`
- `og:title`: Contextual page title
- `og:description`: Curated meta description
- `og:url`: Absolute canonical URL
- `og:image`: High-resolution representative banner or product image (`https://beadsandbloom.in/logo.png` default)
- `twitter:card`: `summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image`

---

## 22. Accessibility (a11y) & SEO Synergy

1. **Heading Semantics:** Clean structural nesting without skipped levels.
2. **Form Accessibility:** All form fields in `Contact.jsx`, `TrackOrder.jsx`, and login forms must possess distinct `id`, `name`, and descriptive labels.
3. **Interactive Elements:**
   - Navigational anchors must use `<Link to="...">` or `<a>`.
   - Action triggers (accordions, sliders, audio toggles, lightbox openers) must use `<button>` with clear `aria-label` tags.
4. **Contrast & Sizing:** Clean typography respecting WCAG 2.1 AA contrast on dark charcoal (`#1C1917`) and cream backgrounds (`#F9F8F6`).

---

## 23. SEO Security & Hygiene

- No cloaking, hidden text, or keyword stuffing.
- Client-side routes handle 404 gracefully with noindex flags.
- API endpoints isolated under `/api/*` and protected against indexing.
- Zero duplicate content through canonicalization.

---

## 24. SEO Implementation Checklist

| Priority | Issue | Target File(s) | Current State | Required Change | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | Route-Aware SEO Engine | `src/components/seo/SEO.jsx` | Missing centralized SEO component | Create modular SEO component with React 19 document metadata hoisting, canonical sync, OG/Twitter tags, and JSON-LD schema | Pending Implementation |
| **CRITICAL** | Parse5 HTML Syntax Error | `Frontend/index.html` | `<noscript>` in `<head>` causing build warnings | Move `<noscript><img ... /></noscript>` into `<body>` | Pending Implementation |
| **CRITICAL** | Static XML Sitemap | `Frontend/public/sitemap.xml` | Missing static file | Create production-grade XML sitemap | Pending Implementation |
| **CRITICAL** | Robots.txt Overhaul | `Frontend/public/robots.txt` | Incomplete directives, missing AI crawler allowances | Update with full disallows and explicit AI crawler rules | Pending Implementation |
| **HIGH** | Homepage H1 Reliability | `src/components/HomePage/Hero.jsx` | H1 omitted if slide has no title | Guarantee semantic H1 for brand & category | Pending Implementation |
| **HIGH** | Heading Hierarchy Correction | `src/components/HomePage/BrandStory.jsx` | H2 jumped directly to H4 | Change H4 cards to H3 | Pending Implementation |
| **HIGH** | Internal Linking Gap | `src/components/Footer.jsx`, `BrandStory.jsx` | `/about` omitted from footer links | Add `/about` to footer navigation & brand story CTA | Pending Implementation |
| **HIGH** | LCP Hero Image Lazy-Loading | `src/util/ShimmerMedia.jsx`, `Hero.jsx` | Hardcoded `loading="lazy"` on LCP image | Support `priority` / `eager` loading on hero banner | Pending Implementation |
| **HIGH** | Route Metadata Coverage | All indexable pages (`HomePage`, `Shop`, `Collection`, `Sale`, `ProductDetail`, `About`, `Contact`, `SizeChart`, `Terms`, `NotFound`) | Missing page-specific metadata | Mount `<SEO />` on every route with unique title, description, schema, canonical | Pending Implementation |
| **MEDIUM** | Font Preconnect Optimization | `Frontend/index.html` | Missing preconnect to Google Fonts | Add preconnect links for fonts.googleapis and fonts.gstatic | Pending Implementation |
| **MEDIUM** | FAQ Schema Injection | `SizeChart.jsx`, `Terms.jsx` | No structured data for answers | Inject rich FAQPage schema for sizing & policies | Pending Implementation |
| **MEDIUM** | Breadcrumb Schema Injection | `ProductDetail.jsx`, `Collection.jsx`, etc. | No breadcrumb structured data | Inject BreadcrumbList JSON-LD schema | Pending Implementation |

---

## 25. SEO Monitoring & Governance Plan

1. **Google Search Console (GSC):**
   - Submit `https://beadsandbloom.in/sitemap.xml`.
   - Monitor Index Coverage (Page indexing status, Valid pages vs Excluded).
   - Track Core Web Vitals report (Mobile & Desktop).
   - Monitor rich result enhancements (Products, Breadcrumbs, Sitelinks searchbox).
2. **Bing Webmaster Tools:**
   - Submit sitemap and verify Bingbot crawl health.
3. **AI Engine Citation Audits:**
   - Monthly spot checks on Perplexity AI, ChatGPT Search, and Google Gemini for prompts:
     - *"Best handcrafted bridal juttis in India"*
     - *"Comfortable double-cushioned Punjabi juttis"*
     - *"Beads and bloom size guide"*
4. **Organic Keyword Tracking:**
   - Track high-intent non-branded terms: `bridal juttis`, `punjabi juttis online`, `handcrafted ethnic flats`, `zardosi mojris`.
5. **Technical Health Check:**
   - Verify zero 5xx server errors, zero soft 404s, and valid JSON-LD schemas via Schema.org validator.
