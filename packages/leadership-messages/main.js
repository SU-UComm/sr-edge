import { cardDataAdapter, funnelbackCardService, linkedHeadingService } from "../../global/js/utils";
import { Card, multiColumnGrid } from "../../global/js/helpers";
import leadershipMessagesTemplate from './leadership-messages.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * A module for rendering a leadership messages section with cards and a linked heading.
 * @module LeadershipMessages
 */
export default {
    /**
     * Fetches leadership message data from a Funnelback API and renders it as a section with cards.
     * @async
     * @param {Object} args - Configuration arguments for the leadership messages section.
     * @param {Object} args.contentConfiguration - Configuration for content sources.
     * @param {string} args.contentConfiguration.searchQuery - The search query for the Funnelback API.
     * @param {Object} [args.headingConfiguration] - Configuration for the linked heading.
     * @param {Object} info - Contextual and environment information.
     * @param {Object} [info.env] - Environment variables.
     * @param {string} [info.env.FB_JSON_URL] - The base URL for the Funnelback JSON API.
     * @param {Object} [info.set] - Alternative configuration set.
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @param {Object} [info.fns] - Functions context object, including URI resolution utilities.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs for the heading link.
     * @returns {Promise<string>} The rendered HTML string for the leadership messages section.
     * @throws {Error} If required environment variables or functions are missing or invalid.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {}; // for backward compatibility - provides the resolveUri function
        const { FB_JSON_URL } = info?.env || info?.set?.environment || {};

        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        let { searchQuery } = args?.contentConfiguration || {};

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = {
            "headingTitle": { "field": "headingConfiguration.title" },
            "headingCtaText": { "field": "headingConfiguration.ctaText" }
        };

        if (squizEdit) {
            title = title || 'Heading text';
            ctaText = ctaText || 'Link text';
            searchQuery = searchQuery || '';
            ctaUrl = ctaUrl || null;
        }

        const adapter = new cardDataAdapter();
        let data = null;
        // Compose and fetch the FB search results
        const service = new funnelbackCardService({ FB_JSON_URL, query: searchQuery });
        
        // Set our card service
        adapter.setCardService(service);
        
        // Get the cards data
        try {
            data = await adapter.getCards();
        } catch (er) {
            console.error('Error occurred in the Leadership messages component: Failed to fetch event data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = null;
            } else {
                return `<!-- Error occurred in the Leadership messages component: Failed to fetch event data. ${er.message} -->`;
            }
        }
        
        // Resolve the URI for the section heading link
        // linkedHeadingService is a function that resolves the URI for the section heading link    
        // if the ctaUrl is not set, we use the ctaManualUrl
        let headingData = null;
        try {
            headingData = await linkedHeadingService(
                fnsCtx,
                {title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow}                
            );
        } catch (er) {
            console.error('Error occurred in the Leadership messages component: Failed to resolve heading link. ', er);
            if (squizEdit) {
                headingData = {
                    title: title,
                    ctaText: ctaText,
                    ctaLink: '#',
                    ctaNewWindow: ctaNewWindow || false
                };
            } else {
                return `<!-- Error occurred in the Leadership messages component: Failed to resolve heading link. ${er.message} -->`;
            }
        }
        
        const cards = [];
        const maxNumberOfCards = 3;
        
        // Prepare card data
        if (data !== null && data !== undefined) {
            data.forEach((card, i) => {
                if (i < maxNumberOfCards) {
                    cards.push(Card({ cardType: "avatar", data: card }));
                }
            });
        }

        const cardContent = cards.length > 0 && multiColumnGrid({
            items: cards
        });
        
        const componentData = {
            width: "large",
            title: headingData.title,
            ctaText: headingData.ctaText,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            cardGrid: cardContent
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) {
            return leadershipMessagesTemplate(componentData);
        }
        return processEditor(leadershipMessagesTemplate(componentData), squizEditTargets);
    }
};
