import featureContentTemplate from './featured-content.hbs';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService, matrixCardService, uuid } from "../../global/js/utils";
import { Card, Modal, EmbedVideo } from "../../global/js/helpers";
import { processEditor } from '../../global/js/utils/processEditor';
 
/**
 * Feature content component that renderds a list of features cards based on fetched data
 */
export default {
    /**
     * Renders the Feature content component.
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

        // CHANGE: change const to let for mutability
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        let { source, searchQuery, featuredDescription, cards } = args?.contentConfiguration || {};
        let { alignment, displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            title = title || 'Heading text';
            ctaText = ctaText || 'Link text';
            ctaUrl = ctaUrl || 'matrix-asset://StanfordNews/29389';
            ctaManualUrl = ctaManualUrl || 'https://news.stanford.edu';
            
            // Provide default content configuration
            searchQuery = searchQuery || '?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!null&sort=date&meta_isTeaser_not=true';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
            
            // Add featured description target if using Select mode
            if (source === 'Select') {
                squizEditTargets["description"] = {
                    "field": "contentConfiguration.featuredDescription"
                };
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (source === 'Search' && (typeof searchQuery !== 'string' || searchQuery === '' || searchQuery === '?')) {
                    throw new Error(
                        `The "searchQuery" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(searchQuery)} was received.`
                    );
                }
                if (source === 'Select' && typeof cards !== 'object') {
                    throw new Error(
                        `The "cards" field must be an array. The ${JSON.stringify(cards)} was received.`
                    );
                }
                if (source === 'Select' && featuredDescription && typeof featuredDescription !== 'string') {
                    throw new Error(
                        `The "featuredDescription" field must be a string. The ${JSON.stringify(featuredDescription)} was received.`
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
                if (typeof ctaNewWindow !== 'boolean') {
                    throw new Error(
                        `The "ctaNewWindow" field must be a boolean. The ${JSON.stringify(ctaNewWindow)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Feature content component: ', er);
                return `<!-- Error occurred in the Feature content component: ${er.message} -->`;
            }
        }

        const adapter = new cardDataAdapter();
        let dataPromise = null;

        // Determine data source: "Search" (fetching from Funnelback) or "Select" (Matrix API)
        if (source.toLowerCase() === "search") {
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });

            adapter.setCardService(service);
            
            try {
                dataPromise = adapter.getCards();
            } catch (er) {
                
                if (!squizEdit) {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch search data. ${er.message} -->`;
                }
                dataPromise = Promise.resolve([]);
            }
        } else {
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            adapter.setCardService(service);
            
            try {
                dataPromise = adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch card data. ', er);
                if (!squizEdit) {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch card data. ${er.message} -->`;
                }
                dataPromise = Promise.resolve([]);
            }
        }

        // Run data fetching and heading service in parallel
        const headingPromise = linkedHeadingService(fnsCtx, { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow });
        
        const [data, headingData] = await Promise.all([dataPromise, headingPromise]);

        data.map((card) => {
            card.uniqueId = uuid();
            return card
        })

        // Extract featured and regular card data
        const featuredCardData = data && data[0];

        if (featuredDescription && featuredDescription !== "") {
            featuredCardData.description = featuredDescription;
        }

        const cardData = data && [data[1], data[2]];
        const cardModal = [];
        
        // Generate modals for video cards
        data?.forEach((card) => {
            if (card.type === 'Video') {
                cardModal.push(
                    Modal({content: EmbedVideo({ isVertical: card.size === "vertical-video", videoId: card.videoUrl, title: `Watch ${card.title}`, noAutoPlay: true }), uniqueId: card.uniqueId, describedby: 'card-modal' })
                );
            }
        });

        // Validate fetched card data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof featuredCardData !== 'object' || featuredCardData === null) {
                    throw new Error(
                        `The data cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                    );
                }
                if (typeof cardData !== 'object' || JSON.stringify(cardData) === JSON.stringify([null, null]) || cardData.length < 2) {
                    throw new Error(
                        `The data cannot have less then 3 elements. The ${JSON.stringify(data)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Feature content component: ', er);
                return `<!-- Error occurred in the Feature content component: ${er.message} -->`;
            }
        }

        // Generate card components to render
        const cardsToRender = cardData.map((card, idx) => `
            ${idx === 0 ? `<div class="su-relative su-w-full">`: `<div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">`}
                ${Card({data: card, cardSize: "small", displayThumbnail: displayThumbnails, displayDescription: displayDescriptions, headingLvl: title ? 3 : 2, uniqueId: card.uniqueId })}
                </div>
            `).join('');

        // Prepare component data for template rendering
        const componentData = {
            alignment,
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            featureCard: Card({ data: featuredCardData, cardSize:"featured", headingLvl: title ? 3 : 2, uniqueId: featuredCardData.uniqueId }),
            cards: cardsToRender,
            cardModal: cardModal.join(''),
            width: "large"
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(featureContentTemplate(componentData), squizEditTargets, args);
        }

        return featureContentTemplate(componentData);
    }
};
