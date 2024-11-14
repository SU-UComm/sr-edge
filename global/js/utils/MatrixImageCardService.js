export class MatrixImageCardService {
    constructor({ API_IDENTIFIER, BASE_DOMAIN }) {
        this.API_IDENTIFIER = API_IDENTIFIER;
        this.BASE_DOMAIN = BASE_DOMAIN;
    }
  
    formatMatrixURItoID(items) {
        return items.map((item) => item.image.replace(`matrix-asset://${this.API_IDENTIFIER}/`, "").replace('matrix-asset://api-identifier/', '') );
    }
  
    formatCardIDsToCSV(items) {
        return items.join(",");
    }
  
    async getCards(cards) {
        const imageIDsArray = this.formatMatrixURItoID(cards);
        const imageIDs = this.formatCardIDsToCSV(imageIDsArray);
        const query = `${this.BASE_DOMAIN}_api/mx/images?images=${imageIDs}`;
        
        const res = await fetch(query).catch((error) => {
            throw new Error(error);
        });
        
        const json = await res.json();

        return Promise.all(json).catch((error) => {
            throw new Error(error);
        });
    }
}

export default MatrixImageCardService;