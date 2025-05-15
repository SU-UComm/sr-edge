import { basicAssetUri } from "../../global/js/utils";
import { isEditor } from "../../global/js/utils/isEditor";
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
        // Extracting environment variables from provided info
        const { API_IDENTIFIER } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};
        const { ctx } = info;
        const editMode = isEditor(ctx.url);

        // Extract configuration data from arguments
        const { images } = args?.contentConfiguration || {};

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
            if (images && !Array.isArray(images) || images.length < 2) {
                throw new Error(
                    `The "images" field must be an array and at least 2 elements length. The ${JSON.stringify(images)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn image component: ', er);
            return `<!-- Error occurred in the Multicolumn image component: ${er.message} -->`;
        }

        const imageData = [];
        let numberOfCaptions = 0;
        let sectionCaption = ''
        
        for (const { imageAsset, imageCaption } of images) {
            const asset = await basicAssetUri(fnsCtx, imageAsset);
        
            if (imageCaption) {
                sectionCaption ||= imageCaption; // Set only if empty
                numberOfCaptions++;
            }
            
            imageData.push({ ...asset, caption: imageCaption });
        }

        // Prepare template data
        const componentData = {
            width: "wide",
            images: imageData,
            sectionCaption,
            showIndividualCaptions: numberOfCaptions > 1,
            editMode,
        };
        return multicolumnImage(componentData);
    }
};