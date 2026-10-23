/**
 * Schema Generators for Beads and Bloom
 * Compliant with Schema.org & Google Rich Results guidelines
 */

export const SITE_URL = 'https://beadsandbloom.in';

export const getStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  '@id': `${SITE_URL}/#store`,
  name: 'Beads and Bloom — Handcrafted Juttis & Ethnic Footwear',
  image: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  email: 'connect@beadsandbloom.in',
  priceRange: '₹₹',
  paymentAccepted: ['Cash on Delivery', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
  currenciesAccepted: 'INR',
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Handcrafted Juttis Collection',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Bridal & Wedding Juttis',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Festive & Party Wear Juttis',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Casual & Everyday Chic Juttis',
      },
    ],
  },
});

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Beads and Bloom',
  alternateName: ['Beads & Bloom', 'Beads and Bloom India'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    caption: 'Beads and Bloom Handcrafted Juttis',
  },
  description:
    'Artisanal luxury footwear label specializing in handcrafted Indian juttis, bridal mojris, and embroidered ethnic footwear blending heritage Punjabi craftsmanship with modern double-cushioned comfort.',
  email: 'connect@beadsandbloom.in',
  sameAs: [
    'https://www.instagram.com/beadsnbloom.india',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'connect@beadsandbloom.in',
    availableLanguage: ['English', 'Hindi', 'Punjabi'],
  },
});

export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Beads and Bloom',
  url: SITE_URL,
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/shop?keyword={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const getBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
  })),
});

export const getProductSchema = (product) => {
  if (!product) return null;

  const inStock = product.totalStock > 0;
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}/${imageUrl}`) : `${SITE_URL}/logo.png`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [fullImageUrl],
    description: product.description || `Handcrafted ${product.name} ethnic jutti with double-cushioned comfort by Beads and Bloom.`,
    sku: product._id || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Beads and Bloom',
    },
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
        name: 'Beads and Bloom',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 2,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price >= 4999 ? '0' : '100',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
    },
  };

  if (product.numReviews > 0 && product.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.numReviews,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
};

export const getCollectionSchema = (title, description, url) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: title,
  description: description,
  url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
  isPartOf: {
    '@id': `${SITE_URL}/#website`,
  },
  provider: {
    '@id': `${SITE_URL}/#organization`,
  },
});

export const getFAQSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (faqs || []).map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getItemListSchema = (items, name = 'Handcrafted Festive Juttis Collection') => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/product/${item.slug}`,
    name: item.name,
    ...(item.price ? {
      offers: {
        '@type': 'Offer',
        price: item.price,
        priceCurrency: 'INR',
        availability: item.totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      }
    } : {}),
  })),
});

