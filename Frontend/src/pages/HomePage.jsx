import React, { Suspense, lazy } from "react";
import SEO from "../components/seo/SEO";
import { getOrganizationSchema, getWebSiteSchema, getStoreSchema, getFAQSchema } from "../components/seo/schemaUtils";

// --- 1. CRITICAL IMPORTS (Load Immediately) ---
// These are "Above the Fold". We want them to show up instantly.
import Hero from "../components/HomePage/HeroNew";
import FeaturedOffers from "../components/FeaturedOffers";
import StoreTrustFAQ, { FAQ_DATA } from "../components/HomePage/StoreTrustFAQ";

// --- 2. LAZY IMPORTS (Load on Demand) ---
const CollectionTiles = lazy(() => import("../components/HomePage/CollectionTiles"));
const BestSellers = lazy(() => import("../components/HomePage/BestSellers"));
const VideoShowcase = lazy(() => import("../components/HomePage/VideoShowcase"));
const BrandStory = lazy(() => import("../components/HomePage/BrandStory"));
const InstagramFeed = lazy(() => import("../components/HomePage/InstagramFeed"));

// --- 3. LOADING SKELETONS ---
import {
  GridSkeleton,
  BestSellerSkeleton,
  VideoScrollSkeleton,
  InstagramSkeleton
} from "../components/loaders/SectionLoader";

// A generic spacer for sections without specific skeletons (like BrandStory)
const SectionSpacer = () => <div className="h-96 w-full bg-[#F9F8F6] animate-pulse" />;

const HomePage = () => {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getStoreSchema(),
      getOrganizationSchema(),
      getWebSiteSchema(),
      getFAQSchema(FAQ_DATA)
    ]
  };

  return (
    <div className="bg-white">
      <SEO
        title="Handcrafted Juttis | Bridal, Festive & Casual | Store in Gurgaon - Beads and Bloom"
        description="Discover luxury handcrafted Punjabi juttis, bridal mojris & festive footwear at Beads and Bloom. Visit our store in Sector 15, Gurgaon. Worldwide shipping & Cash on Delivery (COD) available."
        canonical="/"
        keywords="handcrafted juttis, bridal juttis gurgaon, punjabi jutti sector 15 gurgaon, jutti store gurgaon, festive footwear, wedding mojris, casual juttis, beads and bloom, cash on delivery juttis, worldwide shipping juttis, punjabi juttis online"
        schema={homeSchema}
      />
      {/* Load Instantly */}
      <Hero />
      <FeaturedOffers />

      {/* Load in Background */}
      <Suspense fallback={<div className="py-24 px-4"><GridSkeleton count={3} type="arch" /></div>}>
        <CollectionTiles />
      </Suspense>

      <Suspense fallback={<div className="py-24 px-4"><BestSellerSkeleton /></div>}>
        <BestSellers />
      </Suspense>

      <Suspense fallback={<VideoScrollSkeleton />}>
        <VideoShowcase />
      </Suspense>

      <Suspense fallback={<SectionSpacer />}>
        <BrandStory />
      </Suspense>

      <StoreTrustFAQ />

      <Suspense fallback={<InstagramSkeleton />}>
        <InstagramFeed />
      </Suspense>
    </div>
  );
};

export default HomePage;