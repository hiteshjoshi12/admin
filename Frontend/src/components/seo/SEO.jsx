import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://beadsandbloom.in';
const DEFAULT_TITLE = 'Handcrafted Juttis & Ethnic Footwear | Beads and Bloom';
const DEFAULT_DESCRIPTION =
  'Shop exquisite handcrafted juttis at Beads and Bloom. Discover unique bridal mojris, casual ethnic flats, and traditional footwear crafted for comfort and style.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

/**
 * Reusable SEO & Metadata Component for React 19 + Vite
 * Handles:
 * - Dynamic document title
 * - Meta descriptions & keywords
 * - Self-referencing Canonical URLs
 * - Robots directives (index/noindex)
 * - Open Graph and Twitter Card tags
 * - JSON-LD Structured Data injection
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  robots = 'index, follow',
  keywords,
  schema,
}) {
  const location = useLocation();

  // Determine absolute canonical URL
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${SITE_URL}${canonical}`
    : `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`;

  // Ensure title contains brand suffix if not already present
  const fullTitle = title
    ? title.includes('Beads and Bloom') || title.includes('Beads & Bloom')
      ? title
      : `${title} | Beads and Bloom`
    : DEFAULT_TITLE;

  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  // DOM Synchronizer for client-side navigation
  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to set or create a meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to set or create a link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Synchronize Core Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', robots);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setLinkTag('canonical', canonicalUrl);

    // 3. Open Graph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:site_name', 'Beads and Bloom');

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);
    setMetaTag('name', 'twitter:url', canonicalUrl);

    // 5. JSON-LD Structured Data
    const SCRIPT_ID = 'route-schema-jsonld';
    let scriptEl = document.getElementById(SCRIPT_ID);

    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = SCRIPT_ID;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema, null, 2);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Optional cleanup on route change
    };
  }, [fullTitle, description, canonicalUrl, type, fullImageUrl, robots, keywords, schema]);

  return (
    <>
      {/* React 19 Native Head Hoisting */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Beads and Bloom" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* JSON-LD for React 19 render */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
