import { basicAssetUri } from "../../global/js/utils";
import multicolumnImage from './multicolumn-image.hbs';

/**
 * Multicolumn Image component that renders multiple images in a responsive layout.
 *
 * @module MulticolumnImage
 */
export default {
  /**
   * Main function to render the Multicolumn Image component.
   *
   * @async
   * @function main
   * @param {Object} args - Component arguments
   * @param {Object} args.contentConfiguration - Configuration object containing component properties
   * @param {Array} args.contentConfiguration.images - Array of image objects
   * @param {Object} args.contentConfiguration.images[] - Individual image object
   * @param {string} args.contentConfiguration.images[].imageAsset - Asset URL for the image
   * @param {string} [args.contentConfiguration.images[].imageCaption] - Optional caption for the image
   * @param {Object} info - Context information
   * @param {Object} info.env - Environment variables in the execution context
   * @param {Object} info.fns - Function context
   * @param {Function} info.fns.resolveUri - URI resolution function
   * @returns {Promise<string>} Rendered multicolumn image HTML string
   */
  async main(args, info) {
    const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
    const fnsCtx = info?.fns || info?.ctx || {};
    // Extract configuration data from arguments
    const { images } = (args && args.contentConfiguration);
    // Validate required functions
    try {
      if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
        throw new Error(
          `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
        );
      }
      if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
        throw new Error(
          `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
        );
      }
    } catch (er) {
      console.error('Error occurred in the Multicolumn image component: ', er);
      return `<!-- Error occurred in the Multicolumn image component: ${er.message} -->`;
    }
    // Validate required fields and ensure correct data types
    try {
      if (images && typeof images !== 'object') {
        throw new Error(
          `The "images" field must be an array. The ${JSON.stringify(images)} was received.`
        );
      }
    } catch (er) {
      console.error('Error occurred in the Multicolumn image component: ', er);
      return `<!-- Error occurred in the Multicolumn image component: ${er.message} -->`;
    }
    const imageData = [];
    for (const image of images) {
      const imageAsset = await basicAssetUri(fnsCtx, image.imageAsset)
      const imageCaption = image.imageCaption ? image.imageCaption : ""
      imageData.push({...imageAsset, caption: imageCaption });
    }
    // Prepare template data
    const componentData = {
      images: imageData,
      numberOfCaptions: imageData.length
    };
    return multicolumnImage(componentData);
  }
};