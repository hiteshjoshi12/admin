import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../util/config';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Invalid or expired token');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-[#1C1917] mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">Create a new secure password.</p>
        </div>

        {message ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF2865]/20 text-[#1C1917]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F9F8F6] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF2865]/20 text-[#1C1917]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#FF2865] transition-all disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}