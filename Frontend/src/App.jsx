import { Suspense, lazy } from 'react'; // 1. Import Suspense and lazy
import { Routes, Route } from 'react-router-dom';

// Keep Layout components static (so the header/footer appear instantly)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import PrivateRoute from './components/PrivateRoute';

// 2. Lazy Load all Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const SizeChart = lazy(() => import('./pages/SizeChart'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Cart = lazy(() => import('./pages/Cart'));
const Sale = lazy(() => import('./pages/Sale'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));

// 3. Create a nice Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* 4. Wrap Routes in Suspense */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Home Page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/size-chart" element={<SizeChart />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Shop Pages */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* --- PROTECTED ROUTES --- */}
            <Route element={<PrivateRoute />}>
               <Route path="/profile" element={<Profile />} />
               <Route path="/myorders" element={<MyOrders />} />
               <Route path="/order/:id" element={<OrderDetails />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;