import { basicAssetUri } from '../../global/js/utils';
import imageQuoteTemplate from './image-quote.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * A module for rendering an image-quote section with an image, quote, and attribution.
 * @module ImageQuote
 */
export default {
    /**
     * Fetches an image URI and renders it alongside a quote in a styled section.
     * @async
     * @param {Object} args - Configuration arguments for the image-quote section.
     * @param {Object} args.displayConfiguration - Display settings for the section.
     * @param {string} [args.displayConfiguration.image] - The image identifier or path to fetch.
     * @param {string} [args.displayConfiguration.imageCaption] - Caption for the image.
     * @param {string} [args.displayConfiguration.imageCredit] - Credit for the image.
     * @param {string} [args.displayConfiguration.quote] - The quote text to display.
     * @param {string} [args.displayConfiguration.name] - The name of the quote's author.
     * @param {string} [args.displayConfiguration.title] - The title or role of the quote's author.
     * @param {Object} info - Contextual information.
     * @param {Object} info.fns - Functions context object for URI resolution.
     * @returns {Promise<string>} The rendered HTML string for the image-quote section.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // CHANGE: change const to let for mutability
        let { image, imageCaption, imageCredit, quote, name, title } = args?.displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            image = image || 'matrix-asset://api-identifier/sample-image';
            imageCaption = imageCaption || 'Caption text';
            imageCredit = imageCredit || 'Credit text';
            quote = quote || 'Add content';
            name = name || 'Quotee Name';
            title = title || 'Quotee Title/Role';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "imageCaption": { "field": "displayConfiguration.imageCaption" },
                "imageCredit": { "field": "displayConfiguration.imageCredit" },
                "quote": { "field": "displayConfiguration.quote" },
                "name": { "field": "displayConfiguration.name" },
                "title": { "field": "displayConfiguration.title" }
            };
        }

        // Validate required environment variables - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Image quote component: ', er);
                return `<!-- Error occurred in the Image quote component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof image !== 'string') {
                    throw new Error(
                        `The "image" field must be a string. The ${JSON.stringify(image)} was received.`
                    );
                }
                if (imageCaption && typeof imageCaption !== 'string') {
                    throw new Error(
                        `The "imageCaption" field must be a string. The ${JSON.stringify(imageCaption)} was received.`
                    );
                }
                if (imageCredit && typeof imageCredit !== 'string') {
                    throw new Error(
                        `The "imageCredit" field must be a string. The ${JSON.stringify(imageCredit)} was received.`
                    );
                }
                if (quote && typeof quote !== 'string') {
                    throw new Error(
                        `The "quote" field must be a string. The ${JSON.stringify(quote)} was received.`
                    );
                }
                if (name && typeof name !== 'string') {
                    throw new Error(
                        `The "name" field must be a string. The ${JSON.stringify(name)} was received.`
                    );
                }
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Image quote component: ', er);
                return `<!-- Error occurred in the Image quote component: ${er.message} -->`;
            }
        }

        // Fetch image data
        let imageData = null;
        try {
            imageData = await basicAssetUri(fnsCtx, image);

            // Check required properties - CHANGE: wrap in !squizEdit check
            if (!squizEdit) {
                if (!imageData || typeof imageData !== 'object') {
                    throw new Error('basicAssetUri did not return an object');
                }
                if (typeof imageData.url !== 'string' || imageData.url.trim() === '') {
                    throw new Error('data.url must be a non-empty string');
                }
                if (typeof imageData.attributes !== 'object' || imageData.attributes === null) {
                    throw new Error('data.attributes must be a non-null object');
                }
            }
        } catch (er) {
            console.error('Error occurred in the Image quote component: Failed to fetch image data. ', er);
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                imageData = {
                    "url": "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                    "attributes": {
                        "alt": "Campaign image",
                        "height": "",
                        "width": ""
                    }
                };
            } else {
                return `<!-- Error occurred in the Image quote component: Failed to fetch image data. ${er.message} -->`;
            }
        }
    
        const imageOrientation = imageData?.attributes?.height > imageData?.attributes?.width ? "portrait" : "landscape";
        const figureData = {
            url: imageData?.url,
            alt: imageData?.attributes?.alt || "",
            captionCredit: imageCaption && imageCredit ? `${imageCaption} | ${imageCredit}` : imageCaption || imageCredit,
        }
        const quoteData = {
            quote: quote ? `${quote}`: '',
            name,
            title
        }

        // Prepare component data for template rendering
        const componentData = {
            width: "large",
            imageOrientation,
            image: figureData,
            quote: quoteData,
            imageCaption: imageCaption,
            imageCredit: imageCredit
        }

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(imageQuoteTemplate(componentData), squizEditTargets, args);
        }

        return imageQuoteTemplate(componentData);
    }
}