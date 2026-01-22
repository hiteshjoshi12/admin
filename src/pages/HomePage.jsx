import React from "react";
import Hero from "../components/Hero";
import CollectionTiles from "../components/CollectionTiles";
import BestSellers from "../components/BestSellers";
import VideoShowcase from "../components/VideoShowcase";
import BrandStory from "../components/BrandStory";
import InstagramFeed from "../components/InstagramFeed";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <CollectionTiles />
      <BestSellers />
      <VideoShowcase />
      <BrandStory />
      <InstagramFeed />
    </div>
  );
};

export default HomePage;
