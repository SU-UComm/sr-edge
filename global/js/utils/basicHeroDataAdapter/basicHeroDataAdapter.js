/**
 * Adapter class to orchestrate the transformation of data
 * from various endpoints, using a provided basic hero service.
 */
export class basicHeroDataAdapter {
    /**
     * Creates an instance of basicHeroDataAdapter.
     *
     * @param {Object} basicHeroService - A service object that provides the `getBasicHeroData` method.
     */
    constructor(basicHeroService) {
        this.basicHeroService = basicHeroService;
        this.getBasicHeroData = basicHeroService?.getBasicHeroData;
    }

    /**
     * Sets or replaces the hero service and rebinds its `getBasicHeroData` method.
     *
     * @param {Object} basicHeroService - The new basic hero service instance.
     * @param {Function} basicHeroService.getBasicHeroData - Method to fetch hero data by asset ID.
     */
    setBasicHeroService(basicHeroService) {
        this.basicHeroService = basicHeroService;
        this.getBasicHeroData = basicHeroService.getBasicHeroData.bind(basicHeroService);
    }
}

export default basicHeroDataAdapter;