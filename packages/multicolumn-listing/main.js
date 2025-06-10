import multicolumnListingTemplate from './multicolumn-listing.hbs';
import { cardDataAdapter, funnelbackCardService, matrixCardService, linkedHeadingService, multicolumnGrid, uuid } from "../../global/js/utils";
import { Card } from '../../global/js/helpers';

/**
 * Multicolumn lisitng component that renderds a list of features cards based on fetched data
 */
export default {
    /**
     * Renders the Multicolumn listing component.
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
     * @param {string} args.contentConfiguration.source - Flag specifying where the Funnelback or Matrix data should be retrieved from.
     * @param {string} [args.contentConfiguration.searchQuery] - The query for the search resutls (optional).
     * @param {string} [args.contentConfiguration.featuredDescription] - The description that shluld be replaced for featured card (optional).
     * @param {string} [args.contentConfiguration.cards] - The list of cards to display (optional).
     * @param {Object} args.displayConfiguration - The display configuration for the component.
     * @param {string} args.displayConfiguration.alignment - The aligment of feature card.
     * @param {string} [args.displayConfiguration.displayThumbnails] - The flag to show card thumbnails (optional).
     * @param {string} [args.displayConfiguration.displayDescriptions] - The flag to show card description (optional).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args, info) {
        // Extracting environment variables from provided info
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extracting configuration data from arguments
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { source, searchQuery, searchMaxCards, cards } = args?.contentConfiguration || {};
        const { displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};

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
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn listing component: ', er);
            return `<!-- Error occurred in the Multicolumn listing component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
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
            if (!['Search', 'Select'].includes(source)) {
                throw new Error(
                    `The "source" field cannot be undefined and must be one of ['Search', 'Select'] value, ${JSON.stringify(source)} was received.`
                );
            }
            if (source === 'Search' && (typeof searchQuery !== 'string' || searchQuery === '' || searchQuery === '?')) {
                throw new Error(
                    `The "searchQuery" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(searchQuery)} was received.`
                );
            }
            if (source === 'Search' && (typeof searchMaxCards !== 'number' || searchMaxCards  < 2 || searchMaxCards > 3)) {
                throw new Error(
                    `The "searchMaxCards" field cannot be undefined and must be a number between 2 and 3. The ${JSON.stringify(searchMaxCards)} was received.`
                );
            }
            if (source === 'Select' && typeof cards !== 'object') {
                throw new Error(
                    `The "cards" field must be an array. The ${JSON.stringify(cards)} was received.`
                );
            }
            if (displayDescriptions && typeof displayDescriptions !== 'boolean') {
                throw new Error(
                    `The "displayDescriptions" field must be a boolean. The ${JSON.stringify(displayDescriptions)} was received.`
                );
            }
            if (displayThumbnails && typeof displayThumbnails !== 'boolean') {
                throw new Error(
                    `The "displayThumbnails" field must be a boolean. The ${JSON.stringify(displayThumbnails)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn listing component: ', er);
            return `<!-- Error occurred in the Multicolumn listing component: ${er.message} -->`;
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Determine data source: "Search" (fetching from Funnelback) or "Select" (Matrix API)
        if (source.toLowerCase() === "search") {
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });

            adapter.setCardService(service);
            data = await adapter.getCards();
        } else {
            const { cards } = args.contentConfiguration;
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            adapter.setCardService(service);
            data = await adapter.getCards(cards);
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(fnsCtx, { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow });

        const cardsMarkup = [];

        const maxNumberOfCards =
            source === "Search"
                ? searchMaxCards
                : 3;
        const numberOfCards = data.length > maxNumberOfCards ? maxNumberOfCards : data.length;
        const cardSizeMap = new Map();

        cardSizeMap.set(3, "small");
        cardSizeMap.set(2, "medium");

        const modalData = [];

        // Generate modals for video cards
        data?.forEach((cardData, i) => {
            if (i < maxNumberOfCards) {
                const uniqueId = uuid();
                if (source === "Search") {
                    cardsMarkup.push(
                        Card({data: cardData, displayDescription: displayDescriptions, displayThumbnail: displayThumbnails, cardSize: cardSizeMap.get(searchMaxCards), uniqueId}))
                }
                else {
                    cardsMarkup.push(
                        Card({data: cardData, displayDescription: displayDescriptions, displayThumbnail: displayThumbnails, cardSize: cardSizeMap.get(numberOfCards), uniqueId}))
                }

                if(cardData.type === 'Video') {
                    modalData.push({
                        isVertical: cardData.size === "vertical-video",
                        videoId: cardData.videoUrl,
                        title: `Watch ${cardData.title}`, 
                        noAutoPlay: true,
                        uniqueID: uniqueId,
                        titleID: 'card-modal'
                    })
                }
            }
        });

        // Prepare component data for template rendering
        const componentData = {
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            multicolumnGrid: multicolumnGrid(cardsMarkup, true),
            modalData,
            width: "large",
        };

        return multicolumnListingTemplate(componentData);
    }
};
