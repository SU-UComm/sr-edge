import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';
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
            eyebrow = eyebrow || 'Sample Eyebrow';
            title = title || 'Single CTA Block Title';
            description = description || '<p>This is sample description content for the single CTA block that can be edited inline.</p>';
            ctaText = ctaText || 'Click here';
            
            size = size || 'normal';
            ctaType = ctaType || 'link';
            externalUrl = externalUrl || 'https://example.com';
            isNewWindow = isNewWindow !== undefined ? isNewWindow : false;
            isCard = isCard !== undefined ? isCard : false;
            marginTop = marginTop || '8';
            marginBottom = marginBottom || '8';
            
            squizEditTargets = {
                "eyebrow": { "field": "eyebrow" },
                "title": { "field": "title" },
                "description": { "field": "description" },
                "ctaText": { "field": "ctaConfiguration.ctaText" }
            };
        }

        if (!squizEdit) {
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Single CTA Block component: ', er);
                return `<!-- Error occurred in the Single CTA Block component: ${er.message} -->`;
            }

            try {
                if (size && !['normal', 'campaign'].includes(size) ) {
                    throw new Error(
                        `The "size" field must be one of ["normal", "campaign"]. The ${JSON.stringify(size)} was received.`
                    );
                }
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`
                    );
                }
                if (eyebrow && typeof eyebrow !== 'string') {
                    throw new Error(
                        `The "eyebrow" field must be a string type. The ${JSON.stringify(eyebrow)} was received.`
                    );
                }
                if (description && typeof description !== 'string') {
                    throw new Error(
                        `The "description" field must be a string type. The ${JSON.stringify(description)} was received.`
                    );
                }
                if (image && typeof image !== 'string') {
                    throw new Error(
                        `The "image" field must be a string type. The ${JSON.stringify(image)} was received.`
                    );
                }
                if (isCard && typeof isCard !== 'boolean') {
                    throw new Error(
                        `The "isCard" field must be a boolean type. The ${JSON.stringify(isCard)} was received.`
                    );
                }
                if (marginTop && !['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(marginTop) ) {
                    throw new Error(
                        `The "marginTop" field must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The ${JSON.stringify(marginTop)} was received.`
                    );
                }
                if (marginBottom && !['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(marginBottom) ) {
                    throw new Error(
                        `The "marginBottom" field must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The ${JSON.stringify(marginBottom)} was received.`
                    );
                }
                if (ctaText && typeof ctaText !== 'string') {
                    throw new Error(
                        `The "ctaText" field must be a string type. The ${JSON.stringify(ctaText)} was received.`
                    );
                }
                if (ctaType && !["download", "email", "link"].includes(ctaType) ) {
                    throw new Error(
                        `The "ctaType" must be one of ["download", "email", "link"]. The ${JSON.stringify(ctaType)} was received.`
                    );
                }
                if (externalUrl && typeof externalUrl !== 'string') {
                    throw new Error(
                        `The "externalUrl" field must be a string type. The ${JSON.stringify(externalUrl)} was received.`
                    );
                }
                if (internalUrl && typeof internalUrl !== 'string') {
                    throw new Error(
                        `The "internalUrl" field must be a string type. The ${JSON.stringify(internalUrl)} was received.`
                    );
                }
                if (ctaType === "email" && email && (typeof email !== 'string' || email === '')) {
                    throw new Error(
                        `The "email" field must be a non-empty string. The ${JSON.stringify(email)} was received.`
                    );
                }
                if (isNewWindow && typeof isNewWindow !== 'boolean') {
                    throw new Error(
                        `The "isNewWindow" field must be a boolean type. The ${JSON.stringify(isNewWindow)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Single CTA Block component: ', er);
                return `<!-- Error occurred in the Single CTA Block component: ${er.message} -->`;
            }
        }

        let imageData = null;
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                if (squizEdit) {
                    imageData = {
                        url: 'https://picsum.photos/400/300',
                        attributes: {
                            alt: 'Sample CTA block image',
                            width: 400,
                            height: 300
                        }
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
                    linkData = { url: 'https://example.com' };
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

        return processSquizEdit(singleCtaBlock(componentData), squizEditTargets);
    }
};
