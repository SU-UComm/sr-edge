import fetch from "node-fetch";
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
            throw new Error(error);
        });
    }
}

export default funnelbackCardService;