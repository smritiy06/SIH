import axios from 'axios';

// The travel-advisory.info API provides safety scores per country
const BASE_URL = 'https://travel-advisory.info/api';

export const getCountrySafety = async (countryCode) => {
  if (!countryCode) return null;
  
  try {
    // The API uses ISO2 country codes
    const response = await axios.get(`${BASE_URL}?countrycode=${countryCode}`);
    
    if (response.data && response.data.data && response.data.data[countryCode]) {
      const countryData = response.data.data[countryCode];
      return {
        score: countryData.advisory.score, // 0 to 5, 5 being most dangerous
        message: countryData.advisory.message,
        source: countryData.advisory.source,
        updated: countryData.advisory.updated,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching safety data:', error);
    return null;
  }
};

// General safety tips to show regardless of country, as fallback or supplement
export const getGeneralSafetyTips = () => [
  {
    category: "Common Scams",
    title: "Taxi Overcharging",
    description: "Always insist on using the meter or agree on a fare before starting the journey. Use official taxi apps where available."
  },
  {
    category: "Security",
    title: "Pickpocketing",
    description: "Keep valuables secure in crowded tourist areas and public transport. Use anti-theft bags if possible."
  },
  {
    category: "Health",
    title: "Emergency Numbers",
    description: "Always save local emergency numbers (police, ambulance) and your country's embassy contact info offline."
  }
];
