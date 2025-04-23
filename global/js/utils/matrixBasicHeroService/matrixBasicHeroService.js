
export class matrixBasicHeroService {
    constructor({ BASE_DOMAIN }) {
        this.BASE_DOMAIN = BASE_DOMAIN;
    }

    async getBasicHeroData(currentAssetId) {
        const query = `${this.BASE_DOMAIN}_api/mx/storyhero?story=${currentAssetId}`;

        const res = await fetch(query).catch((error) => {
            throw new Error(error);
        });

        const json = await res.json();

        return json;


        // return Promise.all(json)
        //     .catch((error) => {
        //         throw new Error(error);
        //     });
    }
}

export default matrixBasicHeroService;