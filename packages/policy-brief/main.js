import { basicAssetUri } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';
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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // CHANGE: change const to let for mutability
        let { image, type, title, summary, linkUrl, linkText } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Heading text';
            summary = summary || 'Add content';
            linkText = linkText || 'Link text';
            
            // Provide default values for other required fields
            image = image || 'matrix-asset://StanfordNews/172387';
            linkUrl = linkUrl || 'https://news.stanford.edu';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": { "field": "contentConfiguration.title" },
                "summary": { "field": "contentConfiguration.summary" },
                "linkText": { "field": "contentConfiguration.linkText" }
            };
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        let assetData = null;

        // Getting image data with error handling
        if (image) {
            try {
                assetData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Policy brief component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    assetData = {
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
                        }
                    };
                }
            }
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
            paddingX: false
        };

        // NEW: Early return pattern
        if (!squizEdit) return policyBriefTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(policyBriefTemplate(componentData), squizEditTargets);
    }
};