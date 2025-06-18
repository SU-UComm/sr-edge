import { sidebarNavDataAdapter, matrixSidebarNavService } from '../../global/js/utils';
import sidebarNavigationTemplate from './sidebar-navigation.hbs';

/**
 * Sidebar Navigation component that renders side navigation
 * @module SidebarNavigation
 */
export default {
    /**
     * Renders the Sidebar Navigation component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {Object} info.ctx - Functions available in the execution context.
     * @param {string} [info.ctx.assetId] - The current asset id based on the context.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {string} [info.env.BASE_DOMAIN] - Base domain.
     * @param {Object} [info.set] - Alternative source for environment variables.
     * @param {string} [info.set.environment.BASE_DOMAIN] - Alternative base URL for the Matrix API.
     * @returns {Promise<string>} The rendered Sidebar Navigation HTML or an error message.
     * @throws {Error} If basic hero data fetch operation fails.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.ctx || {};
        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // const currentAssetId = '165914';
        const currentAssetId = fnsCtx?.assetId;

        const adapter = new sidebarNavDataAdapter();
        let menuData = null

        // Create our service
        const service = new matrixSidebarNavService({ BASE_DOMAIN });

        // Set our sidebar service
        adapter.setSidebarNavService(service);

        // Get the menu data directly using currentAssetId
        try {
            menuData = await adapter.getSidebarNavMenuData(currentAssetId);

            if (!menuData || typeof menuData !== 'object') {
                throw new Error(`Invalid API response: "menuData" is missing or not an object. Received: ${JSON.stringify(menuData)}`);
            }
        } catch (er) {
            console.error('Error occurred in the Sidebar Navigation component: Error parsing menu data JSON response: ', er);
            return `<!-- Error occurred in the Sidebar Navigation component: Error parsing menu data JSON response: ${er.message} -->`;
        }
        
        // Prepare component data for template rendering
        const componentData = {
            id: currentAssetId,
            menuData,
        };
        return sidebarNavigationTemplate(componentData);
    }
};