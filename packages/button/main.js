import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import button from './button.hbs';

/**
 * Button component that handles both internal and external links with proper validation and error handling.
 *
 * @module ButtonComponent
 */

/**
 * Main entry point for the Button component.
 * 
 * @async
 * @function main
 * @param {Object} args - Component arguments
 * @param {string} [args.buttonText] - The text displayed on the button
 * @param {string} [args.internalUrl] - Internal URL path for asset resolution
 * @param {string} [args.externalUrl] - External URL destination
 * @param {boolean} [args.isNewWindow] - Whether to open link in new window
 * @param {Object} info - Context information
 * @param {Object} info.fns - Available utility functions
 * @param {Function} info.fns.resolveUri - URI resolution function
 * @returns {Promise<string>} Rendered button HTML or error message
 */
export default {
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting configuration data from arguments
        const { buttonText = "Button text", internalUrl, externalUrl, isNewWindow } = args || {};

         // Validate required functions
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Button component: ', er);
            return `<!-- Error occurred in the Button component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (buttonText && typeof buttonText !== 'string') {
                throw new Error(
                    `The "buttonText" field must be a string. The ${JSON.stringify(buttonText)} was received.`,
                );
            }
            if (internalUrl && typeof internalUrl !== 'string') {
                throw new Error(
                    `The "internalUrl" field must be a string. The ${JSON.stringify(internalUrl)} was received.`,
                );
            }
            if (externalUrl && typeof externalUrl !== 'string') {
                throw new Error(
                    `The "externalUrl" field must be a string. The ${JSON.stringify(externalUrl)} was received.`,
                );
            }
            if (isNewWindow && typeof isNewWindow !== 'boolean') {
                throw new Error(
                    `The "isNewWindow" field must be a boolean. The ${JSON.stringify(isNewWindow)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Button component: ', er);
            return `<!-- Error occurred in the Button component: ${er.message} -->`;
        }

        let linkData = null;
        
        // Getting image data 
        if (internalUrl) {
            linkData = await basicAssetUri(info.fns, internalUrl);
        }

        // Getting button URL
        const buttonUrl = linkData?.url || externalUrl;

        // Validate data
        try {
            if (buttonUrl === '') {
                throw new Error(
                    `The URL of button must be a non-empty string. The ${JSON.stringify(buttonUrl)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Button component: ', er);
            return `<!-- Error occurred in the Button component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            buttonText,
            isNewWindow,
            buttonUrl,
            isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
        };

        return button(componentData);
    },
};
