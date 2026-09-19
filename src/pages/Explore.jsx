import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDestinationImage } from '../services/imageService';

const Explore = () => {
  const [trendingDestinations, setTrendingDestinations] = useState([
    { name: 'Jaipur', region: 'Rajasthan', tags: 'Forts · Culture · Royal Heritage', image: '' },
    { name: 'Goa', region: 'West Coast', tags: 'Beaches · Nightlife · Portuguese Heritage', image: '' },
    { name: 'Varanasi', region: 'Uttar Pradesh', tags: 'Ghats · Spirituality · Ancient Culture', image: '' },
    { name: 'Kerala', region: 'South India', tags: 'Backwaters · Ayurveda · Nature', image: '' },
    { name: 'Manali', region: 'Himachal Pradesh', tags: 'Mountains · Adventure · Snow', image: '' },
    { name: 'Rishikesh', region: 'Uttarakhand', tags: 'Yoga · Rafting · Spirituality', image: '' },
  ]);

  const [hiddenGems, setHiddenGems] = useState([
    { name: 'Meghalaya', region: 'Northeast India', tags: 'Living Root Bridges · Waterfalls · Caves', image: '' },
    { name: 'Spiti Valley', region: 'Himachal Pradesh', tags: 'Cold Desert · Monasteries · Stargazing', image: '' },
    { name: 'Andaman Islands', region: 'Bay of Bengal', tags: 'White Beaches · Diving · Coral Reefs', image: '' },
    { name: 'Hampi', region: 'Karnataka', tags: 'Ruins · Boulders · History', image: '' },
  ]);

  useEffect(() => {
    const loadImages = async () => {
      const updatedTrending = await Promise.all(trendingDestinations.map(async (d) => ({
        ...d,
        image: await getDestinationImage(d.name)
      })));
      setTrendingDestinations(updatedTrending);

      const updatedGems = await Promise.all(hiddenGems.map(async (d) => ({
        ...d,
        image: await getDestinationImage(d.name)
      })));
      setHiddenGems(updatedGems);
    };
    loadImages();
  }, []);

  const DestinationCard = ({ dest, aspect = 'aspect-[4/3]' }) => (
    <Link to="/plan" className={`group relative rounded-2xl overflow-hidden ${aspect} block`}>
      <img
        src={dest.image}
        alt={`${dest.name}, ${dest.region}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{dest.region}</p>
        <h3 className="font-serif text-2xl font-bold text-white mb-1.5">{dest.name}</h3>
        <p className="text-white/60 text-sm">{dest.tags}</p>
      </div>
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4 text-white" />
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-night-50">
      {/* Hero */}
      <section className="section-padding pt-16 pb-12">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-accent-600 dark:text-accent-500 font-medium text-sm tracking-wider uppercase mb-3">Destinations</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-900 dark:text-night-900 mb-4">
            Explore India
          </h1>
          <p className="text-charcoal-700/60 dark:text-night-500 text-lg">
            From the snow-capped Himalayas to the tropical backwaters of Kerala — discover your next adventure.
          </p>
        </div>
      </section>

      {/* Trending */}
      <section className="section-padding pb-20">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-night-900 mb-8">Trending Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingDestinations.map((dest) => (
            <DestinationCard key={dest.name} dest={dest} />
          ))}
        </div>
      </section>

      {/* Hidden Gems */}
      <section className="bg-cream-100 dark:bg-night-100 py-20">
        <div className="section-padding">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-night-900 mb-8">Hidden Gems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiddenGems.map((dest) => (
              <DestinationCard key={dest.name} dest={dest} aspect="aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-charcoal-900 dark:text-night-900 mb-4">Can't decide?</h2>
        <p className="text-charcoal-700/60 dark:text-night-500 max-w-md mx-auto mb-8">
          Tell us what you love and we'll craft the perfect itinerary for you.
        </p>
        <Link to="/plan" className="btn-primary text-base px-8 py-3.5">
          Plan My Trip <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default Explore;
