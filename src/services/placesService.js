import axios from 'axios';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const getNearbyPlaces = async (lat, lon, type = 'tourism', radius = 5000) => {
  // Build Overpass QL query based on type
  let queryTag = '';
  
  if (type === 'tourism') {
    queryTag = '["tourism"~"attraction|museum|viewpoint|gallery"]';
  } else if (type === 'food') {
    queryTag = '["amenity"~"restaurant|cafe|fast_food|bar"]';
  } else if (type === 'accommodation') {
    queryTag = '["tourism"~"hotel|hostel|motel|guest_house"]';
  } else if (type === 'all_attractions') {
    // A broad query that captures many types of places for itinerary building
    queryTag = '["tourism"~"attraction|museum|viewpoint|gallery|theme_park"]["historic"~"monument|castle|ruins"]["natural"~"water|peak|beach"]["leisure"~"park|nature_reserve"]';
  } else {
    queryTag = `["${type}"]`; // generic fallback
  }

  // Find nodes with names within radius
  // If we are looking for 'all_attractions', we use a union to get all the matching nodes
  let query = '';
  
  if (type === 'all_attractions') {
    query = `
      [out:json][timeout:25];
      (
        node["tourism"~"attraction|museum|viewpoint|gallery"]("name")(around:${radius},${lat},${lon});
        node["historic"~"monument|castle|ruins|archaeological_site"]("name")(around:${radius},${lat},${lon});
        node["natural"~"beach|water|peak"]("name")(around:${radius},${lat},${lon});
        node["leisure"~"park|nature_reserve"]("name")(around:${radius},${lat},${lon});
        node["amenity"~"place_of_worship"]("name")(around:${radius},${lat},${lon});
      );
      out body 100;
    `;
  } else {
    query = `
      [out:json][timeout:25];
      (
        node${queryTag}["name"](around:${radius},${lat},${lon});
      );
      out body 20;
    `;
  }

  try {
    const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'TravelMate/1.0'
      }
    });
    
    if (response.data && response.data.elements) {
      return response.data.elements.map(el => ({
        id: el.id,
        name: el.tags.name,
        lat: el.lat,
        lon: el.lon,
        type: el.tags.tourism || el.tags.amenity || el.tags.historic || el.tags.natural || el.tags.leisure || 'attraction',
        historic: el.tags.historic,
        natural: el.tags.natural,
        leisure: el.tags.leisure,
        religion: el.tags.religion,
        amenity: el.tags.amenity,
        tourism: el.tags.tourism,
        website: el.tags.website,
        cuisine: el.tags.cuisine,
        stars: el.tags.stars,
      })).filter(place => place.name); // only return places with names
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw new Error(`Failed to fetch nearby ${type}`);
  }
};
