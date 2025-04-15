import xss from "xss";
import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import twoColumnTemplate from './two-column-text-callout.hbs';

/**
 * Two column text callout component that renders content blocks with optional images and buttons
 * @module TwoColumnTextCallout
 */
export default {
    /**
     * Renders the Two Column Text Callout component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {string} [args.heading] - The text for the component heading (optional).
     * @param {boolean} [args.showTopBorder=true] - Flag to show top border decoration (optional).
     * @param {Array<Object>} [args.callouts=[]] - Array of callout configurations (1-2 items).
     * @param {string} args.callouts[].title - The title text for the callout.
     * @param {string} args.callouts[].content - The main content text for the callout.
     * @param {Object} [args.callouts[].imageConfiguration] - The image configuration for the callout (optional).
     * @param {string} [args.callouts[].imageConfiguration.caption] - Caption text for the image.
     * @param {string} [args.callouts[].imageConfiguration.credit] - Credit text for the image.
     * @param {string} [args.callouts[].imageConfiguration.imagePlacement] - Position of the image in the callout.
     * @param {string} [args.callouts[].imageConfiguration.image] - URI of the image asset.
     * @param {Object} [args.callouts[].buttonConfiguration] - The button configuration for the callout (optional).
     * @param {string} [args.callouts[].buttonConfiguration.buttonText] - Text to display on the button.
     * @param {string} [args.callouts[].buttonConfiguration.externalUrl] - External URL for the button link.
     * @param {string} [args.callouts[].buttonConfiguration.internalUrl] - Internal asset URI for the button link.
     * @param {boolean} [args.callouts[].buttonConfiguration.isNewWindow] - Flag to open button link in new window.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered two column text callout HTML or an error message.
     */
    async main(args, info) {
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
 
        // Extract configuration data
        const { heading, showTopBorder = true, callouts = [] } = args;

        // Validate required context functions
        try {
            if (typeof fnsCtx !== "object" || typeof fnsCtx.resolveUri === "undefined") {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error("Error occurred in the Two Column Text Callout component:", er);
            return `<!-- Error occurred in the Two Column Text Callout component: ${er.message} -->`;
        }

        // Validate inputs
        try {
            if (heading && typeof heading !== 'string') {
                throw new Error(
                    `The "heading" field must be a string. The ${JSON.stringify(heading)} was received.`
                );
            }
            if (!Array.isArray(callouts)) {
                throw new Error(
                    `The "callouts" field must be an array. The ${JSON.stringify(callouts)} was received.`
                );
            }

            if (callouts.length < 1) {
                throw new Error(
                    `The "callouts" array cannot have less than 1 element. The ${JSON.stringify(callouts.length)} elements were received.`
                );
            }

            if (callouts.length > 2) {
                throw new Error(
                    `The "callouts" array cannot have more than 2 elements. The ${JSON.stringify(callouts.length)} elements were received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Two Column Text Callout component: ', er);
            return `<!-- Error occurred in the Two Column Text Callout component: ${er.message} -->`;
        }

        const calloutsData = [];

        for (const callout of callouts) { 
            const { title, content, imageConfiguration, buttonConfiguration } = callout;
            const { caption, credit, imagePlacement, image } = imageConfiguration || {};
            const { buttonText, externalUrl, internalUrl, isNewWindow } = buttonConfiguration || {};

            // Fetch image data
            let imageData = null;
            if (image) {
                imageData = await basicAssetUri(fnsCtx, image);
            }

            // Resolve internal link
            let linkUrl = null;
            if (internalUrl) {
                linkUrl = await basicAssetUri(fnsCtx, internalUrl);
            }
            const internalLinkUrl = linkUrl?.url;

            // Check for empty element 
            const notEmpty = !!(title || content || image || (buttonText && (externalUrl || internalLinkUrl)))

            if (notEmpty) {
                // Using data to get infoBox for each callout
                calloutsData.push({
                    title,
                    content: xss(content),
                    captionCredit: caption && credit ? `${caption} | ${credit}` : caption || credit,
                    imagePlacement,
                    imageData,
                    buttonText,
                    buttonUrl: internalLinkUrl || externalUrl,
                    isRealExternalLink: !internalLinkUrl && externalUrl ? isRealExternalLink(externalUrl) : false,
                    isNewWindow,
                });
            }
        };



        // Prepare component data for template rendering
        const componentData = {
            heading,
            showTopBorder,
            calloutsData,
            flexContainerLength: `${calloutsData.length}`,
        };

        return twoColumnTemplate(componentData);
    }
};
