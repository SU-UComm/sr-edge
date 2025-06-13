import campaignCtaTemplate from './campaign-cta.hbs';
import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';

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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        
        // Maintain backward compatibility for existing code
        const fnsCtx = componentFunctions || componentContext || {};
        
        // CHANGE: change const to let so we can modify later for squizEdit default values
        let { image, title, description, linkUrl, linkText } = (args && args.displayConfiguration) || {};

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = info?.ctx?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;
        
        // NEW: add defaults if squizEdit is true
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Campaign Title';
            description = description || 'Campaign description text goes here.';
            linkText = linkText || 'Learn more';
            linkUrl = linkUrl || "matrix-asset://StanfordNews/29389"
            // Provide default image if none exists
            image = image || 'matrix-asset://StanfordNews/130444';
            
            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            squizEditTargets = {
                "title": {
                    "field": "displayConfiguration.title"
                },
                "description": {
                    "field": "displayConfiguration.description"
                },
                "linkText": {
                    "field": "displayConfiguration.linkText"
                }
            };
        }

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

        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check
        if (!squizEdit) {
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
        }
        
        let imageData = null;
        let linkData = null;

        // Getting link data 
        if (linkUrl) {
            try {
                linkData = await basicAssetUri(fnsCtx, linkUrl);
            } catch (er) {
                console.error('Error occurred in the Campaign cta component: Failed to fetch link data. ', er);
                if (squizEdit) {
                    linkData = {
                        url: "https://news.stanford.edu",
                        text: linkText
                    };
                }
            }
        }

        // Getting image data 
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Campaign cta component: Failed to fetch image data. ', er);
                if (squizEdit) {
                    imageData = {
                        "url": "https://news.stanford.edu/__data/assets/image/0016/130444/Jordan-Hall-Dusk.png",
                        "attributes": {
                            "alt": {
                                "value": "Campaign image"
                            }
                        }
                      };
                }
            }
        }
        
        // Prepare component data for template rendering
        const componentData = {
            title,
            description,
            linkText,
            linkData,
            imageData,
            width: "full",
            paddingX: false
        };

        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) return campaignCtaTemplate(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processSquizEdit(campaignCtaTemplate(componentData), squizEditTargets);
    }
};

