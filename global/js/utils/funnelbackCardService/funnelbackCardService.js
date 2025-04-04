import { formatCardDataFunnelback } from "../formatCardDataFunnelback";

export class funnelbackCardService {
    constructor({ FB_JSON_URL, query }) {
        this.FB_JSON_URL = FB_JSON_URL;
        this.query = query;
    }

    /**
     * validates the FB query string, this is adding futher
     * flexibility to the FB query on the content editor's side
     * allowing them to add a full FB URL (with query included)
     * or just the query itself
     *
     * @returns {string}
     */
    validateQuery() {
        const hasFullQuery = this.query.match(/https:\/\//);

        if (hasFullQuery) {
            const query = this.query.match(/(\?.*)/);

            return this.FB_JSON_URL + query[0];
        }

        return this.FB_JSON_URL + this.query;
    }

    /**
     * will be injected into the adapter's instance
     * to get all card data
     *
     * @returns {array}
     */
    async getCards() {
        const query = this.validateQuery();

        const res = await fetch(query).catch((error) => {
            throw new Error(error);
        });

        const json = await res.json();

        return Promise.all(json.response.resultPacket.results)
            .then((data) => data.map((card) => formatCardDataFunnelback(card)))
            .catch((error) => {
                throw new Error(`Error in getCards: ${error.message}`);
        });
    }

    /**
     * will be injected into the adapter's instance
     * to get resultsSummary data
     *
     * @returns {array}
     */
    async getResultsSummary() {
        try {
        const query = this.validateQuery();

            const res = await fetch(query).catch((error) => {
                throw new Error(error);
            });

            const json = await res.json();

            return json?.response?.resultPacket?.resultsSummary ?? null;
        } catch (error) {
            throw new Error(`Error in getResultsSummary: ${error.message}`);
        }
    }

    /**
     * will be injected into the adapter's instance
     * to fetch both cards and resultsSummary data.
     */
    async getResultData() {
        try {
            const [cards, resultsSummary] = await Promise.all([
                this.getCards(),
                this.getResultsSummary(),
            ]);

            return { cards, resultsSummary };
        } catch (error) {
            throw new Error(`Error in getResultData: ${error.message}`);
        }
    }
}

export default funnelbackCardService;