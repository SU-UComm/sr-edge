import { FetchAdapter } from '../../global/js/utils';
import headerTemplate from './header.hbs';

/**
 * Header component that renders site header
 * @module Header
 */
export default {
    /**
     * Renders the Header component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {string} args.dataUrl - The data url form the fetch should be. 
     * @param {Object} info.ctx - Functions available in the execution context.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {string} [info.env.CONTENT_API] - Matrix content API.
     * @param {string} [info.env.CONTENT_API_KEY] - The key for the API.
     * @param {string} [info.env.FB_JSON_URL] - The URL for FunnelBack endpoint.
     * @param {Object} [info.set] - Alternative source for environment variables.
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @param {string} [info.set.environment.CONTENT_API] - Matrix content API.
     * @param {string} [info.set.environment.CONTENT_API_KEY] - The key for the API.
     * @param {string} [info.set.environment.FB_JSON_URL] - The URL for FunnelBack endpoint.
     * @returns {Promise<string>} The rendered Header HTML or an error message.
     * @throws {Error} If basic hero data fetch operation fails.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.ctx || {};

        // Extracting environment variables from provided info
        const { CONTENT_API, CONTENT_API_KEY, FB_JSON_URL } = info?.env || info?.set?.environment || {};

        // Extracting configuration data from arguments
        const { dataUrl } = args || {};

        // Validate required environment variables
        try {
            if (typeof CONTENT_API !== 'string' || CONTENT_API === '') {
                throw new Error(
                    `The "CONTENT_API" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(CONTENT_API)} was received.`
                );
            }
            if (typeof CONTENT_API_KEY !== 'string' || CONTENT_API_KEY === '') {
                throw new Error(
                    `The "CONTENT_API_KEY" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(CONTENT_API_KEY)} was received.`
                );
            }
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(FB_JSON_URL)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.ctx" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Header component: ', er);
            return `<!-- Error occurred in the Header component: ${er.message} -->`;
        }


         // Validate required fields and ensure correct data types
         try {
            if (typeof dataUrl !== 'string' || dataUrl.trim() === '') {
                throw new Error(
                    `The "dataUrl" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(dataUrl)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Header component: ', er);
            return `<!-- Error occurred in the Header component: ${er.message} -->`;
        }

        const adapter = new FetchAdapter();
        let siteData = null

        adapter.url = args.dataUrl;

        // Get the site data
        try {
            siteData = await adapter.fetch();

            if (!siteData || typeof siteData !== 'object') {
                throw new Error("Invalid API response: siteData is missing or not an object.");
            }
        } catch (er) {
            console.error('Error occurred in the Header component: Error parsing hero data JSON response: ', er);
            return `<!-- Error occurred in the Header component: Error parsing hero data JSON response: ${er.message} -->`;
        }

        const { site, navigation, search } = siteData;

        try {
            if (!site || typeof site !== 'object') {
                throw new Error('The "site" must be an object.');
            }
        } catch (er) {
            console.error('Error occurred in the Header component: ', er);
            return `<!-- Error occurred in the Header component: ${er.message} -->`;
        }
        
        const { url, logo, logoLight, logoTopBar, cookieStatement } = site;
        // Validate fetched data
        try {
            if (url && typeof url !== 'string') {
                throw new Error(
                    `The "url" must be a string. The ${JSON.stringify(url)} was received.`
                );
            }
           
            if (logo && typeof logo !== 'object') {
                throw new Error(
                    `The "logo" must be an object. The ${JSON.stringify(logo)} was received.`
                );
            }
            if (logoLight && typeof logoLight !== 'object') {
                throw new Error(
                    `The "logoLight" must be an object. The ${JSON.stringify(logoLight)} was received.`
                );
            }
            if (logoTopBar && typeof logoTopBar !== 'object') {
                throw new Error(
                    `The "logoTopBar" must be an object. The ${JSON.stringify(logoTopBar)} was received.`
                );
            }
            if (cookieStatement && typeof cookieStatement !== 'string') {
                throw new Error(
                    `The "cookieStatement" must be a string. The ${JSON.stringify(cookieStatement)} was received.`
                );
            }
            if (navigation && typeof navigation !== 'object') {
                throw new Error(
                    `The "navigation" must be an object. The ${JSON.stringify(navigation)} was received.`
                );
            }
            if (search && typeof search !== 'object') {
                throw new Error(
                    `The "search" must be an object. The ${JSON.stringify(search)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Header component: ', er);
            return `<!-- Error occurred in the Header component: ${er.message} -->`;
        }
        
        // Prepare data
        const urlTopBar = "https://www.stanford.edu/";
    
        // Test data 
        const pageControls = null
        const relatedStory = null

        // Prepare component data for template rendering
        const componentData = {
            urlTopBar,
            logoTopBar,
            url,
            logo, 
            logoLight,
            navigation,
            search,
            cookieStatement, 
            
            pageControls,
            relatedStory,
            audience: "external",
            consent: false,
        };
        return headerTemplate(componentData);
    }
};