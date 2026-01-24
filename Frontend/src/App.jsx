import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import About from './pages/About'; // Import the new page
import Terms from './pages/Terms';
import SizeChart from './pages/SizeChart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Sale from './pages/Sale';
import Checkout from './pages/Checkout';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* New About Page */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/size-chart" element={<SizeChart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/sale" element={<Sale />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* --- PROTECTED ROUTES --- */}
        <Route element={<PrivateRoute />}>
           <Route path="/profile" element={<Profile />} />
           <Route path="/myorders" element={<MyOrders />} />
           {/* Add Checkout Page here later */}
        </Route>

          
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;