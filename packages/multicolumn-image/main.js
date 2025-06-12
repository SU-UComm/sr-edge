import { basicAssetUri } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
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

        // Extract configuration data from arguments
        let { images } = args?.contentConfiguration || {};

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = info?.ctx?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;

        // NEW: add a default if squizEdit is true
        if (squizEdit) {
            // Add default values if content is not provided
            images = images && images.length >= 2 ? images : [
                {
                    imageAsset: 'matrix-asset://api-identifier/sample-image-1',
                    imageCaption: 'Sample caption for first image'
                },
                {
                    imageAsset: 'matrix-asset://api-identifier/sample-image-2', 
                    imageCaption: 'Sample caption for second image'
                },
                {
                    imageAsset: 'matrix-asset://api-identifier/sample-image-3',
                    imageCaption: ''
                }
            ];

            // Ensure each image has default caption
            images = images.map(image => ({
                ...image,
                imageCaption: image.imageCaption || ''
            }));

            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            // top level keys match the data-se attributes found in the template eg data-se="caption"
            // the field values are the component data fields eg data-sq-field="contentConfiguration.images[0].imageCaption"
            squizEditTargets = {
                "caption": {
                    "field": "contentConfiguration.images",
                    "array": true,
                    "property": "imageCaption"
                },
                "sectionCaption": {
                    "field": "contentConfiguration.images.0.imageCaption"
                }
            };
        }

        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check
        if (!squizEdit) {
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
        }

        const imageData = [];
        let numberOfCaptions = 0;
        let sectionCaption = ''
        
        for (const { imageAsset, imageCaption } of images) {
            let asset;
            
            if (squizEdit) {
                // In edit mode, provide placeholder data if API call fails
                try {
                    asset = await basicAssetUri(fnsCtx, imageAsset);
                } catch (error) {
                    // Provide mock data silently on API failure
                    asset = { url: 'https://picsum.photos/400/400' };
                }
            } else {
                asset = await basicAssetUri(fnsCtx, imageAsset);
            }
        
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
        };

        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) return multicolumnImage(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processSquizEdit(multicolumnImage(componentData), squizEditTargets);
    }
};