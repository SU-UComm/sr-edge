import campaignCtaTemplate from './campaign-cta.hbs';
import { basicAssetUri, containerClasses } from "../../global/js/utils";

/**
 * Campaign CTA (Call-to-Action) component that renders a campaign block with an image, title, description, and link.
 */
export default {
    /**
     * Renders the Campaign CTA component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.displayConfiguration - The display configuration for the component.
     * @param {string} args.displayConfiguration.image - The image URL for the CTA.
     * @param {string} [args.displayConfiguration.title] - The title text for the CTA (optional).
     * @param {string} [args.displayConfiguration.description] - The description text for the CTA (optional).
     * @param {string} [args.displayConfiguration.linkUrl] - The URL for the CTA link (optional).
     * @param {string} [args.displayConfiguration.linkText] - The text for the CTA link (optional).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting configuration data from arguments
        const { image, title, description, linkUrl, linkText } = (args && args.displayConfiguration) || {};

        // Validate required functions
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Campaign cta component: ', er);
            return `<!-- Error occurred in the Campaign cta component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (!image || typeof image !== 'string') {
                throw new Error(
                    `The "image" field cannot be undefined and must be a string type. The ${JSON.stringify(image)} was received.`
                );
            }
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`,
                );
            }
            if (description && typeof description !== 'string') {
                throw new Error(
                    `The "description" field must be a string type. The ${JSON.stringify(description)} was received.`,
                );
            }
            if (linkUrl && typeof linkUrl !== 'string') {
                throw new Error(
                    `The "linkUrl" field must be a string type. The ${JSON.stringify(linkUrl)} was received.`,
                );
            }
            if (linkText && typeof linkText !== 'string') {
                throw new Error(
                    `The "linkText" field must be a string type. The ${JSON.stringify(linkText)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Campaign cta component: ', er);
            return `<!-- Error occurred in the Campaign cta component: ${er.message} -->`;
        }
        
        let imageData = null;
        let linkData = null;

        // Getting link data 
        if (linkUrl) {
            linkData = await basicAssetUri(fnsCtx, linkUrl);
        }

        // Getting image data 
        if (image) {
            imageData = await basicAssetUri(fnsCtx, image);
        }
        
        // Prepare component data for template rendering
        const componentData = {
            classes: containerClasses({width: "full", paddingX: false}),
            title,
            description,
            linkText,
            linkData,
            imageData
        };

        return campaignCtaTemplate(componentData);
    }
};

