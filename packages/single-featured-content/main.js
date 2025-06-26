import { cardDataAdapter, matrixCardService, linkedHeadingService } from "../../global/js/utils";
import { processEditor } from '../../global/js/utils/processEditor';
import { Card } from "../../global/js/helpers";
import singleFeaturedTemplate from "./single-featured-content.hbs";

/**
 * A module for rendering a single feature with a linked heading.
 * @module SingleFeatured
 */
export default {
    /**
     * Fetches for data and renders it as a section with a linked heading and single feature.
     * @async
     * @param {Object} args - Configuration arguments for the events section.
     * @param {Object} args.headingConfiguration - The header configuration for the component.
     * @param {string} [args.headingConfiguration.title] - The text for the heading (optional).
     * @param {string} [args.headingConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaNewWindow] - Flag to open CTA link in new window (optional).
     * @param {Object} [args.contentConfiguration] - Configuration for content sources.
     * @param {string} args.contentConfiguration.source - The asset id of the feature.
     * @param {string} args.contentConfiguration.description - The overide description that will replace description form souce asset.
     * @param {Object} info - Contextual information.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered HTML string for the events section, or 'no cards' if no data is available.
     */
    async main(args, info) {
        // Extracting environment variables and function from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow } = args?.headingConfiguration || {};
        let { source, description } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Heading text';
            ctaText = ctaText || 'Link text';
            ctaManualUrl = ctaManualUrl || 'https://news.stanford.edu';
            
            // Provide default values for other required fields
            source = source || 'matrix-asset://api-identifier/163459';

            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" }
            };
        }

        const adapter = new cardDataAdapter();
        let data = null;

        // Fetch card data
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data with error handling
        try {
            data = await adapter.getCards([{ cardAsset: source }]);
        } catch (er) {
            console.error('Error occurred in the Single featured content: Failed to fetch feature data. ', er);
            
            if (squizEdit) {
                data = null;
            }
        }

        const cardData = data && data.map((item) => {
            const itemData = {...item} 
            
            if(description && description !== "" && description.replace(/<[^>]+>/g, "").trim().length > 0) {
                itemData.description = description;
            }

            return itemData;
        })[0]

        // Resolve the URI for the section heading link
        let headingData;
        try {
            headingData = await linkedHeadingService(
                componentFunctions || componentContext,
                { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow }
            );
        } catch (er) {
            console.error('Error occurred in the Single featured content: Failed to resolve heading link. ', er);
            if (squizEdit) {
                headingData = {
                    title: title,
                    ctaText: ctaText,
                    ctaLink: '#',
                    ctaNewWindow: ctaNewWindow || false
                };
            }
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate fetched card data
            try {
                if (typeof data !== 'object' || data.length < 1) {
                    throw new Error(
                        `The "data" cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Single featured content component: ', er);
                return `<!-- Error occurred in the Single featured content component: ${er.message} -->`;
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            title: headingData.title,
            ctaText: headingData.ctaText,
            ctaLink: headingData.ctaLink,
            ctaNewWindow: headingData.ctaNewWindow,
            isAlwaysLight: false,
            width: "large",
            card: Card({ data: cardData, cardSize: "featured" }),
            data: JSON.stringify(cardData)
        };

        if (!squizEdit) return singleFeaturedTemplate(componentData);
        
        return processEditor(singleFeaturedTemplate(componentData), squizEditTargets);
    }
};
