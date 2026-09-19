import axios from 'axios';

// Open-Meteo API
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const getWeatherForecast = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Map WMO weather codes to descriptive text and icons
export const getWeatherCondition = (code) => {
  // WMO Weather interpretation codes (WW)
  const weatherMap = {
    0: { text: 'Clear sky', icon: 'Sun' },
    1: { text: 'Mainly clear', icon: 'Sun' },
    2: { text: 'Partly cloudy', icon: 'CloudSun' },
    3: { text: 'Overcast', icon: 'Cloud' },
    45: { text: 'Fog', icon: 'CloudFog' },
    48: { text: 'Depositing rime fog', icon: 'CloudFog' },
    51: { text: 'Light drizzle', icon: 'CloudRain' },
    53: { text: 'Moderate drizzle', icon: 'CloudRain' },
    55: { text: 'Dense drizzle', icon: 'CloudRain' },
    61: { text: 'Slight rain', icon: 'CloudRain' },
    63: { text: 'Moderate rain', icon: 'CloudRain' },
    65: { text: 'Heavy rain', icon: 'CloudRain' },
    71: { text: 'Slight snow fall', icon: 'CloudSnow' },
    73: { text: 'Moderate snow fall', icon: 'CloudSnow' },
    75: { text: 'Heavy snow fall', icon: 'CloudSnow' },
    95: { text: 'Thunderstorm', icon: 'CloudLightning' },
    96: { text: 'Thunderstorm with light hail', icon: 'CloudLightning' },
    99: { text: 'Thunderstorm with heavy hail', icon: 'CloudLightning' },
  };

  return weatherMap[code] || { text: 'Unknown', icon: 'Cloud' };
};
