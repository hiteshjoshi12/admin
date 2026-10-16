# SEO Post-Deployment Verification & Search Console Operations Checklist
## Beads & Bloom — Handcrafted Indian Juttis & Ethnic Footwear
**Website:** `https://beadsandbloom.in/`  
**Protocol:** Standard Operating Procedure (SOP) for Technical Lead & Store Owner  

---

## 1. Local & Staging Pre-Flight Verification

- [ ] **Production Build Passing:** Run `npm run build` in `Frontend/` and ensure zero errors or unhandled chunking issues.
- [ ] **Automated Linking Test Suite Passing:** Run `node test_internal_linking.js` and verify:
  - 100% of the 44 indexable routes have at least 1 crawlable HTML anchor.
  - Zero orphan pages detected.
  - No internal links target non-canonical or query-diluted URLs.
  - `sitemap.xml` entries match the route inventory.
- [ ] **Local 404 Response & SPA Fallback:** Verify that unknown paths (e.g., `/non-existent-sample`) render `NotFound.jsx` with `<meta name="robots" content="noindex, nofollow" />` and do not trigger infinite redirects.

---

## 2. Production Deployment Procedure

Depending on your production environment (MilesWeb / cPanel Passenger / Vercel):
1. **Frontend Deployment:**
   - Run `npm run build` to generate the updated `Frontend/dist` bundle.
   - Upload or sync `dist/` to the web root or deploy via Git CI/CD.
   - Verify `Frontend/public/sitemap.xml` and `Frontend/public/robots.txt` are served at root:
     - `curl -I https://beadsandbloom.in/sitemap.xml` (Must return HTTP 200 `application/xml`)
     - `curl -I https://beadsandbloom.in/robots.txt` (Must return HTTP 200 `text/plain`)
2. **Backend Deployment:**
   - Restart the Node.js application process (e.g., via Passenger restart `tmp/restart.txt` or PM2 restart).
   - Test backend dynamic sitemap: `curl -I https://beadsandbloom.in/sitemap.xml`.

---

## 3. Live Production Technical Validation

After deploying code live to `https://beadsandbloom.in/`:

### A. Canonical Tag Integrity Checks
Inspect live rendered HTML (via Chrome DevTools or `curl`):
- `https://beadsandbloom.in/` -> Canonical must be `https://beadsandbloom.in/`
- `https://beadsandbloom.in/shop` -> Canonical must be `https://beadsandbloom.in/shop`
- `https://beadsandbloom.in/collection/bridal` -> Canonical must be `https://beadsandbloom.in/collection/bridal`
- `https://beadsandbloom.in/collection/festive` -> Canonical must be `https://beadsandbloom.in/collection/festive`
- `https://beadsandbloom.in/collection/casual` -> Canonical must be `https://beadsandbloom.in/collection/casual`
- `https://beadsandbloom.in/product/:slug` -> Canonical must be `https://beadsandbloom.in/product/:slug`

### B. Live Anchor & Navigation Checks
- Click "The Collection" in Navbar: URL in address bar must be `/shop` (NOT `/shop?sort=newest`).
- Click "Festive" in Navbar: URL in address bar must be `/collection/festive`.
- Click Homepage Collection Tiles: Must navigate to `/collection/bridal`, `/collection/festive`, `/collection/casual` with full product listings.
- Open any product page on mobile width (<768px): Verify breadcrumbs are visible above the fold and links are clickable.
- Open any product page in Incognito (fresh session without visiting `/shop` first): Verify "You May Also Like" (Related Products) renders 4 relevant products with crawlable links.

---

## 4. Google Search Console (GSC) Operations

1. **Resubmit Sitemap:**
   - In Google Search Console, navigate to **Indexing** > **Sitemaps**.
   - Resubmit `https://beadsandbloom.in/sitemap.xml`.
   - Confirm discovered URL count updates to reflect the verified routes (44 canonical URLs).
2. **Live URL Inspection on Key Pages:**
   - Use the **URL Inspection Tool** to inspect:
     - `https://beadsandbloom.in/collection/festive`
     - `https://beadsandbloom.in/shop`
     - 2 previously unindexed product URLs (e.g. `https://beadsandbloom.in/product/noor-e-hunar-pastel-pearl-bead-casual-jutti`)
   - Click **Test Live URL**.
   - In the live test results:
     - Check **View Tested Page** > **HTML**.
     - Verify `<a href="/product/...">` links exist in the rendered HTML.
     - Verify canonical tag points to the exact canonical URL.
     - Click **Request Indexing**.
3. **Monitor Coverage Discrepancies:**
   - **Alternate page with proper canonical tag:** Should decline over the next 2-4 crawl cycles as Google stops encountering `/shop?sort=newest` and `/shop?category=...` in internal links.
   - **Crawled — currently not indexed:** Should steadily convert to "Valid / Indexed" as Googlebot recrawls product pages and observes high-quality incoming links from collections and related products.

---

## 5. Timeline & Realistic Expectations

> [!NOTE]
> Googlebot recrawls e-commerce websites on its own schedule based on crawl budget, server response latency, and brand query demand. 
> Typically:
> - Sitemap updates are acknowledged within 24 to 72 hours.
> - Key hub pages (`/collection/festive`, `/shop`) are recrawled within 3 to 7 days.
> - Complete catalog recrawling and indexing re-evaluation across all 34 product SKUs usually takes 1 to 4 weeks.
> Technical SEO fixes remove the barriers to crawling and renderability; actual indexation is granted autonomously by Google's quality algorithms.
