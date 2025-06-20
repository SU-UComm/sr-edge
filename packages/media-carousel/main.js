import mediaCarouselTemplate from './media-carousel.hbs';
import {cardDataAdapter, matrixMediaCardService, isRealExternalLink, uuid } from "../../global/js/utils";
import { SidebarHeading } from "../../global/js/helpers";
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Media carousel component that renderds a list of media cards based on fetched data.
 * @module MediaCarousel
 */
export default {
    /**
     * Renders the Media carousel component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.cards - The list of media cards to render.
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
        const fnsCtx = componentFunctions || componentContext || {};
        
        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if cards array is not provided or empty
            cards = cards && cards.length > 0 ? cards : [
                {
                    cardType: 'Book',
                    title: 'Sample Media Title 1',
                    author: 'Sample Author 1',
                    teaserText: 'This is sample teaser text for the first media card.',
                    image: 'matrix-asset://api-identifier/sample-image-1',
                    linkUrl: 'https://example.com'
                },
                {
                    cardType: 'Podcast',
                    title: 'Sample Media Title 2',
                    author: 'Sample Author 2',
                    teaserText: 'This is sample teaser text for the second media card.',
                    image: 'matrix-asset://api-identifier/sample-image-2',
                    linkUrl: 'https://example.com'
                }
            ];
            
            // Ensure each card has default values
            cards = cards.map(card => ({
                ...card,
                title: card.title || 'Sample Media Title',
                author: card.author || 'Sample Author',
                teaserText: card.teaserText || 'Sample teaser text for this media item.'
            }));
            
            // Configure edit targets for array - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": {
                    "field": "cards",
                    "array": true,
                    "property": "title"
                },
                "author": {
                    "field": "cards",
                    "array": true,
                    "property": "author"
                },
                "teaserText": {
                    "field": "cards",
                    "array": true,
                    "property": "teaserText"
                }
            };
        }

        // Validate required environment variables - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx.API_IDENTIFIER !== 'string' || fnsCtx.API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(fnsCtx.API_IDENTIFIER)} was received.`
                    );
                }
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media carousel component: ', er);
                return `<!-- Error occurred in the Media carousel component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (!Array.isArray(cards) || cards.length === 0) {
                    throw new Error(
                        `The "cards" field cannot be undefined and must be an array with minimum 1 element. The ${JSON.stringify(cards)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media carousel component: ', er);
                return `<!-- Error occurred in the Media carousel component: ${er.message} -->`;
            }
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Compose and fetch the FB search results
        const service = new matrixMediaCardService({ ctx: fnsCtx, API_IDENTIFIER: fnsCtx.API_IDENTIFIER });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            data = await adapter.getCards(cards);
        } catch (er) {
            console.error('Error occurred in the Media carousel component: Failed to fetch card data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = cards.map((card, index) => ({
                    type: card.cardType || 'Book',
                    title: card.title,
                    author: card.author,
                    description: card.teaserText,
                    imageUrl: 'https://picsum.photos/400/600',
                    imageAlt: `Sample media image ${index + 1}`,
                    liveUrl: card.linkUrl || 'https://example.com',
                    taxonomy: card.cardType === 'Podcast' ? 'Featured audio' : 'Featured reading'
                }));
            } else {
                return `<!-- Error occurred in the Media carousel component: Failed to fetch card data. ${er.message} -->`;
            }
        }

        // Setting the icon  
        const typeOfIcon = {
            "Book": {
                typeIcon:"book-open-cover",
                iconTestId:"svg-book-open-cover",
                headingIcon: "Featured reading",
                headingTitle: "Featured reading"
            },
            "Podcast": {
                typeIcon:"microphone",
                iconTestId:"svg-microphone",
                headingIcon: "Featured audio",
                headingTitle: "Featured audio"
            },
            "Magazine": {
                typeIcon:"book-open",
                iconTestId:"svg-book-open",
                headingIcon: "Featured reading",
                headingTitle: "Featured reading"
            }
        }

        if (data !== null && data !== undefined) {
            data.map((card) => {
                card.typeIcon = typeOfIcon[card.type].typeIcon;
                card.iconTestId = typeOfIcon[card.type].iconTestId;
                card.isRealExternalLink = isRealExternalLink(card.liveUrl);
                card.sidebarHeading = SidebarHeading({ 
                    headingSize: "p",
                    icon: typeOfIcon[card.type].headingIcon, 
                    title: typeOfIcon[card.type].headingTitle,
                    color: "media" 
                });

                return card;
            });
        }

        // Validate fetched card data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof data !== 'object' || data.length < 1) {
                    throw new Error(
                        `The "data" cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media carousel component: ', er);
                return `<!-- Error occurred in the Media carousel component: ${er.message} -->`;
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            slides: data,
            width: "large"
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) return mediaCarouselTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(mediaCarouselTemplate(componentData), squizEditTargets);
    }
};