# New Landing Page Evaluation & Architecture Plan
## Beads & Bloom — Handcrafted Indian Punjabi Juttis & Mojris
**Domain:** `https://beadsandbloom.in/`  
**Evaluation Standard:** Mandatory Organic Approval Criteria (Quality over Quantity)  
**Date:** October 2026

---

## 1. Approval Framework & Evaluation Criteria

To prevent content bloat, crawl-budget dilution, and duplicate or thin pages, every prospective new page candidate was evaluated against 7 non-negotiable criteria:
1. **Distinct Search Intent:** Does the page serve a unique search intent not satisfied by any existing URL?
2. **Real Customer Question:** Does it answer an authentic, recurring customer inquiry?
3. **No Cannibalization:** Does it avoid duplicating existing collection or informational pages?
4. **Organic Search Benefit:** Does it offer genuine organic ranking and customer acquisition potential?
5. **Verifiable Facts:** Can every statement on the page be substantiated by the brand's authentic construction, materials, and policies?
6. **Natural Commercial Flow:** Can the page link seamlessly to specific collections and individual products?
7. **Catalogue Resilience:** Can the page remain evergreen as specific products sell out or new lines arrive?

---

## 2. Comprehensive Candidate Evaluation Matrix

| Candidate Page Proposal | Target Search Query / Intent | Evaluation Verdict | Primary Justification & Architectural Decision |
| :--- | :--- | :--- | :--- |
| **Candidate 1: Dedicated Jutti Size & Fit Guide** | "how to measure jutti size", "punjabi jutti size guide", "jutti broad feet sizing" | ❌ **REJECTED AS NEW PAGE**<br>(Integrated into existing `/size-chart`) | `/size-chart` already exists, has dedicated schema, and serves this exact intent. Creating a second URL (`/size-guide` or `/fit-guide`) would cause direct keyword cannibalization and split ranking signals. Instead, enriched `/size-chart` with textual measurement instructions, broad feet guidance, AEO FAQ schema, and cross-guide links. |
| **Candidate 2: Handcrafted Jutti Care Guide** | "how to clean embroidered juttis", "leather jutti maintenance", "prevent jutti shoe bites", "store bridal mojris" | ✅ **APPROVED & CREATED**<br>(Implemented at `/care-guide`) | **Passes All 7 Criteria.** Handcrafted juttis made with raw silk, velvet, genuine leather soles, and metallic embroidery cannot be washed with water. Customers constantly ask how to preserve them. No existing page answered this. Created a comprehensive guide with 4 care pillars, bite-free break-in instructions, FAQ schema, and links to relevant collections and PDPs. |
| **Candidate 3: Bridal Jutti Buying & Styling Guide** | "bridal juttis for lehenga", "wedding footwear comfort", "juttis vs heels for pheras", "gurgaon bridal footwear trial" | ✅ **APPROVED & CREATED**<br>(Implemented at `/bridal-guide`) | **Passes All 7 Criteria.** `/collection/bridal` is a commercial shopping grid. Brides need editorial advice: 10-hour pheras comfort vs. 4-inch stilettos, lehenga skirt hem alterations with flats, event-by-event footwear planning (Haldi to Reception), and booking studio trials in Online Atelier. Links directly to `/collection/bridal`, `/size-chart`, and `/contact`. |
| **Candidate 4: How to Style Punjabi Juttis** | "how to style ethnic flats", "styling juttis with jeans", "everyday jutti outfits" | ❌ **REJECTED AS STANDALONE PAGE**<br>(Integrated into `/collection/casual` & `/collection/festive`) | Standalone fashion styling pages often become thin, generic lifestyle fluff with high bounce rates. Styling guidance was directly integrated into collection descriptions (`/collection/casual` for kurtis/denim, `/collection/festive` for sangeet/shararas) where products can be purchased immediately. |
| **Candidate 5: Central Frequently Asked Questions Page** | "beads and bloom faq", "handcrafted jutti faqs" | ❌ **REJECTED AS STANDALONE PAGE**<br>(Contextualized across native pages) | Central FAQ "graveyard" pages perform poorly in search compared to contextual FAQs embedded directly on high-intent conversion pages. Sizing FAQs are on `/size-chart`, Care FAQs are on `/care-guide`, Bridal FAQs are on `/bridal-guide`, and Shipping/Returns FAQs are on `/terms` and homepage `StoreTrustFAQ`. |
| **Candidate 6: Dedicated Craftsmanship & Heritage Story** | "punjabi jutti making process", "handcrafted leather juttis heritage" | ❌ **REJECTED AS STANDALONE PAGE**<br>(Consolidated into `/about` & Homepage) | Beads & Bloom's brand narrative, artisan handcrafting, and Online Atelier studio identity belong on the authoritative `/about` page and homepage `BrandStory` section. Creating an additional `/our-craft` page would dilute brand authority and E-E-A-T signals. |

---

## 3. Approved Page Architecture & Implementation Details

### Page A: `/care-guide` (Handcrafted Punjabi Jutti Care & Cleaning Guide)
- **Canonical URL:** `https://beadsandbloom.in/care-guide`
- **File:** `Frontend/src/pages/CareGuide.jsx`
- **Search Intent:** Informational / Post-Purchase Maintenance & Pre-Purchase Quality Assurance
- **Target Keywords:** `how to clean juttis`, `jutti care guide`, `cleaning embroidered juttis`, `store bridal mojris`, `prevent jutti shoe bite`
- **Content Outline:**
  1. **Hero & Breadcrumbs:** Home / Care Guide with accessible H1.
  2. **4 Core Care Pillars:**
     - *Moisture Defense:* Why 100% genuine leather soles must never be soaked in water; air-drying naturally.
     - *Fabric Spot Cleaning:* Soft dry brushing for raw silk, velvet, and metallic embroidery.
     - *Breathable Muslin Storage:* Storing pairs in breathable bags with silica gel away from sunlight.
     - *Bite-Free Break-In:* How memory foam cushions mold to feet, and wearing with socks for 20 minutes before events.
  3. **Preservation Rules Checklist:** Perfumes before shoes, gentle sole brushing, no heat/hairdryers.
  4. **4 Verified FAQs:** Schema-enabled direct answers.
  5. **Contextual In-Links & CTAs:** Links to `/collection/bridal`, `/size-chart`, and footer sitewide link.
- **Structured Data:** `Article`, `BreadcrumbList`, and `FAQPage` schema.

### Page B: `/bridal-guide` (Bridal Jutti Buying & Styling Guide)
- **Canonical URL:** `https://beadsandbloom.in/bridal-guide`
- **File:** `Frontend/src/pages/BridalGuide.jsx`
- **Search Intent:** Informational / Wedding Planning & Commercial Bridging
- **Target Keywords:** `bridal jutti guide`, `wedding footwear for lehenga`, `bridal mojris comfort`, `pheras footwear india`, `punjabi juttis for brides`
- **Content Outline:**
  1. **Hero & Breadcrumbs:** Home / Bridal Guide with accessible H1.
  2. **The Bridal Footwear Dilemma (Juttis vs. Heels):** Why 15–25 kg lehengas, 6+ hours of standing, and lawn/marble venues make flat, double-cushioned juttis superior to stilettos.
  3. **Event-by-Event Footwear Guide:** Haldi & Mehendi (mirror work), Sangeet (dance-floor cut-dana), Wedding Day Pheras (royal zardozi), and Reception (champagne metallics).
  4. **Lehenga Fabric & Metal Coordination:** Crimson velvet with gold zardozi, pastels with pearls/cut-dana, tissue silks with champagne zari.
  5. **Gurgaon Studio Appointments & Sizing Timeline:** Ordering 4–6 weeks prior, bringing juttis to lehenga hem alteration trials, and visiting Online Atelier studio.
  6. **4 Verified Bridal FAQs:** Schema-enabled direct answers.
  7. **Contextual In-Links & CTAs:** Links to `/collection/bridal`, `/size-chart`, `/care-guide`, and `/contact`.
- **Structured Data:** `Article`, `BreadcrumbList`, and `FAQPage` schema.

---

## 4. Crawlability & Sitemap Inclusion

Both approved pages have been:
1. Registered with lazy route loading in `Frontend/src/App.jsx`.
2. Linked sitewide from `Frontend/src/components/Footer.jsx` under "About & Support" (0 click depth from homepage).
3. Cross-linked reciprocally from `Frontend/src/pages/SizeChart.jsx` and `Frontend/src/pages/ProductDetail.jsx`.
4. Embedded into `backend/controllers/sitemapController.js` and static `Frontend/public/sitemap.xml` with `weekly` change frequency and `0.8` priority.
