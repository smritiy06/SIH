import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { getCountrySafety, getGeneralSafetyTips } from '../services/safetyService';
import { ShieldCheck, AlertTriangle, Info, Loader2 } from 'lucide-react';

const Safety = () => {
  const [countrySafety, setCountrySafety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState(null);
  const generalTips = getGeneralSafetyTips();

  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        const savedTrip = await localforage.getItem('currentTrip');
        if (savedTrip && savedTrip.destination && savedTrip.destination.country) {
          const code = 'IN';
          setCountryCode(savedTrip.destination.country);
          const safety = await getCountrySafety(code);
          setCountrySafety(safety);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSafetyData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-night-50">
        <Loader2 className="h-8 w-8 text-forest-700 dark:text-accent-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-50 py-16">
      <div className="section-padding max-w-3xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-50 dark:bg-night-200 text-forest-700 dark:text-accent-500 mb-5">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-900 dark:text-night-900 mb-4">
            Travel Safety
          </h1>
          <p className="text-charcoal-700/60 dark:text-night-500 text-lg max-w-md mx-auto">
            Stay informed and secure during your journey across India.
          </p>
        </div>

        {countrySafety && (
          <div className="card p-6 sm:p-8 mb-10 relative overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className={`absolute top-0 left-0 w-1.5 h-full rounded-r-full ${
              countrySafety.score >= 4 ? 'bg-red-500' : countrySafety.score >= 3 ? 'bg-amber-500' : 'bg-accent-500'
            }`} />
            <div className="ml-4">
              <h2 className="font-serif text-xl font-bold text-charcoal-900 dark:text-night-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-charcoal-700/60 dark:text-night-500" />
                Advisory for {countryCode || 'Your Destination'}
              </h2>
              <p className="text-charcoal-700/70 dark:text-night-600 leading-relaxed mb-3">
                {countrySafety.message}
              </p>
              <div className="text-xs text-charcoal-700/40 dark:text-night-400 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Source: {countrySafety.source} · Updated: {new Date(countrySafety.updated).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-6">General Travel Tips</h2>
          <div className="space-y-4">
            {generalTips.map((tip, idx) => (
              <div key={idx} className="card p-6 hover:shadow-md transition-shadow duration-300">
                <p className="text-xs font-semibold text-accent-600 dark:text-accent-500 uppercase tracking-wider mb-2">{tip.category}</p>
                <h3 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 text-lg mb-2">{tip.title}</h3>
                <p className="text-charcoal-700/60 dark:text-night-500 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Safety;
