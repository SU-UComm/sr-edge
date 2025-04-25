import { getCookie } from "../getCookie";
import { translatePersonalisationProfile } from "../translatePersonalisationProfile";
import { formatCardDataFunnelback } from "../formatCardDataFunnelback";

/**
 * Fetches and formats user-specific story cards from Funnelback based on search query, audience profile,
 * and current page context.
 *
 * @async
 * @function fetchUserStories
 * @param {Object} options - The options for fetching user stories.
 * @param {string} options.FB_JSON_URL - The base URL of the Funnelback JSON API.
 * @param {string} options.searchQuery - The Funnelback search query to execute.
 * @param {string} [options.currentPageAssetId] - Optional ID of the current page to exclude from results.
 * @param {string} options.baseDomain - The base domain used to format returned URLs.
 * @returns {Promise<Array<Object>>} A Promise that resolves to an array of formatted card objects.
 */

export async function fetchUserStories({ FB_JSON_URL, searchQuery, currentPageAssetId, baseDomain }) {
    const audience = translatePersonalisationProfile(getCookie("preferences_personalisation"));
  
    let fbUrl = `${FB_JSON_URL}${searchQuery}`;
  
    if (audience && !fbUrl.includes("meta_taxonomyAudienceText")) {
      fbUrl += `&meta_taxonomyAudienceText=${audience}`;
    }
  
    if (currentPageAssetId) {
      fbUrl += `&query_not=[id:${currentPageAssetId}]`;
    }
  
    const response = await fetch(fbUrl);
    const json = await response.json();
    const results = json?.response?.resultPacket?.results || [];
  
    const data = results.map(card => formatCardDataFunnelback(card, baseDomain));
    return data;
  }
  