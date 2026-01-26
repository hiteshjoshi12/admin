import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'; // Added Eye/EyeOff Icons
import { setCart } from '../redux/cartSlice';

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Get the current guest cart items
  const { items: localCart } = useSelector((state) => state.cart);

  // --- STATE ---
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // <--- NEW STATE
  
  // Get Auth State
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  // Redirect if logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/shop');
    }
  }, [userInfo, navigate]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 2. Dispatch register with localCart
    dispatch(register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      localCart 
    })).then((res) => {
       // 3. If registration succeeded and backend returned a cart, update Redux
       if(res.payload && res.payload.cart) {
           dispatch(setCart(res.payload.cart));
       }
    });
  };

  return (
    <div className="min-h-screen flex bg-white pt-24">
      
      {/* --- LEFT: FORM SECTION --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative">
        <div className="w-full max-w-md animate-fade-up">
          
          <div className="mb-10">
            <span className="text-[#FF2865] text-xs font-bold uppercase tracking-[0.3em] mb-2 block">Join the Family</span>
            <h1 className="text-4xl font-serif text-[#1C1917] mb-3">Create Account</h1>
            <p className="text-gray-500">
              Already a member? <Link to="/login" className="text-[#FF2865] font-bold hover:underline">Sign in</Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F9F8F6] border-0 rounded-xl px-12 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                  placeholder="Jane Doe"
                />
              </div>
            </div>

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
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} // <--- TOGGLE TYPE
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F9F8F6] border-0 rounded-xl px-12 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                  placeholder="••••••••"
                />
                {/* --- EYE ICON TOGGLE --- */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1C1917] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <input type="checkbox" id="terms" required className="mt-1 accent-[#FF2865]" />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to the <Link to="/terms" className="underline hover:text-[#FF2865]">Terms of Service</Link> and <Link to="/terms" className="underline hover:text-[#FF2865]">Privacy Policy</Link>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1C1917] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FF2865] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>

        </div>
      </div>

      {/* --- RIGHT: IMAGE SECTION --- */}
      <div className="hidden lg:block w-1/2 relative bg-[#F9F8F6]">
        <img 
          src="https://res.cloudinary.com/dtnyrvshf/image/upload/f_auto,q_auto,w_600/v1769071597/IMG_0279_l2cibn.jpg" 
          alt="Fashion Details" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

    </div>
  );
}