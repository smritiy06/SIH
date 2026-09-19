import axios from 'axios';
const searchDestinations = async (query) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: 'json', addressdetails: 1, limit: 5, countrycodes: 'in' },
      headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'TravelMate-App/1.0' },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};
searchDestinations('Jaipur');
