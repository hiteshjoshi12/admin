import React from "react";
import Hero from "../components/HomePage/Hero";
import CollectionTiles from "../components/HomePage/CollectionTiles";
import BestSellers from "../components/HomePage/BestSellers";
import VideoShowcase from "../components/HomePage/VideoShowcase";
import BrandStory from "../components/HomePage/BrandStory";
import InstagramFeed from "../components/HomePage/InstagramFeed";
import FeaturedOffers from "../components/FeaturedOffers";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedOffers />
      <CollectionTiles />
      <BestSellers />
      <VideoShowcase />
      <BrandStory />
      <InstagramFeed />
    </div>
  );
};

export default HomePage;
