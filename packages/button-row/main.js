import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import buttonRow from './button-row.hbs';

/**
 * Button Row Component - A Handlebars template component that renders a row of buttons
 * @module ButtonRow
 */

export default {
    /**
     * Main function that processes button data and returns rendered template
     * @async
     * @function main
     * @param {Object} args - Component arguments
     * @param {Array<Object>} args.buttons - Array of button configurations
     * @param {Object} info - Context information containing utility functions
     * @returns {Promise<string>} Rendered template string
     */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting configuration data from arguments
        const { buttons } = args || {};
        
        // Validate required functions
        try {
            if ( typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Button Row component: ', er);
            return `<!-- Error occurred in the Button Row component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (!Array.isArray(buttons) || buttons.length === 0) {
                throw new Error(
                    `The "buttons" field must be a non-empty array. The ${JSON.stringify(buttons)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Button Row component: ', er);
            return `<!-- Error occurred in the Button Row component: ${er.message} -->`;
        }

        //Processes buttons asynchronously to resolve URLs and prepare template data
        const data = await Promise.all(
            buttons.map(async (button) => {
                const { buttonText = "Button text", internalUrl, externalUrl, isNewWindow } = button;
                let linkData = null;
                
                if (internalUrl) {
                    linkData = await basicAssetUri(info.fns, internalUrl);
                }
                
                const buttonUrl = linkData?.url || externalUrl;
                
                if (buttonUrl === '') {
                    return '';
                }

                return {
                    buttonText,
                    isNewWindow,
                    buttonUrl,
                    isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
                };
            }),
        );

        // Prepares template props and renders component
        const componentData = {
            buttons: data,
        };
        
        return buttonRow(componentData);
    },
};