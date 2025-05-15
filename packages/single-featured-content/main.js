import { cardDataAdapter, matrixCardService, linkedHeadingService } from "../../global/js/utils";
import { Card } from "../../global/js/helpers";
import { isEditor } from "../../global/js/utils/isEditor";
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
        const fnsCtx = info?.fns || info?.ctx || {};
        const { ctx } = info;
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const editMode = isEditor(ctx.url);

        // Extracting configuration data from arguments
        const { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow } = args?.headingConfiguration || {};
        const { source, description } = args?.contentConfiguration || {};

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

        const adapter = new cardDataAdapter();
        let data = null;

        // Fetch card data
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

        // Set our card service
        adapter.setCardService(service);

        // Get the cards data
        try {
            data = await adapter.getCards([{ cardAsset: source }]);
        } catch (er) {
            console.error('Error occurred in the Single featured content: Failed to fetch feature data. ', er);
            return `<!-- Error occurred in the Single featured content: Failed to fetch feature data. ${er.message} -->`;
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
            args.headingConfiguration
        );

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

        return singleFeaturedTemplate(componentData);
    }
};
