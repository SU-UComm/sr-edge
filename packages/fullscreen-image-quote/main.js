import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import fullscreenImageQuoteTemplate from './fullscreen-image.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

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
     * @param {string} [args.imageOverlay="dark"] - Overlay color for the background image. Options: "dark", "light". Default is "dark".
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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // CHANGE: change const to let for mutability
        let { image, imageOverlay, imageVPosition, mobileImage, quote, quoteVAlign, quoteHAlign, removeTopSpacing, ctaDetails } = args || {};
        let { ctaPreText, ctaText, ctaSubtext, externalUrl, internalUrl, isNewWindow } = ctaDetails || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            quote = quote || '"Add quote"';
            
            // Ensure ctaDetails object exists
            ctaDetails = ctaDetails || {};
            ctaPreText = ctaPreText || 'Meet';
            ctaText = ctaText || 'Link text';
            ctaSubtext = ctaSubtext || "'21, international student";
            
            // Provide default values for other required fields
            image = image || 'matrix-asset://StanfordNews/172387';

            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "fullscreenImageQuoteImage": { "field": "image" },
                "fullscreenImageQuoteMobileImage": { "field": "mobileImage" },
                "quote": { "field": "quote" },
                "ctaPreText": { "field": "ctaDetails.ctaPreText" },
                "ctaText": { "field": "ctaDetails.ctaText" },
                "ctaSubtext": { "field": "ctaDetails.ctaSubtext" }
            };
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
                        url: "#"
                    };
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
            imageOverlay
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) {
            return fullscreenImageQuoteTemplate(componentData);
        }
        return processEditor(fullscreenImageQuoteTemplate(componentData), squizEditTargets);
    }
};
