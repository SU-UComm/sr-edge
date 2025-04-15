import { FetchAdapter } from "../../global/js/utils/fetchAdapter";
import popularStoriesCFTemplate from './popular-stories-cf.hbs';

/**
 * Fetches popular stories from a Funnelback API based on provided URLs and filters.
 * @async
 * @param {string[]} urls - Array of URL paths to fetch stories for.
 * @param {number} storiesCount - The maximum number of stories to return.
 * @param {string} exclusionContentTypes - Space-separated list of content type IDs to exclude.
 * @param {string} exclusionIDs - Space-separated list of asset IDs to exclude.
 * @param {string} dateRangeQuery - Query string for date range filtering (e.g., "meta_d1=01Jan2023").
 * @param {Object} options - Configuration options.
 * @param {string} options.FB_JSON_URL - The base URL for the Funnelback JSON API.
 * @returns {Promise<Object[]|undefined>} Array of story results from Funnelback, or undefined if fetch fails.
 * @throws {Error} If the fetch request fails.
 */
async function popularStoriesFetcher(
    urls,
    storiesCount,
    exclusionContentTypes,
    exclusionIDs,
    dateRangeQuery,
    { FB_JSON_URL }
) {
    const adapter = new FetchAdapter();
    const assets = [];

    for (let i = 0; i < urls.length; i++) {
        assets.push(`assetHref:"${urls[i]}"`);
    }

    adapter.url = `${FB_JSON_URL}?profile=stanford-report-push-search&collection=sug~sp-stanford-report-search&num_ranks=${
        storiesCount + 15
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
function getDateRange(range) {
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
function formatDate(date) {
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
function getAPIDateRange(date) {
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
function getMaxPublishedDate(lengthOfTime) {
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

/**
 * A module for rendering a popular stories component.
 * @module PopularStories
 */
export default {
    /**
     * Renders a list of popular stories based on analytics and Funnelback data.
     * @async
     * @param {Object} args - Configuration options for fetching and rendering stories.
     * @param {number} args.storiesCount - The number of stories to return.
     * @param {number} args.APIrespCount - The number of API responses to fetch from analytics.
     * @param {string} args.sourcePath - The base path for filtering HTTP requests.
     * @param {string} [args.assetExclusions] - Comma-separated list of asset IDs to exclude.
     * @param {string} [args.contentTypeExclusions] - Comma-separated list of content type IDs to exclude.
     * @param {string} [args.APIdateRange] - Date range identifier for the API query (e.g., "1 month").
     * @param {string} [args.publishedDateMax] - Maximum published date range (e.g., "Past 1 year").
     * @param {Object} info - Environment and configuration data.
     * @param {Object} [info.env] - Environment variables.
     * @param {string} [info.env.FB_JSON_URL] - Funnelback JSON API URL.
     * @param {string} [info.env.MGT_API] - Management API URL for analytics.
     * @param {string} [info.env.CF_ANALYTICS_API] - Cloudflare Analytics API token.
     * @param {Object} [info.set] - Alternative configuration set.
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @returns {Promise<string>} The rendered HTML string from the content template.
     * @throws {Error} If required APIs are missing or fetches fail.
     */
    async main(args, info) {
        const adapter = new FetchAdapter();
        const { FB_JSON_URL, MGT_API, CF_ANALYTICS_API } = info?.env || info?.set?.environment || {};
        
        // Validate info properties
        if (typeof FB_JSON_URL !== 'string' || !FB_JSON_URL) {
            throw new Error('FB_JSON_URL must be a non-empty string');
        }
        if (typeof MGT_API !== 'string' || !MGT_API) {
            throw new Error('MGT_API must be a non-empty string');
        }
        if (typeof CF_ANALYTICS_API !== 'string' || !CF_ANALYTICS_API) {
            throw new Error('CF_ANALYTICS_API must be a non-empty string');
        }

        // Type check and destructure args
        if (typeof args !== 'object' || args === null) {
            throw new Error('args must be an object');
        }

        const {
            storiesCount,
            APIrespCount,
            sourcePath,
            assetExclusions = "",
            contentTypeExclusions = "",
            APIdateRange,
            publishedDateMax,
        } = args;

        // Validate args properties
        if (typeof storiesCount !== 'number' || isNaN(storiesCount) || storiesCount < 0) {
            throw new Error('storiesCount must be a non-negative number');
        }
        if (typeof APIrespCount !== 'number' || isNaN(APIrespCount) || APIrespCount < 0) {
            throw new Error('APIrespCount must be a non-negative number');
        }
        if (typeof sourcePath !== 'string' || !sourcePath) {
            throw new Error('sourcePath must be a non-empty string');
        }

        try {
            const dateRangeNumeric = getAPIDateRange(APIdateRange);
            let exclusionContentTypes =
                contentTypeExclusions && contentTypeExclusions.length > 0
                ? contentTypeExclusions
                    .split(",")
                    .map(
                        (num) =>
                        `${num.trim() !== "" ? `taxonomyContentTypeId:${num.trim()}` : ""}`
                    )
                    .join(" ")
                : "";

            exclusionContentTypes +=
                " taxonomyContentTypeId:28201 taxonomyContentTypeId:28216 taxonomyContentTypeId:28210";

            const exclusionIDs =
                assetExclusions && assetExclusions.length > 0
                ? assetExclusions
                    .split(",")
                    .map((num) => `${num.trim() !== "" ? `id:${num.trim()}` : ""}`)
                    .join(" ")
                : "";

            const dateRange = formatDate(getMaxPublishedDate(publishedDateMax));
            const dateRangeQuery = `meta_d1=${dateRange}`;

            const payload = {
                query: `query Viewer {
                    viewer {
                        zones(filter: { zoneTag_in: ["4f245bec971a45ca38091352b2e11951"] }) {
                        httpRequestsAdaptiveGroups(
                            filter: {
                            datetime_gt: "${getDateRange(dateRangeNumeric)}"
                            datetime_lt: "${getDateRange()}"
                            clientRequestHTTPHost: "news.stanford.edu"
                            requestSource: "eyeball"
                            edgeResponseStatus_lt: 300
                            AND: [
                                { clientRequestPath_like: "${sourcePath.trim()}" }
                                { clientRequestPath_notlike: "%/_admin%" }
                            ]
                            }
                            orderBy: [count_DESC]
                            limit: ${APIrespCount}
                        ) {
                            count
                            dimensions {
                            clientRequestHTTPHost
                            clientRequestPath
                            }
                        }
                        }
                    }
                }`,
            };

            let data = null;
            const urls = [];

            if (!MGT_API || !CF_ANALYTICS_API) {
                throw new Error("MGT_API and CF_ANALYTICS_API must be defined.");
            } else {
                const REQUEST_PROPS = {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${CF_ANALYTICS_API}`,
                    },
                    body: JSON.stringify(payload),
                };
                adapter.url = MGT_API;
                adapter.requestProps = REQUEST_PROPS;

                try {
                    data = await adapter.fetch();
                } catch (fetchError) {
                    throw new Error(`Analytics fetch failed: ${fetchError.message}`);
                }

                if (!data?.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups) {
                    throw new Error("No valid analytics data returned.");
                } else {
                    data.data.viewer.zones[0].httpRequestsAdaptiveGroups.forEach(
                        ({ dimensions }) => {
                        urls.push(dimensions.clientRequestPath);
                        }
                    );

                    try {
                        data = await popularStoriesFetcher(
                            urls,
                            storiesCount,
                            exclusionContentTypes,
                            exclusionIDs,
                            dateRangeQuery,
                            { FB_JSON_URL }
                        );
                    } catch (fetcherError) {
                        throw new Error(`Popular stories fetch failed: ${fetcherError.message}`);
                    }

                    const sortedData = [];
                    urls.forEach((url) => {
                        data.forEach((item) => {
                            if (item.liveUrl.includes(url)) sortedData.push(item);
                        });
                    });
                    data = sortedData.slice(0, storiesCount);
                }
            }

            const links = [];
            data.forEach((link) => { 
                try {
                    const url = link.listMetadata.assetHref;
                    const title = link.listMetadata.t;
                    links.push({ url, title });
                } catch (linkError) {
                    console.log("Error processing link:", linkError);
                }
            });

            const componentData = {
                title: "Popular stories",
                links
            };

            return popularStoriesCFTemplate(componentData);
        } catch (err) {
            return `<!-- Error rendering popular stories: ${err.message} -->`;
        }
    }
};