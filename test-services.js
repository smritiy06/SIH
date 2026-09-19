import { searchDestinations } from './src/services/geocodingService.js';
import { getWeatherForecast } from './src/services/weatherService.js';
import { getNearbyPlaces } from './src/services/placesService.js';
import { getCountrySafety } from './src/services/safetyService.js';

async function runTests() {
  console.log("1. Testing Geocoding (search 'Paris')...");
  const dests = await searchDestinations('Paris');
  console.log("Destinations found:", dests.length);
  if (dests.length > 0) {
    const { lat, lon } = dests[0];
    console.log(`Using lat: ${lat}, lon: ${lon}`);

    console.log("\n2. Testing Weather...");
    const weather = await getWeatherForecast(lat, lon);
    console.log("Current Temp:", weather.current.temperature_2m);

    console.log("\n3. Testing Places...");
    const places = await getNearbyPlaces(lat, lon, 'tourism', 2000);
    console.log("Attractions found:", places.length);
    if (places.length > 0) console.log("First attraction:", places[0].name);

    console.log("\n4. Testing Safety...");
    const safety = await getCountrySafety('FR');
    console.log("Safety Score:", safety?.score);
  }
}

runTests().catch(console.error);
