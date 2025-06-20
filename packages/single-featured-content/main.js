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
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow } = args?.headingConfiguration || {};
        let { source, description } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Featured Content';
            ctaText = ctaText || 'View all';
            description = description || '<p>This is a sample description override that can be edited inline to customize the featured content description.</p>';
            
            // Provide default values for other required fields
            source = source || 'matrix-asset://api-identifier/162618';
            ctaUrl = ctaUrl || '';
            ctaManualUrl = ctaManualUrl || 'https://example.com';
            ctaNewWindow = ctaNewWindow !== undefined ? ctaNewWindow : false;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" },
                "description": { "field": "contentConfiguration.description" }
            };
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate required environment variables
            try {
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
                console.error('Error occurred in the Single featured content component: ', er);
                return `<!-- Error occurred in the Single featured content component: ${er.message} -->`;
            }

            // Validate required fields and ensure correct data types
            try {
                if (typeof source !== 'string' || source.trim() === '') {
                    throw new Error(
                        `The "source" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(source)} was received.`
                    );
                }
                if (description && typeof description !== 'string') {
                    throw new Error(
                        `The "description" field must be a string. The ${JSON.stringify(description)} was received.`
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
                console.error('Error occurred in the Single featured content component: ', er);
                return `<!-- Error occurred in the Single featured content component: ${er.message} -->`;
            }
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
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [{
                    title: 'Sample Featured Content Title',
                    description: 'This is a sample description from the API that would normally be fetched.',
                    liveUrl: 'https://example.com',
                    imageUrl: 'https://picsum.photos/600/400',
                    imageAlt: 'Sample featured content image',
                    taxonomy: 'Featured',
                    taxonomyUrl: 'https://example.com',
                    type: 'Article'
                }];
            } else {
                return `<!-- Error occurred in the Single featured content: Failed to fetch feature data. ${er.message} -->`;
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
        const headingData = await linkedHeadingService(
            fnsCtx,
            { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow }
        );

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

        // NEW: Early return pattern
        if (!squizEdit) return singleFeaturedTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(singleFeaturedTemplate(componentData), squizEditTargets);
    }
};
