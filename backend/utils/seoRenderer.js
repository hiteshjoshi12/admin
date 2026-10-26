const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const Product = require('../models/Product');
const SiteContent = require('../models/SiteContent');
const routesManifest = require('./routesManifest.json');
const {
  renderHomeRoot,
  renderShopRoot,
  renderCollectionRoot,
  renderProductRoot,
  renderAboutRoot,
  getOptimizedImageUrl,
  getImageSrcSet
} = require('./rootGenerators');

// In-memory cache for dynamic SEO lookups (TTL 5 minutes)
const seoCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

// Dynamic build-time prerendered static snapshot loader
function getPrerenderedStatic() {
  const candidatePaths = [
    path.join(__dirname, 'prerendered-static.json'),
    path.join(__dirname, '../dist/prerendered-static.json'),
    path.join(process.cwd(), 'dist/prerendered-static.json'),
    path.join(process.cwd(), 'utils/prerendered-static.json')
  ];
  for (const c of candidatePaths) {
    if (fs.existsSync(c)) {
      try {
        return JSON.parse(fs.readFileSync(c, 'utf8'));
      } catch (e) {}
    }
  }
  return {};
}

const SITE_URL = routesManifest.siteUrl || 'https://beadsandbloom.in';
const STATIC_PAGE_CONFIGS = routesManifest.staticRoutes;
const PRIVATE_ROUTES = routesManifest.privateRoutes;

// Helper to escape HTML attributes to prevent XSS and broken tags (used ONLY in HTML tags)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Product title: "<Product Name> | Beads and Bloom", dropped when exceeding ~60 chars
function formatProductTitle(name) {
  if (!name) return 'Handcrafted Juttis | Beads and Bloom';
  const withBrand = `${name} | Beads and Bloom`;
  if (withBrand.length <= 60) {
    return withBrand;
  }
  return name;
}

// Breadcrumb Schema Generator
function getBreadcrumbsSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`
    }))
  };
}

// Product Schema Generator (Real SKU, all gallery images, real stock availability, NO shipping/return claims)
function getProductSchema(product) {
  const totalStock = product.totalStock !== undefined 
    ? product.totalStock 
    : (Array.isArray(product.stock) ? product.stock.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0);
  const inStock = totalStock > 0;

  const imageList = [];
  if (product.image) imageList.push(product.image);
  if (Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img && !imageList.includes(img)) imageList.push(img);
    });
  }
  const images = imageList.length > 0 ? imageList : [`${SITE_URL}/logo.png`];
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const realSku = product.sku && String(product.sku).trim() ? String(product.sku).trim() : String(product.slug);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description || `Handcrafted ${product.name} with pure leather soles by Beads and Bloom.`,
    sku: realSku,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Beads and Bloom'
    },
    category: 'Traditional Footwear > Juttis & Mojaris',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Beads and Bloom'
      }
    }
  };

  // Only add aggregateRating if real, visible reviews exist on the product
  if (product.numReviews > 0 && Array.isArray(product.reviews) && product.reviews.length > 0 && product.rating > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: product.numReviews,
      bestRating: '5',
      worstRating: '1'
    };
  }

  const breadcrumbs = getBreadcrumbsSchema([
    { name: 'Home', url: '/' },
    { name: 'The Collection', url: '/shop' },
    { name: product.name, url: productUrl }
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbs, productSchema]
  };
}

// Homepage Schema Generator (Organization + WebSite with SearchAction)
function getHomeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Beads and Bloom',
        alternateName: ['Beads & Bloom', 'Beads and Bloom India'],
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: 'Luxury handcrafted Punjabi juttis, bridal mojris & festive footwear with genuine leather soles and dual-density memory foam cushioning.',
        email: 'connect@beadsandbloom.in',
        sameAs: ['https://www.instagram.com/beadsnbloom.india'],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'connect@beadsandbloom.in',
          availableLanguage: ['English', 'Hindi', 'Punjabi']
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Beads and Bloom',
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/shop?keyword={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
}

// Collection Page Schema Generator (Uses clean collection displayName, never full page title)
function getCollectionSchema(displayName, description, canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbsSchema([
        { name: 'Home', url: '/' },
        { name: displayName, url: canonicalUrl }
      ]),
      {
        '@type': 'CollectionPage',
        name: displayName,
        description: description,
        url: canonicalUrl
      }
    ]
  };
}

// Generic Content Page Schema Generator
function getContentPageSchema(displayName, description, canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbsSchema([
        { name: 'Home', url: '/' },
        { name: displayName, url: canonicalUrl }
      ]),
      {
        '@type': 'WebPage',
        name: displayName,
        description: description,
        url: canonicalUrl
      }
    ]
  };
}

/**
 * Injects head tags and JSON-LD schema into raw index.html
 */
function injectMetaTags(rawHtml, { title, description, canonical, ogImage, ogUrl, noindex = false, schema = null, preloadImage = null }) {
  let html = rawHtml;

  // Clean up any stray meta name="title"
  html = html.replace(/<meta\s+name=["']title["'][^>]*>\s*/gi, '');

  // 1. Title tag replacement
  const cleanTitle = escapeHtml(title);
  if (/<title>.*?<\/title>/i.test(html)) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${cleanTitle}</title>`);
  } else {
    html = html.replace('</head>', `<title>${cleanTitle}</title>\n</head>`);
  }

  // 2. Meta Description replacement
  const cleanDesc = escapeHtml(description);
  if (html.includes('name="description"')) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${cleanDesc}" />`);
  } else if (cleanDesc) {
    html = html.replace('</head>', `<meta name="description" content="${cleanDesc}" />\n</head>`);
  }

  // 3. Canonical Tag replacement
  if (canonical) {
    const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonical)}" />`;
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
    } else {
      html = html.replace('</head>', `${canonicalTag}\n</head>`);
    }
  }

  // 4. Robots directive (noindex for private/404 routes, index for public)
  const robotsDirective = noindex
    ? '<meta name="robots" content="noindex, nofollow" />'
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />';
  if (html.includes('name="robots"')) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, robotsDirective);
  } else {
    html = html.replace('</head>', `${robotsDirective}\n</head>`);
  }

  // 5. Open Graph & Twitter Tags (Clean replacement without duplicating or leaving template logo.png)
  const targetOgUrl = ogUrl || canonical || SITE_URL;
  const targetOgImage = ogImage || `${SITE_URL}/logo.png`;

  // OG tags
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${cleanTitle}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${cleanDesc}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${escapeHtml(targetOgUrl)}" />`);
  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${escapeHtml(targetOgImage)}" />`);

  // Twitter tags (standardized to name="twitter:...")
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${cleanTitle}" />`);
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${cleanDesc}" />`);
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${escapeHtml(targetOgUrl)}" />`);
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(targetOgImage)}" />`);

  // 6. JSON-LD Structured Data injection (Pure JSON escaping, escaping '<' to '\u003c')
  if (schema) {
    const jsonEscaped = JSON.stringify(schema, null, 2).replace(/</g, '\\u003c');
    const schemaScript = `\n<script type="application/ld+json" id="route-schema-jsonld">\n${jsonEscaped}\n</script>\n`;
    if (html.includes('id="route-schema-jsonld"')) {
      html = html.replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']route-schema-jsonld["']>[\s\S]*?<\/script>/i, schemaScript);
    } else {
      html = html.replace('</head>', `${schemaScript}</head>`);
    }
  }

  // 7. Search Engine Verification Tags (Bing & Google)
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification-token';
  const bingVerification = process.env.BING_SITE_VERIFICATION || 'BING_VERIFICATION_TOKEN';
  if (!html.includes('name="google-site-verification"')) {
    html = html.replace('</head>', `<meta name="google-site-verification" content="${googleVerification}" />\n</head>`);
  }
  if (!html.includes('name="msvalidate.01"')) {
    html = html.replace('</head>', `<meta name="msvalidate.01" content="${bingVerification}" />\n</head>`);
  }

  // 8. LCP Image Preload with ImageKit transformations, srcset and sizes
  if (preloadImage && preloadImage.href) {
    const preloadTag = `<link rel="preload" as="image" href="${escapeHtml(preloadImage.href)}"${preloadImage.imagesrcset ? ` imagesrcset="${escapeHtml(preloadImage.imagesrcset)}"` : ''}${preloadImage.imagesizes ? ` imagesizes="${escapeHtml(preloadImage.imagesizes)}"` : ''} fetchpriority="high" />`;
    if (html.includes('rel="preload" as="image"') || html.includes('as="image" rel="preload"')) {
      html = html.replace(/<link\s+[^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*\/?>/i, preloadTag);
    } else {
      html = html.replace('</head>', `${preloadTag}\n</head>`);
    }
  } else {
    // Clean up any default template banner preload if current route does not use it
    html = html.replace(/<link\s+[^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*\/?>\s*/gi, '');
  }

  return html;
}

/**
 * Injects semantic SSR markup into <div id="root">
 */
function injectRootHtml(html, innerRootHtml) {
  if (!innerRootHtml) return html;
  return html.replace(/<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i, `<div id="root">${innerRootHtml}</div>`);
}

/**
 * Main SEO request processor for Express fallback
 */
async function processSeoRoute(reqPath, rawHtml) {
  const normalizedPath = reqPath.toLowerCase().replace(/\/+$/, '') || '/';

  // 1. Check if Private / Utility Route (Cart, Checkout, Admin, Profile, Auth)
  const isPrivate = PRIVATE_ROUTES.some(prefix => 
    normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
  );

  if (isPrivate) {
    const html = injectMetaTags(rawHtml, {
      title: 'Beads and Bloom',
      description: '',
      canonical: `${SITE_URL}${normalizedPath}`,
      noindex: true,
      schema: null
    });
    return {
      statusCode: 200,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
      html,
      lastModified: '2026-10-26T12:00:00.000Z'
    };
  }

  // 2. Check Static Known Routes
  if (STATIC_PAGE_CONFIGS[normalizedPath]) {
    const cacheKey = `seo_static_${normalizedPath}`;
    const cachedData = seoCache.get(cacheKey);
    if (cachedData) {
      return {
        statusCode: 200,
        headers: { 'X-Cache': 'HIT' },
        html: cachedData.html,
        lastModified: cachedData.lastModified || '2026-10-26T12:00:00.000Z'
      };
    }

    const config = STATIC_PAGE_CONFIGS[normalizedPath];
    let schema = null;
    let innerRootHtml = '';
    const displayName = config.displayName || config.title.split('—')[0].split('|')[0].trim();
    let preloadImage = null;

    try {
      if (normalizedPath === '/') {
        schema = getHomeSchema();
        const [siteContent, featuredProducts] = await Promise.all([
          SiteContent.findOne().lean(),
          Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).limit(4).lean()
        ]);
        innerRootHtml = renderHomeRoot(siteContent, featuredProducts);
        const heroImage = siteContent?.heroSlides?.[0]?.image || 'https://ik.imagekit.io/hiteshh12/editorial/banner1_7npLvX_g6.png';
        preloadImage = {
          href: getOptimizedImageUrl(heroImage, 1200),
          imagesrcset: getImageSrcSet(heroImage, [480, 768, 1200, 1600]),
          imagesizes: '100vw'
        };
      } else if (normalizedPath === '/shop' || normalizedPath === '/sale') {
        schema = getCollectionSchema(displayName, config.description, config.canonical);
        const products = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).lean();
        innerRootHtml = renderShopRoot(products);
        if (products.length > 0 && products[0].image) {
          preloadImage = {
            href: getOptimizedImageUrl(products[0].image, 600),
            imagesrcset: getImageSrcSet(products[0].image, [360, 480, 600, 800]),
            imagesizes: '(max-width: 768px) 50vw, 25vw'
          };
        }
      } else if (normalizedPath.startsWith('/collection/')) {
        schema = getCollectionSchema(displayName, config.description, config.canonical);
        let categoryQuery = /bridal/i;
        if (normalizedPath.includes('festive')) categoryQuery = /festive|party/i;
        if (normalizedPath.includes('casual')) categoryQuery = /casual|everyday|office/i;

        const products = await Product.find({ isActive: { $ne: false }, category: categoryQuery }).sort({ createdAt: -1 }).lean();
        innerRootHtml = renderCollectionRoot(displayName, config.description, products);
        if (products.length > 0 && products[0].image) {
          preloadImage = {
            href: getOptimizedImageUrl(products[0].image, 600),
            imagesrcset: getImageSrcSet(products[0].image, [360, 480, 600, 800]),
            imagesizes: '(max-width: 768px) 50vw, 25vw'
          };
        }
      } else if (normalizedPath === '/about') {
        schema = getContentPageSchema(displayName, config.description, config.canonical);
        const siteContent = await SiteContent.findOne().lean();
        innerRootHtml = renderAboutRoot(siteContent?.aboutContent || {});
      } else {
        schema = getContentPageSchema(displayName, config.description, config.canonical);
        const staticSnapshots = getPrerenderedStatic();
        innerRootHtml = staticSnapshots[normalizedPath] || '';
      }
    } catch (err) {
      console.error(`Error generating #root HTML for ${normalizedPath}:`, err.message);
    }

    let html = injectMetaTags(rawHtml, {
      title: config.title,
      description: config.description,
      canonical: config.canonical,
      noindex: false,
      schema,
      preloadImage
    });

    if (innerRootHtml) {
      html = injectRootHtml(html, innerRootHtml);
    }

    const payload = {
      html,
      lastModified: '2026-10-26T12:00:00.000Z'
    };
    seoCache.set(cacheKey, payload);

    return {
      statusCode: 200,
      headers: { 'X-Cache': 'MISS' },
      html,
      lastModified: payload.lastModified
    };
  }

  // 3. Check Dynamic Product Route (/product/:slug)
  if (normalizedPath.startsWith('/product/')) {
    const slug = normalizedPath.replace('/product/', '').trim();
    if (!slug) {
      return getNotFoundResponse(rawHtml);
    }

    // Check Cache
    const cacheKey = `seo_product_${slug}`;
    const cachedData = seoCache.get(cacheKey);
    if (cachedData) {
      if (cachedData.redirect) {
        return { statusCode: 301, redirectUrl: cachedData.redirect };
      }
      return {
        statusCode: 200,
        headers: { 'X-Cache': 'HIT' },
        html: cachedData.html,
        lastModified: cachedData.lastModified || '2026-10-26T12:00:00.000Z'
      };
    }

    try {
      // Find current product
      const product = await Product.findOne({ slug }).lean();
      if (product) {
        const title = formatProductTitle(product.name);
        const description = product.description 
          ? `Shop ${product.name}. Handcrafted Indian jutti with pure leather soles & double-cushioned comfort in EU sizes 36-41.`
          : `Handcrafted ${product.name} with pure leather soles by Beads and Bloom.`;
        const canonical = `${SITE_URL}/product/${product.slug}`;
        const ogImage = product.images?.[0] || product.image || `${SITE_URL}/logo.png`;
        const schema = getProductSchema(product);
        const lastModified = product.updatedAt ? product.updatedAt.toISOString() : '2026-10-26T12:00:00.000Z';

        const lcpImage = product.images?.[0] || product.image;
        const preloadImage = lcpImage ? {
          href: getOptimizedImageUrl(lcpImage, 600),
          imagesrcset: getImageSrcSet(lcpImage, [360, 600, 900, 1200]),
          imagesizes: '(max-width: 768px) 100vw, 600px'
        } : null;

        let html = injectMetaTags(rawHtml, {
          title,
          description,
          canonical,
          ogImage,
          ogUrl: canonical,
          noindex: false,
          schema,
          lastModified,
          preloadImage
        });

        // Inject semantic product markup into #root
        const innerRootHtml = renderProductRoot(product);
        html = injectRootHtml(html, innerRootHtml);

        const seoPayload = {
          html,
          lastModified
        };

        seoCache.set(cacheKey, seoPayload);

        return {
          statusCode: 200,
          headers: { 'X-Cache': 'MISS' },
          html,
          lastModified
        };
      }

      // Check for Old Slug Alias
      const oldProduct = await Product.findOne({ oldSlugs: slug }, 'slug').lean();
      if (oldProduct && oldProduct.slug) {
        const redirectUrl = `/product/${oldProduct.slug}`;
        seoCache.set(cacheKey, { redirect: redirectUrl }, 86400); // Cache redirect 24h
        return {
          statusCode: 301,
          redirectUrl
        };
      }

      // Product Not Found
      return getNotFoundResponse(rawHtml);
    } catch (err) {
      console.error('SEO Product Lookup Error:', err);
      return getNotFoundResponse(rawHtml);
    }
  }

  // 4. Default: Unknown Path -> Return HTTP 404 with SPA shell & noindex
  return getNotFoundResponse(rawHtml);
}

function getNotFoundResponse(rawHtml) {
  const html = injectMetaTags(rawHtml, {
    title: 'Page Not Found | Beads and Bloom',
    description: 'The requested page could not be found.',
    canonical: null,
    noindex: true,
    schema: null
  });
  return {
    statusCode: 404,
    headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    html,
    lastModified: '2026-10-26T12:00:00.000Z'
  };
}

// Function to clear SEO cache on product/collection mutations
function flushSeoCache() {
  seoCache.flushAll();
}

module.exports = {
  processSeoRoute,
  flushSeoCache,
  STATIC_PAGE_CONFIGS,
  PRIVATE_ROUTES,
  escapeHtml,
  formatProductTitle
};
