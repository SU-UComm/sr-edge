import { basicAssetUri } from "../../global/js/utils";
import { processEditor } from '../../global/js/utils/processEditor';
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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Extract configuration data from arguments
        let images = [];

        // if contentConfiguration is provided and images is an array, use the images from the contentConfiguration
        if (args?.contentConfiguration && args.contentConfiguration?.images) {
            images = args.contentConfiguration.images;
        }

        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = {
            "caption": {
                "field": "contentConfiguration.images",
                "array": true,
                "property": "imageCaption"
            },
            "sectionCaption": {
                "field": "contentConfiguration.images.0.imageCaption"
            }
        };

        let imageData = [];
        let numberOfCaptions = 0;
        let sectionCaption = ''
        
        for (const { imageAsset, imageCaption } of images) {
            let asset;
            if (squizEdit && typeof imageAsset === 'undefined') {
                break;
            }

            try {
                asset = await basicAssetUri(componentFunctions, imageAsset);
            } catch (error) {
                if (squizEdit) {
                    asset = {
                        "url": "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        "attributes": {
                            "allow_unrestricted": false,
                            "size": 1858005,
                            "height": 960,
                            "width": 1440,
                            "title": "placeholder.png",
                            "name": "placeholder.png",
                            "caption": "",
                            "alt": "This is a placeholder"
                        },
                    };
                } else {
                    console.error('Error occurred in the multicolumn image component: Failed to fetch image data. ', error);
                    return `<!-- Error occurred in the Multicolumn image component: ${error.message} -->`;
    
                }
            }
            if (imageCaption) {
                sectionCaption ||= imageCaption; // Set only if empty
                numberOfCaptions++;
            }
            if (asset) {
                imageData.push({ ...asset, caption: imageCaption });
            }
        }

        // NEW: add a default if squizEdit is true
        if (squizEdit) {
            // Ensure each image has default caption
            imageData = imageData.map(image => ({
                ...image,
                imageCaption: image.imageCaption || 'Add image caption'
            }));
        }
           // Prepare template data
        const componentData = {
            width: "wide",
            images: imageData,
            sectionCaption,
            showIndividualCaptions: numberOfCaptions > 1,
        };

        
        if (!squizEdit) {
            return multicolumnImage(componentData);  
        } 

        // if in squiz edit and there are less than 2 images, return an empty div
        if (imageData.length < 2) {
            return "<div></div>";
        } 
        // NEW: process the output to be editable in Squiz Editor
        return processEditor(multicolumnImage(componentData), squizEditTargets);
    }
};