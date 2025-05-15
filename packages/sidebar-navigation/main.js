import { sidebarNavDataAdapter, matrixSidebarNavService } from '../../global/js/utils';
import { isEditor } from "../../global/js/utils/isEditor";
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
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @param {string} [info.set.environment.BASE_DOMAIN] - Alternative base URL for the Matrix API.
     * @returns {Promise<string>} The rendered Sidebar Navigation HTML or an error message.
     * @throws {Error} If basic hero data fetch operation fails.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.ctx || {};
        const { ctx } = info;
        const editMode = isEditor(ctx.url);

        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // const currentAssetId = '165914';
        const currentAssetId = fnsCtx?.assetId

        // Validate required environment variables
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(
                    `The "info.ctx.assetId" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(currentAssetId)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Sidebar Navigation component: ', er);
            return `<!-- Error occurred in the Sidebar Navigation component: ${er.message} -->`;
        }
        
        const adapter = new sidebarNavDataAdapter();
        let parentData = null
        let menuData = null

        // Create our service
        const service = new matrixSidebarNavService({ BASE_DOMAIN });

        // Set our sidebar service
        adapter.setSidebarNavService(service);

        // Get the parent data
        try {
            parentData = await adapter.getSidebarNavParentData(currentAssetId);

            if (!parentData || typeof parentData !== 'object') {
                throw new Error('Invalid API response: "parentData" is missing or not an object.');
            }
        } catch (er) {
            console.error('Error occurred in the Sidebar Navigation component: Error parsing parent data JSON response: ', er);
            return `<!-- Error occurred in the Sidebar Navigation component: Error parsing parent data JSON response: ${er.message} -->`;
        }

        const { id, root } = parentData;

        // Validate fetched data
        try {
            if (typeof id !== 'string' || id.trim() === '') {
                throw new Error(
                    `The "id" must be non-empty string. The ${JSON.stringify(id)} was received.`
                );
            }
            if (typeof root !== 'string' || root.trim() === '') {
                throw new Error(
                    `The "root" must be non-empty string. The ${JSON.stringify(root)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Sidebar Navigation component: ', er);
            return `<!-- Error occurred in the Sidebar Navigation component: ${er.message} -->`;
        }

        // Get the menu data
        try {
            menuData = await adapter.getSidebarNavMenuData(root);

            if (!menuData || typeof menuData !== 'object') {
                throw new Error('Invalid API response: "menuData" is missing or not an object.');
            }
        } catch (er) {
            console.error('Error occurred in the Sidebar Navigation component: Error parsing menu data JSON response: ', er);
            return `<!-- Error occurred in the Sidebar Navigation component: Error parsing menu data JSON response: ${er.message} -->`;
        }
        
        const { asset_assetid, asset_url, asset_short_name, menu } = menuData;
        
        // Validate fetched data
        try {
            if (typeof asset_assetid !== 'string' || asset_assetid.trim() === '') {
                throw new Error(
                    `The "asset_assetid" must be non-empty string. The ${JSON.stringify(asset_assetid)} was received.`
                );
            }
            if (typeof asset_url !== 'string' || asset_url.trim() === '') {
                throw new Error(
                    `The "asset_url" must be non-empty string. The ${JSON.stringify(asset_url)} was received.`
                );
            }
            if (typeof asset_short_name !== 'string' || asset_short_name.trim() === '') {
                throw new Error(
                    `The "asset_short_name" must be non-empty string. The ${JSON.stringify(asset_short_name)} was received.`
                );
            }
            if (!Array.isArray(menu)) {
                throw new Error(
                    `The "menu" must be an array. The ${JSON.stringify(menu)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Sidebar Navigation component: ', er);
            return `<!-- Error occurred in the Sidebar Navigation component: ${er.message} -->`;
        }
        
        // Prepare component data for template rendering
        const componentData = {
            id,
            menuData,
            editMode
        };
        return sidebarNavigationTemplate(componentData);
    }
};