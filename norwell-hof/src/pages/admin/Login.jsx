// src/pages/admin/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser } from '../../firebase/auth';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: signInError } = await signInUser(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else if (user) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-norwell-blue to-blue-700 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-norwell-gold rounded-full mb-4">
            <LogIn className="w-8 h-8 text-norwell-blue" />
          </div>
          <h2 className="text-3xl font-bold text-norwell-blue">Admin Login</h2>
          <p className="text-gray-600 mt-2">Norwell Hall of Fame</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              placeholder="admin@norwellhof.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-norwell-blue text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            For access issues, contact the site administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;