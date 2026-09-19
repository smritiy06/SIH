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
  } else {
    queryTag = `["${type}"]`; // generic fallback
  }

  // Find nodes with names within radius
  const query = `
    [out:json][timeout:25];
    (
      node${queryTag}["name"](around:${radius},${lat},${lon});
    );
    out body 20;
  `;

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
        type: el.tags.tourism || el.tags.amenity,
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
