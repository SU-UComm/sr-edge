import mediaCarouselTemplate from './media-carousel.hbs';
import {cardDataAdapter, matrixMediaCardService, uuid } from "../../global/js/utils";
import { Carousel, Card } from "../../global/js/helpers";

/**
 * Media carousel component that renderds a list of media cards based on fetched data.
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
        // Extracting environment variables and functions from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting configuration data from arguments
        const { cards } = args || {};

        // Validate required environment variables
        try {
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
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

        // Validate required fields and ensure correct data types
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

        const adapter = new cardDataAdapter();
        let data = null;

        // Compose and fetch the FB search results
        const service = new matrixMediaCardService({ ctx: fnsCtx, API_IDENTIFIER });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data
        data = await adapter.getCards(cards);

        const cardData = [];
        let uniqueClass = ""
        
        if (data !== null && data !== undefined) {
            uniqueClass = uuid();
            
            data.forEach((card) => {
                cardData.push(
                    `<div class="swiper-slide">
                        ${Card({ cardType: "media", data: card, displayDescription: false})}
                    </div>`
                );
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
            console.error('Error occurred in the Media carousel component: ', er);
            return `<!-- Error occurred in the Media carousel component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            id: uniqueClass,
            carousel: Carousel({ variant:"media", slides: cardData.join(''), uniqueClass: uniqueClass }),
            width: "large"
        };

        return mediaCarouselTemplate(componentData);
    }
};