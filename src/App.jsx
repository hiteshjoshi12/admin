import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import About from './pages/About'; // Import the new page

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* New About Page */}
          <Route path="/about" element={<About />} />
          
          {/* Placeholder for Shop (optional) */}
          <Route path="/shop" element={<div className="pt-32 text-center">Shop Page Coming Soon</div>} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;