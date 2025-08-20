import { FetchAdapter } from '../../global/js/utils';
import headerTemplate from './header.hbs';

/**
 * Extracts the persona from the dataUrl query string.
 * @param {string} dataUrl
 * @returns {string} persona ("student" | "faculty" | "external")
 */
function getPersonaFromDataUrl(dataUrl) {
    try {
        const urlObj = new URL(dataUrl);
        const persona = urlObj.searchParams.get("persona");
        if (persona === "student" || persona === "faculty" || persona === "external") {
            return persona;
        }
    } catch (e) {
        return "external";
    }
    return "external";
}

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

        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const componentEnvVars = info?.env || null;
        const currentAssetId = componentContext?.assetId;

        const { CONTENT_API, CONTENT_API_KEY } = componentEnvVars || {};

        // Extracting configuration data from arguments
        const { dataUrl = null } = args || {};
        if(!dataUrl){
            return `<!-- Error occurred in the Header component: dataUrl is not supported -->`;
        }
        
        let siteData = null;
        const siteDataAdapter = new FetchAdapter();
        siteDataAdapter.url = dataUrl;

        let pageData = null;
        const pageDataAdapter = new FetchAdapter();
        // Compose and fetch the popular stories results
        const PAGE_REQUEST_PROPS = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${CONTENT_API_KEY}`,
            }
        };
        pageDataAdapter.url = `${CONTENT_API}/${currentAssetId}?data=metadata`;
        pageDataAdapter.requestProps = PAGE_REQUEST_PROPS;

        try {
            [siteData, pageData] = await Promise.all([
                siteDataAdapter.fetch(),
                pageDataAdapter.fetch()
            ]);
            if (!siteData || typeof siteData !== 'object') {
                throw new Error("Invalid API response: siteData is missing or not an object.");
            }
            // Process both results
        } catch (error) {
            console.error('Error occurred in the Header component: Error parsing hero data JSON response: ', error);
            return `<!-- Error occurred in the Header component: Error parsing hero data JSON response: ${error.message} -->`;
        }
        
        const { site, navigation, search } = siteData;
        const { url, logo, logoLight, logoTopBar, cookieStatement } = site;
        
        const { id, short_name } = pageData;
        const { storyLayout = null, srContentType = null, srContentMainTopic = null} = pageData?.metadata || {};
        
        const isVideo = srContentType && srContentType?.includes("28207");
        const isStory = !!storyLayout;
        const persona = getPersonaFromDataUrl(dataUrl);

        // Prepare data
        const urlTopBar = "https://www.stanford.edu/";
    
        // Test data 
        const pageControls = {
            id,
            title: short_name,
            contentType: isVideo ? "Video" : "Story",
            isStory,
            isVideo,
            persona,
            mainTopicId: srContentMainTopic?.[0] || null
        };
        const relatedStory = null;
        
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
            audience: persona,
            consent: false
        };
        return headerTemplate(componentData);
    }
};