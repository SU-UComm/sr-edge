import { basicAssetUri } from "../../global/js/utils";
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
        
        // Extract configuration data from arguments
        const { asset, quote, name, title, width } = (args && args.displayConfiguration) || {};

        // Validate required functions
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

        // Validate required fields and ensure correct data types
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

        // Process asset if provided
        let assetData = null;
        if (asset) {
            assetData = await basicAssetUri(fnsCtx, asset);
        }

        // Prepare template data
        const componentData = {
            avatarURL: assetData?.url ? assetData.url : "",
            quote,
            name,
            title,
            width: width.toLocaleLowerCase()
        };

        return pullQuote(componentData);
    }
};