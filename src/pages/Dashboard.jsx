import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { differenceInDays, format, addDays } from 'date-fns';
import { getWeatherForecast, getWeatherCondition } from '../services/weatherService';
import { getNearbyPlaces } from '../services/placesService';
import { getLocalEvents } from '../services/eventsService';
import { MapPin, Calendar, Users, Wallet, CloudSun, Utensils, Bed, CalendarDays, ShieldCheck, ArrowRight, RefreshCw, Save, Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState({ error: false, message: '', data: [] });
  const [places, setPlaces] = useState({ attractions: [], food: [], accommodation: [] });
  const [activeTab, setActiveTab] = useState('itinerary');
  const [accTypeFilter, setAccTypeFilter] = useState('all');

  useEffect(() => {
    const loadTripData = async () => {
      try {
        const savedTrip = await localforage.getItem('currentTrip');
        if (!savedTrip) { navigate('/plan'); return; }
        setTrip(savedTrip);
        const { lat, lon } = savedTrip.destination;
        try {
          const weatherData = await getWeatherForecast(lat, lon);
          setWeather(weatherData);
        } catch (e) { console.error('Failed to load weather'); }
        try {
          const [attractions, food, hotels, localEvents] = await Promise.all([
            getNearbyPlaces(lat, lon, 'tourism', 10000),
            getNearbyPlaces(lat, lon, 'food', 5000),
            getNearbyPlaces(lat, lon, 'accommodation', 10000),
            getLocalEvents(lat, lon)
          ]);
          
          // Mock data fallbacks for food and accommodation
          const finalFood = food.length > 0 ? food : [
            { id: 'f1', name: 'The Royal Spice', type: 'restaurant', cuisine: 'Authentic Indian', stars: 4 },
            { id: 'f2', name: 'Bazaar Cafe', type: 'cafe', cuisine: 'Coffee & Snacks', stars: 4 },
            { id: 'f3', name: 'Streetside Delights', type: 'food', cuisine: 'Local Street Food', stars: 5 }
          ];
          
          const finalHotels = hotels.length > 0 ? hotels : [
            { id: 'h1', name: 'Grand Plaza Hotel', type: 'hotel', stars: 5 },
            { id: 'h2', name: 'Cozy Homestay', type: 'guest_house', stars: 4 },
            { id: 'h3', name: 'Backpacker Haven', type: 'hostel', stars: 3 }
          ];

          setPlaces({ attractions, food: finalFood, accommodation: finalHotels });
          setEvents(localEvents);
        } catch (e) { console.error('Failed to load places or events'); }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadTripData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 dark:bg-night-50 gap-3">
        <Loader2 className="h-8 w-8 text-forest-700 dark:text-accent-500 animate-spin" />
        <p className="text-charcoal-700/50 dark:text-night-500 text-sm">Loading your trip…</p>
      </div>
    );
  }
  if (!trip) return null;

  const numDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const tripDates = Array.from({ length: numDays }).map((_, i) => addDays(new Date(trip.startDate), i));

  const generateItinerary = () => {
    const itinerary = [];
    const usedAttractions = new Set();
    
    // Mock data fallback if APIs return no places
    const mockAttractions = [
      { id: 'm1', name: 'City Center Tour', type: 'attraction' },
      { id: 'm2', name: 'Local Museum', type: 'museum' },
      { id: 'm3', name: 'Historic Monument', type: 'monument' },
      { id: 'm4', name: 'Central Park', type: 'park' },
      { id: 'm5', name: 'Market Walk', type: 'shopping' },
      { id: 'm6', name: 'Sunset Viewpoint', type: 'viewpoint' },
    ];
    const mockFood = [
      { id: 'f1', name: 'Traditional Cafe', type: 'restaurant', cuisine: 'Local' },
      { id: 'f2', name: 'Street Food Hub', type: 'food', cuisine: 'Street Food' },
    ];
    
    const availableAttractions = places.attractions.length > 0 ? [...places.attractions] : mockAttractions;
    const availableFood = places.food.length > 0 ? [...places.food] : mockFood;

    for (let i = 0; i < numDays; i++) {
      const dayActivities = [];
      const morning = availableAttractions.find(a => !usedAttractions.has(a.id));
      if (morning) { dayActivities.push({ time: 'Morning', type: 'attraction', place: morning }); usedAttractions.add(morning.id); }
      const lunch = availableFood[i % Math.max(availableFood.length, 1)];
      if (lunch) { dayActivities.push({ time: 'Lunch', type: 'food', place: lunch }); }
      const afternoon = availableAttractions.find(a => !usedAttractions.has(a.id));
      if (afternoon) { dayActivities.push({ time: 'Afternoon', type: 'attraction', place: afternoon }); usedAttractions.add(afternoon.id); }
      const evening = availableAttractions.find(a => !usedAttractions.has(a.id));
      if (evening) { dayActivities.push({ time: 'Evening', type: 'attraction', place: evening }); usedAttractions.add(evening.id); }
      itinerary.push({ day: i + 1, date: tripDates[i], activities: dayActivities });
    }
    return itinerary;
  };
  const itinerary = generateItinerary();

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: <MapPin className="h-4 w-4" /> },
    { id: 'stays', label: 'Stays', icon: <Bed className="h-4 w-4" /> },
    { id: 'food', label: 'Food', icon: <Utensils className="h-4 w-4" /> },
    { id: 'weather', label: 'Weather', icon: <CloudSun className="h-4 w-4" /> },
    { id: 'events', label: 'Events', icon: <CalendarDays className="h-4 w-4" /> },
    { id: 'safety', label: 'Safety', icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-50">
      {/* Trip Header */}
      <div className="bg-white dark:bg-night-100 border-b border-black/[0.06] dark:border-night-200">
        <div className="section-padding py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-accent-600 dark:text-accent-500 font-medium text-xs tracking-wider uppercase mb-1">Your Trip</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-night-900 mb-2">{trip.destination.name}</h1>
              <p className="text-charcoal-700/50 dark:text-night-500 text-sm flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {trip.destination.fullName}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-cream-100 dark:bg-night-200 px-4 py-2 rounded-lg text-charcoal-700 dark:text-night-700 text-sm">
                <Calendar className="h-4 w-4 text-forest-700 dark:text-accent-500" />
                <span className="font-medium">{format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-100 dark:bg-night-200 px-4 py-2 rounded-lg text-charcoal-700 dark:text-night-700 text-sm">
                <Users className="h-4 w-4 text-forest-700 dark:text-accent-500" />
                <span className="font-medium">{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
              </div>
              <div className="flex items-center gap-2 bg-cream-100 dark:bg-night-200 px-4 py-2 rounded-lg text-charcoal-700 dark:text-night-700 text-sm capitalize">
                <Wallet className="h-4 w-4 text-forest-700 dark:text-accent-500" />
                <span className="font-medium">{trip.budget}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 overflow-x-auto pb-px -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-forest-700 dark:border-accent-500 text-forest-700 dark:text-accent-500'
                    : 'border-transparent text-charcoal-700/50 dark:text-night-500 hover:text-charcoal-700 dark:hover:text-night-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="section-padding py-10">

        {/* Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900">Your Itinerary</h2>
              <div className="flex gap-2">
                <button onClick={() => window.location.reload()} className="btn-outline text-xs gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Regenerate</button>
                <button className="btn-outline text-xs gap-1.5"><Save className="h-3.5 w-3.5" /> Save</button>
              </div>
            </div>
            {itinerary.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-charcoal-700/50 dark:text-night-500">Not enough data to generate an itinerary for this destination.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {itinerary.map((day) => (
                  <div key={day.day}>
                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="font-serif text-xl font-bold text-charcoal-900 dark:text-night-900">Day {day.day}</span>
                      <span className="text-sm text-charcoal-700/40 dark:text-night-500">{format(day.date, 'EEEE, MMMM d')}</span>
                    </div>
                    <div className="space-y-3 ml-4 border-l-2 border-cream-200 dark:border-night-300 pl-6">
                      {day.activities.map((activity, idx) => (
                        <div key={idx} className="card p-4 flex flex-col sm:flex-row gap-4 group hover:shadow-md transition-shadow">
                          <div className="w-20 flex-shrink-0">
                            <span className="text-xs font-semibold text-forest-700 dark:text-accent-500 uppercase tracking-wider">{activity.time}</span>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 mb-0.5">{activity.place.name}</h4>
                            <p className="text-charcoal-700/50 dark:text-night-500 text-sm capitalize">
                              {activity.type === 'food' ? activity.place.cuisine || 'Local Restaurant' : activity.place.type || 'Attraction'}
                            </p>
                          </div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-lg text-charcoal-700/40 dark:text-night-500 hover:bg-cream-100 dark:hover:bg-night-200 hover:text-forest-700 dark:hover:text-accent-500 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                            <button className="p-1.5 rounded-lg text-charcoal-700/40 dark:text-night-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      ))}
                      <button className="text-sm text-forest-700 dark:text-accent-500 font-medium flex items-center gap-1 p-2 hover:bg-accent-50 dark:hover:bg-night-200 rounded-lg transition-colors">
                        <Plus className="h-4 w-4" /> Add Activity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stays */}
        {activeTab === 'stays' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-1">Find Your Stay</h2>
                <p className="text-charcoal-700/50 dark:text-night-500 text-sm">Accommodation options near {trip.destination.name}</p>
              </div>
              {places.accommodation.length > 0 && (
                <select value={accTypeFilter} onChange={(e) => setAccTypeFilter(e.target.value)}
                  className="px-4 py-2.5 border border-black/10 dark:border-night-300 rounded-lg bg-white dark:bg-night-100 dark:text-night-700 text-sm focus:ring-2 focus:ring-forest-700/20 dark:focus:ring-accent-500/20 focus:border-forest-700 dark:focus:border-accent-500 outline-none">
                  <option value="all">All Types</option>
                  <option value="hotel">Hotels</option>
                  <option value="hostel">Hostels</option>
                  <option value="guest_house">Guest Houses</option>
                  <option value="resort">Resorts</option>
                </select>
              )}
            </div>
            {places.accommodation.length === 0 ? (
              <div className="card p-12 text-center">
                <Bed className="h-10 w-10 text-charcoal-700/20 dark:text-night-400 mx-auto mb-4" />
                <p className="text-charcoal-700/50 dark:text-night-500">No accommodation data is currently available for this destination.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {places.accommodation.filter(p => accTypeFilter === 'all' || p.type === accTypeFilter).map((place) => (
                  <div key={place.id} className="card p-5 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 leading-tight pr-2">{place.name}</h3>
                        <span className="bg-cream-100 dark:bg-night-200 text-forest-700 dark:text-accent-500 text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider flex-shrink-0">
                          {place.type === 'guest_house' ? 'Guest House' : place.type}
                        </span>
                      </div>
                      {place.stars && (
                        <p className="text-amber-400 text-sm mb-2">
                          {'★'.repeat(parseInt(place.stars))}
                          <span className="text-charcoal-700/30 dark:text-night-500 text-xs ml-1">({place.stars} Star)</span>
                        </p>
                      )}
                      <p className="text-charcoal-700/50 dark:text-night-500 text-sm flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {trip.destination.city || trip.destination.name}
                      </p>
                    </div>
                    <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place.name + ' ' + (trip.destination.city || trip.destination.name))}`}
                      target="_blank" rel="noreferrer"
                      className="btn-primary w-full justify-center mt-5 py-2.5 text-xs">
                      Check Availability <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Food */}
        {activeTab === 'food' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-1">Discover Food</h2>
              <p className="text-charcoal-700/50 dark:text-night-500 text-sm">Restaurants and eateries near {trip.destination.name}</p>
            </div>
            {places.food.length === 0 ? (
              <div className="card p-12 text-center">
                <Utensils className="h-10 w-10 text-charcoal-700/20 dark:text-night-400 mx-auto mb-4" />
                <p className="text-charcoal-700/50 dark:text-night-500">No restaurant data found for this destination.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {places.food.map((place) => (
                  <div key={place.id} className="card p-5 hover:shadow-md transition-shadow">
                    <h3 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 mb-1.5">{place.name}</h3>
                    <p className="text-charcoal-700/50 dark:text-night-500 text-sm capitalize mb-3">
                      {place.type} · {place.cuisine?.replace(/;/g, ', ') || 'Various Cuisine'}
                    </p>
                    {place.website && (
                      <a href={place.website} target="_blank" rel="noreferrer" className="text-forest-700 dark:text-accent-500 text-sm font-medium hover:underline inline-flex items-center gap-1">
                        Visit Website <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Weather */}
        {activeTab === 'weather' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-8">Weather in {trip.destination.name}</h2>
            {!weather ? (
              <div className="card p-12 text-center">
                <CloudSun className="h-10 w-10 text-charcoal-700/20 dark:text-night-400 mx-auto mb-4" />
                <p className="text-charcoal-700/50 dark:text-night-500">Weather data unavailable for this destination.</p>
              </div>
            ) : (
              <div>
                <div className="card p-8 mb-8">
                  <p className="text-xs font-semibold text-accent-600 dark:text-accent-500 uppercase tracking-wider mb-3">Current Weather</p>
                  <div className="flex items-end gap-4">
                    <span className="font-serif text-5xl font-bold text-charcoal-900 dark:text-night-900">{weather.current.temperature_2m}°</span>
                    <div className="mb-1">
                      <p className="text-charcoal-900 dark:text-night-800 font-medium">{getWeatherCondition(weather.current.weather_code).text}</p>
                      <p className="text-charcoal-700/50 dark:text-night-500 text-sm">Humidity: {weather.current.relative_humidity_2m}% · Wind: {weather.current.wind_speed_10m} km/h</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 mb-4">7-Day Forecast</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weather.daily.time.slice(0, 7).map((dateStr, idx) => (
                    <div key={dateStr} className="card p-4 text-center">
                      <p className="text-xs font-medium text-charcoal-700/50 dark:text-night-500 mb-3">{format(new Date(dateStr), 'EEE')}</p>
                      <p className="text-xs text-charcoal-700/50 dark:text-night-500 truncate mb-2">{getWeatherCondition(weather.daily.weather_code[idx]).text}</p>
                      <p className="font-semibold text-charcoal-900 dark:text-night-800">{weather.daily.temperature_2m_max[idx]}°</p>
                      <p className="text-charcoal-700/30 dark:text-night-500 text-sm">{weather.daily.temperature_2m_min[idx]}°</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-1">Local Events</h2>
              <p className="text-charcoal-700/50 dark:text-night-500 text-sm">What's happening around {trip.destination.name}</p>
            </div>
            {events.error ? (
              <div className="card p-8 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-700/30">
                <p className="font-medium text-amber-800 dark:text-amber-400 text-sm">{events.message}</p>
                <p className="text-xs mt-2 text-amber-700/70 dark:text-amber-500/70">Add a Ticketmaster API key to your .env file to enable live events.</p>
              </div>
            ) : events.data.length === 0 ? (
              <div className="card p-12 text-center">
                <CalendarDays className="h-10 w-10 text-charcoal-700/20 dark:text-night-400 mx-auto mb-4" />
                <p className="text-charcoal-700/50 dark:text-night-500">No verified events found for this location.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {events.data.map((event) => (
                  <div key={event.id} className="card p-5 flex gap-4 hover:shadow-md transition-shadow">
                    {event.images && event.images.length > 0 && (
                      <img src={event.images[0].url} alt={event.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                    )}
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <p className="text-[10px] font-semibold text-accent-600 dark:text-accent-500 uppercase tracking-wider mb-1">{event.category}</p>
                        <h3 className="font-sans font-semibold text-charcoal-900 dark:text-night-800 mb-1">{event.name}</h3>
                        <p className="text-charcoal-700/50 dark:text-night-500 text-xs">{event.date} {event.time && `· ${event.time}`}</p>
                        <p className="text-charcoal-700/50 dark:text-night-500 text-xs">{event.venues}</p>
                      </div>
                      {event.url && (
                        <a href={event.url} target="_blank" rel="noreferrer" className="text-forest-700 dark:text-accent-500 text-xs font-medium hover:underline mt-2 inline-flex items-center gap-1">
                          View Event <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Safety */}
        {activeTab === 'safety' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-8">Safety in {trip.destination.name}</h2>
            <div className="card p-8 text-center">
              <ShieldCheck className="h-10 w-10 text-charcoal-700/20 dark:text-night-400 mx-auto mb-4" />
              <p className="text-charcoal-700/50 dark:text-night-500 mb-4">For detailed safety information, visit the safety page.</p>
              <button onClick={() => navigate('/safety')} className="btn-primary">
                View Safety Guide <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
