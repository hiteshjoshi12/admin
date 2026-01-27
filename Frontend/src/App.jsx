// import { Suspense, lazy } from 'react'; 
// import { Routes, Route, Outlet } from 'react-router-dom';

// // 1. Keep Static Imports (Critical Components)
// import AdminRoute from './components/AdminRoute'; // Security guard shouldn't be lazy
// import ChatWidget from './components/ChatWidget';
// import PrivateRoute from './components/PrivateRoute';

// // Layouts (We import these to wrap specific sections)
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Inventory from './pages/admin/Inventory';

// // 2. Lazy Load User Pages
// const HomePage = lazy(() => import('./pages/HomePage'));
// const About = lazy(() => import('./pages/About'));
// const Terms = lazy(() => import('./pages/Terms'));
// const SizeChart = lazy(() => import('./pages/SizeChart'));
// const Contact = lazy(() => import('./pages/Contact'));
// const Login = lazy(() => import('./pages/Login'));
// const Signup = lazy(() => import('./pages/Signup'));
// const Cart = lazy(() => import('./pages/Cart'));
// const Sale = lazy(() => import('./pages/Sale'));
// const Checkout = lazy(() => import('./pages/Checkout'));
// const Shop = lazy(() => import('./pages/Shop'));
// const ProductDetail = lazy(() => import('./pages/ProductDetail'));
// const Profile = lazy(() => import('./pages/Profile'));
// const MyOrders = lazy(() => import('./pages/MyOrders'));
// const OrderDetails = lazy(() => import('./pages/OrderDetails'));
// const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
// const ResetPassword = lazy(() => import('./pages/ResetPassword'));



// // 3. Lazy Load Admin Pages (NEW)
// const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
// const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
// const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
// const CMS = lazy(() => import('./pages/admin/CMS'));
// const Orders = lazy(() => import('./pages/admin/Orders'));
// const AdminOrderDetails = lazy(() => import('./pages/admin/OrderDetails'));
// const Customers = lazy(() => import('./pages/admin/Customers'));
// const Reviews = lazy(() => import('./pages/admin/Reviews'));
// const Offers = lazy(() => import('./pages/admin/Offers'));


// // 4. Loading Fallback
// const PageLoader = () => (
//   <div className="min-h-[60vh] flex items-center justify-center">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
//   </div>
// );

// // 5. Create a "Public Layout" Component
// // This wrapper ensures Navbar/Footer ONLY show on customer pages, not Admin pages.
// const PublicLayout = () => (
//   <>
//     <Navbar />
//     <main>
//       <Outlet /> {/* This renders the child route (HomePage, Shop, etc.) */}
//     </main>
//     <Footer />
//     <ChatWidget />
//   </>
// );

// function App() {
//   return (
//     <Suspense fallback={<PageLoader />}>
//       <Routes>
        
//         {/* --- SECTION A: ADMIN ROUTES (No Public Navbar/Footer) --- */}
//         <Route path="/admin" element={<AdminRoute />}>
//            <Route element={<AdminLayout />}>
//               <Route path="dashboard" element={<DashboardHome />} />
//               <Route path="product/add" element={<ProductForm />} />
//               <Route path="product/edit/:id" element={<ProductForm />} />
//               {/* Placeholders for future admin pages */}
//               <Route path="products" element={<Inventory />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="order/:id" element={<AdminOrderDetails />} />
//               <Route path="cms" element={<CMS />} />
//               <Route path="customers" element={<Customers />} />
//               <Route path="reviews" element={<Reviews />} />
//               <Route path="offers" element={<Offers />} />
//            </Route>
//         </Route>

//         {/* --- SECTION B: PUBLIC ROUTES (Wrapped in Navbar/Footer) --- */}
//         <Route element={<PublicLayout />}>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/resetpassword/:token" element={<ResetPassword />} />
            
//             {/* Static Pages */}
//             <Route path="/about" element={<About />} />
//             <Route path="/terms" element={<Terms />} />
//             <Route path="/size-chart" element={<SizeChart />} />
//             <Route path="/contact" element={<Contact />} />
            
//             {/* Shop Pages */}
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/sale" element={<Sale />} />
//             <Route path="/shop" element={<Shop />} />
//             <Route path="/product/:id" element={<ProductDetail />} />

//             {/* User Protected Routes */}
//             <Route element={<PrivateRoute />}>
//                <Route path="/profile" element={<Profile />} />
//                <Route path="/myorders" element={<MyOrders />} />
//                <Route path="/order/:id" element={<OrderDetails />} />
//             </Route>
//         </Route>

//       </Routes>
//     </Suspense>
//   );
// }

// export default App;





import { Suspense, lazy, useEffect } from 'react'; 
import { Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { syncCartToBackend } from './redux/cartSlice';

// 1. Keep Static Imports (Critical Components)
import AdminRoute from './components/AdminRoute'; 
import ChatWidget from './components/ChatWidget';
import PrivateRoute from './components/PrivateRoute';

// Layouts 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inventory from './pages/admin/Inventory';

// 2. Lazy Load User Pages
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

// 3. Lazy Load Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const CMS = lazy(() => import('./pages/admin/CMS'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const AdminOrderDetails = lazy(() => import('./pages/admin/OrderDetails'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));
const Offers = lazy(() => import('./pages/admin/Offers'));

// 4. Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
  </div>
);

// 5. Create a "Public Layout" Component
const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet /> 
    </main>
    <Footer />
    <ChatWidget />
  </>
);

function App() {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // --- CART PERSISTENCE LOGIC ---
  useEffect(() => {
    // Only sync if user is logged in
    if (userInfo) {
      // Debounce: Wait 1 second after last change before saving
      const timer = setTimeout(() => {
        dispatch(syncCartToBackend(cartItems));
      }, 1000);

      // Cleanup timer if cart changes again quickly
      return () => clearTimeout(timer);
    }
  }, [cartItems, userInfo, dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        
        {/* --- SECTION A: ADMIN ROUTES --- */}
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

        {/* --- SECTION B: PUBLIC ROUTES --- */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/track-order" element={<TrackOrder />} />
            
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

            {/* User Protected Routes */}
            <Route element={<PrivateRoute />}>
               <Route path="/profile" element={<Profile />} />
               <Route path="/myorders" element={<MyOrders />} />
               <Route path="/order/:id" element={<OrderDetails />} />
            </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}

export default App;