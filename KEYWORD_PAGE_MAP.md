# Keyword-to-Page Architecture & Search Intent Map
## Beads & Bloom — Handcrafted Indian Punjabi Juttis & Mojris
**Domain:** `https://beadsandbloom.in/`  
**Mapping Strategy:** Intent-First Topic Clustering & Cannibalization Prevention  
**Last Updated:** October 2026

---

## 1. Strategy & Methodology Principles

1. **Intent-Specific Separation:** No two canonical URLs target the exact same primary search intent. Commercial collections (`/collection/bridal`) are strictly separated from editorial guides (`/bridal-guide`) and clearance hubs (`/sale`).
2. **Evidence-Based Demand Classification:**
   - **Verified Query (High Confidence):** Queries directly observed in the Search Console telemetry export (e.g., brand variants, `blush bloom juttis`).
   - **Catalog-Verified Topic (High Confidence):** Non-branded topics directly backed by actual inventory in MongoDB (e.g., Punjabi bridal juttis, velvet dabka juttis, mirror work mojris).
   - **Hypothesis / Unverified Volume (Moderate Confidence):** Informational searches with high conceptual intent but unverified Google search volume (e.g., `how to clean embroidered juttis`, `jutti sizing for broad feet`).
3. **Strict Zero-Stuffing Rule:** Natural terminology reflects how North Indian brides and ethnic fashion buyers search for luxury handcrafted footwear.

---

## 2. Master Keyword-to-Page Mapping Matrix

| Target Page URL | Page Type | Primary Search Intent | Primary Target Topic | Secondary & Semantic Topics | Evidence & Confidence Level | Supporting Internal In-Links | Cannibalization Risk & Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `https://beadsandbloom.in/` | Brand Homepage | Navigational / Brand Investigation | Luxury Handcrafted Punjabi Juttis for Women | Indian ethnic footwear, designer Punjabi mojris, artisanal leather juttis, double cushioned juttis | Verified Query & Brand Baseline (521 impressions in GSC) | Global Logo, Breadcrumbs, Footer Copyright | **Risk:** Overlapping with `/shop`.<br>**Mitigation:** Homepage targets overarching brand positioning and artisan heritage; `/shop` targets the complete product listing. |
| `https://beadsandbloom.in/shop` | Complete Catalog Hub | Commercial Exploration | Shop All Handcrafted Punjabi Juttis Online | Indian jutti collection, ethnic flat shoes, embroidered juttis for women, genuine leather Punjabi mojris | Catalog-Verified (34 active products across all collections) | Header "The Collection", Footer "Complete Jutti Range", Breadcrumbs | **Risk:** Overlapping with `/collection/festive`.<br>**Mitigation:** `/shop` is the exhaustive directory containing all products, filtered by category pills; collection pages are curated edits. |
| `https://beadsandbloom.in/collection/bridal` | Collection Hub | Commercial / Transactional | Handcrafted Bridal Juttis & Wedding Mojaris | Punjabi juttis for brides, wedding juttis for lehenga, zardozi bridal footwear, dabka embroidered wedding mojris | Catalog-Verified (16 bridal products in DB; GSC confirmed indexed) | Navbar, Footer, Homepage Tiles, `/bridal-guide`, Product Breadcrumbs | **Risk:** Cannibalization with `/bridal-guide`.<br>**Mitigation:** `/collection/bridal` is an e-commerce catalog prioritizing filters, prices, and add-to-cart; `/bridal-guide` is an editorial guide. |
| `https://beadsandbloom.in/collection/festive` | Collection Hub | Commercial / Transactional | Festive Juttis & Party Wear Mojaris | Ethnic footwear for Diwali, sangeet dancing juttis, mirror work juttis, gotta patti ethnic flats, mehendi footwear | Catalog-Verified (22 festive products in DB) | Navbar, Footer, Homepage Tiles, Shop Pills, Product Breadcrumbs | **Risk:** Overlap with general `/shop`.<br>**Mitigation:** Explicitly targets festive celebrations, sangeet, and parties with rich occasion wear copy. |
| `https://beadsandbloom.in/collection/casual` | Collection Hub | Commercial / Transactional | Everyday Casual Ethnic Juttis | Comfortable Punjabi juttis, daily wear ethnic flats, bite-free casual juttis, chikankari suit footwear | Catalog-Verified (6 casual products in DB) | Navbar, Footer, Homepage Tiles, Shop Pills, Product Breadcrumbs | **Risk:** Low product count causing thin collection perception.<br>**Mitigation:** Highlighted double-cushioned comfort for daily work/college wear; linked to size chart. |
| `https://beadsandbloom.in/sale` | Archive Clearance Hub | Transactional / Bargain | Archive Festive Sale — Handcrafted Juttis | Discounted Punjabi juttis, ethnic footwear sale, clearance bridal juttis, luxury mojris on offer | Catalog-Verified (12 sale-eligible products) | Header "Archive Sale", Footer, Shop Category Navigation | **Risk:** Duplicate content with legacy `/collection/sale`.<br>**Mitigation:** Implemented automatic 301-style redirect from `/collection/sale` to canonical `/sale`. |
| `https://beadsandbloom.in/bridal-guide` | Editorial Guide | Informational / Educational | Bridal Jutti Buying & Lehenga Styling Guide | How to match juttis with lehenga, juttis vs high heels for wedding, pheras footwear comfort, Gurgaon bridal trial | Hypothesis / High Organic Intent (Unverified Volume) | Footer "Bridal Footwear Guide", `/collection/bridal`, `/size-chart`, `/care-guide` | **Risk:** Cannibalization with `/collection/bridal`.<br>**Mitigation:** Strictly educational format with wedding timeline, pheras comfort tests, and tailor hem alterations. |
| `https://beadsandbloom.in/care-guide` | Editorial Guide | Informational / Maintenance | Handcrafted Punjabi Jutti Care & Cleaning Guide | How to clean embroidered juttis, protect leather jutti soles, prevent jutti shoe bites, break in authentic juttis | Hypothesis / High Organic Intent (Unverified Volume) | Footer "Jutti Care & Cleaning", Product Detail accordion, `/size-chart`, `/bridal-guide` | **Risk:** Overlapping with Product Detail care tips.<br>**Mitigation:** Product details provide a brief summary and point directly to `/care-guide` for comprehensive deep-cleaning steps. |
| `https://beadsandbloom.in/about` | Brand Story Hub | Informational / Brand Trust (E-E-A-T) | Beads & Bloom Heritage & Handcrafted Footwear Story | Artisanal Indian shoemakers, handmade Punjabi jutti craftsmanship, memory foam ethnic footwear, Gurgaon shoe studio | Catalog-Verified Brand Reality | Footer "Our Story & Heritage", Homepage BrandStory component | **Risk:** Generic marketing fluff without E-E-A-T value.<br>**Mitigation:** Embedded verified workshop details, Online Atelier studio, and double-cushioned construction facts. |
| `https://beadsandbloom.in/size-chart` | Sizing Utility (AEO) | Informational / Answer Engine | Jutti Size Chart & Foot Length Measurement Guide | How to measure foot for juttis, jutti size conversion EU to UK, broad feet jutti sizing, prevent jutti shoe bites | Catalog-Verified / High Pre-Purchase Intent | Footer, Product Detail PDP link, Cart, `/bridal-guide` | **Risk:** Image-only page invisible to text search engines.<br>**Mitigation:** Added structured textual measuring steps (EU 36-41), AEO/FAQ schema, and cross-guide links. |
| `https://beadsandbloom.in/contact` | Studio & Support | Commercial / Local Search | Beads & Bloom Gurugram Studio & Customer Care | Jutti studio Online Atelier, bridal footwear trial Gurgaon, WhatsApp customer service, contact Beads and Bloom | Verified Physical Business Entity | Footer "Gurgaon Studio & Contact", Navbar, PDP Support link | **Risk:** Ranking confusion with national e-commerce store.<br>**Mitigation:** Targets local Delhi NCR brides seeking in-person fitting trials while preserving nationwide e-commerce contact channels. |
| `https://beadsandbloom.in/terms` | Trust & Legal Hub | Informational / Policy Trust | Shipping, Delivery, COD & Returns Policy | Beads and Bloom return policy, 48 hour unboxing video exchange, COD footwear India, express worldwide delivery | Verified Business Policies | Footer "Worldwide Shipping & COD", Privacy & Terms, Checkout | **Risk:** High cart abandonment from hidden or conflicting policy terms.<br>**Mitigation:** Verified explicit 48-hour exchange rules, mandatory unboxing video requirement, and 3-7 day domestic delivery timelines. |

---

## 3. Product-Level Keyword Architecture (34 Individual Handcrafted Juttis)

Every product detail page (`/product/:slug`) targets a unique, highly specific long-tail keyword cluster based on 4 verified attributes:
1. **Design Name:** The artisan design identifier (e.g., `Neel Pari`, `Peela Sitara`, `Zar Surkh`).
2. **Dominant Colorway:** e.g., `Beige`, `Mustard Yellow`, `Emerald Green`, `Cobalt Blue`, `Maroon Velvet`, `Rose Gold`.
3. **Embroidery Craft:** e.g., `Zardozi`, `Dabka`, `Sitara`, `Sheesha Mirror Work`, `Gotta Patti`, `Seed Pearls`, `Phulkari`.
4. **Primary Occasion:** e.g., `Bridal Wedding`, `Sangeet & Festive`, `Casual Chic`.

### Keyword Structure Formula:
`[Product Name] — [Dominant Color] [Embroidery Technique] [Occasion] Jutti | Beads and Bloom`

#### Representative Product Keyword Allocations:
- `/product/neel-pari-beige-embroidered-festive-jutti` ➔ **Target:** *Beige raw silk embroidered festive jutti with ivory dabka and pearls*
- `/product/peela-sitara-silver-sparkle-festive-jutti` ➔ **Target:** *Mustard yellow haldi jutti with silver sitara sequins and cut-dana*
- `/product/zar-surkh-maroon-velvet-handcrafted-bridal-jutti` ➔ **Target:** *Maroon velvet bridal jutti for lehenga with antique gold zardozi*
- `/product/ruby-heritage-emerald-green-embroidered-bridal-jutti` ➔ **Target:** *Emerald green bridal jutti with antique ruby crystals and dabka*
- `/product/noor-e-aaina-mirror-work-sheesha-party-jutti` ➔ **Target:** *Authentic mirror work party jutti with silver gotta patti*
- `/product/meher-sitara-handcrafted-zardozi-sitara-casual-jutti` ➔ **Target:** *Casual raw silk jutti with minimalist golden sitara stars*
- `/product/champagne-zeenat-champagne-gold-embellished-bridal-jutti` ➔ **Target:** *Champagne gold bridal reception jutti with micro-pearls and crystals*

---

## 4. Keyword Cannibalization Prevention Governance

To guarantee that Google never confuses a product, collection, or guide:
1. **Title Uniqueness:** 100% of the 46 canonical URLs have distinct, unique `<title>` tags and H1 elements.
2. **Internal Anchor Text Discipline:**
   - Links to `/collection/bridal` always use anchors like *"Bridal Juttis"*, *"Bridal Collection"*, or *"Handcrafted Bridal Mojaris"*.
   - Links to `/bridal-guide` always use descriptive editorial anchors like *"Bridal Footwear Guide"*, *"Read Bridal Jutti Buying Guide"*, or *"Lehenga Footwear Guide"*.
   - Links to products always use the full, descriptive artisan product name.
3. **No Dynamic Search Indexing:** Filter query strings (e.g. `/shop?color=red`, `/shop?price=2000-3000`) always point to canonical `/shop` to prevent duplicate index pollution.
