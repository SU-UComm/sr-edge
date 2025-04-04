/**
 * Orchestrates the transformation of data from
 * various endpoints
 */
export class cardDataAdapter {
    constructor(cardService) {
        this.cardService = cardService;
        this.getCards = cardService?.getCards;
        this.getResultsSummary = cardService?.getResultsSummary;
        this.getResultData = cardService?.getResultData;
    }

    setCardService(cardService) {
        this.cardService = cardService;
        this.getCards = cardService.getCards.bind(cardService);
        this.getResultsSummary = cardService?.getResultsSummary?.bind(cardService);
        this.getResultData = cardService?.getResultData?.bind(cardService);
    }
}

export default cardDataAdapter;