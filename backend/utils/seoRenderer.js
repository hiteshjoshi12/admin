const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const Product = require('../models/Product');
const routesManifest = require('./routesManifest.json');

// In-memory cache for dynamic SEO lookups (TTL 5 minutes)
const seoCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const SITE_URL = routesManifest.siteUrl || 'https://beadsandbloom.in';
const STATIC_PAGE_CONFIGS = routesManifest.staticRoutes;
const PRIVATE_ROUTES = routesManifest.privateRoutes;

// Helper to escape HTML attributes to prevent XSS and broken tags
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

// Product Schema Generator (Strictly omitting MerchantReturnPolicy due to no-refund policy)
function getProductSchema(product) {
  const inStock = Array.isArray(product.stock)
    ? product.stock.reduce((acc, item) => acc + (item.quantity || 0), 0) > 0
    : true;

  const imageList = [];
  if (product.image) imageList.push(product.image);
  if (Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img && !imageList.includes(img)) imageList.push(img);
    });
  }
  const images = imageList.length > 0 ? imageList : [`${SITE_URL}/logo.png`];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description || `Handcrafted ${product.name} ethnic jutti with pure leather soles by Beads and Bloom.`,
    sku: String(product._id || product.slug),
    brand: {
      '@type': 'Brand',
      name: 'Beads and Bloom'
    },
    category: 'Clothing > Shoes > Traditional Footwear > Juttis & Mojaris',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Beads and Bloom'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price >= 4999 ? '0' : '100',
          currency: 'INR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      }
    }
  };

  if (product.numReviews > 0 && product.rating > 0) {
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
    { name: 'Shop', url: '/shop' },
    { name: product.name, url: `/product/${product.slug}` }
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
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
          caption: 'Beads and Bloom Handcrafted Juttis'
        },
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

// Collection Page Schema Generator
function getCollectionSchema(title, description, canonicalUrl) {
  const shortName = title.split('—')[0].replace('The ', '').trim();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbsSchema([
        { name: 'Home', url: '/' },
        { name: shortName, url: canonicalUrl }
      ]),
      {
        '@type': 'CollectionPage',
        name: title,
        description: description,
        url: canonicalUrl
      }
    ]
  };
}

// Generic Content Page Schema Generator
function getContentPageSchema(title, description, canonicalUrl) {
  const shortName = title.split('—')[0].split('|')[0].trim();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbsSchema([
        { name: 'Home', url: '/' },
        { name: shortName, url: canonicalUrl }
      ]),
      {
        '@type': 'WebPage',
        name: title,
        description: description,
        url: canonicalUrl
      }
    ]
  };
}

/**
 * Injects head tags and JSON-LD schema into raw index.html
 */
function injectMetaTags(rawHtml, { title, description, canonical, ogImage, ogUrl, noindex = false, schema = null }) {
  let html = rawHtml;

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

  // 5. Open Graph & Twitter Tags
  const targetOgUrl = ogUrl || canonical || SITE_URL;
  const targetOgImage = ogImage || `${SITE_URL}/logo.png`;

  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${cleanTitle}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${cleanDesc}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${escapeHtml(targetOgUrl)}" />`);
  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${escapeHtml(targetOgImage)}" />`);

  html = html.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${cleanTitle}" />`);
  html = html.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${cleanDesc}" />`);
  html = html.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${escapeHtml(targetOgUrl)}" />`);
  html = html.replace(/<meta\s+property=["']twitter:image["'][^>]*>/i, `<meta property="twitter:image" content="${escapeHtml(targetOgImage)}" />`);

  // 6. JSON-LD Structured Data injection into head
  if (schema) {
    const schemaScript = `\n<script type="application/ld+json" id="route-schema-jsonld">\n${JSON.stringify(schema, null, 2)}\n</script>\n`;
    if (html.includes('id="route-schema-jsonld"')) {
      html = html.replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']route-schema-jsonld["']>[\s\S]*?<\/script>/i, schemaScript);
    } else {
      html = html.replace('</head>', `${schemaScript}</head>`);
    }
  }

  return html;
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
      html
    };
  }

  // 2. Check Static Known Routes
  if (STATIC_PAGE_CONFIGS[normalizedPath]) {
    const config = STATIC_PAGE_CONFIGS[normalizedPath];
    let schema = null;
    if (normalizedPath === '/') {
      schema = getHomeSchema();
    } else if (normalizedPath.startsWith('/collection/') || normalizedPath === '/shop' || normalizedPath === '/sale') {
      schema = getCollectionSchema(config.title, config.description, config.canonical);
    } else {
      schema = getContentPageSchema(config.title, config.description, config.canonical);
    }

    const html = injectMetaTags(rawHtml, {
      title: config.title,
      description: config.description,
      canonical: config.canonical,
      noindex: false,
      schema
    });
    return {
      statusCode: 200,
      headers: {},
      html
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
        headers: {},
        html: injectMetaTags(rawHtml, cachedData)
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

        const seoPayload = {
          title,
          description,
          canonical,
          ogImage,
          ogUrl: canonical,
          noindex: false,
          schema
        };

        seoCache.set(cacheKey, seoPayload);

        return {
          statusCode: 200,
          headers: {},
          html: injectMetaTags(rawHtml, seoPayload)
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
    html
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
