import axios from 'axios';

// Nominatim API for geocoding
const BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const searchDestinations = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        countrycodes: 'in' // Restrict search to India
      },
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        // Nominatim requires a user agent or might block requests if abused
        'User-Agent': 'TravelMate-App/1.0',
      },
    });
    
    return response.data.map((item) => ({
      id: item.place_id,
      name: item.name || item.display_name.split(',')[0],
      fullName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.village || item.name,
      country: item.address?.country,
    }));
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw new Error('Failed to fetch destinations');
  }
};
