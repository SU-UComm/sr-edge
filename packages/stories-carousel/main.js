import storiesCarouselTemplate from './stories-carousel.hbs';
import { linkedHeadingService, uuid } from "../../global/js/utils";
import { Carousel, Card } from "../../global/js/helpers";
import { fetchUserStories } from "../../global/js/utils/fetchUserStories";
import { isEditor } from "../../global/js/utils/isEditor";

/**
 * Stories carousel component that renderds a list of cards based on fetched data.
 */
export default {
    /**
     * Renders the Stories carousel component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.headingConfiguration - The header configuration for the component.
     * @param {string} [args.headingConfiguration.title] - The text for the heading (optional).
     * @param {string} [args.headingConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaNewWindow] - Flag to open CTA link in new window (optional).
     * @param {Object} args.contentConfiguration - The content configuration for the component.
     * @param {string} args.contentConfiguration.searchQuery - The query for the search resutls.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args, info) {
        // Extracting environment variables from provided info
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN, BASE_PATH, NEWS_ARCHIVE_PATH } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        const { ctx } = info;
        
        // Extracting configuration data from arguments
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { searchQuery } = args?.contentConfiguration || {};
        const editMode = isEditor(ctx.url);
        
        const MAX_CARDS = 6;
        let dataSource = "content";

        const assetCtx = info?.ctx ||  {};
        // const currentAssetId = assetCtx?.assetId || 169707;
        const currentAssetId = assetCtx?.assetId;

        // Validate required environment variables
        try {
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(FB_JSON_URL)} was received.`
                );
            }
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof BASE_PATH !== 'string' || BASE_PATH === '') {
                throw new Error(
                    `The "BASE_PATH" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_PATH)} was received.`
                );
            }
            if (typeof NEWS_ARCHIVE_PATH !== 'string' || NEWS_ARCHIVE_PATH === '') {
                throw new Error(
                    `The "NEWS_ARCHIVE_PATH" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(NEWS_ARCHIVE_PATH)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Stories carousel component: ', er);
            return `<!-- Error occurred in the Stories carousel component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (typeof searchQuery !== 'string' || searchQuery === '' || searchQuery === '?') {
                throw new Error(
                    `The "searchQuery" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(searchQuery)} was received.`
                );
            }
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (ctaUrl && typeof ctaUrl !== 'string') {
                throw new Error(
                    `The "ctaUrl" field must be a string. The ${JSON.stringify(ctaUrl)} was received.`
                );
            }
            if (ctaManualUrl && typeof ctaManualUrl !== 'string') {
                throw new Error(
                    `The "ctaManualUrl" field must be a string. The ${JSON.stringify(ctaManualUrl)} was received.`
                );
            }
            if (ctaText && typeof ctaText !== 'string') {
                throw new Error(
                    `The "ctaText" field must be a string. The ${JSON.stringify(ctaText)} was received.`
                );
            }
            if (ctaNewWindow && typeof ctaNewWindow !== 'boolean') {
                throw new Error(
                    `The "ctaNewWindow" field must be a boolean. The ${JSON.stringify(ctaNewWindow)} was received.`
                );
            }
            
        } catch (er) {
            console.error('Error occurred in the Stories carousel component: ', er);
            return `<!-- Error occurred in the Stories carousel component: ${er.message} -->`;
        }
        
        let data = [];

        let query = searchQuery;
        let fallbackFbUrl = "";
        // handle the input querystring
        // remove the ?
        const cleanedQuery = query.startsWith('?') ? query.slice(1) : query;
        // Parse query string into an object
        const params = cleanedQuery.split('&').reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            if (key && value !== undefined) { // Ensure key exists and value is defined
              acc[key] = decodeURIComponent(value); // Decode URL-encoded values
            }
            return acc;
          }, {});
        let headingInfo = args.headingConfiguration;
        // Extract specific values
        const isGlobal = params.global === 'true'; // Check if global=true
        const audience = params.meta_taxonomyAudienceText || ""; // Get audience value or null if not present
        
        if(isGlobal){
            dataSource = "global";
            const apiData = `${BASE_DOMAIN}_api/mx/storycarousel?story=${currentAssetId}`;
            const res = await fetch(apiData);
            const props = await res.json();

            // Construct the FB URL
            if (props?.search) {
                query = `?profile=${props.search.profile}&collection=${props.search.collection}${
                    props.search.maintopic?.asset_name !== ""
                    ? `&query=[taxonomyContentMainTopicId:${props.search.maintopic?.asset_assetid} taxonomyContentTopicsId:${props.search.maintopic?.asset_assetid} taxonomyContentSubtopicsId:${props.search.maintopic?.asset_assetid}]`
                    : ""
                }&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${
                    props.search.currentPage
                }]&num_ranks=${MAX_CARDS}&sort=date&meta_taxonomyAudienceText=${audience}`;

                fallbackFbUrl = `?profile=${props.search.profile}&collection=${
                    props.search.collection
                }&query_not=[taxonomyContentTypeId:28210 taxonomyContentTypeId:28216 taxonomyContentTypeId:28201 id:${
                    props.search.currentPage
                }]&num_ranks=12&sort=date`;

                if (props.search.contentType === "Video") {
                    fallbackFbUrl += "&meta_taxonomyContentTypeId=28207";
                    query += "&meta_taxonomyContentTypeId=28207";
                }
            }
            headingInfo = props.headingConfiguration;
        }

        try {
            
            data = await fetchUserStories({
                FB_JSON_URL,
                searchQuery: query,
                currentPageAssetId: currentAssetId,
                baseDomain: BASE_DOMAIN,
            });
        
            // fallback when no data is found
            if(isGlobal && Array.isArray(data) && data.length < MAX_CARDS){
                // fallbackFbUrl
                query = fallbackFbUrl;
                dataSource = "global-fallback";
                const fallbackData = await fetchUserStories({
                    FB_JSON_URL,
                    searchQuery: fallbackFbUrl,
                    currentPageAssetId: currentAssetId,
                    baseDomain: BASE_DOMAIN,
                });
                fallbackData.forEach(item => data.push(item));
            }

            if (Array.isArray(data) && data.length > MAX_CARDS) {
                data = data.slice(0, MAX_CARDS);
            }
            
        } catch (er) {
            console.error('Error occurred in the Stories carousel component while fetching user stories:', er);
            return `<!-- Error occurred in the Stories carousel component: ${er.message} -->`;
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            headingInfo
        );
        
        if (headingData && !headingData.ctaLink) {
            headingData.ctaLink = `${BASE_DOMAIN}${BASE_PATH}${NEWS_ARCHIVE_PATH}`;
        }

        const cardData = [];
        const modalData = [];
        let uniqueClass = ""
        
        if (data !== null && data !== undefined) {
            uniqueClass = uuid();
            
            data.forEach((card) => {
                const uniqueID = uuid();
                cardData.push(
                    `<div class="swiper-slide">
                        ${Card({data: card, displayDescription: false, uniqueId: uniqueID})}
                    </div>`
                );

                if (card.type === 'Video' || card.videoUrl) {
                    modalData.push({
                        isVertical: card.size === "vertical-video",
                        videoId: card.videoUrl,
                        title: `Watch ${card.title}`, 
                        noAutoPlay: true,
                        uniqueID: uniqueID,
                        titleID: 'card-modal'
                    })
                }
            });
        }

        // Validate fetched card data
        try {
            if (typeof cardData !== 'object' || cardData.length < 1) {
                throw new Error(
                    `The "data" cannot be undefined or null. The ${JSON.stringify(cardData)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Stories carousel component: ', er);
            return `<!-- Error occurred in the Stories carousel component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            title: headingData.title,
            isAlwaysLight: false,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            ctaText: headingData.ctaText,
            carousel: Carousel({ variant:"cards", slides: cardData.join(''), uniqueClass: uniqueClass }),
            modalData,
            width: "large",
            dataSource,
            query,
            editMode
        };
        
        return storiesCarouselTemplate(componentData);
    }
};