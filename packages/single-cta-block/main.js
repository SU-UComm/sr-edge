import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import { processEditor } from '../../global/js/utils/processEditor';
import singleCtaBlock from './single-cta-block.hbs';

/**
 * Main Single-CTA-block function
 * 
 * This component generates a call-to-action block with customizable content, styling,
 * and behavior. It handles both internal and external links, email links, and
 * supports various display configurations.
 * 
 * @async
 * @param {Object} args - Component arguments
 * @param {Object} args.size - Size variant of the component
 * @param {string} args.title - Main title text
 * @param {string} args.eyebrow - Subtitle text above the main title
 * @param {string} args.description - Description text
 * @param {string} args.image - Image asset path
 * @param {boolean} args.isCard - Whether to display as a card
 * @param {string} args.marginTop - Top margin class
 * @param {string} args.marginBottom - Bottom margin class
 * @param {Object} args.ctaConfiguration - CTA configuration object
 * @param {string} args.ctaConfiguration.ctaText - Button text
 * @param {string} args.ctaConfiguration.ctaType - Type of CTA ("download", "email", or "link")
 * @param {string} args.ctaConfiguration.externalUrl - External URL for link CTAs
 * @param {string} args.ctaConfiguration.internalUrl - Internal URL for link CTAs
 * @param {string} args.ctaConfiguration.email - Email address for email CTAs
 * @param {boolean} args.ctaConfiguration.isNewWindow - Whether to open link in new window
 * @param {Object} info - Context information
 * @param {Object} info.fns - Function context with resolveUri method
 * @returns {string} Rendered HTML template
 * @throws {Error} If required dependencies or invalid types are detected
 */
export default {
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        
        let { size, title, eyebrow, description, image, isCard, marginTop, marginBottom } = args || {};
        let { ctaText, ctaType, externalUrl, internalUrl, email, isNewWindow } = (args && args.ctaConfiguration) || {};

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            eyebrow = eyebrow || 'Eyebrow tex';
            title = title || 'Heading text';
            description = description || '<p>Add content</p>';
            ctaText = ctaText || 'Link text';  
            image = image || 'matrix-asset://StanfordNews/172387';
            
            squizEditTargets = {
                "eyebrow": { "field": "eyebrow" },
                "title": { "field": "title" },
                "description": { "field": "description" },
                "button": { "field": "ctaConfiguration.ctaText" },
                "singleCtaBlockImage": { "field": "image" }
            };
        }

        let imageData = null;
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
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

        let linkData = null;
        if (internalUrl) {
            try {
                linkData = await basicAssetUri(info.fns, internalUrl);
            } catch (er) {
                if (squizEdit) {
                    linkData = {
                        url: "https://news.stanford.edu",
                        text: ctaText || "Link text"
                    };
                }
            }
        }

        const buttonUrl = linkData?.url || externalUrl;

        const componentData = {
            size,
            title,
            eyebrow,
            isCard,
            marginTop,
            marginBottom,
            description,
            email,
            isNewWindow,
            ctaText,
            ctaType: ctaType,
            isRealExternalLink: ctaType === "link" && !linkData?.url && externalUrl ?
                isRealExternalLink(externalUrl) : false,
            buttonUrl: ctaType === "email" ? `mailto:${email}` : buttonUrl || '#',
            imageUrl: imageData?.url,
            imageAlt: imageData?.attributes?.alt || "",
            containerSize: size === "campaign" ? "cc" : "large",
            linkButtonClasses: size === "campaign" ? "su-mx-auto su-rs-mt-4" : "su-mx-auto su-rs-mt-2",
            iconUniqueID: uuid()
        };

        if (!squizEdit) return singleCtaBlock(componentData);

        return processEditor(singleCtaBlock(componentData), squizEditTargets);
    }
};
