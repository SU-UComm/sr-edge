import { formatMediaCardDataMatrix } from "./formatMediaCardDataMatrix";
import { resolveMediaCardAssetUri } from "./resolveMediaCardAssetUri";

export class matrixMediaCardService {
  constructor({ ctx, API_IDENTIFIER }) {
    this.ctx = ctx;
    this.API_IDENTIFIER = API_IDENTIFIER;
  }

  async getCards(cards) {
    const cardsData = [];
    // Resolve the data for each of the cards
    for (let index = 0; index < cards.length; index++) {
      // Get our current card
      const card = cards[parseInt(index, 10)];

      // Reassign the card data as our current card
      cardsData[parseInt(index, 10)] = resolveMediaCardAssetUri({
        ctx: this.ctx,
        cardData: card,
      });
    }

    return Promise.all(cardsData)
      .then((data) =>
        data.map((cardData) => formatMediaCardDataMatrix(cardData))
      )
      .catch((error) => {
        throw new Error(
          `There was an error formatting the card data: ${error}`
        );
      });
  }
}
