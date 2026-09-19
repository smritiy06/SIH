import { getNearbyPlaces } from './placesService';
import { searchDestinations } from './geocodingService';

/**
 * Calculates the number of days between two dates
 */
const getDurationInDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
};

/**
 * Maps a place to a relevance score based on user interests
 */
const scorePlaceByInterests = (place, interests) => {
  let score = 0;
  
  if (interests.includes('History') && (place.historic || place.tourism === 'museum')) score += 5;
  if (interests.includes('Nature') && (place.natural || place.leisure === 'nature_reserve')) score += 5;
  if (interests.includes('Spiritual') && place.religion) score += 5;
  if (interests.includes('Adventure') && place.leisure === 'park') score += 3;
  if (interests.includes('Culture') && (place.tourism === 'museum' || place.historic)) score += 3;
  if (interests.includes('Food') && place.amenity === 'restaurant') score += 5;
  
  // Base score for any attraction
  if (place.tourism === 'attraction' || place.tourism === 'viewpoint') score += 1;
  
  return score;
};

/**
 * Generates a dynamic, destination-specific itinerary based on interests and duration
 */
export const generateItinerary = async (tripData) => {
  const { destination, startDate, endDate, travelers, budget, interests } = tripData;
  const numDays = getDurationInDays(startDate, endDate);
  
  // 1. Get coordinates for the destination
  let lat = 20.5937, lon = 78.9629; // default India
  if (destination.lat && destination.lon) {
    lat = destination.lat;
    lon = destination.lon;
  } else {
    try {
      const results = await searchDestinations(`${destination.name}, ${destination.region || 'India'}`);
      if (results && results.length > 0) {
        lat = results[0].lat;
        lon = results[0].lon;
      }
    } catch (error) {
      console.warn('Geocoding failed, using fallback coordinates');
    }
  }

  // 2. Fetch all raw places in a 10km radius
  let rawPlaces = [];
  try {
    rawPlaces = await getNearbyPlaces(lat, lon, 'all_attractions', 10000);
  } catch (err) {
    console.error('Failed to fetch places, using fallback generator', err);
    return generateFallbackItinerary(destination.name, numDays);
  }

  // 3. Filter and Score Places based on Interests
  // If no places found from API, use fallback
  if (rawPlaces.length === 0) {
    return generateFallbackItinerary(destination.name, numDays);
  }

  // Score places
  let scoredPlaces = rawPlaces.map(place => ({
    ...place,
    score: scorePlaceByInterests(place, interests || [])
  }));

  // Sort by score descending
  scoredPlaces.sort((a, b) => b.score - a.score);

  // Group by rough categories to ensure variety
  const historical = scoredPlaces.filter(p => p.historic || p.tourism === 'museum');
  const nature = scoredPlaces.filter(p => p.natural || p.leisure === 'nature_reserve' || p.leisure === 'park');
  const spiritual = scoredPlaces.filter(p => p.religion);
  const general = scoredPlaces.filter(p => !p.historic && !p.natural && !p.religion && !p.amenity);
  const food = scoredPlaces.filter(p => p.amenity === 'restaurant' || p.amenity === 'cafe');

  // Helper to pick unique places
  const usedPlaceIds = new Set();
  const pickPlace = (categoryArr) => {
    for (let place of categoryArr) {
      if (!usedPlaceIds.has(place.id)) {
        usedPlaceIds.add(place.id);
        return place;
      }
    }
    return null;
  };

  const itinerary = [];
  
  // 4. Allocate unique places across the required number of days
  for (let i = 1; i <= numDays; i++) {
    const dayActivities = [];

    // Morning: Historical or Nature
    let morningPlace = (interests.includes('Nature') && i % 2 === 0) ? pickPlace(nature) : pickPlace(historical);
    if (!morningPlace) morningPlace = pickPlace(general) || pickPlace(scoredPlaces);
    
    if (morningPlace) {
      dayActivities.push({
        time: '09:00 AM',
        title: `Visit ${morningPlace.name}`,
        description: `Explore this popular ${morningPlace.type || 'attraction'} in ${destination.name}.`,
        duration: '2-3 hours',
        type: 'activity',
        lat: morningPlace.lat,
        lon: morningPlace.lon
      });
    }

    // Lunch: Food
    let lunchPlace = pickPlace(food);
    dayActivities.push({
      time: '01:00 PM',
      title: lunchPlace ? `Lunch at ${lunchPlace.name}` : 'Local Lunch Experience',
      description: lunchPlace ? `Enjoy a meal at this highly rated local spot.` : `Try local ${destination.name} delicacies.`,
      duration: '1 hour',
      type: 'food',
      lat: lunchPlace ? lunchPlace.lat : lat,
      lon: lunchPlace ? lunchPlace.lon : lon
    });

    // Afternoon: Spiritual, Nature, or General
    let afternoonPlace = pickPlace(spiritual);
    if (!afternoonPlace || !interests.includes('Spiritual')) afternoonPlace = pickPlace(nature);
    if (!afternoonPlace) afternoonPlace = pickPlace(general) || pickPlace(scoredPlaces);

    if (afternoonPlace) {
      dayActivities.push({
        time: '03:00 PM',
        title: `Explore ${afternoonPlace.name}`,
        description: `Afternoon visit to this beautiful ${afternoonPlace.type || 'site'}.`,
        duration: '2 hours',
        type: 'activity',
        lat: afternoonPlace.lat,
        lon: afternoonPlace.lon
      });
    }

    // Evening: General / Leisure
    let eveningPlace = pickPlace(general) || pickPlace(scoredPlaces);
    if (eveningPlace) {
      dayActivities.push({
        time: '06:00 PM',
        title: `Evening at ${eveningPlace.name}`,
        description: `Relax and take in the atmosphere at ${eveningPlace.name}.`,
        duration: '2 hours',
        type: 'activity',
        lat: eveningPlace.lat,
        lon: eveningPlace.lon
      });
    }

    itinerary.push({
      day: i,
      title: `Day ${i} in ${destination.name}`,
      activities: dayActivities
    });
  }

  return itinerary;
};

/**
 * Fallback generator strictly labeled as a template if the API fails or returns no data
 */
const generateFallbackItinerary = (destinationName, numDays) => {
  const itinerary = [];
  for (let i = 1; i <= numDays; i++) {
    itinerary.push({
      day: i,
      title: `Day ${i} in ${destinationName} (Generic Template)`,
      activities: [
        {
          time: '10:00 AM',
          title: `Main City Attraction`,
          description: `Visit the central landmark of ${destinationName}. (Real data unavailable)`,
          duration: '3 hours',
          type: 'activity'
        },
        {
          time: '02:00 PM',
          title: `Local Cuisine`,
          description: `Try popular local dishes in the city center.`,
          duration: '1 hour',
          type: 'food'
        }
      ]
    });
  }
  return itinerary;
};
