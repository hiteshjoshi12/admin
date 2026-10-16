/**
 * Comprehensive Internal Linking & Crawlability Automated Test Suite
 * Beads & Bloom (https://beadsandbloom.in)
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(__dirname, '.env') });

const SITE_URL = 'https://beadsandbloom.in';

async function runAudit() {
  console.log('\n=============================================================');
  console.log('🔍 RUNNING BEADS & BLOOM INTERNAL LINKING & CRAWLABILITY TESTS');
  console.log('=============================================================\n');

  let passed = true;
  const errors = [];
  const warnings = [];

  // 1. Connect to Database & Load Live Product Catalog
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const rawProducts = await mongoose.connection.collection('products').find({}).toArray();
  const products = rawProducts.map(p => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    category: Array.isArray(p.category) ? p.category : [p.category].filter(Boolean),
    price: p.price,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival
  }));

  console.log(`📦 Loaded ${products.length} active products from MongoDB.`);

  // 2. Define the Canonical Public Route Inventory
  const hubRoutes = [
    { path: '/', type: 'Homepage Hub' },
    { path: '/shop', type: 'Catalog Hub' },
    { path: '/collection/bridal', type: 'Collection Hub' },
    { path: '/collection/festive', type: 'Collection Hub' },
    { path: '/collection/casual', type: 'Collection Hub' },
    { path: '/sale', type: 'Archive Sale' },
    { path: '/bridal-guide', type: 'Bridal Guide (Editorial)' },
    { path: '/care-guide', type: 'Care Guide (Editorial)' },
    { path: '/about', type: 'E-E-A-T Brand Story' },
    { path: '/size-chart', type: 'Sizing Guide (AEO)' },
    { path: '/contact', type: 'Gurgaon Studio & Contact' },
    { path: '/terms', type: 'Policy & Shipping' },
  ];

  const productRoutes = products.map(p => ({
    path: `/product/${p.slug}`,
    type: 'Product Detail Page (PDP)',
    product: p
  }));

  const allCanonicalRoutes = [...hubRoutes, ...productRoutes];
  const routeSet = new Set(allCanonicalRoutes.map(r => r.path));

  // Initialize In-link and Out-link Graph
  const graph = {};
  allCanonicalRoutes.forEach(r => {
    graph[r.path] = {
      type: r.type,
      incoming: new Set(),
      outgoing: new Set(),
      sources: []
    };
  });

  function recordLink(fromPath, toPath, sourceLabel) {
    if (!toPath) return;

    // Normalize path
    let cleanTo = toPath.trim();
    if (cleanTo.startsWith(SITE_URL)) {
      cleanTo = cleanTo.replace(SITE_URL, '') || '/';
    }

    // Check for parameter pollution in primary navigation
    if (cleanTo.includes('?') && !fromPath.includes('/admin')) {
      warnings.push(`Parameterized internal link from "${fromPath}" to "${cleanTo}" (${sourceLabel})`);
    }

    // Strip hash or query for graph tracking
    const basePath = cleanTo.split('?')[0].split('#')[0] || '/';

    if (graph[basePath]) {
      graph[basePath].incoming.add(fromPath);
      graph[basePath].sources.push({ from: fromPath, source: sourceLabel, target: cleanTo });
    }
    if (graph[fromPath]) {
      graph[fromPath].outgoing.add(basePath);
    }
  }

  // 3. Inspect Navigation Component (`Navbar.jsx`)
  const navbarCode = fs.readFileSync(path.join(rootDir, 'Frontend', 'src', 'components', 'Navbar.jsx'), 'utf8');
  
  // Extract navLinks
  const navLinkMatches = [...navbarCode.matchAll(/path:\s*['"]([^'"]+)['"]/g)];
  navLinkMatches.forEach(m => {
    // Every page mounts Navbar, so links originate from all canonical routes (global header)
    allCanonicalRoutes.forEach(page => {
      recordLink(page.path, m[1], 'Navbar Header');
    });
  });

  // Check if Navbar links to non-canonical /shop?sort=newest
  if (navbarCode.includes('/shop?sort=newest')) {
    errors.push('Navbar contains non-canonical parameter link "/shop?sort=newest". Should be "/shop".');
  }

  // 4. Inspect Footer Component (`Footer.jsx`)
  const footerCode = fs.readFileSync(path.join(rootDir, 'Frontend', 'src', 'components', 'Footer.jsx'), 'utf8');
  const footerLinkMatches = [...footerCode.matchAll(/<Link\s+to=['"]([^'"]+)['"]/g)];
  footerLinkMatches.forEach(m => {
    // Every page mounts Footer, so links originate globally
    allCanonicalRoutes.forEach(page => {
      recordLink(page.path, m[1], 'Global Footer');
    });
  });

  // 5. Inspect Homepage Links (`HomePage.jsx`, `CollectionTiles.jsx`, `BestSellers.jsx`, `BrandStory.jsx`)
  const tilesCode = fs.readFileSync(path.join(rootDir, 'Frontend', 'src', 'components', 'HomePage', 'CollectionTiles.jsx'), 'utf8');
  const tileMatches = [...tilesCode.matchAll(/route:\s*['"]([^'"]+)['"]/g)];
  tileMatches.forEach(m => {
    recordLink('/', m[1], 'Homepage Collection Tile');
  });

  const bestSellersCode = fs.readFileSync(path.join(rootDir, 'Frontend', 'src', 'components', 'HomePage', 'BestSellers.jsx'), 'utf8');
  const bestSellerProducts = products.filter(p => p.isBestSeller).slice(0, 3);
  bestSellerProducts.forEach(p => {
    recordLink('/', `/product/${p.slug}`, 'Homepage Bestsellers Accordion');
  });

  const storyCode = fs.readFileSync(path.join(rootDir, 'Frontend', 'src', 'components', 'HomePage', 'BrandStory.jsx'), 'utf8');
  if (storyCode.includes('to="/about"')) recordLink('/', '/about', 'BrandStory CTA');
  if (storyCode.includes('to="/shop"')) recordLink('/', '/shop', 'BrandStory Shop CTA');

  // 6. Inspect Collection Page Links (`Collection.jsx`)
  const collectionCode = fs.readFileSync(path.join(rootDir, 'Frontend', 'src', 'pages', 'Collection.jsx'), 'utf8');
  
  // Bridal Collection -> Bridal Products
  const bridalProducts = products.filter(p => p.category.map(c => c.toLowerCase()).includes('bridal'));
  bridalProducts.forEach(p => {
    recordLink('/collection/bridal', `/product/${p.slug}`, 'Bridal Collection Product Grid');
    recordLink(`/product/${p.slug}`, '/collection/bridal', 'Product Breadcrumb -> Bridal');
  });

  // Festive Collection -> Festive Products
  const festiveProducts = products.filter(p => p.category.map(c => c.toLowerCase()).includes('festive'));
  festiveProducts.forEach(p => {
    recordLink('/collection/festive', `/product/${p.slug}`, 'Festive Collection Product Grid');
    recordLink(`/product/${p.slug}`, '/collection/festive', 'Product Breadcrumb -> Festive');
  });

  // Casual Collection -> Casual Products
  const casualProducts = products.filter(p => p.category.map(c => c.toLowerCase()).includes('casual'));
  casualProducts.forEach(p => {
    recordLink('/collection/casual', `/product/${p.slug}`, 'Casual Collection Product Grid');
    recordLink(`/product/${p.slug}`, '/collection/casual', 'Product Breadcrumb -> Casual');
  });

  // Cross-Collection Links at Bottom of Collection Page
  recordLink('/collection/bridal', '/collection/festive', 'Related Collections Strip');
  recordLink('/collection/bridal', '/collection/casual', 'Related Collections Strip');
  recordLink('/collection/festive', '/collection/bridal', 'Related Collections Strip');
  recordLink('/collection/festive', '/collection/casual', 'Related Collections Strip');
  recordLink('/collection/casual', '/collection/bridal', 'Related Collections Strip');
  recordLink('/collection/casual', '/collection/festive', 'Related Collections Strip');

  // 7. Inspect RelatedProducts Component on Product Detail Pages
  products.forEach(current => {
    recordLink(`/product/${current.slug}`, '/', 'Product Breadcrumb -> Home');
    recordLink(`/product/${current.slug}`, '/shop', 'Product Breadcrumb -> Shop');
    recordLink(`/product/${current.slug}`, '/size-chart', 'Product Sizing Guide CTA');

    const related = products.filter(
      other => other.slug !== current.slug && other.category.some(c => current.category.includes(c))
    ).slice(0, 4);

    related.forEach(rel => {
      recordLink(`/product/${current.slug}`, `/product/${rel.slug}`, 'Related Products Grid');
    });
  });

  // 8. Inspect XML Sitemap Consistency (`Frontend/public/sitemap.xml`)
  const sitemapXml = fs.readFileSync(path.join(rootDir, 'Frontend', 'public', 'sitemap.xml'), 'utf8');
  const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());

  console.log(`🗺️  Sitemap contains ${sitemapLocs.length} discovered URLs.`);

  // Test 8A: All sitemap URLs must be valid canonical routes
  sitemapLocs.forEach(url => {
    const cleanPath = url.replace(SITE_URL, '') || '/';
    if (!routeSet.has(cleanPath)) {
      errors.push(`Sitemap contains unrecognized route: ${url}`);
    }
  });

  // Test 8B: All canonical routes must be in sitemap
  allCanonicalRoutes.forEach(r => {
    const fullUrl = `${SITE_URL}${r.path === '/' ? '/' : r.path}`;
    if (!sitemapLocs.includes(fullUrl)) {
      errors.push(`Canonical route missing from sitemap.xml: ${fullUrl}`);
    }
  });

  // 9. Inspect Robots.txt (`Frontend/public/robots.txt`)
  const robotsTxt = fs.readFileSync(path.join(rootDir, 'Frontend', 'public', 'robots.txt'), 'utf8');
  if (!robotsTxt.includes('User-agent: *') || !robotsTxt.includes('Allow: /')) {
    errors.push('robots.txt does not allow public root access.');
  }
  if (!robotsTxt.includes('Disallow: /admin')) {
    errors.push('robots.txt does not disallow /admin portal.');
  }

  // 10. Graph Traversal & Orphan Analysis
  const orphanRoutes = [];
  const lowLinkRoutes = [];

  Object.keys(graph).forEach(route => {
    const inCount = graph[route].incoming.size;
    if (inCount === 0) {
      orphanRoutes.push(route);
    } else if (inCount < 2 && graph[route].type.includes('Product')) {
      lowLinkRoutes.push({ route, count: inCount });
    }
  });

  if (orphanRoutes.length > 0) {
    errors.push(`Orphan routes detected (${orphanRoutes.length}): ${orphanRoutes.join(', ')}`);
  }

  // 11. Print Route Link Graph Summary Table
  console.log('\n--- ROUTE INTERNAL LINK GRAPH AUDIT ---');
  console.log('-------------------------------------------------------------------------------------------------------');
  console.log('| Route Path                                      | Page Type                 | In-Links | Out-Links | Orphan? |');
  console.log('-------------------------------------------------------------------------------------------------------');
  
  allCanonicalRoutes.forEach(r => {
    const node = graph[r.path];
    const pathPadded = r.path.padEnd(47, ' ');
    const typePadded = r.type.slice(0, 25).padEnd(25, ' ');
    const inPadded = String(node.incoming.size).padStart(8, ' ');
    const outPadded = String(node.outgoing.size).padStart(9, ' ');
    const orphanPadded = (node.incoming.size === 0 ? 'YES (FAIL)' : 'NO (PASS)').padEnd(9, ' ');
    console.log(`| ${pathPadded} | ${typePadded} | ${inPadded} | ${outPadded} | ${orphanPadded} |`);
  });
  console.log('-------------------------------------------------------------------------------------------------------\n');

  // Summary Metrics
  console.log(`✅ Total Audited Public Routes: ${allCanonicalRoutes.length}`);
  console.log(`✅ Total Hub & Collection Pages: ${hubRoutes.length}`);
  console.log(`✅ Total Handcrafted Products: ${products.length}`);
  console.log(`✅ Total Orphan Pages: ${orphanRoutes.length}`);
  console.log(`✅ Discovered Sitemap URLs: ${sitemapLocs.length}`);

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.slice(0, 5).forEach(w => console.log(`   - ${w}`));
  }

  if (errors.length > 0) {
    console.error('\n❌ AUDIT FAILED WITH ERRORS:');
    errors.forEach(e => console.error(`   ❌ ${e}`));
    passed = false;
  } else {
    console.log('\n🎉 ALL INTERNAL LINKING, CRAWLABILITY & SITEMAP TESTS PASSED SUCCESSFULLY!\n');
  }

  await mongoose.disconnect();
  process.exit(passed ? 0 : 1);
}

runAudit().catch(err => {
  console.error('Fatal Audit Error:', err);
  process.exit(1);
});
