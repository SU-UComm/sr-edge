import hash from "object-hash";
import multicolumnListingTemplate from './multicolumn-listing.hbs';
import { cardDataAdapter, funnelbackCardService, matrixCardService, linkedHeadingService, multicolumnGrid, containerClasses } from "../../global/js/utils";
import { Card, Modal, EmbedVideo, LinkedHeading } from '../../global/js/helpers';

export default {
    async main(args, info) {
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { source, searchQuery, searchMaxCards, cards } = args?.contentConfiguration || {};
        const { displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};

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
            console.error('Error occurred in the Multicolumn listing component: ', er);
            return `<!-- Error occurred in the Multicolumn listing component: ${er.message} -->`;
        }

        // Check manifest fields
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

        if (source.toLowerCase() === "search") {
            // compose and fetch the FB search results
            const query = searchQuery;
            const service = new funnelbackCardService({ FB_JSON_URL, query });

            adapter.setCardService(service);

            data = await adapter.getCards();
        }

        // When Select, use Matix Content API
        else {
            // Get our card URI's from the args object
            const { cards } = args.contentConfiguration;

            // Create our service
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            // Set our card service
            adapter.setCardService(service);

            // get the cards data
            data = await adapter.getCards(cards);
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow }
        );

        const cardsMarkup = [];

        const maxNumberOfCards =
            source === "Search"
                ? searchMaxCards
                : 3;
        const numberOfCards = data.length > maxNumberOfCards ? maxNumberOfCards : data.length;
        const cardSizeMap = new Map();
        cardSizeMap.set(3, "small");
        cardSizeMap.set(2, "medium");

        const cardModal = [];
        data.forEach((cardData, i) => {
            if (i < maxNumberOfCards) {
                if (source === "Search") {
                    cardsMarkup.push(
                        Card({data: cardData, displayDescription: displayDescriptions, displayThumbnail: displayThumbnails, cardSize: cardSizeMap.get(searchMaxCards)}))
                }
                else {
                    cardsMarkup.push(
                        Card({data: cardData, displayDescription: displayDescriptions, displayThumbnail: displayThumbnails, cardSize: cardSizeMap.get(numberOfCards)}))
                }
                if (cardData.type === 'Video') {
                    const uniqueId = hash.MD5(
                        JSON.stringify(cardData.videoUrl) + hash.MD5(JSON.stringify(cardData.title))
                    );
                    cardModal.push(
                        Modal({content: EmbedVideo({ isVertical: cardData.size === "vertical-video", videoId: cardData.videoUrl, title: `Watch ${cardData.title}`, noAutoPlay: true }), uniqueId, describedby: 'card-modal' })
                    );
                }
            }
        });

        const componentTitleStateClass = headingData.title
            ? "has-title"
            : "has-no-title";

        const componentData = {
            classes: containerClasses({width: "large"}),
            componentTitleStateClass,
            headingData: LinkedHeading(headingData),
            multicolumnGrid: multicolumnGrid(cardsMarkup, true),
            cardModal: cardModal.join('')
        };

        return multicolumnListingTemplate(componentData);
    }
};
