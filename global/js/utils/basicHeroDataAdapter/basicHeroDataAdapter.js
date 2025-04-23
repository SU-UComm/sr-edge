/**
 * Orchestrates the transformation of data from
 * various endpoints
 */
export class basicHeroDataAdapter {
    constructor(basicHeroService) {
        this.basicHeroService = basicHeroService;
        this.getBasicHeroData = basicHeroService?.getBasicHeroData;
    }

    setBasicHeroService(basicHeroService) {
        this.basicHeroService = basicHeroService;
        this.getBasicHeroData = basicHeroService.getBasicHeroData.bind(basicHeroService);
    }
}

export default basicHeroDataAdapter;