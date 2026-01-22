import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function Login() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex bg-white pt-20">
      
      {/* --- LEFT: IMAGE SECTION (Hidden on mobile) --- */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required 
                  className="w-full bg-[#F9F8F6] border-0 rounded-xl px-12 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                <a href="#" className="text-xs text-gray-400 hover:text-[#FF2865]">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required 
                  className="w-full bg-[#F9F8F6] border-0 rounded-xl px-12 py-4 text-[#1C1917] focus:ring-2 focus:ring-[#FF2865]/20 focus:bg-white transition-all outline-none" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1C1917] text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#FF2865] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}