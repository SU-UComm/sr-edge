import mediaCarouselTemplate from './media-carousel.hbs';
import {cardDataAdapter, matrixMediaCardService, isRealExternalLink, uuid, linkedHeadingService } from "../../global/js/utils";
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
     * @param {Object} args.headingConfiguration - The header configuration for the component.
     * @param {string} [args.headingConfiguration.title] - The text for the heading (optional).
     * @param {string} [args.headingConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaNewWindow] - Flag to open CTA link in new window (optional).
     * @param {Object} args.cards - The list of media cards to render.
     * @param {string} [args.marginTop] - The value of top margin (optional).
     * @param {string} [args.marginBottom] - The value of bottom margin (optional).
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
        let { cards, headingConfiguration, marginTop, marginBottom } = args || {};

        // Extracting configuration data from arguments
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = headingConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;

        if (squizEdit) {
            // defaults
            title = title || "Heading text";
            ctaText = ctaText || "Link text";
            ctaUrl = ctaUrl || null;
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
                },
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        let cardData = null;

        // Compose and fetch the FB search results
        const service = new matrixMediaCardService({ ctx: componentFunctions, API_IDENTIFIER: API_IDENTIFIER });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            cardData = await adapter.getCards(cards);
        } catch (er) {
            console.error('Error occurred in the Media carousel component: Failed to fetch card data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                cardData = null
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

        // Validate fetched card data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
        if (typeof cardData !== 'object' || cardData.length < 1) {
                    throw new Error(
                `The "cardData" cannot be undefined or null. The ${JSON.stringify(cardData)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media carousel component: ', er);
                return `<!-- Error occurred in the Media carousel component: ${er.message} -->`;
            }
        }

        // ADD: Resolve the URI for the section heading link
        let headingData = null;
        try {
            headingData = await linkedHeadingService(
                componentFunctions,
                { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow }
            );
        } catch (er) {
            console.error('Error occurred in the Media carousel component: Failed to resolve heading link. ', er);
            // NEW: In edit mode, provide mock heading data
            if (squizEdit) {
                headingData = {
                    title: title,
                    ctaText: ctaText,
                    ctaLink: '#',
                    ctaNewWindow: ctaNewWindow || false
                };
            } else {
                return `<!-- Error occurred in the Media carousel component: Failed to resolve heading link. ${er.message} -->`;
            }
        }


        let cardsToRender = [];
        if (cardData !== null && cardData !== undefined) {
            cardsToRender = cardData.map((card) => {
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

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            slides: cardsToRender,
            marginTop: marginTop,
            marginBottom: marginBottom,
            width: "large"
        };
        if (!squizEdit) return mediaCarouselTemplate(componentData);
        return processEditor(mediaCarouselTemplate(componentData), squizEditTargets);
    }
};