import { basicAssetUri } from '../../global/js/utils';
import policyBriefTemplate from './policy-brief.hbs';

/**
 * Policy Brief component that renders a formatted content card with associated metadata and SVG icons.
 *
 * @module PolicyBrief
 */
export default {
    /**
     * Main function to render the Policy Brief component.
     *
     * @async
     * @function main
     * @param {Object} args - Component arguments
     * @param {Object} args.contentConfiguration - Configuration object containing content properties
     * @param {string} [args.contentConfiguration.image] - URL of the image to display (optional)
     * @param {string} args.contentConfiguration.type - Type of content ("Policy Brief" or "Case Study")
     * @param {string} args.contentConfiguration.title - Title of the policy brief
     * @param {string} args.contentConfiguration.summary - Summary text
     * @param {string} [args.contentConfiguration.linkUrl] - Optional link URL
     * @param {string} [args.contentConfiguration.linkText] - Text for the optional link
     * @param {Object} info - Context information
     * @param {Object} info.fns - Function context
     * @param {Function} info.fns.resolveUri - URI resolution function
     * @returns {Promise<string>} Rendered policy brief HTML string
     */
    async main(args, info) {
        // Extracting environment functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extract configuration data from arguments
        const { image, type, title, summary, linkUrl, linkText } = args?.contentConfiguration || {};

        // Validate required functions
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Policy brief component: ', er);
            return `<!-- Error occurred in the Policy brief component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (image && typeof image !== 'string') {
                throw new Error(
                    `The "image" field must be a string type. The ${JSON.stringify(image)} was received.`
                );
            }
            if (type && !["Policy Brief", "Case Study"].includes(type)) {
                throw new Error(
                    `The "type" field must be one of ["Policy Brief", "Case Study"] values. The ${JSON.stringify(type)} was received.`
                );
            }
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`
                );
            }
            if (summary && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" field must be a string type. The ${JSON.stringify(summary)} was received.`
                );
            }
            if (linkUrl && typeof linkUrl !== 'string') {
                throw new Error(
                    `The "linkUrl" field must be a string type. The ${JSON.stringify(linkUrl)} was received.`
                );
            }
            if (linkText && typeof linkText !== 'string') {
                throw new Error(
                    `The "linkText" field must be a string type. The ${JSON.stringify(linkText)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Policy brief component: ', er);
            return `<!-- Error occurred in the Policy brief component: ${er.message} -->`;
        }

        let assetData = null;

        // Getting image data 
        if (image) {
            assetData = await basicAssetUri(fnsCtx, image);
        }

        // Prepare component data for template rendering
        const componentData = {
            imageUrl: assetData,
            type,
            title,
            summary,
            linkUrl,
            linkText,
            width: "wide",
        };

        return policyBriefTemplate(componentData);
    }
};