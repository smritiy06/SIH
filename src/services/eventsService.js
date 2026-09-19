import axios from 'axios';

// Ticketmaster Discovery API
const API_KEY = import.meta.env.VITE_EVENTS_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

export const getLocalEvents = async (lat, lon, radius = 50, unit = 'km') => {
  if (!API_KEY) {
    return {
      error: true,
      message: 'Events API key not configured. Please add VITE_EVENTS_API_KEY to your .env file.',
      data: []
    };
  }

  try {
    // Ticketmaster uses geohash or latlong
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        latlong: `${lat},${lon}`,
        radius,
        unit,
        sort: 'date,asc',
        size: 10,
      }
    });
    
    if (response.data && response.data._embedded && response.data._embedded.events) {
      return {
        error: false,
        data: response.data._embedded.events.map(event => ({
          id: event.id,
          name: event.name,
          url: event.url,
          images: event.images,
          date: event.dates?.start?.localDate,
          time: event.dates?.start?.localTime,
          venues: event._embedded?.venues?.map(v => v.name).join(', '),
          category: event.classifications?.[0]?.segment?.name || 'Event'
        }))
      };
    }
    
    return { error: false, data: [] };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      error: true,
      message: 'Failed to fetch events from the provider.',
      data: []
    };
  }
};
