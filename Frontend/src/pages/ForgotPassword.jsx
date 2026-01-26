import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../util/config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Email not found');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-[#1C1917] mb-2">Forgot Password?</h1>
          <p className="text-gray-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Check your email</h3>
            <p className="text-gray-500 text-sm mb-6">We have sent a password reset link to <strong>{email}</strong>.</p>
            <Link to="/login" className="text-[#FF2865] font-bold text-sm hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF2865]/20 text-[#1C1917]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Sending...' : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-gray-400 hover:text-gray-600 text-xs font-bold flex items-center justify-center gap-2">
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}