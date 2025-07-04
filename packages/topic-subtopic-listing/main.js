import xss from "xss";
import { cardDataAdapter, funnelbackCardService, uuid, formatNewsDate, isRealExternalLink } from "../../global/js/utils";
import { pagination } from "../../global/js/helpers";
import { processEditor } from "../../global/js/utils/processEditor";
import topicListingTemplate from "./topic-subtopic-listing.hbs";

/**
 * @module TopicSubtopicListing
 * @description A module for rendering a topic/subtopic listing from Funnelback search results,
 * displaying cards in a horizontal grid with pagination.
 */
export default {
    /**
     * Fetches and processes Funnelback search results, rendering them as a topic/subtopic listing.
     * 
     * @async
     * @function main
     * @param {Object} args - Configuration arguments for the listing.
     * @param {Object} args.displayConfiguration - Display settings for the component.
     * @param {string} args.displayConfiguration.searchQuery - The search query to fetch results from Funnelback.
     * @param {string} args.displayConfiguration.displayStyle - The style of display, affecting card rendering 
     * (e.g., "Press Center", "Leadership Messages", "University Updates", "Announcements", "In the News").
     * @param {Object} info - Contextual information including environment variables.
     * @param {Object} [info.env] - Environment variables (preferred source).
     * @param {string} [info.env.FB_JSON_URL] - The base URL for the Funnelback JSON API.
     * @param {Object} [info.set] - Alternative source for environment variables.
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @param {string} [info.set.environment.FB_JSON_URL] - Alternative base URL for the Funnelback JSON API.
     * @returns {Promise<string>} The rendered HTML string from the topicListingTemplate, or an error comment if processing fails.
     * @throws {Error} If FB_JSON_URL or query is invalid or if the fetch operation fails.
     */
    async main(args, info) {
        // Extracting environment variables from provided info
        const { FB_JSON_URL } = info?.env || info?.set?.environment || {};
        
        // Extracting configuration data from arguments 
        let { searchQuery, displayStyle } = args?.displayConfiguration || {};

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        if(squizEdit) {
            searchQuery = searchQuery || "?profile=stanford-report-push-search&collection=sug~sp-stanford-report-search&sort=date&log=false";
        }

        if(!squizEdit) {
            // Validate required fields and ensure correct data types
            try {
                if (typeof searchQuery !== 'string' || searchQuery === '' || searchQuery === '?') {
                    throw new Error(
                        `The "searchQuery" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(searchQuery)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Topic subtopic listing component: ', er);
                return `<!-- Error occurred in the Topic subtopic listing component: ${er.message} -->`;
            }
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Compose and fetch the FB search results
        const query = searchQuery;
        const service = new funnelbackCardService({ FB_JSON_URL, query });

        // Set our card service
        adapter.setCardService(service);

        // Get the result data
        try {
            data = await adapter.getResultData();
        } catch (er) {
            console.error('Error occurred in the Topic subtopic listing component: Error parsing Funnelback JSON response: ', er);
            if (squizEdit) {
                // In edit mode, provide mock data instead of throwing error
                data = [];
                return `<div></div>`;
            }
        }

        const resultsSummary = data?.resultsSummary;
        const modalData = [];

        const cards = data?.cards?.map((card) => {
            const cardData = {
                uniqueID: uuid(),
                type: card.type,
                iconType: card.type.toLowerCase(),
                title: xss(card.title),
                description: xss(card.description),
                date: formatNewsDate(card.date),
                liveUrl: card.liveUrl,
                isRealExternalLink: isRealExternalLink(card?.liveUrl),
                isExternalLink: isRealExternalLink(card?.liveUrl) && (Array.isArray(card?.isTeaser) ? card.isTeaser[0] === "true" : card?.isTeaser === "true"),
                imageUrl: card.imageUrl,
                imageAlt: card.imageAlt,
                avatarSize: "small",
                avatarRef: card.authorAvatar || Array.isArray(card.imageUrl) ? card.imageUrl[0] : card.imageUrl,
                avatarAlt: `Photo of ${card.authorDisplayName ? card.authorDisplayName : card.title}`,
                taxonomy: xss(card.taxonomy),
                taxonomyUrl: card.taxonomyUrl,
                taxonomyFeaturedUnitText: xss(card.taxonomyFeaturedUnitText),
                taxonomyFeaturedUnitLandingPageUrl: card.taxonomyFeaturedUnitLandingPageUrl,
                storySource: xss(card.storySource),
                videoUrl: card.videoUrl
            }

            
            if(card.type === 'Video' || card.videoUrl) {
                modalData.push({
                    isVertical: card.size === "vertical-video",
                    videoId: card.videoUrl,
                    title: `Watch ${card.title}`, 
                    noAutoPlay: true,
                    uniqueID: cardData.uniqueID,
                    titleID: 'card-modal'
                })
            }

            if(["Press Center", "Leadership Messages", "University Updates", "Announcements", "In the News"].includes(displayStyle)) {
                cardData.displayConfiguration = displayStyle;
                return { data: cardData, cardType: "narrowhorizontal" }
            } 

            return { data: cardData, cardType: "horizontal", cardSize: "large" }
        });

        if(!squizEdit) {
            if(typeof cards !== 'object' || cards.length < 1) {
                throw new Error(
                    `The "cards" cannot be undefined or null. The ${JSON.stringify(cards)} was received.`
                );
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            width: "large",
            orientation: "topiclisting",
            cards,
            pages: pagination({
                pageNumber: Number(resultsSummary.currStart),
                allResults: resultsSummary.totalMatching,
                resultsPerPage: resultsSummary.numRanks,
                paginationRange: 5
            }),
            modalData,
            query: searchQuery,
            endpoint: FB_JSON_URL,
            display: displayStyle,
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) return topicListingTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(topicListingTemplate(componentData), squizEditTargets);
    }
}
