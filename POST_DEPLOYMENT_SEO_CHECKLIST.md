# Post-Deployment SEO & Indexing Checklist
## Beads & Bloom — Handcrafted Indian Punjabi Juttis & Mojris
**Domain:** `https://beadsandbloom.in/`  
**Execution Phase:** Production Release & Ongoing Performance Monitoring  
**Target Search Engine:** Google Search & Merchant Center  
**Date:** October 2026

---

## 1. Production Deployment Immediate Verification Steps

Execute these steps immediately following the production build release on the live host:

| Step | Action | Verification Tool / Command | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **1.1** | Verify Live HTTP Response Codes | `curl -I https://beadsandbloom.in/` | HTTP 200 OK with valid SSL certificate. |
| **1.2** | Verify Canonical Header on Root & Subpages | Browser DevTools / curl | Self-referencing `<link rel="canonical">` matching exact protocol and pathname without trailing slashes. |
| **1.3** | Verify XML Sitemap Accessibility | `curl -s https://beadsandbloom.in/sitemap.xml` | XML is well-formed; contains exactly 46 canonical `<url>` entries; no 404s or query parameters. |
| **1.4** | Check Robots.txt Public Directives | `curl -s https://beadsandbloom.in/robots.txt` | `User-agent: *` with `Allow: /`, `Disallow: /admin`, and correct `Sitemap:` pointer. |
| **1.5** | Test New Landing Page Renders | Visit `/bridal-guide` and `/care-guide` | Renders in < 1.5s; H1, content sections, FAQ accordions, and schema are fully populated. |
| **1.6** | Test Product Page Description State | Visit any product (e.g. `/product/neel-pari-...`) | "Description" is open by default on initial page mount; full specifications visible. |
| **1.7** | Confirm Redirect for Deprecated Routes | Visit `/collection/sale` | Automatically redirects cleanly to `/sale`. |

---

## 2. Google Search Console (GSC) Priority Actions

Perform these actions inside Google Search Console (`https://search.google.com/search-console`):

### A. Sitemap Resubmission
1. Navigate to **Indexing ➔ Sitemaps**.
2. Submit `https://beadsandbloom.in/sitemap.xml`.
3. Confirm status changes to **Success** and discovered URLs count displays **46**.

### B. High-Priority URL Inspection & Manual Index Request
Inspect and request indexing for the following critical hubs and new pages:
1. `https://beadsandbloom.in/` (Homepage)
2. `https://beadsandbloom.in/collection/festive` (Restored collection hub)
3. `https://beadsandbloom.in/bridal-guide` (New high-intent editorial guide)
4. `https://beadsandbloom.in/care-guide` (New high-intent care guide)
5. `https://beadsandbloom.in/size-chart` (Enriched sizing & AEO guide)
6. Sample product URLs:
   - `https://beadsandbloom.in/product/neel-pari-beige-embroidered-festive-jutti`
   - `https://beadsandbloom.in/product/peela-sitara-silver-sparkle-festive-jutti`
   - `https://beadsandbloom.in/product/zar-surkh-maroon-velvet-handcrafted-bridal-jutti`

### C. Live Test URL in GSC URL Inspection
- Click **"Test Live URL"** on `/bridal-guide` and `/care-guide`.
- Confirm **"URL is available to Google"**.
- Confirm that Google's rendered screenshot displays the complete text without JavaScript errors.
- Confirm detected structured data items: `BreadcrumbList`, `Article`, and `FAQPage`.

---

## 3. Rich Results & Structured Data Validation

Test the following URLs using Google's Rich Results Test tool (`https://search.google.com/test/rich-results`):
- **Homepage:** Verify `Organization` and `WebSite` schema with sitelinks searchbox.
- **Product Pages:** Verify `Product` schema with `Offer`, `priceValidUntil`, `hasMerchantReturnPolicy`, and `shippingDetails`. Confirm 0 critical errors.
- **Bridal Guide (`/bridal-guide`):** Verify `Article`, `BreadcrumbList`, and `FAQPage` schema.
- **Care Guide (`/care-guide`):** Verify `Article`, `BreadcrumbList`, and `FAQPage` schema.
- **Size Chart (`/size-chart`):** Verify `BreadcrumbList` and `FAQPage` schema.

---

## 4. 30, 60, and 90-Day Organic Performance Measurement Plan

### Phase 1: Days 1–30 (Indexing & Crawl Hygiene)
- **Primary Objective:** Transition newly added and enriched pages from "Discovered" to "Indexed".
- **Key Metrics to Track:**
  - Total Indexed Pages in GSC (Target: Growth from 7 to 30+ pages).
  - Status of "Crawled — currently not indexed" (verify that enriched products drop off this exclusion report).
  - Total impressions for `/bridal-guide`, `/care-guide`, and `/collection/festive`.
- **Review Action:** Weekly review of GSC Indexing ➔ Pages report.

### Phase 2: Days 31–60 (Non-Branded Query Emergence)
- **Primary Objective:** Observe initial non-branded ranking impressions and query diversity.
- **Key Metrics to Track:**
  - Query expansion beyond "beads and bloom" (e.g. `bridal juttis for lehenga`, `how to clean juttis`, `festive juttis online`).
  - Average position for collection hubs (`/collection/bridal` target < 20).
  - Click-through rate (CTR) on Rich Results (FAQ accordion snippets in SERPs).
- **Review Action:** Bi-weekly inspection of GSC Performance report filtered by "Queries not containing 'beads'".

### Phase 3: Days 61–90 (Conversion & Commercial Momentum)
- **Primary Objective:** Convert organic landing page traffic into sales and studio inquiries.
- **Key Metrics to Track:**
  - Assisted conversions: Organic visitors landing on `/care-guide` or `/bridal-guide` navigating to `/collection/bridal` and completing checkout.
  - Studio trial inquiries via WhatsApp/Contact form mentioning the Bridal Guide.
  - Organic revenue and average order value (AOV).
- **Review Action:** Monthly E-Commerce conversion audit in Google Analytics 4 (GA4).
