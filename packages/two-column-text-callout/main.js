import xss from "xss";
import { basicAssetUri, isRealExternalLink } from '../../global/js/utils';
import twoColumnTemplate from './two-column-text-callout.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

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
    
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        // Detect edit mode
        const squizEdit = componentContext?.editor || false;
        // Extract configuration data
        let { heading, showTopBorder = true, callouts = [] } = args;
        
        let squizEditTargets = null;
        if(squizEdit) {
            heading = heading || 'Heading text';
            callouts = callouts || [];

            squizEditTargets = {
                "heading": { "field": "heading" },
                "infoBoxTitle": { "field": "callouts", "array": true, "property": "title" },
                "infoBoxContent": { "field": "callouts", "array": true, "property": "content" },
                "caption": { "field": "callouts", "array": true, "property": "imageConfiguration.caption"},
                "credit": { "field": "callouts", "array": true, "property": "imageConfiguration.credit"},
                "button": { "field": "callouts", "array": true, "property": "buttonConfiguration.buttonText"}
            };
        }

        const calloutsData = [];

        for (const callout of callouts) { 
            let { title, content, imageConfiguration, buttonConfiguration } = callout;
            let { caption, credit, imagePlacement, image } = imageConfiguration || {};
            let { buttonText, externalUrl, internalUrl, isNewWindow } = buttonConfiguration || {};

            if(squizEdit) {
                title = title || 'Title text';
                content = content || 'Add content';

                buttonText = buttonText || 'Link text';
                
                caption = `<span data-se="caption">${caption ? caption : 'Caption text'}</span>`;
                credit = `<span data-se="credit">${credit ? credit : 'Credit text'}</span>`;

            }

             // Prepare caption-credit data
            const captionCredit = [caption, credit].filter(Boolean).join(' | ');

            // Fetch image data with error handling
            let imageData = null;
            if (image) {
                try {
                    imageData = await basicAssetUri(fnsCtx, image);
                } catch (er) {
                    console.error('Error occurred in the Two Column Text Callout component: Failed to fetch image data. ', er);
                    if (squizEdit) {
                        imageData = {
                            "url": "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                            "attributes": {
                                "allow_unrestricted": false,
                                "size": 1858005,
                                "height": 960,
                                "width": 1440,
                                "title": "placeholder.png",
                                "name": "placeholder.png",
                                "caption": "",
                                "alt": "This is a placeholder"
                            },
                        };
                    }
                }
            }

            // Resolve internal link
            let linkUrl = null;
            if (internalUrl) {
                try {
                    linkUrl = await basicAssetUri(fnsCtx, internalUrl);
                } catch (er) {
                    console.error('Error occurred in the Two Column Text Callout component: Failed to fetch link data. ', er);
                    // NEW: In edit mode, provide mock data instead of returning error
                    if (squizEdit) {
                        linkUrl = {
                            url: "https://news.stanford.edu",
                            text: buttonText || "Link text"
                        };
                    }
                }
            }
            const internalLinkUrl = linkUrl?.url;

            // Check for empty element 
            let notEmpty = !!(title || content || image || (buttonText && (externalUrl || internalLinkUrl)))
            if(squizEdit) {
                notEmpty = true;
            }

            if (squizEdit || notEmpty) {
                // Using data to get infoBox for each callout
                calloutsData.push({
                    title,
                    content: xss(content),
                    captionCredit,
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

        // Early return for non-edit mode
        if (!squizEdit) {
            return twoColumnTemplate(componentData);
        }

        // Process and return template with inline editing support
        return processEditor(twoColumnTemplate(componentData), squizEditTargets);
    }
};
