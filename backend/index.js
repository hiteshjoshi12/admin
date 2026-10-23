require('dotenv').config();
const compression = require('compression');
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db.js');
const enableCors = require('./config/cors.js');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const bestSellerRoutes = require('./routes/bestSellerRoutes');
const collectionRoutes = require('./routes/collectionRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');
const contentRoutes = require('./routes/contentRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const coupons = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); 
const uploadRoutes = require('./routes/uploadRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(compression());
enableCors(app);
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Database Connection
connectDB();

// Global API Rate Limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/', sitemapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/bestsellers', bestSellerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/coupons', coupons);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

const fs = require('fs');

// --- STATIC ASSETS & REACT CLIENT ROUTING ---

const distPath = path.join(__dirname, 'dist');

// Serve static assets from the 'dist' directory
app.use(express.static(distPath, {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SEO Injection Configuration for /collection/festive
const FESTIVE_INJECTION = {
  title: 'Buy Festive Juttis Online — Handcrafted Party Wear Mojris | Beads and Bloom',
  description: 'Shop luxury handcrafted festive juttis & party wear mojris at Beads and Bloom. Featuring authentic mirror work (sheesha), zardozi, dabka & double-cushioned memory foam soles. Cash on delivery & express shipping across India.',
  canonical: 'https://beadsandbloom.in/collection/festive',
  keywords: 'buy festive juttis online, festive juttis, party wear mojris, sangeet footwear, punjabi juttis for women, mirror work juttis, comfortable wedding flats, ethnic mojari India, haldi footwear, mehendi juttis',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'The Festive Edit — Handcrafted Festive Juttis & Sangeet Mojris',
        description: 'Celebrate India\'s most joyous moments in handcrafted splendor. Discover our festive jutti collection featuring authentic mirror work (sheesha), zardozi, dabka wire, and double-padded memory foam comfort.',
        url: 'https://beadsandbloom.in/collection/festive',
        isPartOf: { '@id': 'https://beadsandbloom.in/#website' },
        provider: { '@id': 'https://beadsandbloom.in/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://beadsandbloom.in/' },
          { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://beadsandbloom.in/shop' },
          { '@type': 'ListItem', position: 3, name: 'Festive Juttis', item: 'https://beadsandbloom.in/collection/festive' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Why are Beads & Bloom festive juttis the best choice for wedding sangeets and dancing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Unlike mass-produced ethnic shoes that cause painful blisters and sole stiffness, Beads & Bloom festive juttis are engineered with our signature dual-layer memory foam footbed and soft vegetable-tanned genuine leather linings. Our flexible genuine leather soles absorb impact during high-energy dance routines, ensuring 10+ hours of continuous, bite-free comfort through Sangeet performances, Baraat processions, and all-night celebrations.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I choose between mirror work, zardozi, and resham threadwork juttis for my outfit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'For evening sangeets and cocktail events, mirror work (sheesha) and metallic sequins catch ambient lighting and chandeliers brilliantly. For royal wedding ceremonies, pheras, and Anand Karaj, traditional antique gold dabka and zardozi embroidery provide timeless Mughal elegance. For daytime events like Haldi, Mehendi, or festive brunches, cheerful resham threadwork, gota patti, and bright mustard or pastel silks offer a radiant, breathable touch.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will the heavy embroidery or mirror work snag my delicate lehenga or saree hemline?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Every Beads & Bloom pair undergoes a meticulous finishing process where master artisans tuck, polish, and burnish metallic wires, sitara sequins, and cut-dana edges. The embroidery is securely anchored onto raw silk or micro-velvet, ensuring a smooth exterior surface that will not catch, pull, or tear fine organza, raw silk, or georgette lehenga hemlines.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I select my ideal size if I have broad feet or fall between sizes?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our festive juttis are crafted to true Indian standard sizing (EU 36 to 41). Handcrafted pure leather juttis naturally soften and contour to the unique shape of your feet within 15–30 minutes of wear. If you have wide feet or fall between sizes, we recommend ordering one size up for a relaxed fit, or consulting our Size Chart. You can also message our sizing concierge via WhatsApp for personalized guidance.',
            },
          },
          {
            '@type': 'Question',
            name: 'How should I clean, store, and maintain embroidered festive juttis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'To preserve genuine leather soles and delicate hand embroidery, always dry clean only. Gently wipe dust with a dry muslin cloth or a soft-bristled brush. Avoid submerging in water or wearing in wet weather. Store each jutti wrapped individually in our breathable cotton dust bags with silica gel pouches to maintain shape and protect metallic zari from oxidation.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the delivery times and Cash on Delivery (COD) options for upcoming festivals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We offer Cash on Delivery (COD) across India, alongside UPI, Net Banking, and Credit/Debit cards. Standard domestic transit takes 3 to 7 business days, with expedited 2 to 3-day express dispatch available for metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad). We also ship internationally to the USA, UK, Canada, Australia, and the UAE.',
            },
          },
        ],
      },
    ],
  },
  noscriptBody: `
    <noscript>
      <div style="font-family: serif; max-width: 1200px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #1C1917;">
        <h1>Handcrafted Festive Juttis & Party Wear Mojris — The Festive Edit</h1>
        <p>Celebrate India’s most joyous moments in handcrafted splendor. At Beads & Bloom, our festive jutti collection is born from an obsession with authentic Indian karigari and modern comfort. Every pair is individually hand-embroidered by master artisans in Punjab using genuine raw silks, plush micro-velvet, metallic zardozi cords, dabka wires, sitara sequins, and authentic sheesha mirror work. Unlike conventional ethnic shoes that pinch and bite after an hour, our festive mojris are engineered with our signature dual-layer memory foam footbed and 100% genuine vegetable-tanned leather soles. Whether you are leading a high-octane Sangeet performance, attending a sundowner Mehendi, celebrating Diwali with family, or dancing through wedding pheras, step into all-day bite-free luxury designed to keep you shining from dusk till dawn.</p>
        
        <h2>Festive Footwear Occasions & Styling Guide</h2>
        <ul>
          <li><strong>Sangeet & Dance Floor Nights:</strong> High-impact mirror work (sheesha) and dual-padded comfort engineered to dance non-stop. Featured pairs: Noor-e-Aaina, Fuchsia Raqs, Sitara Lattice.</li>
          <li><strong>Haldi, Mehendi & Daytime Ceremonies:</strong> Cheerful mustard yellow silks, resham threadwork, and phulkari motifs that complement floral jewelry. Featured pairs: Peela Sitara, Peacock Blush, Neel Pari.</li>
          <li><strong>Diwali & Evening Galas:</strong> Rich micro-velvets in emerald, ruby, and midnight navy adorned with antique tilla and bronze zari. Featured pairs: Ruby Heritage, Sheesh Noir, Cobalt Sheesh.</li>
          <li><strong>Pheras & Wedding Receptions:</strong> Heirloom Mughal dabka wire, faux river pearls, and champagne tissue fabrics that glide smoothly against fine lehenga hems. Featured pairs: Tajvira Royale, Champagne Zeenat, Noorani Dabka.</li>
        </ul>

        <h2>The Anatomy of a Beads & Bloom Festive Jutti</h2>
        <p>1. <strong>Lustrous Silks & Micro-Velvets:</strong> Heavyweight raw silk, dupion, and plush micro-velvet bases selected for structural strength and rich color fastness.</p>
        <p>2. <strong>20+ Hours of Hand Karigari:</strong> Intricately hand-stitched by generational Punjabi artisans with dabka, sitara, cut-dana, and real sheesha mirrors.</p>
        <p>3. <strong>Dual-Layer Memory Foam:</strong> High-density shock absorption base paired with contouring memory foam upper eliminates ball-of-foot pressure and heel pain.</p>
        <p>4. <strong>100% Genuine Leather Soles:</strong> Vegetable-tanned pure leather that breathes naturally and conforms to your individual foot contour.</p>

        <h2>Frequently Asked Questions About Festive Juttis</h2>
        <h3>Why are Beads & Bloom festive juttis the best choice for wedding sangeets and dancing?</h3>
        <p>Unlike mass-produced ethnic shoes that cause painful blisters and sole stiffness, Beads & Bloom festive juttis are engineered with our signature dual-layer memory foam footbed and soft vegetable-tanned genuine leather linings. Our flexible genuine leather soles absorb impact during high-energy dance routines, ensuring 10+ hours of continuous, bite-free comfort through Sangeet performances, Baraat processions, and all-night celebrations.</p>
        
        <h3>Will the heavy embroidery or mirror work snag my delicate lehenga or saree hemline?</h3>
        <p>No. Every Beads & Bloom pair undergoes a meticulous finishing process where master artisans tuck, polish, and burnish metallic wires, sitara sequins, and cut-dana edges. The embroidery is securely anchored onto raw silk or micro-velvet, ensuring a smooth exterior surface that will not catch, pull, or tear fine organza, raw silk, or georgette lehenga hemlines.</p>

        <h3>How do I select my ideal size if I have broad feet or fall between sizes?</h3>
        <p>Our festive juttis are crafted to true Indian standard sizing (EU 36 to 41). Handcrafted pure leather juttis naturally soften and contour to the unique shape of your feet within 15–30 minutes of wear. If you have wide feet or fall between sizes, we recommend ordering one size up for a relaxed fit, or consulting our Size Chart.</p>

        <h2>Curated Handcrafted Footwear Collections</h2>
        <p><a href="/collection/bridal">The Bridal Edit (Wedding Mojris)</a> | <a href="/collection/casual">Everyday Chic (Casual Flats)</a> | <a href="/shop">Shop All Handcrafted Juttis</a> | <a href="/size-chart">Jutti Size Guide</a> | <a href="/care-guide">Embroidered Jutti Care Guide</a></p>
      </div>
    </noscript>
  `
};

// SEO Injection Configuration for /about
const ABOUT_INJECTION = {
  title: 'Our Story & Artisan Heritage — Handcrafted Luxury Juttis | Beads & Bloom',
  description: 'Discover Beads & Bloom. Explore our comprehensive brand story, Punjab artisan heritage, orthopedic dual-density memory foam soles, and ethical craftsmanship behind our luxury juttis.',
  canonical: 'https://beadsandbloom.in/about',
  keywords: 'beads and bloom story, handcrafted juttis india, punjabi jutti craft, bridal jutti makers, double padded juttis, memory foam ethnic footwear, ethical artisan fashion India, genuine leather mojri',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'Our Story & Artisan Heritage — Beads & Bloom',
        url: 'https://beadsandbloom.in/about',
        description: 'Handcrafted luxury Punjabi juttis rooted in artisan heritage with worldwide delivery. Engineered with double memory foam cushioning and 100% genuine leather soles.',
        mainEntity: {
          '@type': 'Organization',
          name: 'Beads & Bloom',
          url: 'https://beadsandbloom.in',
          logo: 'https://beadsandbloom.in/favicon.ico',
          description: 'Artisanal Indian luxury footwear brand specializing in handcrafted Punjabi juttis, bridal mojris, and festive footwear engineered with orthopedic dual memory foam comfort.',
          foundingDate: '2023',
          founders: [
            {
              '@type': 'Person',
              name: 'Hitesh Joshi',
              jobTitle: 'Founder & Creative Director'
            }
          ],
          sameAs: [
            'https://www.instagram.com/beadsnbloom.india'
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://beadsandbloom.in/' },
          { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://beadsandbloom.in/about' },
        ],
      }
    ],
  },
  noscriptBody: `
    <noscript>
      <div style="font-family: serif; max-width: 1200px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #1C1917;">
        <h1>Our Story & Artisan Heritage — Beads & Bloom Handcrafted Luxury Footwear</h1>
        <p>Born from a passion to preserve authentic Indian needlecraft while solving the age-old problem of painful ethnic footwear, Beads & Bloom engineers heirloom Punjabi juttis with pure leather soles and double-cushioned orthopedic comfort. For decades, wearing traditional ethnic footwear meant enduring painful shoe bites, stiff cardboard soles, and blisters after just an hour on the dance floor. We set out to change this without losing the soul of the craft. We paired centuries-old dabka, zardozi, and authentic sheesha mirror work with modern orthopedic footbed engineering—giving every woman the freedom to celebrate India’s most joyous weddings, sangeets, and galas in pure, uncompromised comfort.</p>
        
        <h2>The Anatomy of Beads & Bloom Craftsmanship</h2>
        <ul>
          <li><strong>Generational Punjabi Needlecraft:</strong> Every pair is individually hand-embroidered by master karigars in Punjab using authentic dabka wire, sitara sequins, resham threadwork, and genuine sheesha mirrors.</li>
          <li><strong>Dual-Layer Memory Foam Footbed:</strong> An orthotic-grade high-density base absorbs impact while an ultra-plush memory foam topper contours to the foot, ensuring 10+ hours of continuous dance floor comfort without shoe bites.</li>
          <li><strong>100% Vegetable-Tanned Leather Soles:</strong> Cut, shaped, and buffed by hand, our pure leather soles soften and adapt uniquely to your stride without toxic chemicals or stiff synthetic boards.</li>
          <li><strong>Snag-Free Lehenga Protection:</strong> Needlework wire ends, cutdana crystals, and sitara sequins are hand-burnished and tucked to ensure a silky smooth exterior that will never snag fine lehenga hemlines.</li>
        </ul>

        <h2>Our Core Values & Ethical Commitments</h2>
        <p><strong>Artisan Welfare:</strong> Direct livelihood support, dignified wages, and preserving India’s intangible cultural craft heritage in artisan clusters across Punjab.</p>
        <p><strong>Slow, Heirloom Fashion:</strong> Designed to transcend transient micro-trends and become cherished keepsakes passed down through family celebrations.</p>
        <p><strong>Plastic-Conscious Packaging:</strong> Breathable cotton drawstring dust bags and recyclable protective packaging that protect fine metallic zari embroidery.</p>

        <h2>Worldwide Delivery & Shopping Confidence</h2>
        <p>We deliver nationwide across India with Cash on Delivery (COD) and express shipping. We also deliver internationally to the USA, UK, Canada, Australia, UAE, Europe, and over 18+ countries worldwide.</p>
        
        <h2>Curated Footwear Collections</h2>
        <p><a href="/collection/festive">The Festive Edit (Party Wear Mojris)</a> | <a href="/collection/bridal">The Bridal Edit (Wedding Juttis)</a> | <a href="/collection/casual">Everyday Chic (Work Flats)</a> | <a href="/shop">Complete Catalog</a></p>
      </div>
    </noscript>
  `
};

const getIndexHtml = () => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, 'utf8');
  }
  return null;
};

// Fallback for React Router (handles root '/', client subpaths, and prevents overriding /api)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  // Guard against missing assets/scripts returning index.html as text/html
  if (
    req.path.startsWith('/assets/') || 
    /\.(js|mjs|css|png|jpg|jpeg|gif|webp|svg|ico|json|map|woff|woff2|ttf|eot)$/i.test(req.path)
  ) {
    return res.status(404).type('text/plain').send('Asset not found');
  }

  // Prevent intermediate proxies (LiteSpeed, Cloudflare, Caddy) and browsers from caching SPA shell HTML
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const rawHtml = getIndexHtml();
  if (!rawHtml) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }

  const normalizedPath = req.path.toLowerCase().replace(/\/$/, '');

  // Dynamic SSR & SEO Injection for /collection/festive
  if (normalizedPath === '/collection/festive') {
    let html = rawHtml;

    // 1. Set Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${FESTIVE_INJECTION.title}</title>`);
    
    // 2. Set Meta Description
    if (html.includes('name="description"')) {
      html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${FESTIVE_INJECTION.description}" />`);
    } else {
      html = html.replace('</head>', `<meta name="description" content="${FESTIVE_INJECTION.description}" />\n</head>`);
    }

    // 3. Set Canonical URL
    const canonicalTag = `<link rel="canonical" href="${FESTIVE_INJECTION.canonical}" />`;
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/i, canonicalTag);
    } else {
      html = html.replace('</head>', `${canonicalTag}\n</head>`);
    }

    // 4. Set Open Graph & Twitter Tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${FESTIVE_INJECTION.title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${FESTIVE_INJECTION.description}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${FESTIVE_INJECTION.canonical}" />`);

    // 5. Inject Structured Data JSON-LD
    const schemaScript = `\n<script type="application/ld+json" id="server-injected-schema">\n${JSON.stringify(FESTIVE_INJECTION.schema, null, 2)}\n</script>\n`;
    html = html.replace('</head>', `${schemaScript}</head>`);

    // 6. Inject Semantic NoScript Content for Crawlers
    html = html.replace('</body>', `${FESTIVE_INJECTION.noscriptBody}\n</body>`);

    return res.type('html').send(html);
  }

  // Dynamic SSR & SEO Injection for /about (Comprehensive Brand Story & E-E-A-T)
  if (normalizedPath === '/about') {
    let html = rawHtml;

    // 1. Set Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${ABOUT_INJECTION.title}</title>`);
    
    // 2. Set Meta Description
    if (html.includes('name="description"')) {
      html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${ABOUT_INJECTION.description}" />`);
    } else {
      html = html.replace('</head>', `<meta name="description" content="${ABOUT_INJECTION.description}" />\n</head>`);
    }

    // 3. Set Canonical URL
    const canonicalTag = `<link rel="canonical" href="${ABOUT_INJECTION.canonical}" />`;
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/i, canonicalTag);
    } else {
      html = html.replace('</head>', `${canonicalTag}\n</head>`);
    }

    // 4. Set Open Graph & Twitter Tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${ABOUT_INJECTION.title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${ABOUT_INJECTION.description}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${ABOUT_INJECTION.canonical}" />`);

    // 5. Inject Structured Data JSON-LD
    const schemaScript = `\n<script type="application/ld+json" id="server-injected-about-schema">\n${JSON.stringify(ABOUT_INJECTION.schema, null, 2)}\n</script>\n`;
    html = html.replace('</head>', `${schemaScript}</head>`);

    // 6. Inject Semantic NoScript Content for Crawlers
    html = html.replace('</body>', `${ABOUT_INJECTION.noscriptBody}\n</body>`);

    return res.type('html').send(html);
  }

  // General self-referencing canonical tag for other routes
  let genericHtml = rawHtml;
  const canonicalUrl = `https://beadsandbloom.in${normalizedPath === '' ? '/' : normalizedPath}`;
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (genericHtml.includes('rel="canonical"')) {
    genericHtml = genericHtml.replace(/<link rel="canonical" href=".*?" \/>/i, canonicalTag);
  } else {
    genericHtml = genericHtml.replace('</head>', `${canonicalTag}\n</head>`);
  }

  res.type('html').send(genericHtml);
});

// Export app
module.exports = app;

// Listen on Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require('dotenv').config();
// const compression = require('compression');
// const express = require('express');
// const path = require('path'); // Added for production pathing
// const { connectDB } = require('./config/db.js');
// const enableCors = require('./config/cors.js');

// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const userRoutes = require('./routes/userRoutes');
// const bestSellerRoutes = require('./routes/bestSellerRoutes');
// const collectionRoutes = require('./routes/collectionRoutes'); 
// const reviewRoutes = require('./routes/reviewRoutes');
// const contentRoutes = require('./routes/contentRoutes');
// const cmsRoutes = require('./routes/cmsRoutes');
// const coupons = require('./routes/couponRoutes');
// const wishlistRoutes = require('./routes/wishlistRoutes'); 
// const uploadRoutes = require('./routes/uploadRoutes');
// const sitemapRoutes = require('./routes/sitemapRoutes');
// const contactRoutes = require('./routes/contactRoutes');


// const app = express();

// // Middleware
// app.use(compression());
// enableCors(app);
// app.use(express.json());

// // Database Connection
// connectDB()

// // API Routes
// app.use('/', sitemapRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/bestsellers', bestSellerRoutes);
// app.use('/api/collections', collectionRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/content', contentRoutes);
// app.use('/api/cms', cmsRoutes);
// app.use('/api/coupons', coupons);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/contact', contactRoutes);

// // --- MILESWEB PRODUCTION CONFIGURATION ---

// if (process.env.NODE_ENV === 'production') {
//     // 1. Serve static files from 'dist' ONLY in production
//     app.use(express.static(path.join(__dirname, 'dist')));

//     // 2. Handle React routing
//     // NEW WAY (Correct for modern Express)
// // ✅ Correct syntax for Express 5.x catch-all
// app.get(/^(?!\/api).+/, (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });
// } else {
//     // 3. Optional: Add a simple message for local dev testing
//     app.get('/', (req, res) => {
//         res.send('API is running in development mode. Start your React dev server separately.');
//     });
// }

// // ✅ EXPORT APP (Required for some environments like Vercel)
// module.exports = app;

// // ✅ LISTEN ON PORT (Required for MilesWeb/cPanel Passenger)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));