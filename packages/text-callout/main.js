import xss from "xss";
import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import textCalloutTemplate from "./text-callout.hbs";
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * A module for rendering an Text callout.
 * @module TextCallout
 */
export default {
    /**
     * Main function to render the Text Callout component.
     * 
     * @async
     * @function main
     * @param {Object} args - Component arguments
     * @param {Object} args.displayConfiguration - Configuration object containing component properties
     * @param {string} [args.displayConfiguration.title] - The heading text (optional)
     * @param {string} [args.displayConfiguration.content] - The text content for this component (optional)
     * @param {Object} args.imageConfiguration - Configuration for the image
     * @param {string} [args.imageConfiguration.image] - Image asset URI (optional)
     * @param {string} [args.imageConfiguration.caption] - Caption text for the image (optional)
     * @param {string} [args.imageConfiguration.credit] - Credit text for the image (optional)
     * @param {string} [args.imageConfiguration.imagePlacement] - Image position ("Below content" or "Above content")
     * @param {Object} args.buttonConfiguration - Configuration for the button
     * @param {string} [args.buttonConfiguration.buttonText] - Button text (optional)
     * @param {string} [args.buttonConfiguration.internalUrl] - Internal link URI (optional)
     * @param {string} [args.buttonConfiguration.externalUrl] - External manual link (optional)
     * @param {boolean} [args.buttonConfiguration.isNewWindow] - Whether the link opens in a new window (optional)
     * @param {Object} info - Context information
     * @param {Object} info.fns - Function context
     * @param {Function} info.fns.resolveUri - URI resolution function
     * @returns {Promise<string>} Rendered Text Callout HTML string
     */
    async main(args, info) {
        // Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Extract configuration data
        const { title, content } = args?.displayConfiguration || {};
        const { image, caption, credit, imagePlacement } =  args?.imageConfiguration || {};
        const { buttonText, internalUrl, externalUrl, isNewWindow } =  args?.buttonConfiguration || {};

        // Validate required context functions
        try {
            if (typeof fnsCtx !== "object" || typeof fnsCtx.resolveUri === "undefined") {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error("Error occurred in the Text callout component:", er);
            return `<!-- Error occurred in the Text callout component: ${er.message} -->`;
        }

        // Validate input types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (content && typeof content !== 'string') {
                throw new Error(
                    `The "content" field must be a string. The ${JSON.stringify(content)} was received.`
                );
            }
            if (image && typeof image !== 'string') {
                throw new Error(
                    `The "image" field must be a string. The ${JSON.stringify(image)} was received.`
                );
            }
            if (caption && typeof caption !== 'string') {
                throw new Error(
                    `The "caption" field must be a string. The ${JSON.stringify(caption)} was received.`
                );
            }
            if (credit && typeof credit !== 'string') {
                throw new Error(
                    `The "credit" field must be a string. The ${JSON.stringify(credit)} was received.`
                );
            }
            if (imagePlacement && !['Below content', 'Above content'].includes(imagePlacement) ) {
                throw new Error(
                    `The "imagePlacement" field must be one of ["Below content", "Above content"]. The ${JSON.stringify(imagePlacement)} was received.`
                );
            }
            if (buttonText && typeof buttonText !== 'string') {
                throw new Error(
                    `The "buttonText" field must be a string. The ${JSON.stringify(buttonText)} was received.`
                );
            }
            if (internalUrl && typeof internalUrl !== 'string') {
                throw new Error(
                    `The "internalUrl" field must be a string. The ${JSON.stringify(internalUrl)} was received.`
                );
            }
            if (externalUrl && typeof externalUrl !== 'string') {
                throw new Error(
                    `The "externalUrl" field must be a string. The ${JSON.stringify(externalUrl)} was received.`
                );
            }
            if (isNewWindow && typeof isNewWindow !== "boolean") {
                throw new Error(
                    `The "isNewWindow" field must be a boolean. The ${JSON.stringify(isNewWindow)} was received.`
                );
            }
        } catch (er) {
            console.error("Error occurred in the Text callout component:", er);
            return `<!-- Error occurred in the Text callout component: ${er.message} -->`;
        }

        // Fetch image data
        let imageData = null;
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Text callout component: Failed to fetch image data. ', er);
                return `<!-- Error occurred in the Text callout component: Failed to fetch image data. ${er.message} -->`;
            }
        }
        const figureData = {
            url: imageData?.url,
            alt: imageData?.attributes?.alt || "",
            placement: imagePlacement,
            captionCredit: caption && credit ? `${caption} | ${credit}` : caption || credit,
        }
        
        // Resolve internal link
        let linkData = null
        if (internalUrl) {
            try {
                linkData = await basicAssetUri(fnsCtx, internalUrl);
            } catch (er) {
                console.error('Error occurred in the Text callout component: Failed to fetch link data. ', er);
                return `<!-- Error occurred in the Text callout component: Failed to fetch link data. ${er.message} -->`;
            }
        }
        const buttonData = {
            title: buttonText,
            url: linkData?.url || externalUrl,
            isNewWindow: isNewWindow,
            isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
        }

        // Prepare component data for template rendering
        const componentData = {
            title,
            content: xss(content),
            image: figureData,
            button: buttonData,
        };

        // Configure squizEditTargets for inline editing
        const squizEditTargets = {
            "infoBoxTitle": { "field": "displayConfiguration.title" },
            "infoBoxContent": { "field": "displayConfiguration.content" },
            "captionCredit": { "field": "imageConfiguration.caption" },
            "button": { "field": "buttonConfiguration.buttonText" }
        };

        // Early return for non-edit mode
        if (!squizEdit) {
            return textCalloutTemplate(componentData);
        }

        // Process and return template with inline editing support
        return processEditor(textCalloutTemplate(componentData), squizEditTargets);
    },
};
