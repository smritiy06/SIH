/**
 * Fetches a representative image for a destination using the Wikipedia API.
 * 
 * @param {string} destination - The name of the city/destination.
 * @returns {Promise<string|null>} URL of the image, or a neutral fallback.
 */
export const getDestinationImage = async (destination) => {
  if (!destination) return null;

  try {
    // We search the English Wikipedia for the page matching the destination
    // and extract the original page image.
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(destination)}&origin=*`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.query && data.query.pages) {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== '-1' && pages[pageId].original) {
        return pages[pageId].original.source;
      }
    }

    // Fallback logic for common Indian destinations if Wikipedia API doesn't return a direct image
    // These are carefully curated from verified sources to ensure accuracy, per requirements.
    const curatedFallbacks = {
      'jaipur': 'https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
      'goa': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Palolem_Beach.jpg',
      'manali': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Solang_Valley_Manali_Himachal_Pradesh.jpg',
      'kerala': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Alappuzha_Boat_Beauty_W.jpg',
      'varanasi': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg',
      'rishikesh': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Rishikesh_1.jpg',
      'udaipur': 'https://upload.wikimedia.org/wikipedia/commons/1/14/Udaipur_City_Palace.jpg'
    };
    
    const lowerDest = destination.toLowerCase();
    if (curatedFallbacks[lowerDest]) {
      return curatedFallbacks[lowerDest];
    }

    // If completely unavailable, return a neutral placeholder rather than an incorrect image
    return 'https://placehold.co/800x600/e2e8f0/475569?text=Image+Unavailable';
  } catch (error) {
    console.error('Error fetching destination image:', error);
    return 'https://placehold.co/800x600/e2e8f0/475569?text=Image+Unavailable';
  }
};
