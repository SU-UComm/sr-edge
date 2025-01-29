/**
 * Orchestrates the transformation of data from
 * various endpoints
 */
export class cardDataAdapter {
    constructor(cardService) {
        this.cardService = cardService;
        this.getCards = cardService?.getCards;
    }

    setCardService(cardService) {
        this.cardService = cardService;
        this.getCards = cardService.getCards.bind(cardService);
    }
}

export default cardDataAdapter;