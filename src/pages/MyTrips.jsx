import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';
import { Map, Calendar, Users, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const userTrips = await localforage.getItem(`trips_${user.id}`);
          setTrips(userTrips || []);
        }
      } catch (err) {
        console.error('Failed to load trips', err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-night-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-700 dark:border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-cream-50 dark:bg-night-50 py-12">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-night-900 mb-2">
              My Trips
            </h1>
            <p className="text-charcoal-700/60 dark:text-night-500">
              Your saved itineraries and travel plans.
            </p>
          </div>

          {trips.length === 0 ? (
            <div className="card p-12 text-center animate-fade-in-up">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-cream-100 dark:bg-night-200 mb-4">
                <Map className="h-8 w-8 text-charcoal-700/40 dark:text-night-500" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 dark:text-night-900 mb-2">
                You haven't saved any trips yet.
              </h3>
              <p className="text-charcoal-700/60 dark:text-night-500 mb-8 max-w-md mx-auto">
                Start exploring India and build your first personalized itinerary.
              </p>
              <Link to="/plan" className="btn-primary inline-flex">
                Plan a Trip
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {trips.map((trip) => (
                <div key={trip.id} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900 dark:text-night-900 mb-1">
                      {trip.destination.name}, {trip.destination.region}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-700/60 dark:text-night-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      // Set as current trip and go to dashboard
                      await localforage.setItem('currentTrip', trip);
                      window.location.href = '/dashboard';
                    }}
                    className="btn-outline shrink-0 w-full sm:w-auto justify-center"
                  >
                    View Itinerary <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
