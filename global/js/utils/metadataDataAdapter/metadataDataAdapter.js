/**
 * Adapter class to orchestrate the transformation of data
 * from various endpoints, using a provided metadata service.
 */
export class metadataDataAdapter {
    /**
     * Creates an instance of metadataDataAdapter.
     *
     * @param {Object} metadataService - A service object that provides the `getMetadataData` method.
     */
    constructor(metadataService) {
        this.metadataService = metadataService;
        this.getMetadataData = metadataService?.getMetadataData;
    }

    /**
     * Sets or replaces the hero service and rebinds its `getMetadataData` method.
     *
     * @param {Object} metadataService - The new metadata service instance.
     * @param {Function} metadataService.getMetadataData - Method to fetch metadata data by asset ID.
     */
    setMetadataService(metadataService) {
        this.metadataService = metadataService;
        this.getMetadataData = metadataService.getMetadataData.bind(metadataService);
    }
}

export default metadataDataAdapter;