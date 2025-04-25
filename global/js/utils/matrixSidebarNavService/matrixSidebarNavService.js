/**
 * Service class for retrieving sidebar nav data from the Matrix API.
 */
export class matrixSidebarNavService {
    /**
     * Constructs the service with a base domain URL.
     * 
     * @param {Object} config - Configuration object.
     * @param {string} config.BASE_DOMAIN - The base domain for the API.
     */
    constructor({ BASE_DOMAIN }) {
        this.BASE_DOMAIN = BASE_DOMAIN;
    }

    /**
     * Fetches side bar parent data for a given asset ID from the Matrix API.
     *
     * @async
     * @param {string} currentAssetId - The asset ID to fetch parent data for.
     * @returns {Promise<Object>} A promise that resolves to the parent data.
     * @throws {Error} If the fetch request or JSON parsing fails.
     */
    async getSidebarNavParentData(currentAssetId) {
        const query = `${this.BASE_DOMAIN}_api/mx/sidebarnav?page=${currentAssetId}`;

        try {
            const res = await fetch(query);
            const json = await res.json();

            return json;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Fetches side bar menu data for a given asset ID from the Matrix API.
     *
     * @async
     * @param {string} parentAssetId - The asset ID to fetch menu data for.
     * @returns {Promise<Object>} A promise that resolves to the menu data.
     * @throws {Error} If the fetch request or JSON parsing fails.
     */
    async getSidebarNavMenuData(parentAssetId) {
        const query = `${this.BASE_DOMAIN}_api/mx/menu?loc=${parentAssetId}`;

        try {
            const res = await fetch(query);
            const json = await res.json();

            return json;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default matrixSidebarNavService;