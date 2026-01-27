import { FetchAdapter } from "../../../global/js/utils/fetchAdapter";
/**
 * Fetches popular stories from a Funnelback API based on provided URLs and filters.
 * @async
 * @param {string[]} urls - Array of URL paths to fetch stories for.
 * @param {number} storiesCount - The maximum number of stories to return.
 * @param {string} exclusionContentTypes - Space-separated list of content type IDs to exclude.
 * @param {string} exclusionIDs - Space-separated list of asset IDs to exclude.
 * @param {string} dateRangeQuery - Query string for date range filtering (e.g., "meta_d1=01Jan2023").
 * @param {Object} options - Configuration options.
 * @param {number} APIrespCount - Number of results to request from Cloudflare Analytics API used to define num_ranks in Funnelback query.
 * @param {string} options.FB_JSON_URL - The base URL for the Funnelback JSON API.
 * @returns {Promise<Object[]|undefined>} Array of story results from Funnelback, or undefined if fetch fails.
 * @throws {Error} If the fetch request fails.
 */
export async function popularStoriesFetcher(
    urls,
    storiesCount,
    exclusionContentTypes,
    exclusionIDs,
    dateRangeQuery,
    APIrespCount,
    { FB_JSON_URL }
) {
    const adapter = new FetchAdapter();
    const assets = [];

    for (let i = 0; i < urls.length; i++) {
        assets.push(`assetHref:"${urls[i]}"`);
    }

    adapter.url = `${FB_JSON_URL}?profile=stanford-report-push-search&collection=sug~sp-stanford-report-search&num_ranks=${
        APIrespCount
    }&query=[${assets.join(
        " "
    )}]&${dateRangeQuery}&query_not=[${exclusionContentTypes} ${exclusionIDs}]`;
    const data = await adapter.fetch();

    return data?.response?.resultPacket?.results;
}

/**
 * Calculates a date range by subtracting a number of days from today.
 * @param {number} [range] - Number of days to subtract from the current date.
 * @returns {string} ISO string representation of the calculated date.
 */
export function getDateRange(range) {
    const date = new Date();
    if (range) {
        date.setDate(date.getDate() - range);
    }

    return date.toISOString();
}

/**
 * Formats a Date object into a string like "DDMonYYYY" (e.g., "01Jan2023").
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}${month}${year}`;
}

/**
 * Maps a date range string to a number of days.
 * @param {string} [date] - The date range identifier (e.g., "1 month").
 * @returns {number|undefined} Number of days corresponding to the range, or undefined if not mapped.
 */
export function getAPIDateRange(date) {
    const dateRangeMap = {
        "1 week": 7,
        "2 weeks": 14,
        "1 month": 30,
    };

    return dateRangeMap[date];
}

/**
 * Calculates a past date based on a predefined time range.
 * @param {string} [lengthOfTime] - The time range (e.g., "Past 1 year").
 * @returns {Date} The calculated past date.
 */
export function getMaxPublishedDate(lengthOfTime) {
    const dateRangeMap = {
        "Past 6 months": {
            days: 0,
            months: -6,
            years: 0,
        },
        "Past 1 year": {
            days: 0,
            months: 0,
            years: -1,
        },
        "Past 2 years": {
            days: 0,
            months: 0,
            years: -2,
        },
    };

    const date = new Date();
    date.setDate(date.getDate() + (dateRangeMap[lengthOfTime]?.days || 0));
    date.setMonth(date.getMonth() + (dateRangeMap[lengthOfTime]?.months || 0));
    date.setFullYear(date.getFullYear() + (dateRangeMap[lengthOfTime]?.years || 0));
    return date;
}
