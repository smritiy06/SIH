import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { registerUser } from '../services/authService';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cream-50 dark:bg-night-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 card p-8 sm:p-10 animate-fade-in-up">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-cream-100 dark:bg-night-200">
            <User className="h-6 w-6 text-forest-700 dark:text-accent-500" />
          </div>
          <h2 className="mt-6 font-serif text-3xl font-bold text-charcoal-900 dark:text-night-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-charcoal-700/60 dark:text-night-500">
            Join TravelMate to save trips and personalized itineraries.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-charcoal-700/40 dark:text-night-500" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-charcoal-700/40 dark:text-night-500" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-charcoal-700/40 dark:text-night-500" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-charcoal-700/40 dark:text-night-500" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Sign Up'} <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
          
          <div className="text-center text-sm text-charcoal-700/60 dark:text-night-500 pt-4">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-forest-700 dark:text-accent-500 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
