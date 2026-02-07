import { Suspense, lazy, useEffect } from 'react'; 
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { syncCartToBackend } from './redux/cartSlice';
import { fetchWishlist } from './redux/wishlistSlice'; // 1. Import fetchWishlist Action
import { Toaster } from 'react-hot-toast';

// ... (Your Static Imports for Admin, Components, Layouts) ...
import AdminRoute from './components/AdminRoute'; 
import ChatWidget from './components/ChatWidget';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inventory from './pages/admin/Inventory';

// ... (Your Lazy Imports) ...
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
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const NotFound = lazy(() => import('./pages/NotFound')); 
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const CMS = lazy(() => import('./pages/admin/CMS'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const AdminOrderDetails = lazy(() => import('./pages/admin/OrderDetails'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));
const Offers = lazy(() => import('./pages/admin/Offers'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Collection = lazy(() => import('./pages/Collection'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen"> <Outlet /> </main>
    <Footer />
    <ChatWidget />
  </>
);

function App() {
  const dispatch = useDispatch();
  // 1. Get Cart & Auth State
  const { items: cartItems, isDirty } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // 2. Fetch Wishlist on Login
    if (userInfo) {
       dispatch(fetchWishlist());
    }

    // 3. 🚦 DIRTY FLAG GUARD (Sync Cart) 🚦
    // "Only sync if the User changed something (isDirty)"
    if (userInfo && isDirty) {
      const timer = setTimeout(() => {
        dispatch(syncCartToBackend(cartItems));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, userInfo, isDirty, dispatch]); 

  return (
    <Suspense fallback={<PageLoader />}>
      <Toaster position="top-center" reverseOrder={false} /> 
      <ScrollToTop /> 
      <Routes>
        <Route path="/admin" element={<AdminRoute />}>
           <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="product/add" element={<ProductForm />} />
              <Route path="product/edit/:id" element={<ProductForm />} />
              <Route path="products" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="order/:id" element={<AdminOrderDetails />} />
              <Route path="cms" element={<CMS />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="offers" element={<Offers />} />
           </Route>
        </Route>
        <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/size-chart" element={<SizeChart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/collection/:category" element={<Collection />} />
            
            <Route element={<PrivateRoute />}>
               <Route path="/profile" element={<Profile />} />
               <Route path="/myorders" element={<MyOrders />} />
               <Route path="/order/:id" element={<OrderDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;