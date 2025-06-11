import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import fullscreenImageQuoteTemplate from './fullscreen-image.hbs';
import { processSquizEdit } from '../../global/js/utils/isEditor';

/**
 * Fullscreen image quote component that renders quoute with background image
 * @module FullscreenImageQuote
 */
export default {
    /**
     * Renders the Fullscreen Image Quote component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {string} [args.image] - Background image (landscape orientation). Preferred aspect ratio: 3x2. Cropped to 2x1 on large screens (>1500px).
     * @param {string} [args.imageVPosition="center"] - Vertical crop position of the background image if it's taller than its container. Options: "top", "center", "bottom".
     * @param {string} [args.mobileImage] - Mobile background image (portrait orientation). Shown on screens ≤ 991px. Preferred ratio: 3x4. Cropped to 1x2.
     * @param {string} [args.quote] - Quote or body content. Include quotation marks manually.
     * @param {string} [args.quoteVAlign="center"] - Vertical alignment of the quote on desktop. Always bottom on smaller screens. Options: "top", "center", "bottom".
     * @param {string} [args.quoteHAlign="left"] - Horizontal alignment of the quote. Options: "left", "right".
     * @param {boolean} [args.removeTopSpacing=false] - Remove top spacing above the component, e.g., when it's not the first in a series.
     * @param {Object} args.ctaDetails - CTA link details.
     * @param {string} [args.ctaDetails.ctaPreText="Meet"] - Short text shown before the CTA label.
     * @param {string} [args.ctaDetails.ctaText] - Main CTA link text.
     * @param {string} [args.ctaDetails.ctaSubtext="'21, international student"] - Small text shown below the CTA.
     * @param {string} [args.ctaDetails.internalUrl] - Internal Matrix asset link.
     * @param {string} [args.ctaDetails.externalUrl] - External manual link, starting with https://. Adds diagonal arrow icon unless linking to news.stanford.edu.
     * @param {boolean} [args.ctaDetails.isNewWindow=false] - Whether the link opens in a new window.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered Fullscreen Image Quote HTML or an error message.
     */
    async main(args, info) {
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // CHANGE: change const to let for mutability
        let { image, imageVPosition, mobileImage, quote, quoteVAlign, quoteHAlign, removeTopSpacing, ctaDetails } = args || {};
        let { ctaPreText, ctaText, ctaSubtext, externalUrl, internalUrl, isNewWindow } = ctaDetails || {};

        // NEW: Detect edit mode
        const squizEdit = false || info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            quote = quote || '"This is a sample quote that can be edited inline."';
            
            // Ensure ctaDetails object exists
            ctaDetails = ctaDetails || {};
            ctaPreText = ctaPreText || 'Meet';
            ctaText = ctaText || 'Sample Person';
            ctaSubtext = ctaSubtext || "'21, international student";
            
            // Provide default values for other required fields
            image = image || 'matrix-asset://api-identifier/sample-image';
            imageVPosition = imageVPosition || 'center';
            quoteVAlign = quoteVAlign || 'center';
            quoteHAlign = quoteHAlign || 'left';
            removeTopSpacing = removeTopSpacing !== undefined ? removeTopSpacing : false;
            externalUrl = externalUrl || 'https://example.com';
            isNewWindow = isNewWindow !== undefined ? isNewWindow : false;
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "quote": { "field": "quote" },
                "ctaPreText": { "field": "ctaDetails.ctaPreText" },
                "ctaText": { "field": "ctaDetails.ctaText" },
                "ctaSubtext": { "field": "ctaDetails.ctaSubtext" }
            };
        }

        // Validate required environment variables - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: ', er);
                return `<!-- Error occurred in the Fullscreen Image Quote component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                // if (!image || typeof image !== 'string') {
                //     throw new Error(
                //         `The "image" field cannot be undefined and must be a string. The ${JSON.stringify(image)} was received.`
                //     );
                // }
                // if (imageVPosition && !['top', 'center', 'bottom'].includes(imageVPosition)) {
                //     throw new Error(
                //         `The "imageVPosition" field must be one of ["top", "center", "bottom"]. The ${JSON.stringify(imageVPosition)} was received.`
                //     );
                // }
                // if (mobileImage && typeof mobileImage !== 'string') {
                //     throw new Error(
                //         `The "mobileImage" field must be a string. The ${JSON.stringify(mobileImage)} was received.`
                //     );
                // }
                if (!quote || typeof quote !== 'string') {
                    throw new Error(
                        `The "quote" field cannot be undefined and must be a string. The ${JSON.stringify(quote)} was received.`
                    );
                }
                if (quoteHAlign && !['left', 'right'].includes(quoteHAlign)) {
                    throw new Error(
                        `The "quoteHAlign" field must be one of ["left", "right"]. The ${JSON.stringify(quoteHAlign)} was received.`
                    );
                }
                if (quoteVAlign && !['top', 'center', 'bottom'].includes(quoteVAlign)) {
                    throw new Error(
                        `The "quoteVAlign" field must be one of ["top", "center", "bottom"]. The ${JSON.stringify(quoteVAlign)} was received.`
                    );
                }
                if (removeTopSpacing !== undefined && typeof removeTopSpacing !== 'boolean') {
                    throw new Error(
                        `The "removeTopSpacing" field must be a boolean. The ${JSON.stringify(removeTopSpacing)} was received.`
                    );
                }
                if (ctaPreText && typeof ctaPreText !== 'string') {
                    throw new Error(
                        `The "ctaPreText" field must be a string. The ${JSON.stringify(ctaPreText)} was received.`
                    );
                }
                if (ctaText && typeof ctaText !== 'string') {
                    throw new Error(
                        `The "ctaText" field must be a string. The ${JSON.stringify(ctaText)} was received.`
                    );
                }
                if (ctaSubtext && typeof ctaSubtext !== 'string') {
                    throw new Error(
                        `The "ctaSubtext" field must be a string. The ${JSON.stringify(ctaSubtext)} was received.`
                    );
                }
                if (internalUrl && typeof internalUrl !== 'string') {
                    throw new Error(
                        `The "internalUrl" field must be a string. The ${JSON.stringify(internalUrl)} was received.`
                    );
                }
                if (externalUrl && typeof externalUrl !== 'string') {
                    throw new Error(
                        `The "externalUrl" field must be a string. The ${JSON.stringify(externalUrl)} was received.`
                    );
                }
                if (isNewWindow !== undefined && typeof isNewWindow !== 'boolean') {
                    throw new Error(
                        `The "isNewWindow" field must be a boolean. The ${JSON.stringify(isNewWindow)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: ', er);
                return `<!-- Error occurred in the Fullscreen Image Quote component: ${er.message} -->`;
            }
        }

        let imageData = null;
        let mobileImageData = null;
        let linkUrl = null;
        
        
        // Get background image data
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    imageData = {
                        url: 'https://picsum.photos/1200/800',
                        attributes: {
                            alt: 'Sample background image',
                            width: 1200,
                            height: 800
                        }
                    };
                } else {
                    return `<!-- Error occurred in the Fullscreen Image Quote component: Failed to fetch image data. ${er.message} -->`;
                }
            }
        }

        // Get mobile image data
        if (mobileImage) {
            try {
                mobileImageData = await basicAssetUri(fnsCtx, mobileImage);
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: Failed to fetch mobile image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    mobileImageData = {
                        url: 'https://picsum.photos/600/800',
                        attributes: {
                            alt: 'Sample mobile background image',
                            width: 600,
                            height: 800
                        }
                    };
                } else {
                    return `<!-- Error occurred in the Fullscreen Image Quote component: Failed to fetch mobile image data. ${er.message} -->`;
                }
            }
        }
        
        // Get link data
        if (internalUrl) {
            try {
                linkUrl = await basicAssetUri(fnsCtx, internalUrl);
            } catch (er) {
                console.error('Error occurred in the Fullscreen Image Quote component: Failed to fetch link data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    linkUrl = {
                        url: 'https://example.com'
                    };
                } else {
                    return `<!-- Error occurred in the Fullscreen Image Quote component: Failed to fetch link data. ${er.message} -->`;
                }
            }
        }
        
        const isRealExternal = externalUrl ? isRealExternalLink(externalUrl) : false;

        
        const quoteVAligns = {
            top: "start",
            center: "center",
            bottom: "",
        };
        const convertedQuoteVAlign = quoteVAligns[quoteVAlign] || quoteVAlign;

        // Prepare component data for template rendering
        const componentData = {
            quote,
            quoteHAlign,
            quoteVAlign: convertedQuoteVAlign,
            imageVPosition,
            removeTopSpacing,
            ctaPreText,
            ctaText,
            ctaSubtext,
            link: externalUrl || linkUrl?.url,
            iconUniqueID: uuid(),
            isNewWindow,
            isRealExternal,
            imageData: imageData,
            mobileImageData: mobileImageData,
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(fullscreenImageQuoteTemplate(componentData), squizEditTargets, args);
        }

        return fullscreenImageQuoteTemplate(componentData);
    }
};
