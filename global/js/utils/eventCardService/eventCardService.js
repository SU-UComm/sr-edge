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
            throw new Error(`Events API request failed. ${error?.message || error}`);
        });

        if (!res.ok) {
            throw new Error(`Events API returned ${res.status} ${res.statusText}`.trim());
        }

        let json;
        try {
            json = await res.json();
        } catch (error) {
            throw new Error(`Events API returned invalid JSON. ${error?.message || error}`);
        }

        if (!Array.isArray(json?.events)) {
            throw new Error('Events API response missing events array');
        }

        try {
            return json.events.map((card) => formatCardDataEvents(card));
        } catch (error) {
            throw new Error(`Events API returned malformed event data. ${error?.message || error}`);
        }
    }
}
