import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DestinationSearch from '../components/ui/DestinationSearch';
import { Calendar, Users, Wallet, ArrowRight, MapPin, Bed, Utensils, CloudSun, CalendarDays, ShieldCheck, Star, ChevronDown } from 'lucide-react';
import localforage from 'localforage';

const Home = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 'moderate',
    interests: [],
  });

  const interestsOptions = [
    'Nature', 'Adventure', 'History', 'Culture', 'Food', 'Spiritual', 'Shopping', 'Family'
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
      alert('Please select a destination from the suggestions.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert('Please select your travel dates.');
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

  const popularDestinations = ['Jaipur', 'Goa', 'Manali', 'Kerala', 'Varanasi', 'Rishikesh'];

  const destinations = [
    {
      name: 'Jaipur',
      region: 'Rajasthan',
      tags: 'Forts · Culture · Royal Heritage',
      image: 'https://picsum.photos/seed/jaipur/800/600',
    },
    {
      name: 'Goa',
      region: 'West Coast',
      tags: 'Beaches · Nightlife · Portuguese Heritage',
      image: 'https://picsum.photos/seed/goa/800/600',
    },
    {
      name: 'Varanasi',
      region: 'Uttar Pradesh',
      tags: 'Ghats · Spirituality · Ancient Culture',
      image: 'https://picsum.photos/seed/varanasi/800/600',
    },
    {
      name: 'Kerala',
      region: 'South India',
      tags: 'Backwaters · Ayurveda · Nature',
      image: 'https://picsum.photos/seed/kerala/800/600',
    },
    {
      name: 'Manali',
      region: 'Himachal Pradesh',
      tags: 'Mountains · Adventure · Snow',
      image: 'https://picsum.photos/seed/manali/800/600',
    },
    {
      name: 'Udaipur',
      region: 'Rajasthan',
      tags: 'Lakes · Palaces · Romance',
      image: 'https://picsum.photos/seed/udaipur/800/600',
    },
  ];

  const features = [
    { icon: <MapPin className="h-6 w-6" />, title: 'Plan Itinerary', desc: 'Day-wise personalized travel plans' },
    { icon: <Bed className="h-6 w-6" />, title: 'Find Stays', desc: 'Hotels, homestays & resorts' },
    { icon: <Utensils className="h-6 w-6" />, title: 'Discover Food', desc: 'Local restaurants & cuisine' },
    { icon: <CloudSun className="h-6 w-6" />, title: 'Check Weather', desc: 'Real-time destination weather' },
    { icon: <CalendarDays className="h-6 w-6" />, title: 'Local Events', desc: 'Festivals & experiences' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Stay Safe', desc: 'Safety tips & scam alerts' },
    { icon: <Star className="h-6 w-6" />, title: 'Share Feedback', desc: 'Reviews & travel stories' },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section 
        className="relative h-[92vh] min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      >
        {/* Subtle overlay that doesn't wash out the image */}
        <div className="absolute inset-0 bg-black/30" />


        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto w-full">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up">
            Travel India,<br />
            <em className="font-serif">Your Way.</em>
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Discover places. Plan smart itineraries. Find stays, food, events and experiences — all in one place.
          </p>

          {/* Search bar */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white dark:bg-night-100 rounded-xl shadow-xl p-2 flex items-center gap-2 max-w-2xl mx-auto">
              <div className="flex-grow">
                <DestinationSearch onSelect={(place) => { setSelectedPlace(place); setShowPlanner(true); }} />
              </div>
              <button
                onClick={() => {
                  if (selectedPlace) {
                    setShowPlanner(true);
                    setTimeout(() => document.getElementById('trip-planner')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="btn-primary whitespace-nowrap px-6 py-3 rounded-lg"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Popular tags */}
            <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
              <span className="text-white/60 text-sm">Popular:</span>
              {popularDestinations.map((d) => (
                <span key={d} className="text-sm text-white/80 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full cursor-default hover:bg-white/25 transition-colors">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Location badge */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/70 text-sm z-10">
          <MapPin className="h-4 w-4" />
          <span>Udaipur, Rajasthan</span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white/60 text-sm z-10">
          <span>Scroll to explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* ===== TRIP PLANNER ===== */}
      {showPlanner && (
        <section id="trip-planner" className="section-padding py-16">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-night-900 mb-3">
                Plan Your Journey
              </h2>
              <p className="text-charcoal-700/60 dark:text-night-500 text-base">
                {selectedPlace ? `You selected ${selectedPlace.name}. Fill in the details below.` : 'Tell us about your ideal trip.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Start Date</label>
                  <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full p-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">End Date</label>
                  <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full p-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Travelers</label>
                  <input type="number" min="1" required value={formData.travelers} onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})} className="w-full p-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-800 dark:text-night-700 mb-2">Budget</label>
                  <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full p-3 border border-black/10 dark:border-night-300 rounded-lg bg-cream-50 dark:bg-night-200 dark:text-night-800 focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none transition-all">
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

              <button type="submit" className="btn-primary w-full justify-center py-4 text-base rounded-xl">
                Plan My Trip <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ===== EXPLORE INDIA ===== */}
      <section className="section-padding py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-accent-600 dark:text-accent-500 font-medium text-sm tracking-wider uppercase mb-2">Destinations</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-night-900">Explore India</h2>
          </div>
          <Link to="/explore" className="text-forest-700 dark:text-accent-500 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all destinations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              to="/plan"
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
            >
              <img
                src={dest.image}
                alt={`${dest.name}, ${dest.region}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-2xl font-bold text-white mb-1">{dest.name}</h3>
                <p className="text-white/70 text-sm">{dest.tags}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-cream-100 dark:bg-night-100 py-20">
        <div className="section-padding">
          <div className="text-center mb-14">
            <p className="text-accent-600 dark:text-accent-500 font-medium text-sm tracking-wider uppercase mb-2">Everything You Need</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-night-900 mb-4">Your Complete Travel Companion</h2>
            <p className="text-charcoal-700/60 dark:text-night-500 max-w-xl mx-auto">
              From planning your itinerary to finding the perfect stay — TravelMate has it all.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="card p-5 sm:p-6 text-center hover:shadow-md transition-shadow duration-300 group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-50 dark:bg-night-200 text-forest-700 dark:text-accent-500 mb-4 group-hover:bg-forest-700 dark:group-hover:bg-accent-600 group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 text-sm mb-1">{f.title}</h3>
                <p className="text-charcoal-700/50 dark:text-night-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=80"
            alt="Taj Mahal at sunrise"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest-900/70" />
          <div className="relative z-10 text-center py-20 px-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to explore India?
            </h2>
            <p className="text-white/70 max-w-md mx-auto mb-8">
              Start planning your dream trip today. It only takes a minute.
            </p>
            <Link to="/plan" className="bg-white text-forest-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-cream-100 transition-colors inline-flex items-center gap-2">
              Start Planning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
