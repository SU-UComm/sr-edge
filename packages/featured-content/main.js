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
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations
            title = title || 'Featured Content';
            ctaText = ctaText || 'View all';
            ctaUrl = ctaUrl || '';
            ctaManualUrl = ctaManualUrl || 'https://example.com';
            ctaNewWindow = ctaNewWindow !== undefined ? ctaNewWindow : false;
            
            // Provide default content configuration
            source = source || 'Search';
            searchQuery = searchQuery || '?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!null&sort=date&meta_isTeaser_not=true';
            
            // Provide default display configuration
            alignment = alignment || 'left';
            displayThumbnails = displayThumbnails !== undefined ? displayThumbnails : true;
            displayDescriptions = displayDescriptions !== undefined ? displayDescriptions : true;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
            
            // Add featured description target if using Select mode
            if (source === 'Select') {
                featuredDescription = featuredDescription || 'This is a sample featured description that can be edited inline.';
                cards = cards && cards.length >= 3 ? cards : [
                    { cardAsset: 'matrix-asset://api-identifier/166535' },
                    { cardAsset: 'matrix-asset://api-identifier/162707' },
                    { cardAsset: 'matrix-asset://api-identifier/162759' }
                ];
                squizEditTargets["description"] = {
                    "field": "contentConfiguration.featuredDescription"
                };
            }
        }
        
        // Validate required environment variables - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
                console.error('Error occurred in the Feature content component: ', er);
                return `<!-- Error occurred in the Feature content component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (!['Search', 'Select'].includes(source) ) {
                    throw new Error(
                        `The "source" field cannot be undefined and must be one of ["Search", "Select"]. The ${JSON.stringify(source)} was received.`
                    );
                }
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
                if (typeof alignment !== 'string' || !['left', 'right'].includes(alignment) ) {
                    throw new Error(
                        `The "alignment" field cannot be undefined and must be one of ["left", "right"]. The ${JSON.stringify(alignment)} was received.`
                    );
                }
                if (typeof displayThumbnails !== 'boolean') {
                    throw new Error(
                        `The "displayThumbnails" field must be a boolean. The ${JSON.stringify(displayThumbnails)} was received.`
                    );
                }
                if (typeof displayDescriptions !== 'boolean') {
                    throw new Error(
                        `The "displayDescriptions" field must be a boolean. The ${JSON.stringify(displayDescriptions)} was received.`
                    );
                }
                
            } catch (er) {
                console.error('Error occurred in the Feature content component: ', er);
                return `<!-- Error occurred in the Feature content component: ${er.message} -->`;
            }
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Determine data source: "Search" (fetching from Funnelback) or "Select" (Matrix API)
        if (source.toLowerCase() === "search") {
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });

            adapter.setCardService(service);
            
            try {
                data = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch search data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    data = [
                        {
                            title: 'Sample Featured Article',
                            description: 'This is a sample featured article description that can be edited inline.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/600/400',
                            imageAlt: 'Sample featured image',
                            taxonomy: 'Research',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        {
                            title: 'Sample Article 2',
                            description: 'This is another sample article description.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/400/300',
                            imageAlt: 'Sample image 2',
                            taxonomy: 'News',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        {
                            title: 'Sample Article 3',
                            description: 'This is a third sample article description.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/400/300',
                            imageAlt: 'Sample image 3',
                            taxonomy: 'Events',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        }
                    ];
                } else {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch search data. ${er.message} -->`;
                }
            }
        } else {
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            adapter.setCardService(service);
            
            try {
                data = await adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the Feature content component: Failed to fetch card data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    data = [
                        {
                            title: 'Sample Featured Content',
                            description: 'This is a sample featured content description that can be edited inline.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/600/400',
                            imageAlt: 'Sample featured image',
                            taxonomy: 'Featured',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        {
                            title: 'Sample Content 2',
                            description: 'This is another sample content description.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/400/300',
                            imageAlt: 'Sample image 2',
                            taxonomy: 'Content',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        },
                        {
                            title: 'Sample Content 3',
                            description: 'This is a third sample content description.',
                            liveUrl: 'https://example.com',
                            imageUrl: 'https://picsum.photos/400/300',
                            imageAlt: 'Sample image 3',
                            taxonomy: 'Content',
                            taxonomyUrl: 'https://example.com',
                            type: 'Article'
                        }
                    ];
                } else {
                    return `<!-- Error occurred in the Feature content component: Failed to fetch card data. ${er.message} -->`;
                }
            }
        }

        // Generate linked heading data
        const headingData = await linkedHeadingService(fnsCtx, { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow });

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
