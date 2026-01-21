import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionTiles from './components/CollectionTiles';
import BestSellers from './components/BestSellers';
import BrandStory from './components/BrandStory';
import InstagramFeed from './components/InstagramFeed'; // <--- Import
import Footer from './components/Footer';               // <--- Import
import SmoothScroll from './components/SmoothScroll';

function App() {
  return (
    <SmoothScroll>
      <Navbar />
      <main>
        <Hero />
        <CollectionTiles />
        <BestSellers />
        <BrandStory />
        <InstagramFeed /> {/* <--- Add */}
      </main>
      <Footer />          {/* <--- Add */}
    </SmoothScroll>
  );
}

export default App;