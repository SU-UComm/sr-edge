import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';
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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        
        // CHANGE: change const to let so we can modify later for squizEdit default values
        let { buttons } = args || {};
        
        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = componentContext?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;
        
        // NEW: add a default if squizEdit is true
        if (squizEdit) {
            // Add default values if buttons array is not provided or empty
            buttons = buttons && buttons.length > 0 ? buttons : [
                { buttonText: 'Button 1', externalUrl: '#' },
                { buttonText: 'Button 2', externalUrl: '#' }
            ];
            
            // Ensure each button has default buttonText
            buttons = buttons.map(button => ({
                ...button,
                buttonText: button.buttonText || 'Link text'
            }));
            
            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            // For button arrays, we target the "button" data-se attribute with array configuration
            squizEditTargets = {
                "button": {
                    "field": "buttons",
                    "array": true,
                    "property": "buttonText"
                }
            };
        }
        
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

        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check
        if (!squizEdit) {
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
        }

        //Processes buttons asynchronously to resolve URLs and prepare template data
        const data = await Promise.all(
            buttons.map(async (button) => {
                const { buttonText = "Button text", internalUrl, externalUrl, isNewWindow } = button;
                let linkData = null;
                
                // Getting link data 
                if (internalUrl) {
                    try {
                        linkData = await basicAssetUri(componentFunctions, internalUrl);
                    } catch (er) {
                        console.error('Error occurred in the Button component: ', er);
                        if (squizEdit) {
                            linkData = {
                                url: "https://news.stanford.edu",
                                text: buttonText
                            };
                        }
                    }
                }
                
                const buttonUrl = linkData?.url || externalUrl;
                
                // NEW: Skip URL validation in edit mode - editor handles this
                if (!squizEdit && buttonUrl === '') {
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
        
        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) return buttonRow(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processEditor(buttonRow(componentData), squizEditTargets);
    },
};