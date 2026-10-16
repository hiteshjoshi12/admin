# Comprehensive Technical SEO, Crawlability & Indexing Audit
## Beads & Bloom — Handcrafted Indian Juttis & Ethnic Footwear
**Domain:** `https://beadsandbloom.in/`  
**Audit Date:** October 2026  
**Auditor:** Senior Technical SEO Engineer, E-Commerce SEO Architect & Google Search Specialist  

---

## 1. Executive Summary & GSC Telemetry Reconciliation

### A. Google Search Console Baseline Findings (Reported by Owner)
- **Sitemap Discovered URLs:** 43 URLs (`Frontend/public/sitemap.xml`)
- **Indexed Pages:** 7 URLs (including confirmed indexed `/collection/bridal`)
- **Not Indexed Pages:** 5 reported URLs
- **Primary GSC Exclusion Reasons:**
  1. *Alternate page with proper canonical tag* — 2 URLs
  2. *Crawled — currently not indexed* — 3 URLs

### B. Audit Re-verification & Root-Cause Determinations

| GSC Finding | Verified Root Cause | Finding Type | Evidence from Codebase |
| :--- | :--- | :--- | :--- |
| **Alternate page with proper canonical tag (2 URLs)** | 1. `Navbar.jsx` linked "The Collection" to `/shop?sort=newest` instead of the canonical `/shop`.<br>2. `CollectionTiles.jsx` linked category cards to query URLs (`/shop?category=...`) instead of clean collection URLs (`/collection/...`).<br>3. `VideoShowcase.jsx` and `ProductDetail.jsx` breadcrumbs also linked to `/shop?category=...`. All these query URLs inject `canonical="/shop"`, causing Google to discover the parameter URL and log "Alternate page with proper canonical tag". | **Confirmed Issue** | `Navbar.jsx:52`: `{ name: 'The Collection', path: '/shop?sort=newest' }`<br>`CollectionTiles.jsx:84`: `targetLink = '/shop?category=' + encodeURIComponent(col.name)`<br>`Shop.jsx:118`: `<SEO canonical="/shop" />` |
| **Crawled — currently not indexed (3 URLs)** | 1. **Zero Related Products on Direct Headless Render:** `RelatedProducts.jsx` reads `state.products.items` from Redux without dispatching an API call if `items` is empty. When Googlebot crawls a product URL directly from the sitemap, `state.products.items` is `[]`, rendering `null`. Product pages had zero incoming internal links on standalone headless crawling.<br>2. **Broken Collection Tiles:** Homepage `CollectionTiles.jsx` queried categories named "Blush Mirage", "Ruby Heritage", "Noorani Dabka", and "Neel Noor" which matched 0 products in MongoDB (`category: 'Blush Mirage'` = 0 items). This generated thin/empty search pages.<br>3. **Missing Category Hub:** 22 products belong to "Festive" in MongoDB, but no `/collection/festive` route was exposed in navigation or sitemap. | **Confirmed Issue** | `RelatedProducts.jsx:24-26`: `const { items } = useSelector(...); const related = items.filter(...); if (related.length === 0) return null;`<br>`CollectionTiles.jsx`: links to `/shop?category=Blush%20Mirage` (0 products in DB)<br>MongoDB: 22 Festive products stranded without collection hub |
| **Indexed Status of `/collection/bridal`** | `/collection/bridal` was confirmed indexed because it is directly linked in the main desktop navbar, the footer, and included as a clean canonical in the static XML sitemap with high priority. | **Confirmed Fact** | Preserved without changing canonical route structure. |

---

## 2. Technical Stack & Rendering Strategy

| Dimension | Specification | Architecture Assessment |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19.2.0 | High performance modern React with document head hoisting (`<title>`, `<meta>`, `<link>`). |
| **Build Tooling** | Vite 7.2.4 + `@tailwindcss/vite` 4.1.18 | Optimized bundle chunking with dynamic `import()` for lazy route loading. |
| **Routing Strategy** | React Router DOM v7 (`BrowserRouter`) | Client-Side SPA routing with `react-router-dom`. |
| **Backend API** | Node.js / Express 5 with Mongoose 8.13 | REST API running on port 5000 with MongoDB Atlas backend. |
| **Static Serving / SPA Fallback** | Express `sendFile` fallback | `backend/index.js` serves `dist/index.html` for all non-API routes (`/^(?!\/api).+/`). |
| **Database & Content Source** | MongoDB Atlas (Collection: `products`, `collections`, `cms`, `coupons`) | 34 active published handcrafted jutti products, 4 collection records. |
| **Image Delivery & CDN** | ImageKit (`ik.imagekit.io/hiteshh12`) | Dynamic WebP delivery (`f-webp,q-auto`) with responsive width breakpoints. |

---

## 3. Comprehensive Technical SEO & Crawlability Deficiencies

### Confirmed Issues (Verified by Code Inspection & Database Queries)

1. **Internal Linking to Parameterized Non-Canonical URLs (High Severity)**
   - *Issue:* `Navbar.jsx` linked to `/shop?sort=newest` instead of canonical `/shop`.
   - *Issue:* `CollectionTiles.jsx` on homepage generated links to `/shop?category=${col.name}` where `col.name` was a product name ("Blush Mirage") yielding 0 products.
   - *Issue:* `VideoShowcase.jsx` linked to `/shop?category=Bridal` and `/shop?category=Festive`.
   - *Issue:* `ProductDetail.jsx` breadcrumbs linked to `/shop?category=${primaryCategory}`.
   - *Impact:* Googlebot crawled these parameterized URLs, rendered them, observed `<link rel="canonical" href="https://beadsandbloom.in/shop">`, and flagged them in GSC as "Alternate page with proper canonical tag".

2. **Isolated Product Pages (Zero Related Products on First-Hop Crawl) (Critical Severity)**
   - *Issue:* `RelatedProducts.jsx` relied strictly on `useSelector((state) => state.products.items)`.
   - *Impact:* When Googlebot requests `/product/:slug` directly (from the sitemap or external links), Redux `items` is empty (`[]`). The component returned `null`. Googlebot rendered a product page with **zero outgoing links to any other product**. 31 of 34 products had zero crawlable links from peers.

3. **Mobile Breadcrumb Elimination (High Severity)**
   - *Issue:* In `ProductDetail.jsx`, the breadcrumb navigation `<nav aria-label="Breadcrumb">` was nested inside `<div className="hidden lg:grid ...">`.
   - *Impact:* Under Google's Smartphone Mobile-First Indexing crawler, the breadcrumbs were 100% removed from the mobile DOM, breaking contextual hierarchy and parent links.

4. **Missing Topical Collection Hub for Largest Category ("Festive") (High Severity)**
   - *Issue:* 22 out of 34 products (65% of catalog) belong to the `Festive` category in MongoDB. However, only `/collection/bridal` and `/collection/casual` were defined as dedicated routes and included in sitemaps.
   - *Impact:* 22 festive juttis lacked a high-authority category hub (`/collection/festive`), reducing topical authority and crawl discovery.

5. **Pagination Inaccessibility for Crawlers in Catalog (`Shop.jsx`) (Medium Severity)**
   - *Issue:* `Shop.jsx` only displayed the first 12 products. Additional products required clicking a JavaScript "Load More" button.
   - *Impact:* Crawlers without synthetic click execution could not discover products on page 2 or 3 of `/shop` through sequential pagination.

6. **Missing Breadcrumb Navigation on Collection Pages (Medium Severity)**
   - *Issue:* Collection pages had basic breadcrumbs, but lacked cross-linking to related collections (e.g., from Bridal to Festive or Casual).

7. **Sitemap Discrepancies (Medium Severity)**
   - *Issue:* Static `Frontend/public/sitemap.xml` and backend dynamic `sitemapController.js` were missing `/collection/festive`.
   - *Issue:* `generate_sitemap.js` used a hardcoded `today` timestamp for static pages on every run rather than realistic last modified dates.

---

## 4. Hypotheses & Potential Non-Blockers Evaluated

1. **Hypothesis: Client-Side Rendering (CSR) Prevents Indexing by Google**
   - *Evaluation:* **Disproved / Secondary.** Googlebot renders modern JavaScript SPAs cleanly (as proven by the successful indexing of `/collection/bridal` and 7 other pages). However, Googlebot's second-wave rendering requires explicit HTML `<a href="...">` anchors with crawlable canonical URLs and non-empty rendered content. CSR becomes an indexing barrier only when links rely on `onClick` handlers or unpopulated Redux state.
2. **Hypothesis: Robots.txt Is Blocking AI or Search Crawlers**
   - *Evaluation:* **Disproved.** Inspection of `Frontend/public/robots.txt` shows `User-agent: * Allow: /` with only admin/auth routes disallowed, and explicit allowance for Googlebot, Bingbot, GPTBot, PerplexityBot, and ClaudeBot.
3. **Hypothesis: Canonical Hostname Duplication (www vs non-www)**
   - *Evaluation:* **Confirmed Handled.** Canonical URLs across `SEO.jsx`, `index.html`, and `sitemap.xml` strictly enforce `https://beadsandbloom.in` (non-www, HTTPS).

---

## 5. Architectural Objectives & Priority Plan

- **P0: Fix Broken Parameterized Links & Canonical Inconsistencies**
  - Update `Navbar.jsx` link for 'The Collection' to `/shop`.
  - Update `CollectionTiles.jsx` to link to real collections (`/collection/bridal`, `/collection/festive`, `/collection/casual`) with accurate product counts.
  - Fix `VideoShowcase.jsx` links to use canonical collection routes.
- **P1: Guarantee Crawlable Product-to-Product Internal Linking**
  - Refactor `RelatedProducts.jsx` to fetch category-relevant products when Redux `items` is empty, ensuring direct crawls always render genuine related product links.
  - Ensure related products use crawlable `<a href="/product/:slug">` anchors with descriptive text.
- **P2: Expand Collection Architecture to Match Catalog Reality**
  - Add `/collection/festive` to `Collection.jsx` configuration, `App.jsx`, `Navbar.jsx`, `Footer.jsx`, and `sitemap.xml`.
  - Add related collection badges on collection and product pages.
- **P3: Make Breadcrumbs Universally Visible on Mobile & Desktop**
  - Move breadcrumbs out of `hidden lg:grid` into a universal container in `ProductDetail.jsx`.
  - Ensure BreadcrumbList JSON-LD schema matches visible breadcrumb URLs.
- **P4: Automated Regression Tests**
  - Implement automated test suite verifying all 44 indexable routes have incoming crawlable links, canonical consistency, and zero orphan states.
