import xss from 'xss';
import horizontalVideoTestimonialsTemplate from './horizontal-video-testimonials.hbs';
import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";

/**
 * Horizontal Video Testimonials renders a video content modal.
 *
 * @module HorizontalVideoTestimonials
 */

export default {
    /**
     * Renders the Horizontal Video Testimonials component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.sectionConfiguration - The section configuration for the component.
     * @param {string} [args.sectionConfiguration.title] - The text for the heading (optional).
     * @param {string} [args.sectionConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.sectionConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.sectionConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.sectionConfiguration.bgImage] - The URL for the background image (optional).
     * @param {string} [args.sectionConfiguration.marginTop] - The value of top margin(optional).
     * @param {string} [args.sectionConfiguration.marginBottom] - The value of bottom margin (optional).
     * @param {array} args.testimonials - The array of testimonials.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.ctx - Functions available in the execution context.
     * @param {Function} info.ctx.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered Horizontal Video Testimonials HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting configuration data from arguments
        const { testimonials, sectionConfiguration } = args || {};
        const { title, ctaText, ctaUrl, ctaManualUrl, bgImage, marginTop, marginBottom } = sectionConfiguration || {};

        // Validate required functions
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Horizontal Video Testimonials component: ', er);
            return `<!-- Error occurred in the Horizontal Video Testimonials component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`,
                );
            }
            if (ctaText && typeof ctaText !== 'string') {
                throw new Error(
                    `The "ctaText" field must be a string type. The ${JSON.stringify(ctaText)} was received.`,
                );
            }
            if (ctaUrl && typeof ctaUrl !== 'string') {
                throw new Error(
                    `The "ctaUrl" field must be a string type. The ${JSON.stringify(ctaUrl)} was received.`,
                );
            }
            if (ctaManualUrl && typeof ctaManualUrl !== 'string') {
                throw new Error(
                    `The "ctaManualUrl" field must be a string type. The ${JSON.stringify(ctaManualUrl)} was received.`,
                );
            }
            if (bgImage && typeof bgImage !== 'string') {
                throw new Error(
                    `The "bgImage" field must be a string type. The ${JSON.stringify(bgImage)} was received.`,
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
            if (!Array.isArray(testimonials) || testimonials.length === 0) {
                throw new Error(
                    `The "testimonials" field must be a non-empty array. The ${JSON.stringify(testimonials)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Horizontal Video Testimonials component: ', er);
            return `<!-- Error occurred in the Horizontal Video Testimonials component: ${er.message} -->`;
        }
        
        const modalData = [];
        let bgImageData = null;
        let linkData = null;

        // Getting link data 
        if (ctaUrl) {
            linkData = await basicAssetUri(fnsCtx, ctaUrl);
        }

        // Getting image data 
        if (bgImage) {
            bgImageData = await basicAssetUri(fnsCtx, bgImage);
        }
        
        // Getting testimonials data 
        const testimonialsArray = await Promise.all(
            testimonials.map(async (testimonial) => {
                const {
                    heading,
                    description,
                    videoImage,
                    youtubeId,
                    internalStoryUrl,
                    manualStoryUrl,
                } = testimonial;

                const uniqueID = uuid();
                let internalLink = null;
                if (internalStoryUrl) {
                    internalLink = await basicAssetUri(fnsCtx, internalStoryUrl);
                }
                const internalStoryLink = internalLink?.url;

                let videoImageData = null;
                if (videoImage) {
                    videoImageData = await basicAssetUri(fnsCtx, videoImage);
                }

                modalData.push(
                    {
                        isVertical: true, 
                        videoId: youtubeId, 
                        title: `Watch ${heading}`, 
                        noAutoPlay: true,
                        uniqueID, 
                        titleID: 'video-modal' 
                    }
                )

                return {
                    uniqueID: uniqueID,
                    heading,
                    description: xss(description),
                    videoImageUrl: videoImageData?.url,
                    videoImageAlt: videoImageData?.alt || heading,
                    youtubeId,
                    storyLink: internalStoryLink || manualStoryUrl,
                    isRealExternalLink: !internalStoryLink && manualStoryUrl ? isRealExternalLink(manualStoryUrl) : false,

                };
            })
        );
        
        // Prepare component data for template rendering
        const componentData = {
            title,
            ctaText,
            ctaLink: linkData?.url || ctaManualUrl,
            marginTop,
            marginBottom,
            bgImageData,
            linkData,
            testimonialsArray,
            testimonialsArrayLength: testimonialsArray.length,
            modalData,
        };

        return horizontalVideoTestimonialsTemplate(componentData);
    }
};

