import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 dark:bg-night-50 text-white/70 dark:text-night-500 mt-auto border-t border-transparent dark:border-night-200">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg className="h-7 w-7 text-accent-500" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2L6 18h6l-2 12 12-16h-6l4-12z" />
              </svg>
              <span className="font-serif font-bold text-lg text-white dark:text-night-800">TravelMate</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 dark:text-night-500">
              Your companion for exploring the beauty of India. Plan trips, find stays, discover food, and travel safely.
            </p>
          </div>
          <div>
            <h4 className="font-sans font-semibold text-white dark:text-night-700 text-sm uppercase tracking-wider mb-4">Discover</h4>
            <div className="space-y-2.5">
              <Link to="/explore" className="block text-sm hover:text-white dark:hover:text-night-800 transition-colors">Explore India</Link>
              <Link to="/plan" className="block text-sm hover:text-white dark:hover:text-night-800 transition-colors">Plan a Trip</Link>
              <Link to="/dashboard" className="block text-sm hover:text-white dark:hover:text-night-800 transition-colors">My Trips</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans font-semibold text-white dark:text-night-700 text-sm uppercase tracking-wider mb-4">Travel</h4>
            <div className="space-y-2.5">
              <Link to="/dashboard" className="block text-sm hover:text-white dark:hover:text-night-800 transition-colors">Hotels & Stays</Link>
              <Link to="/dashboard" className="block text-sm hover:text-white dark:hover:text-night-800 transition-colors">Food & Dining</Link>
              <Link to="/safety" className="block text-sm hover:text-white dark:hover:text-night-800 transition-colors">Safety Guide</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans font-semibold text-white dark:text-night-700 text-sm uppercase tracking-wider mb-4">Destinations</h4>
            <div className="space-y-2.5">
              <span className="block text-sm">Jaipur · Goa · Kerala</span>
              <span className="block text-sm">Varanasi · Manali · Rishikesh</span>
              <span className="block text-sm">Udaipur · Darjeeling · Sikkim</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 dark:border-night-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 dark:text-night-400">&copy; {new Date().getFullYear()} TravelMate. All rights reserved.</p>
          <p className="text-xs text-white/40 dark:text-night-400">Made with care for Indian travelers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
