import React, { Suspense, lazy } from "react";
import SEO from "../components/seo/SEO";
import { getOrganizationSchema, getWebSiteSchema, getStoreSchema, getFAQSchema } from "../components/seo/schemaUtils";

// --- 1. CRITICAL IMPORTS (Load Immediately Above the Fold) ---
import Hero from "../components/HomePage/HeroNew";
import EditorialBanner from "../components/HomePage/EditorialBanner";
import { FAQ_DATA } from "../data/faqData";

// --- 2. LAZY IMPORTS (Loaded On Demand to Preserve Fast TBT and PageSpeed) ---
const CollectionTiles = lazy(() => import("../components/HomePage/CollectionTiles"));
const CraftAnatomy = lazy(() => import("../components/HomePage/CraftAnatomy"));
const BestSellers = lazy(() => import("../components/HomePage/BestSellers"));
const FeaturedOffers = lazy(() => import("../components/FeaturedOffers"));
const OccasionLookbook = lazy(() => import("../components/HomePage/OccasionLookbook"));
const VideoShowcase = lazy(() => import("../components/HomePage/VideoShowcase"));
const BrandStory = lazy(() => import("../components/HomePage/BrandStory"));
const StoreTrustFAQ = lazy(() => import("../components/HomePage/StoreTrustFAQ"));
const InstagramFeed = lazy(() => import("../components/HomePage/InstagramFeed"));

// --- 3. LOADING SKELETONS ---
import {
  GridSkeleton,
  BestSellerSkeleton,
  VideoScrollSkeleton,
  InstagramSkeleton
} from "../components/loaders/SectionLoader";

const SectionSpacer = () => <div className="h-96 w-full bg-[#FAF8F5] animate-pulse" />;

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
        title="Handcrafted Punjabi Juttis | Luxury Bridal, Festive & Casual Mojaris - Beads and Bloom"
        description="Discover luxury handcrafted Punjabi juttis, bridal mojris & festive footwear at Beads and Bloom. Pure leather soles, double-cushioned comfort, worldwide shipping & Cash on Delivery (COD) available."
        canonical="/"
        keywords="handcrafted juttis, bridal juttis, punjabi juttis online, festive footwear, wedding mojris, casual juttis, beads and bloom, cash on delivery juttis, worldwide shipping juttis"
        schema={homeSchema}
      />

      {/* 1. Cinematic Hero Showcase */}
      <Hero />

      {/* 2. Editorial Hallmarks Ribbon */}
      <EditorialBanner />

      {/* 3. Arch Category Portals */}
      <Suspense fallback={<div className="py-24 px-4"><GridSkeleton count={3} type="arch" /></div>}>
        <CollectionTiles />
      </Suspense>

      {/* 4. Artisanal Architecture: The Anatomy of a Handcrafted Jutti (Rich Images) */}
      <Suspense fallback={<SectionSpacer />}>
        <CraftAnatomy />
      </Suspense>

      {/* 5. Best Sellers Spotlight */}
      <Suspense fallback={<div className="py-24 px-4"><BestSellerSkeleton /></div>}>
        <BestSellers />
      </Suspense>

      {/* 6. Curated Occasion Lookbook (Rich Imagery for Wedding & Festive Styling) */}
      <Suspense fallback={<SectionSpacer />}>
        <OccasionLookbook />
      </Suspense>

      {/* 7. Limited Atelier Privileges & Offers */}
      <Suspense fallback={<div className="h-48 w-full bg-[#FAF8F5]" />}>
        <FeaturedOffers />
      </Suspense>

      {/* 8. Runway Motion Video Showcase */}
      <Suspense fallback={<VideoScrollSkeleton />}>
        <VideoShowcase />
      </Suspense>

      {/* 9. The Atelier Heritage Story (Editorial Dual-Photo Layout) */}
      <Suspense fallback={<SectionSpacer />}>
        <BrandStory />
      </Suspense>

      {/* 10. Frequently Asked Questions & Information */}
      <Suspense fallback={<SectionSpacer />}>
        <StoreTrustFAQ />
      </Suspense>

      {/* 11. Social Journal & Real Bride Community */}
      <Suspense fallback={<InstagramSkeleton />}>
        <InstagramFeed />
      </Suspense>
    </div>
  );
};

export default HomePage;