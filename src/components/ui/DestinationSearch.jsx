
import { useState, useEffect, useRef } from 'react';
import { searchDestinations } from '../../services/geocodingService';
import { MapPin, Search, Loader2 } from 'lucide-react';

const DestinationSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const isSelecting = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3 || isSelecting.current) {
        setResults([]);
        return;
      }
      setIsOpen(true);
      setLoading(true);
      try {
        const data = await searchDestinations(query);
        setResults(data);
        if (data.length > 0 && data[0].name.toLowerCase() === query.toLowerCase()) {
          onSelect(data[0]);
        }
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (place) => {
    isSelecting.current = true;
    setQuery(place.name);
    setIsOpen(false);
    onSelect(place);
    setTimeout(() => { isSelecting.current = false; }, 600);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-charcoal-700/40 dark:text-night-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-charcoal-700/40 dark:text-night-500" />
          )}
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3.5 bg-transparent border-0 focus:ring-0 placeholder-charcoal-700/40 dark:placeholder-night-500 text-charcoal-900 dark:text-night-800 text-sm font-sans outline-none"
          placeholder="Search Indian destinations, places or experiences..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSelect(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isOpen) {
              e.preventDefault();
              if (results.length > 0) {
                handleSelect(results[0]);
              }
            }
          }}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
      </div>

      {isOpen && (results.length > 0 || loading || query.length >= 3) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-night-100 rounded-xl shadow-lg border border-black/[0.08] dark:border-night-200 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-4 text-sm text-charcoal-700/50 dark:text-night-500 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching...
            </div>
          ) : results.length === 0 && query.length >= 3 ? (
            <div className="px-5 py-5 text-sm text-charcoal-700/70 dark:text-night-600">
              <p className="font-medium text-charcoal-900 dark:text-night-800 mb-1">No results found</p>
              <p>TravelMate currently focuses on destinations across India 🇮🇳</p>
            </div>
          ) : (
            <ul className="py-1">
              {results.map((place) => (
                <li
                  key={place.id}
                  onClick={() => handleSelect(place)}
                  className="px-4 py-3.5 hover:bg-cream-100 dark:hover:bg-night-200 cursor-pointer flex items-start gap-3 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-forest-700 dark:text-accent-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-charcoal-900 dark:text-night-800 text-sm">{place.name}</div>
                    <div className="text-xs text-charcoal-700/50 dark:text-night-500 mt-0.5 truncate max-w-xs">
                      {place.fullName}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationSearch;
