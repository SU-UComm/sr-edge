import storiesCarouselTemplate from './stories-carousel.hbs';
import { linkedHeadingService, uuid } from "../../global/js/utils";
import { Carousel, Card } from "../../global/js/helpers";
import { fetchUserStories } from "../../global/js/utils/fetchUserStories";
import { processEditor } from '../../global/js/utils/processEditor';

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

        // Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        
        // Extracting environment variables from provided info
        const { FB_JSON_URL, BASE_DOMAIN, BASE_PATH, NEWS_ARCHIVE_PATH } = info?.env || info?.set?.environment || {};
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        
        // Extracting configuration data from arguments
        // const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { searchQuery } = args?.contentConfiguration || {};
        
        const MAX_CARDS = 6;
        let dataSource = "content";

        const assetCtx = info?.ctx ||  {};
        // const currentAssetId = assetCtx?.assetId || 169707;
        const currentAssetId = assetCtx?.assetId;

   
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
        

        if (squizEdit) {
            
            headingInfo.title = headingInfo.title || "Heading text"
            headingInfo.ctaUrl = headingInfo.ctaUrl || null;
            headingInfo.ctaText = headingInfo.ctaText || "Link text";
            
        }



        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            headingInfo
        );

        
        if (headingData && !headingData.ctaLink) {            
            // there is a case where these environment variable cause 
            // https://news.stanford.edu//news-archive/
            // we should strip the double slash but preserve protocol://            
            headingData.ctaLink = `${BASE_DOMAIN}${BASE_PATH}${NEWS_ARCHIVE_PATH}`;
            headingData.ctaLink = headingData.ctaLink.replace(/([^:])\/\//g, '$1/');
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
            id: uniqueClass,
            title: headingData.title,
            isAlwaysLight: false,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            ctaText: headingData.ctaText,
            carousel: Carousel({ variant:"cards", slides: cardData.join(''), uniqueClass: uniqueClass }),
            modalData,
            width: "large",
            dataSource,
            query
        };

        // Configure squizEditTargets for inline editing
        const squizEditTargets = {
            "headingTitle": { "field": "headingConfiguration.title" },
            "headingCtaText": { "field": "headingConfiguration.ctaText" }
        };

        // Early return for non-edit mode
        if (!squizEdit) {
            return storiesCarouselTemplate(componentData);
        }

        // Process and return template with inline editing support
        return processEditor(storiesCarouselTemplate(componentData), squizEditTargets);
    }
};