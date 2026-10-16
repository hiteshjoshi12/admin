# BEADS & BLOOM — GOOGLE SEARCH CONSOLE VERIFICATION & MONITORING CHECKLIST
**Domain:** `https://beadsandbloom.in/`  
**Property Type:** Domain / URL Prefix (`https://beadsandbloom.in/`)  
**Target:** Google Search Crawling, Rendering, Understanding & Indexing Optimization  

---

## 1. Context & Technical Reconciliation

### Understanding Live Test vs. Google Index Report
A common point of confusion is seeing:
- **Live Test Report:** *"URL is available to Google / Page fetch successful / Crawl allowed / Indexing allowed"*
- **Google Index Report:** *"Discovered — currently not indexed"* or *"Crawled — currently not indexed"*

**Crucial Technical Distinction:**
- **Live Test:** A real-time, on-demand headless browser render performed by Google's inspection bot against the current live web server. It verifies that your page returns HTTP 200, renders JavaScript cleanly, permits indexing (`index, follow`), and has valid canonical and schema tags.
- **Google Index Report:** Google Search's persistent historical database. When Googlebot discovers a URL (via sitemap or link), it schedules it in a crawl queue. It may remain in *"Discovered — currently not indexed"* or *"Crawled — currently not indexed"* until Google evaluates site-wide internal link signals, content value, and crawl budget.

With our internal linking architecture now in place:
1. `/collection/festive` is linked directly from the primary navigation bar (desktop and mobile), footer, homepage collection tiles, and product breadcrumbs.
2. The 3 previously unindexed products (`Noor-e-Aaina`, `Peacock Blush`, `Meher Sitara`) are now connected to collection hubs and receive peer links from Related Products.
3. Every public page has at least one crawlable incoming HTML link, eliminating orphan status.

---

## 2. Immediate Post-Deployment Actions (Day 1)

### Step 1: Resubmit the Master Sitemap in GSC
1. Navigate to **Google Search Console** > **Indexing** > **Sitemaps**.
2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Confirm:
   - Status: **Success**
   - Discovered Pages: **44** (10 Hubs/Collections + 34 Handcrafted Products).
   *(Note: It may take 24–48 hours for GSC to update the discovered count from 43 to 44).*

---

### Step 2: URL Inspection & Live Testing for Priority Hubs
Inspect the following 4 priority hubs using the **URL Inspection Tool** (top search bar in GSC):

1. **`https://beadsandbloom.in/collection/festive`**
   - Click **Test Live URL**.
   - Verify:
     - Page fetch: **Successful**
     - Crawl allowed: **Yes**
     - User-declared canonical: `https://beadsandbloom.in/collection/festive`
     - Google-selected canonical: *Same as user-declared*
     - Rich Results: **CollectionPage, Breadcrumbs (2 items: Home > Shop > The Festive Edit)**
   - Click **Request Indexing**. *(Only request once; repeated requests do not accelerate processing).*

2. **`https://beadsandbloom.in/collection/bridal`**
   - Confirm it remains indexed and displays self-referencing canonical and BreadcrumbList.

3. **`https://beadsandbloom.in/shop`**
   - Click **Test Live URL**.
   - Confirm category navigation pills (`Bridal`, `Festive`, `Casual`, `Sale`) render in the screenshot.

4. **`https://beadsandbloom.in/` (Homepage)**
   - Verify structured data detects: `ShoeStore`, `Organization`, `WebSite`, `FAQPage`.

---

### Step 3: Inspect Previously Unindexed Product Pages
Inspect the 3 previously flagged product pages:
1. `https://beadsandbloom.in/product/noor-e-aaina-mirror-work-sheesha-party-jutti`
2. `https://beadsandbloom.in/product/peacock-blush-phulkari-inspired-floral-party-jutti`
3. `https://beadsandbloom.in/product/meher-sitara-handcrafted-zardozi-sitara-casual-jutti`

**Verification Criteria:**
- Click **Test Live URL**.
- View **Tested Page** > **Screenshot**: Verify that the product image, size selector, price, and **Related Products** section render.
- Check **HTML**: Confirm `<a href="/collection/festive">` (or `/collection/casual`) is present in the breadcrumbs.
- Click **Request Indexing** on `noor-e-aaina-mirror-work-sheesha-party-jutti`.

---

## 3. Weekly Monitoring & Status Tracking (Weeks 1 – 4)

### Week 1: Monitor "Crawl Stats" & "Sitemaps"
- Go to **Settings** > **Crawl stats** > **Open Report**.
- Check:
  - **Total crawl requests:** Look for an upward tick as Googlebot processes the updated sitemap and new internal links.
  - **By response:** Ensure HTTP 200 is >98%, and HTTP 404 is only for genuine removed URLs.
  - **By purpose:** Ensure "Refresh" and "Discovery" crawls are active.

### Week 2: Review "Pages" (Index Coverage Report)
Navigate to **Indexing** > **Pages**:

1. **Review "Alternate page with proper canonical tag":**
   - Previously reported: 2 URLs.
   - Expected trend: Should decrease as Googlebot crawls the updated internal links that point directly to canonical `/shop` rather than `/shop?sort=newest` or `/shop?category=...`.
2. **Review "Crawled — currently not indexed":**
   - Previously reported: 3 URLs.
   - Expected trend: As the internal link graph distributes PageRank and topical context from `/collection/festive` and Related Products, these product pages should transition from "Crawled — currently not indexed" to "Indexed".
3. **Review "Discovered — currently not indexed":**
   - Ensure newly added URLs (`/collection/festive`) move into the crawl queue and get crawled.

### Week 3: Monitor Rich Results & Enhancements
Under **Enhancements** in GSC:
- **Products:** Check for valid product items. Verify 0 errors. (Our addition of `priceValidUntil`, `hasMerchantReturnPolicy`, and `shippingDetails` prevents merchant warnings).
- **Breadcrumbs:** Verify valid breadcrumb items across all collection and product URLs.
- **Merchant Listings:** Check for free listing eligibility.

---

## 4. Key Don'ts & Common Pitfalls to Avoid
- **DO NOT submit mass indexing requests:** Submitting dozens of URLs daily can trigger quota limits and provides zero algorithmic advantage. Only request indexing for 2–3 key hubs (`/collection/festive`, 1 product).
- **DO NOT remove unindexed products:** Leaving products online with proper category mapping and related links gives Googlebot the signal needed to evaluate their commercial value.
- **DO NOT create duplicate collections:** Do not create duplicate landing pages like `/collection/punjabi-juttis` that duplicate `/shop` or `/collection/festive`.
- **DO NOT canonicalize collections to homepage:** Every distinct collection (`bridal`, `festive`, `casual`) must remain self-canonicalized.
