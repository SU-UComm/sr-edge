import eventSectionTemplate from './event-section.hbs';
import { cardDataAdapter, eventCardService, linkedHeadingService, isRealExternalLink, uuid, basicAssetUri } from "../../global/js/utils";
import { EventStartEndDate } from '../../global/js/helpers';
import { processEditor } from '../../global/js/utils/processEditor';

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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // CHANGE: change const to let for mutability
        let { headingConfiguration, contentConfiguration, displayConfiguration } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;

        let squizEditTargets = null;

        // Extracting configuration data from arguments
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = headingConfiguration || {};
        let { eventsUrl } = contentConfiguration || {};
        let { numberOfEvents } = displayConfiguration || {};
        
        if (squizEdit) {
            
            // Add default values for inline editable fields
            title = title || 'Upcoming events';
            ctaText = ctaText || 'View all';
            // ctaUrl = ctaUrl || "matrix-asset://StanfordNews/29389";
            ctaUrl = null;
            ctaManualUrl = ctaManualUrl || 'https://events.stanford.edu';
            
            // Add default values for required fields
            eventsUrl = eventsUrl || 'https://events.stanford.edu/api/2/events?days=365&sponsored=true';
            numberOfEvents = numberOfEvents || 6;

            // Re-assign updated values back to original config objects
            headingConfiguration = {
                ...headingConfiguration,
                title,
                ctaText,
                ctaUrl
            };
            contentConfiguration = {
                ...contentConfiguration,
                eventsUrl
            };
            displayConfiguration = {
                ...displayConfiguration,
                numberOfEvents
            };
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { 
                    "field": "headingConfiguration.title" 
                },
                "headingCtaText": { 
                    "field": "headingConfiguration.ctaText" 
                }
            };
        }


        // Check for environment vars
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

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof eventsUrl !== 'string' || eventsUrl.trim() === '') {
                    throw new Error(
                        `The "eventsUrl" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(eventsUrl)} was received.`
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
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [
                    {
                        title: 'Sample Event 1',
                        description: 'This is a sample event description.',
                        liveUrl: 'https://example.com',
                        imageUrl: 'https://picsum.photos/400/400',
                        imageAlt: 'Sample event image',
                        taxonomy: 'Events',
                        taxonomyUrl: 'https://example.com',
                        type: 'Event',
                        date: new Date().toISOString(),
                        endDate: new Date(Date.now() + 3600000).toISOString()
                    },
                    {
                        title: 'Sample Event 2',
                        description: 'This is another sample event description.',
                        liveUrl: 'https://example.com',
                        imageUrl: 'https://picsum.photos/400/400',
                        imageAlt: 'Another sample event image',
                        taxonomy: 'Events',
                        taxonomyUrl: 'https://example.com',
                        type: 'Event',
                        date: new Date().toISOString(),
                        endDate: new Date(Date.now() + 3600000).toISOString()
                    }
                ];
            } else {
                return `<!-- Error occurred in the Events section component: Failed to fetch event data. ${er.message} -->`;
            }
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            headingConfiguration
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

        // Validate fetched card data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof cardData !== 'object' || cardData.length < 1) {
                    throw new Error(
                        `The "data" cannot be undefined or null. The ${JSON.stringify(cardData)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Events section component: ', er);
                return `<!-- Error occurred in the Events section component: ${er.message} -->`;
            }
        }

        // Resolve internal link safely
        let linkData = null;
            try {
                linkData = await basicAssetUri(fnsCtx, headingConfiguration.ctaUrl);
            } catch (er) {
                console.error('Error occurred in the Events section component: Failed to resolve Matrix asset link.', er);
                if (squizEdit) {
                    linkData = {
                        url: "https://news.stanford.edu",
                        text: headingConfiguration.ctaText || "Link text"
                    };
                }
            }

        // Prepare component data for template rendering
        const componentData = {
            title: headingData.title,
            ctaText: headingConfiguration.ctaText,
            ctaLink: linkData?.url || headingConfiguration.ctaManualUrl,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            width: "large",
            cardSize: "small",
            data: cardData,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(eventSectionTemplate(componentData), squizEditTargets, args);
        }

        return eventSectionTemplate(componentData);
    }
};
