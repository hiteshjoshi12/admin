import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionTiles from './components/CollectionTiles';
import BestSellers from './components/BestSellers';
import BrandStory from './components/BrandStory';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';
import VideoShowcase from './components/VideoShowcase';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    // No more <SmoothScroll> wrapper
    <>
      <Navbar />
      <main>
        <Hero />
        <CollectionTiles />
        <BestSellers />
        <VideoShowcase />
        <BrandStory />
        <InstagramFeed />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;