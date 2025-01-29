import { formatCardDataMatrix } from "../formatCardDataMatrix";

export class matrixCardService {
    constructor({ BASE_DOMAIN, API_IDENTIFIER }) {
        this.BASE_DOMAIN = BASE_DOMAIN;
        this.API_IDENTIFIER = API_IDENTIFIER;
    }

    formatMatrixURItoID(cards) {
        return cards.map((card) => card.cardAsset.replace(`matrix-asset://${this.API_IDENTIFIER}/`, "").replace('matrix-asset://api-identifier/', '') );
    }

    formatCardIDsToCSV(cards) {
        return cards.join(",");
    }

    async getCards(cards) {
        const cardIDsArray = this.formatMatrixURItoID(cards);
        const cardIDs = this.formatCardIDsToCSV(cardIDsArray);
        const query = `${this.BASE_DOMAIN}_api/mx/cards?cards=${cardIDs}`;

        const res = await fetch(query).catch((error) => {
            throw new Error(error);
        });

        const json = await res.json();

        return Promise.all(json)
            .then((data) => data.map((card) => formatCardDataMatrix(card)))
            .catch((error) => {
                throw new Error(error);
            });
    }
}

export default matrixCardService;