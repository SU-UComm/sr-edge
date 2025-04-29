import { FetchAdapter } from '../../global/js/utils';
import footerTemplate from './footer.hbs';

/**
 * Footer component that renders site footer
 * @module Footer
 */
export default {
    /**
     * Renders the Footer component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {string} args.dataUrl - The data url form the fetch should be. 
     * @param {Object} info.ctx - Functions available in the execution context.
     * @returns {Promise<string>} The rendered Footer HTML or an error message.
     * @throws {Error} If footer data fetch operation fails.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extracting configuration data from arguments
        const { dataUrl } = args || {};
        
        // Validate required environment variables
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.ctx" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Footer component: ', er);
            return `<!-- Error occurred in the Footer component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (typeof dataUrl !== 'string' || dataUrl.trim() === '') {
                throw new Error(
                    `The "dataUrl" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(dataUrl)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Footer component: ', er);
            return `<!-- Error occurred in the Footer component: ${er.message} -->`;
        }

        // Fetch site data
        const adapter = new FetchAdapter();
        let siteData = null;

        adapter.url = dataUrl;

        // Get the site data
        try {
            siteData = await adapter.fetch();

            if (!siteData || typeof siteData !== 'object') {
                throw new Error("Invalid API response: siteData is missing or not an object.");
            }
        } catch (er) {
            console.error('Error occurred in the Footer component: Error parsing footer data JSON response: ', er);
            return `<!-- Error occurred in the Footer component: Error parsing footer data JSON response: ${er.message} -->`;
        }
        

        // Prepare component data for template rendering
        const componentData = {
            ...args,
            ...siteData,
        };

        return footerTemplate(componentData);
    }
};
