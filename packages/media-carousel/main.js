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
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        
        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if cards array is not provided or empty
            cards = cards || [];
            
            // Ensure each card has default values
            cards = cards.map(card => ({
                ...card,
                title: card.title || 'Title text'
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
        const service = new matrixMediaCardService({ ctx: componentFunctions, API_IDENTIFIER: API_IDENTIFIER });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            data = await adapter.getCards(cards);
        } catch (er) {
            console.error('Error occurred in the Media carousel component: Failed to fetch card data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = null
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