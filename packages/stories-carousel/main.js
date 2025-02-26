import hash from "object-hash";
import storiesCarouselTemplate from './stories-carousel.hbs';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService } from "../../global/js/utils";
import { Carousel, LinkedHeading, Card, Modal, EmbedVideo } from "../../global/js/helpers";

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
        
        // Extracting configuration data from arguments
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { searchQuery } = args?.contentConfiguration || {};

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

        const adapter = new cardDataAdapter();
        let data = null;

        // Compose and fetch the FB search results
        const query = searchQuery;
        const service = new funnelbackCardService({ FB_JSON_URL, query });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data
        data = await adapter.getCards();

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            args.headingConfiguration
        );
        
        if (headingData && !headingData.ctaLink) {
            headingData.ctaLink = `${BASE_DOMAIN}${BASE_PATH}${NEWS_ARCHIVE_PATH}`;
        }

        const cardData = [];
        const cardModal = [];
        let uniqueClass = ""
        
        if (data !== null && data !== undefined) {
            uniqueClass = hash.MD5(JSON.stringify(data));
            
            data.forEach((card) => {
                cardData.push(
                    `<div class="swiper-slide">
                        ${Card({data: card, displayDescription: false})}
                    </div>`
                );

                if (card.type === 'Video') {
                    const uniqueId = hash.MD5(
                        JSON.stringify(card.videoUrl) + hash.MD5(JSON.stringify(card.title))
                    );
                    cardModal.push(
                        Modal({content: EmbedVideo({ isVertical: card.size === "vertical-video", videoId: card.videoUrl, title: `Watch ${card.title}`, noAutoPlay: true }), uniqueId, describedby: 'card-modal' })
                    );
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
            headingData: LinkedHeading(headingData),
            carousel: Carousel({ variant:"cards", slides: cardData.join(''), uniqueClass: uniqueClass }),
            cardModal: cardModal.join(''),
            width: "large"
        };

        return storiesCarouselTemplate(componentData);
    }
};