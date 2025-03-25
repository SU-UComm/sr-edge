import eventSectionTemplate from './event-section.hbs';
import { cardDataAdapter, eventCardService, linkedHeadingService, isRealExternalLink, uuid } from "../../global/js/utils";
import { EventStartEndDate } from '../../global/js/helpers';

/**
 * A module for rendering an events section with cards and a linked heading.
 * @module EventsSection
 */
export default {
    /**
     * Fetches event data and renders it as a section with a linked heading and card grid.
     * @async
     * @param {Object} args - Configuration arguments for the events section.
     * @param {Object} args.headingConfiguration - The header configuration for the component.
     * @param {string} [args.headingConfiguration.title] - The text for the heading (optional).
     * @param {string} [args.headingConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaNewWindow] - Flag to open CTA link in new window (optional).
     * @param {Object} [args.contentConfiguration] - Configuration for content sources.
     * @param {string} args.contentConfiguration.eventsUrl - The URL of the events API.
     * @param {Object} [args.displayConfiguration] - Display settings for the section.
     * @param {string} [args.displayConfiguration.numberOfEvents] - The maximum number of events to display.
     * @param {Object} info - Contextual information.
     * @param {Object} info.ctx - Context object for resolving heading data.
     * @returns {Promise<string>} The rendered HTML string for the events section, or 'no cards' if no data is available.
     */
    async main(args, info) {
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extracting configuration data from arguments
        const { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        const { eventsUrl } = args?.contentConfiguration || {};
        const { numberOfEvents } = args?.displayConfiguration || {};

        // Validate required environment variables
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Events section component: ', er);
            return `<!-- Error occurred in the Events section component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (typeof eventsUrl !== 'string' || eventsUrl.trim() === '') {
                throw new Error(
                    `The "eventsUrl" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(eventsUrl)} was received.`
                );
            }
            if (typeof numberOfEvents !== 'number' || ![3, 6, 9].includes(numberOfEvents)) {
                throw new Error(
                    `The "numberOfEvents" field cannot be undefined and must be a number one of [3, 6, 9]. The ${JSON.stringify(numberOfEvents)} was received.`
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
            console.error('Error occurred in the Events section component: ', er);
            return `<!-- Error occurred in the Events section component: ${er.message} -->`;
        }

        const adapter = new cardDataAdapter();
        let data = [];

        // Fetch event data if eventAPI is provided
        const service = new eventCardService({ api: eventsUrl });

        // Set our card service
        adapter.setCardService(service);
        
        // Get the cards data
        try {
            data = await adapter.getCards();
        } catch (er) {
            console.error('Error occurred in the Events section component: Failed to fetch event data. ', er);
            return `<!-- Error occurred in the Events section component: Failed to fetch event data. ${er.message} -->`;
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            args.headingConfiguration
        );

        // Prepare card data
        let cardData = [];
        if (data !== null && data !== undefined) {
            cardData = data.map((card) => {
                card.isRealExternalLink = isRealExternalLink(card.liveUrl);
                card.eventStartEndDate = EventStartEndDate({start: card.date, end: card.endDate});
                card.uniqueID = uuid();
                card.imageAlt = card.videoUrl ? `Open video ${card.imageAlt} in a modal` : card.imageAlt;
                card.iconType = card.type?.toLowerCase();

                return card;
            }).slice(0, numberOfEvents);
        }

        // Validate fetched card data
        try {
            if (typeof cardData !== 'object' || cardData.length < 1) {
                throw new Error(
                    `The "data" cannot be undefined or null. The ${JSON.stringify(cardData)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Events section component: ', er);
            return `<!-- Error occurred in the Stories carousel component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            title: headingData.title,
            ctaText: headingData.ctaText,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            width: "large",
            cardSize: "small",
            data: cardData
        };

        return eventSectionTemplate(componentData);
    }
};
