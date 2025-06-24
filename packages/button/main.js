import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';
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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        
        // CHANGE: change const to let for mutability in edit mode
        let { buttonText = "Button text", internalUrl, externalUrl, isNewWindow } = args || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            buttonText = buttonText || 'Button text';
            
            // NEW: Provide default URLs for edit mode
            internalUrl = internalUrl || null;
            externalUrl = externalUrl || 'https://news.stanford.edu';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "button": {
                    "field": "buttonText"
                }
            };
        }

         // Validate required functions
        try {
            if (typeof componentFunctions !== 'object' || typeof componentFunctions.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(componentFunctions)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Button component: ', er);
            return `<!-- Error occurred in the Button component: ${er.message} -->`;
        }

        // NEW: Wrap validation in !squizEdit check - in edit mode we don't need to validate because values may be blank while editing
        if (!squizEdit) {
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
        }

        let linkData = null;
        
        // Getting link data 
        if (internalUrl) {
            try {
                linkData = await basicAssetUri(componentFunctions, internalUrl);
            } catch (er) {
                console.error('Error occurred in the Button component: ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    linkData = {
                        url: "https://news.stanford.edu",
                        text: buttonText
                    };
                } else {
                    return `<!-- Error occurred in the Button component: ${er.message} -->`;
                }
            }
        }

        // Getting button URL
        let buttonUrl = linkData?.url || externalUrl;
        if (squizEdit) {
            buttonUrl = buttonUrl || 'https://news.stanford.edu';
        }
        
        // NEW: Skip URL validation in edit mode - editor handles this
        if (!squizEdit) {
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
        }

        // Prepare component data for template rendering
        const componentData = {
            buttonText,
            isNewWindow,
            buttonUrl,
            isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(button(componentData), squizEditTargets, args);
        }

        // Return original template when not in edit mode
        return button(componentData);
    },
};
