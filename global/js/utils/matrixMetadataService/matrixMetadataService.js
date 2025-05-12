/**
 * Service class for retrieving metadata data from the Matrix API.
 */
export class matrixMetadataService {
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
     * Fetches metadata data for a given asset ID from the Matrix API.
     *
     * @async
     * @param {string} currentAssetId - The asset ID to fetch metadata data for.
     * @returns {Promise<Object>} A promise that resolves to the metadata data.
     * @throws {Error} If the fetch request or JSON parsing fails.
     */
    async getMetadataData(currentAssetId) {
        const query = `${this.BASE_DOMAIN}_api/mx/storymetadata?story=${currentAssetId}`;

        try {
            const res = await fetch(query);
            const json = await res.json();

            return json;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default matrixMetadataService;