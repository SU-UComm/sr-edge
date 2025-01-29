import hash from "object-hash";
import featureContentTemplate from './featured-content.hbs';
import { cardDataAdapter, funnelbackCardService, linkedHeadingService, matrixCardService, containerClasses } from "../../global/js/utils";
import { LinkedHeading, Card, Modal, EmbedVideo } from "../../global/js/helpers";
 
export default {
    async main(args, info) {
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { source, searchQuery, featuredDescription, cards } = args?.contentConfiguration || {};
        const { alignment, displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};
        
        // Check for environment vars
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

        // Validating fields
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

        const adapter = new cardDataAdapter();
        let data = null;

        // Check what data source "Search" or "Select"
        if (source.toLowerCase() === "search") {
            // Compose and fetch the FB search results
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });

            // Set our card service
            adapter.setCardService(service);

            // Get the cards data
            data = await adapter.getCards();
        }
        // When Select, use Matix Content API
        else {
            // Create our service
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            // Set our card service
            adapter.setCardService(service);

            // Get the cards data
            data = await adapter.getCards(cards);
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            { 
                title, 
                ctaUrl, 
                ctaManualUrl, 
                ctaText, 
                ctaNewWindow
            } 
        );

        const featuredCardData = data && data[0];
        if (featuredDescription && featuredDescription !== "") {
            featuredCardData.description = featuredDescription;
        }

        const cardData = data && [data[1], data[2]];
        const cardModal = [];

        data && data.forEach((card) => {
            if (card.type === 'Video') {
                const uniqueId = hash.MD5(
                    JSON.stringify(card.videoUrl) + hash.MD5(JSON.stringify(card.title))
                );
                cardModal.push(
                    Modal({content: EmbedVideo({ isVertical: card.size === "vertical-video", videoId: card.videoUrl, title: `Watch ${card.title}`, noAutoPlay: true }), uniqueId, describedby: 'card-modal' })
                );
            }
        });

        // Validating data 
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

        const alignClasses = {
            'left': 'before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]',
            'right': 'before:su-right-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-right-[-36px] before:lg:su-right-[-80px]',
        };

        const growClass = alignment === 'right' ? 'md:su-order-2' : '';

        const cardsToRender = cardData.map((card, idx) => `
            ${idx === 0 ? `<div class="su-relative su-w-full">`: `<div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">`}
                ${Card({ data: card, cardSize: "small", displayThumbnail: displayThumbnails, displayDescription: displayDescriptions, headingLvl: title ? 3 : 2 })}
                </div>
            `).join('');

        const componentData = {
            classes: containerClasses({width: "large"}),
            alignClasses: alignClasses[alignment],
            growClass,
            headingData: await LinkedHeading(headingData),
            featureCard: Card({ data: featuredCardData, cardSize:"featured", headingLvl: title ? 3 : 2 }),
            cards: cardsToRender,
            cardModal: cardModal.join('')
        };



        return featureContentTemplate(componentData);
    }
};
