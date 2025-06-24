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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        const { FB_JSON_URL } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability in edit mode
        let { title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = args?.headingConfiguration || {};
        let { searchQuery } = args?.contentConfiguration || {};

        // NEW: Detect edit mode properly
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;

        if (squizEdit) {
            // Provide default values for inline editable fields
            title = title || 'Add title';
            ctaText = ctaText || 'Add Call to Action';
            searchQuery = searchQuery || 'sample leadership query';
            
            // Provide default values for URLs
            ctaUrl = ctaUrl || null;
            ctaManualUrl = ctaManualUrl || 'https://news.stanford.edu';
            ctaNewWindow = ctaNewWindow || false;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
        }

        // NEW: Wrap validation in !squizEdit check - in edit mode we don't need to validate because values may be blank while editing
        if (!squizEdit) {
            // Validate required environment variables
            try {
                if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                    throw new Error(
                        `The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(FB_JSON_URL)} was received.`
                    );
                }
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Leadership messages component: ', er);
                return `<!-- Error occurred in the Leadership messages component: ${er.message} -->`;
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
                console.error('Error occurred in the Leadership messages component: ', er);
                return `<!-- Error occurred in the Leadership messages component: ${er.message} -->`;
            }
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
                data = {
                        title: "Sample Leadership Message 1",
                        description: "This is a sample leadership message for demonstration purposes in edit mode.",
                        liveUrl: "#",
                        imageUrl: "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        imageAlt: "Sample leadership headshot",
                        name: "Dr. Sample Leader",
                        jobTitle: "Sample Position"
                    };
            } else {
                return `<!-- Error occurred in the Leadership messages component: Failed to fetch event data. ${er.message} -->`;
            }
        }
        
        // Resolve the URI for the section heading link
        let headingData = null;
        try {
            headingData = await linkedHeadingService(
                fnsCtx,
                args.headingConfiguration
            );
        } catch (er) {
            console.error('Error occurred in the Leadership messages component: Failed to resolve heading link. ', er);
            // NEW: In edit mode, provide mock heading data
            if (squizEdit) {
                headingData = {
                    title: title,
                    ctaText: ctaText,
                    ctaLink: ctaManualUrl || '#',
                    ctaNewWindow: ctaNewWindow || false
                };
                console.log('Mock headingData created:', headingData);
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

        console.log('headingData', headingData);
        // Prepare component data for template rendering
        if(squizEdit && headingData) {
            headingData.title = headingData.title || 'Add title';
            headingData.ctaText = headingData.ctaText || 'Add Call to Action';
            headingData.ctaLink = headingData.ctaLink || '#';
            headingData.ctaNewWindow = headingData.ctaNewWindow || false;
        }
        
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
        if (squizEdit) {
            return processEditor(leadershipMessagesTemplate(componentData), squizEditTargets, args);
        }

        return leadershipMessagesTemplate(componentData);
    }
};
