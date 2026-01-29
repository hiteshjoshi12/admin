import React, { Suspense, lazy } from "react";

// --- 1. CRITICAL IMPORTS (Load Immediately) ---
// These are "Above the Fold". We want them to show up instantly.
import Hero from "../components/HomePage/Hero";
import FeaturedOffers from "../components/FeaturedOffers";

// --- 2. LAZY IMPORTS (Load on Demand) ---
// These are "Below the Fold". The browser downloads them in the background 
// while the user is looking at the Hero. This makes the initial load super fast.
const CollectionTiles = lazy(() => import("../components/HomePage/CollectionTiles"));
const BestSellers = lazy(() => import("../components/HomePage/BestSellers"));
const VideoShowcase = lazy(() => import("../components/HomePage/VideoShowcase"));
const BrandStory = lazy(() => import("../components/HomePage/BrandStory"));
const InstagramFeed = lazy(() => import("../components/HomePage/InstagramFeed"));

// --- 3. LOADING SKELETONS ---
// We use the skeletons you already built as placeholders
import { 
  GridSkeleton, 
  BestSellerSkeleton, 
  VideoScrollSkeleton, 
  InstagramSkeleton 
} from "../components/loaders/SectionLoader";

// A generic spacer for sections without specific skeletons (like BrandStory)
const SectionSpacer = () => <div className="h-96 w-full bg-[#F9F8F6] animate-pulse" />;

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Load Instantly */}
      <Hero />
      <FeaturedOffers />

      {/* Load in Background */}
      <Suspense fallback={<div className="py-24 px-4"><GridSkeleton count={3} type="arch"/></div>}>
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

      <Suspense fallback={<InstagramSkeleton />}>
        <InstagramFeed />
      </Suspense>
    </div>
  );
};

export default HomePage;