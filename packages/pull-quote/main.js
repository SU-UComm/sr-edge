import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
import pullQuote from './pull-quote.hbs';

/**
 * Pull Quote component that renders a formatted quote with associated metadata.
 */

export default {
    /**
     * Main function to render the Pull Quote component.
     * 
     * @async
     * @function main
     * @param {Object} args - Component arguments
     * @param {Object} args.displayConfiguration - Configuration object containing component properties
     * @param {string} [args.displayConfiguration.asset] - URL of the asset to display (optional)
     * @param {string} args.displayConfiguration.quote - The quote text to display
     * @param {string} [args.displayConfiguration.name] - Name associated with the quote (optional)
     * @param {string} [args.displayConfiguration.title] - Title for the pull quote (optional)
     * @param {string} args.displayConfiguration.width - Width variant ("Narrow" or "Large")
     * @param {Object} info - Context information
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Function context
     * @param {Function} info.fns.resolveUri - URI resolution function
     * @returns {Promise<string>} Rendered pull quote HTML string
     */
    async main(args, info) {
        // Extracting environment variables and functions from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // CHANGE: change const to let for mutability
        let { asset, quote, name, title, width } = (args && args.displayConfiguration) || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            quote = quote || 'This is a sample pull quote that can be edited inline to highlight important content.';
            name = name || 'Sample Name';
            title = title || 'Sample Title';
            
            // Provide default values for other required fields
            width = width || 'Narrow';
            asset = asset || 'matrix-asset://api-identifier/164977';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "featuredQuote": { "field": "displayConfiguration.quote" },
                "name": { "field": "displayConfiguration.name" },
                "title": { "field": "displayConfiguration.title" }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
                if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                    throw new Error(
                        `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Pull quote component: ', er);
                return `<!-- Error occurred in the Pull quote component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (asset && typeof asset !== 'string') {
                    throw new Error(
                        `The "asset" field must be a string. The ${JSON.stringify(asset)} was received.`,
                    );
                }
                if (quote && typeof quote !== 'string') {
                    throw new Error(
                        `The "quote" field must be a string. The ${JSON.stringify(quote)} was received.`,
                    );
                }
                if (name && typeof name !== 'string') {
                    throw new Error(
                        `The "name" field must be a string. The ${JSON.stringify(name)} was received.`,
                    );
                }
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string. The ${JSON.stringify(title)} was received.`,
                    );
                }
                if (!["Narrow", "Large"].includes(width)) {
                    throw new Error(
                        `The "width" field cannot be undefined and must be one of ["Narrow", "Large"]. The ${JSON.stringify(width)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Pull quote component: ', er);
                return `<!-- Error occurred in the Pull quote component: ${er.message} -->`;
            }
        }

        // Process asset if provided with error handling
        let assetData = null;
        if (asset) {
            try {
                assetData = await basicAssetUri(fnsCtx, asset);
            } catch (er) {
                console.error('Error occurred in the Pull quote component: Failed to fetch asset data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    assetData = {
                        url: 'https://picsum.photos/200/200',
                        attributes: {
                            alt: 'Sample avatar image',
                            width: 200,
                            height: 200
                        }
                    };
                }
            }
        }

        // Prepare template data
        const componentData = {
            avatarURL: assetData?.url ? assetData.url : "",
            quote,
            name,
            title,
            width: width.toLocaleLowerCase()
        };

        // NEW: Early return pattern
        if (!squizEdit) return pullQuote(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(pullQuote(componentData), squizEditTargets);
    }
};