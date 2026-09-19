# TravelMate

TravelMate is a smart tourism platform that helps users discover, plan, stay, eat, experience, and stay safe during a trip. It is built as a fully functional frontend application using real data APIs without fabricating any information.

## Features

- **Destination Discovery**: Search and select real places using the OpenStreetMap Nominatim API.
- **Trip Planning**: Enter travel dates, budget, travelers, and interests to generate a personalized trip.
- **Smart Dashboard**: A unified dashboard displaying everything you need for your trip.
- **Personalized Itinerary**: Generates a daily itinerary based on real nearby attractions and food places.
- **Weather Forecast**: Real-time current weather and daily forecasts for your destination (via Open-Meteo).
- **Nearby Places & Accommodation**: Fetches real attractions, restaurants, and hotels near your destination using the Overpass API.
- **Safety Advisories**: Displays real country-specific travel advisories and general safety tips.
- **Local Events**: Can fetch local events via Ticketmaster if an API key is provided, handles missing key gracefully.

## Tech Stack

- **Frontend**: React (Vite), JavaScript, Tailwind CSS
- **Routing**: React Router
- **State/Storage**: LocalForage (IndexedDB/LocalStorage) for saving the current trip state across reloads.
- **Icons**: Lucide React
- **Data Fetching**: Axios

## API Integrations

This project strictly avoids fake data. It relies on the following public APIs:

1. **Geocoding (Destination Search)**: [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/) - Free, no key required.
2. **Weather**: [Open-Meteo](https://open-meteo.com/) - Free, no key required.
3. **Places, Food, Hotels**: [Overpass API (OpenStreetMap)](https://overpass-api.de/) - Free, no key required.
4. **Safety Advisories**: [travel-advisory.info](https://www.travel-advisory.info/) - Free, no key required.
5. **Local Events**: Ticketmaster Discovery API - **API key required**.

## Getting Started

### 1. Installation

```bash
git clone <repository-url>
cd TravelMate
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

If you have a Ticketmaster API key for local events, add it to `.env`:
```
VITE_EVENTS_API_KEY=your_key_here
```
*(If you don't add this key, the application will still function perfectly but will gracefully indicate that event data is unavailable).*

### 3. Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Architecture & Code Structure

- `src/components/`: Reusable UI components (Navbar, DestinationSearch).
- `src/pages/`: Main route components (Home, PlanTrip, Dashboard, Explore, Safety).
- `src/services/`: Isolated API fetching logic. Keeps components clean and handles error states.
- `src/App.jsx`: Main routing setup.

## Note on "Fake Data"

Per the project requirements, **no fake data is used**. All destinations, weather, places, and safety data are fetched live. If a network request fails or data is unavailable for a specific location, the app gracefully displays an empty or fallback state.
