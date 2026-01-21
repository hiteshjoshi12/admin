import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionTiles from './components/CollectionTiles';
import BestSellers from './components/BestSellers';
import BrandStory from './components/BrandStory';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';

function App() {
  return (
    // No more <SmoothScroll> wrapper
    <>
      <Navbar />
      <main>
        <Hero />
        <CollectionTiles />
        <BestSellers />
        <BrandStory />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}

export default App;