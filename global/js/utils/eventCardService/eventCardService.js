import { formatCardDataEvents } from "../formatCardDataEvents";

export class eventCardService {
    constructor({ api }) {
        this.api = api;
    }

    /**
     * fetch and format card data
     *
     * @returns {array}
     */
    async getCards() {
        const res = await fetch(this.api).catch((error) => {
            throw new Error(error);
        });

        const json = await res.json();

        return Promise.all(json.events)
            .then((data) => data.map((card) => formatCardDataEvents(card)))
            .catch((error) => {
                throw new Error(error);
        });
    }
}
