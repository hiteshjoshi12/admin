import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { setCart } from '../redux/cartSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- STATE ---
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // Get Auth State & Local Cart
  const { loading, error, userInfo } = useSelector((state) => state.auth);
  const { items: localCart } = useSelector((state) => state.cart);

  // Redirect based on role
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin/dashboard'); // Admins go here
      } else {
        navigate('/'); // Customers go here (or '/shop' if you prefer)
      }
    }
  }, [userInfo, navigate]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(login({ 
      email: formData.email, 
      password: formData.password, 
      localCart // Sending cart to backend for merging
    })).then((result) => {
      // If login successful and backend returned a merged cart, update Redux immediately
      if (result.payload && result.payload.cart) {
        dispatch(setCart(result.payload.cart));
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-white pt-20">
      
      {/* --- LEFT: IMAGE SECTION --- */}
      <div className="hidden lg:block w-1/2 relative bg-[#F9F8F6]">
        <img 
          src="https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_500/v1769075057/IMG_1050_bt6gdf.jpg" 
          alt="Luxury Footwear" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-12 left-12 text-white p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl max-w-sm animate-fade-up">
           <p className="font-serif text-2xl mb-2">"Elegance is not standing out, but being remembered."</p>
           <p className="text-xs uppercase tracking-widest opacity-80">— Giorgio Armani</p>
        </div>
      </div>

      {/* --- RIGHT: FORM SECTION --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative">
        <div className="w-full max-w-md animate-fade-up">
          
          <div className="mb-10">
            <h1 className="text-4xl font-serif text-[#1C1917] mb-3">Welcome Back</h1>
            <p className="text-gray-500">
              New to Beads & Bloom? <Link to="/signup" className="text-[#FF2865] font-bold hover:underline">Create an account</Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F9F8F6] border-0 rounded-xl px-12 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-[#FF2865]">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F9F8F6] border-0 rounded-xl px-12 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1C1917] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FF2865] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}