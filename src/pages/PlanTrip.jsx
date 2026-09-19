import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DestinationSearch from '../components/ui/DestinationSearch';
import { Calendar, Users, Wallet, ArrowRight } from 'lucide-react';
import localforage from 'localforage';

const PlanTrip = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 'moderate',
    interests: [],
  });

  const interestsOptions = [
    'Nature', 'Adventure', 'History', 'Culture', 'Food', 'Shopping', 'Family', 'Spiritual'
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlace) {
      alert('Please select a destination from the dropdown.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert('Please select travel dates.');
      return;
    }
    const tripData = {
      id: Date.now().toString(),
      destination: selectedPlace,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    try {
      await localforage.setItem('currentTrip', tripData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving trip data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-accent-600 dark:text-accent-500 font-medium text-sm tracking-wider uppercase mb-3">Plan Your Trip</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-900 dark:text-night-900 mb-4">
            Where will India<br />take you?
          </h1>
          <p className="text-charcoal-700/60 dark:text-night-500 max-w-md mx-auto">
            Tell us about your ideal trip and we'll gather everything you need.
          </p>
        </div>

        <div className="card p-6 sm:p-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Destination</label>
              <div className="border border-black/10 dark:border-night-300 rounded-xl overflow-hidden bg-cream-50 dark:bg-night-200">
                <DestinationSearch onSelect={setSelectedPlace} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest-700 dark:text-accent-500" /> Start Date
                </label>
                <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full p-3.5 border border-black/10 dark:border-night-300 rounded-xl bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest-700 dark:text-accent-500" /> End Date
                </label>
                <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full p-3.5 border border-black/10 dark:border-night-300 rounded-xl bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-forest-700 dark:text-accent-500" /> Travelers
                </label>
                <input type="number" min="1" required value={formData.travelers} onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
                  className="w-full p-3.5 border border-black/10 dark:border-night-300 rounded-xl bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-forest-700 dark:text-accent-500" /> Budget
                </label>
                <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full p-3.5 border border-black/10 dark:border-night-300 rounded-xl bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all text-sm">
                  <option value="budget">Budget / Backpacker</option>
                  <option value="moderate">Moderate / Standard</option>
                  <option value="luxury">Luxury / Premium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-3">What do you love?</label>
              <div className="flex flex-wrap gap-2">
                {interestsOptions.map(interest => (
                  <button key={interest} type="button" onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      formData.interests.includes(interest)
                        ? 'bg-forest-700 dark:bg-accent-600 text-white shadow-sm'
                        : 'bg-cream-100 dark:bg-night-200 text-charcoal-700 dark:text-night-600 hover:bg-cream-200 dark:hover:bg-night-300 border border-black/[0.06] dark:border-night-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-4 text-base rounded-xl mt-4">
              Plan My Trip <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
