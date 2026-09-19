import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import localforage from 'localforage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await localforage.getItem('user');
        if (savedUser) setUser(savedUser);
      } catch (err) {
        console.error('Error loading user:', err);
      }
    };
    loadUser();
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Plan a Trip', path: '/plan' },
    { name: 'My Trips', path: '/dashboard' },
    { name: 'Safety', path: '/safety' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 dark:bg-night-50/95 backdrop-blur-sm border-b border-black/[0.06] dark:border-night-200 sticky top-0 z-50">
      <div className="section-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <svg className="h-8 w-8 text-forest-700 dark:text-accent-500" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2L6 18h6l-2 12 12-16h-6l4-12z" />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-charcoal-900 dark:text-night-900 leading-tight">TravelMate</span>
              <span className="text-[10px] text-charcoal-700/50 dark:text-night-500 font-medium tracking-wider uppercase leading-tight hidden sm:block">Explore India. Together.</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-forest-700 dark:text-accent-500'
                    : 'text-charcoal-700/70 dark:text-night-600 hover:text-charcoal-900 dark:hover:text-night-800'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="block h-0.5 bg-forest-700 dark:bg-accent-500 mt-0.5 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Day/Night Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-full bg-cream-100 dark:bg-night-200 text-charcoal-700 dark:text-night-700 hover:bg-cream-200 dark:hover:bg-night-300 transition-all duration-300"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative w-5 h-5">
                <Sun className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <Moon className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </div>
            </button>

            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-100 dark:bg-night-200">
                <User className="h-4 w-4 text-forest-700 dark:text-accent-500" />
                <span className="text-sm font-medium text-charcoal-800 dark:text-night-700 capitalize">{user.name}</span>
              </div>
            ) : (
              <Link to="/signin" className="btn-outline dark:border-night-300 dark:text-night-700 dark:hover:bg-night-200">Sign In</Link>
            )}
            <Link to="/plan" className="btn-primary">Plan a Trip</Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-cream-100 dark:bg-night-200 text-charcoal-700 dark:text-night-700 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-charcoal-700 dark:text-night-700"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-night-50 border-t border-black/[0.06] dark:border-night-200 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                isActive('/') ? 'bg-accent-50 dark:bg-night-200 text-forest-700 dark:text-accent-500' : 'text-charcoal-700 dark:text-night-600 hover:bg-cream-100 dark:hover:bg-night-100'
              }`}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path) ? 'bg-accent-50 dark:bg-night-200 text-forest-700 dark:text-accent-500' : 'text-charcoal-700 dark:text-night-600 hover:bg-cream-100 dark:hover:bg-night-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-black/[0.06] dark:border-night-200 mt-3 space-y-2">
              {user ? (
                <div className="flex items-center gap-2 px-4 py-3">
                  <User className="h-5 w-5 text-forest-700 dark:text-accent-500" />
                  <span className="text-sm font-medium text-charcoal-800 dark:text-night-700 capitalize">{user.name}</span>
                </div>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="btn-outline w-full justify-center"
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/plan"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Plan a Trip
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
