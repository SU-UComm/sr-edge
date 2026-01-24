import { FetchAdapter } from "../../global/js/utils/fetchAdapter";
import { popularStoriesFetcher, getDateRange, formatDate, getAPIDateRange, getMaxPublishedDate } from "./scripts/popularStoriesHelpers"
import popularStoriesCFTemplate from './popular-stories-cf.hbs';

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
        // Extracting environment variables from provided info
        const { FB_JSON_URL, MGT_API, CF_ANALYTICS_API } = info?.env || info?.set?.environment || {};

        // Extracting configuration data from arguments 
        const { storiesCount, assetExclusions, contentTypeExclusions, sourcePath, APIrespCount, APIdateRange, publishedDateMax } = args || {};

        // Validate required environment variables
        try {
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(FB_JSON_URL)} was received.`
                );
            }
            if (typeof MGT_API !== 'string' || MGT_API === '') {
                throw new Error(
                    `The "MGT_API" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(MGT_API)} was received.`
                );
            }
            if (typeof CF_ANALYTICS_API !== 'string' || CF_ANALYTICS_API === '') {
                throw new Error(
                    `The "CF_ANALYTICS_API" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(CF_ANALYTICS_API)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Popular Stories CF component: ', er);
            return `<!-- Error occurred in the Popular Stories CF component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (storiesCount && typeof storiesCount !== 'number' || ![5, 10, 15, 20].includes(storiesCount)) {
                throw new Error(
                    `The "storiesCount" field must be a number one of [5, 10, 15, 20]. The ${JSON.stringify(storiesCount)} was received.`
                );
            }
            if (assetExclusions && typeof assetExclusions !== 'string') {
                throw new Error(
                    `The "assetExclusions" field must be a string. The ${JSON.stringify(assetExclusions)} was received.`
                );
            }
            if (contentTypeExclusions && typeof contentTypeExclusions !== 'string') {
                throw new Error(
                    `The "contentTypeExclusions" field must be a string. The ${JSON.stringify(contentTypeExclusions)} was received.`
                );
            }
            if (sourcePath && typeof sourcePath !== 'string') {
                throw new Error(
                    `The "sourcePath" field must be a string. The ${JSON.stringify(sourcePath)} was received.`
                );
            }
            if (APIrespCount && typeof APIrespCount !== 'number' || ![30, 60].includes(APIrespCount)) {
                throw new Error(
                    `The "APIrespCount" field must be a number one of [30, 60]. The ${JSON.stringify(APIrespCount)} was received.`
                );
            }
            if (APIdateRange && !["1 week", "2 weeks", "1 month"].includes(APIdateRange) ) {
                throw new Error(
                    `The "APIdateRange" field must be one of ["1 week", "2 weeks", "1 month"]. The ${JSON.stringify(APIdateRange)} was received.`
                );
            }
            if (publishedDateMax && !["Past 6 months", "Past 1 year", "Past 2 years"].includes(publishedDateMax) ) {
                throw new Error(
                    `The "publishedDateMax" field must be one of ["Past 6 months", "Past 1 year", "Past 2 years"]. The ${JSON.stringify(publishedDateMax)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Popular Stories CF component: ', er);
            return `<!-- Error occurred in the Popular Stories CF component: ${er.message} -->`;
        }

        const adapter = new FetchAdapter();
        let data = null;
        const urls = [];

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

        // Exclude Leadership Messages, In The News, Announcement, and the topics Community Message & University Statement
        exclusionContentTypes +=
            " taxonomyContentTypeId:28201 taxonomyContentTypeId:28216 taxonomyContentTypeId:28210 taxonomyContentMainTopicId:169602 taxonomyContentMainTopicId:169604";

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
                            { clientRequestPath_notlike: "/stories/200%/%" }
                            { clientRequestPath_notlike: "/stories/201%/%" }
                            { clientRequestPath_notlike: "/stories/2020/%" }
                            { clientRequestPath_notlike: "/stories/2021/%" }
                            { clientRequestPath_notlike: "/stories/2022/%" }
                            { clientRequestPath_notlike: "/stories/2023/%" }
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

        // Compose and fetch the popular stories results
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
        } catch (er) {
            console.error('Error occurred in the Popular Stories CF component: Analytics fetch failed: ', er);
            return `<!-- Error occurred in the Popular Stories CF component: Analytics fetch failed: ${er.message} -->`;
        }

        try {
            data.data.viewer.zones[0].httpRequestsAdaptiveGroups.forEach(
                ({ dimensions }) => {
                    urls.push(dimensions.clientRequestPath);
                }
            );

            data = await popularStoriesFetcher(
                urls,
                storiesCount,
                exclusionContentTypes,
                exclusionIDs,
                dateRangeQuery,
                { FB_JSON_URL }
            );
        
            const sortedData = [];
            urls.forEach((url) => {
                data.forEach((item) => {
                    if (item.liveUrl.includes(url)) sortedData.push(item);
                });
            });
            data = sortedData.slice(0, storiesCount);
        } catch (er) {
            console.error('Error occurred in the Popular Stories CF component: Popular stories fetch failed: ', er);
            return `<!-- Error occurred in the Popular Stories CF component: Popular stories fetch failed: ${er.message} -->`;
        }
            

        const links = [];
        data.forEach((link) => { 
            links.push({ url: link?.listMetadata?.assetHref, title: link?.listMetadata?.t });
        });

        const componentData = {
            links
        };

        return popularStoriesCFTemplate(componentData);
    }
};