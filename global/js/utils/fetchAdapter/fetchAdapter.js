/**
 * Orchestrates the fetching of data from
 * various endpoints
 */
export class FetchAdapter {
  constructor(url, type) {
    this.url = url;
    this.type = type;

    this.assetData = "";
    this.assetIds = [];
    this.requestProps = {};
  }

  /**
   * A collection of Matrix asset ids
   *
   * @param  {...any} assets
   * a list of asset ids
   *
   * @returns {self}
   */
  assets(...assets) {
    this.assetIds = assets;

    return this;
  }

  /**
   * The data to return from the Matrix
   * endpoint: "thumbnail", "metadata", etc...
   *
   * @param  {...string} data
   *
   * @returns {self}
   */
  data(...data) {
    this.assetData = data.join(",");
    return this;
  }

  /**
   * What props to pass to the fetch request
   *
   * @param {object} props
   *
   * @returns {self}
   */
  request(props) {
    this.requestProps = props;

    return this;
  }

  /**
   * Fetches data from selected endpoints,
   * it and then outputs an array of returned responses
   *
   * @return {array}
   */
  async fetch() {
    if (this.type === "MX") {
      const promises = this.assetIds.map(async (assetid) => {
        const url = `${this.url}/${assetid}?data=${this.assetData}`;

        const res = await fetch(url, this.requestProps).catch((error) => {
          throw new Error(error);
        });

        const json = await res.json();
        return json;
      });

      // Wait for all promises to resolve before continuing
      return Promise.all(promises);
    }

    const res = await fetch(this.url, this.requestProps).catch((error) => {
      throw new Error(error);
    });

    const json = await res.json();

    return json;
  }
}
