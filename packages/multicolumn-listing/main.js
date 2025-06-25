import multicolumnListingTemplate from './multicolumn-listing.hbs';
import { cardDataAdapter, funnelbackCardService, matrixCardService, linkedHeadingService, multicolumnGrid, uuid } from "../../global/js/utils";
import { Card } from '../../global/js/helpers';
import { processEditor } from '../../global/js/utils/processEditor';

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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Extracting environment variables from provided info
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // Extracting configuration data from arguments
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { source, searchQuery, searchMaxCards, cards } = args?.contentConfiguration || {};
        const { displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = info?.ctx?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;


        if (squizEdit) {
            // defaults
            title = title || "Heading text";
            ctaText = ctaText || "Link text";
            ctaManualUrl = ctaManualUrl || "https://news.stanford.edu";
            // Clear ctaUrl in edit mode to prevent Matrix URI resolution issues
            ctaUrl = null;

            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
        }

        // Validate required fields and ensure correct data types
        try {
            if (!squizEdit) {
                // Add this in the validation try-catch block
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
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
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn listing component: ', er);
            return `<!-- Error occurred in the Multicolumn listing component: ${er.message} -->`;
        }

        const adapter = new cardDataAdapter();
        let dataPromise = null;

        // Determine data source and set up promise: "Search" (fetching from Funnelback) or "Select" (Matrix API)
        if (source.toLowerCase() === "search") {
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });

            adapter.setCardService(service);
            dataPromise = adapter.getCards();
        } else {
            const { cards } = args.contentConfiguration;
            
            // In edit mode, provide default cards if none are selected
            if (squizEdit && (!cards || cards.length === 0)) {
                dataPromise = Promise.resolve([
                    {
                        type: "Feature",
                        title: "Sample Selected Card 1",
                        liveUrl: "https://news.stanford.edu",
                        description: "This is a sample card for when 'Select' mode is chosen but no cards are selected yet.",
                        imageUrl: "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        imageAlt: "Sample card image",
                        taxonomy: "Featured Content",
                        taxonomyUrl: "https://news.stanford.edu",
                        videoUrl: null,
                        date: new Date().toISOString().split('T')[0],
                        source: null,
                        authorName: null,
                        authorEmail: null
                    },
                    {
                        type: "News",
                        title: "Sample Selected Card 2",
                        liveUrl: "https://news.stanford.edu",
                        description: "Another sample card showing the Select mode layout with multiple cards.",
                        imageUrl: "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        imageAlt: "Another sample card image",
                        taxonomy: "News",
                        taxonomyUrl: "https://news.stanford.edu",
                        videoUrl: null,
                        date: new Date().toISOString().split('T')[0],
                        source: null,
                        authorName: null,
                        authorEmail: null
                    }
                ]);
            } else {
                const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
                adapter.setCardService(service);
                dataPromise = adapter.getCards(cards);
            }
        }

        // Add error handling to data promise
        dataPromise = dataPromise.catch(er => {
            console.error('Error occurred in the Multicolumn listing component: Failed to fetch data. ', er);

            if (squizEdit) {
                return [
                    {
                        type: "Feature",
                        title: "Sample Card Title",
                        liveUrl: "https://news.stanford.edu",
                        description: "This is a sample description for the card in edit mode.",
                        imageUrl: "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        imageAlt: "Sample image description",
                        taxonomy: "Featured Content",
                        taxonomyUrl: "https://news.stanford.edu",
                        videoUrl: null,
                        date: new Date().toISOString().split('T')[0],
                        source: null,
                        authorName: null,
                        authorEmail: null
                    },
                    {
                        type: "News",  
                        title: "Another Sample Card",
                        liveUrl: "https://news.stanford.edu",
                        description: "This is another sample description showing multiple cards.",
                        imageUrl: "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        imageAlt: "Another sample image description",
                        taxonomy: "News",
                        taxonomyUrl: "https://news.stanford.edu",
                        videoUrl: null,
                        date: new Date().toISOString().split('T')[0],
                        source: null,
                        authorName: null,
                        authorEmail: null
                    }
                ]; // Always return sample data array on failure in edit mode
            }

            return `<!-- Error occurred in the Multicolumn listing component: ${er.message} -->`;
        });

        // Run data fetching and heading service in parallel
        const headingPromise = linkedHeadingService(fnsCtx, { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow });
        
        const [data, headingData] = await Promise.all([dataPromise, headingPromise]);

        const cardsMarkup = [];

        const maxNumberOfCards = source === "Search" ? searchMaxCards : 3;
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

        // NEW: Early return pattern for edit mode
        if (!squizEdit) return multicolumnListingTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(multicolumnListingTemplate(componentData), squizEditTargets);
    }
};
