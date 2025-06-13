import xss from 'xss';
import horizontalVideoTestimonialsTemplate from './horizontal-video-testimonials.hbs';
import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';

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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
        
        // CHANGE: change const to let for mutability
        let { testimonials, sectionConfiguration } = args || {};
        let { title, ctaText, ctaUrl, ctaManualUrl, bgImage, marginTop, marginBottom } = sectionConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default section configuration
            sectionConfiguration = sectionConfiguration || {};
            title = title || 'Meet more students';
            ctaText = ctaText || 'Watch all';
            ctaUrl = ctaUrl || '';
            ctaManualUrl = ctaManualUrl || 'https://news.stanford.edu/video';
            bgImage = bgImage || 'matrix-asset://api-identifier/sample-bg-image';
            marginTop = marginTop || '10';
            marginBottom = marginBottom || '10';
            
            // Add default testimonials if not provided or empty
            testimonials = testimonials && testimonials.length > 0 ? testimonials : [
                {
                    heading: 'Sample Student, Class of 2024',
                    description: '<p>This is a sample testimonial description that can be edited inline.</p>',
                    youtubeId: 'dQw4w9WgXcQ',
                    videoImage: 'matrix-asset://api-identifier/sample-video-image',
                    manualStoryUrl: 'https://example.com'
                },
                {
                    heading: 'Another Student, Class of 2023',
                    description: '<p>This is another sample testimonial with rich text content.</p>',
                    youtubeId: 'dQw4w9WgXcQ',
                    videoImage: 'matrix-asset://api-identifier/sample-video-image-2',
                    internalStoryUrl: 'matrix-asset://api-identifier/sample-story'
                }
            ];
            
            // Ensure each testimonial has default values
            testimonials = testimonials.map(testimonial => ({
                ...testimonial,
                heading: testimonial.heading || 'Sample Student',
                description: testimonial.description || '<p>Add testimonial description here.</p>'
            }));
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "sectionTitle": { "field": "sectionConfiguration.title" },
                "sectionCtaText": { "field": "sectionConfiguration.ctaText" },
                "heading": {
                    "field": "testimonials",
                    "array": true,
                    "property": "heading"
                },
                "description": {
                    "field": "testimonials",
                    "array": true,
                    "property": "description"
                }
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }
        
        const modalData = [];
        let bgImageData = null;
        let linkData = null;

        // Getting link data 
        if (ctaUrl) {
            try {
                linkData = await basicAssetUri(fnsCtx, ctaUrl);
            } catch (er) {
                console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch link data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    linkData = {
                        url: 'https://example.com'
                    };
                } else {
                    return `<!-- Error occurred in the Horizontal Video Testimonials component: Failed to fetch link data. ${er.message} -->`;
                }
            }
        }

        // Getting image data 
        if (bgImage) {
            try {
                bgImageData = await basicAssetUri(fnsCtx, bgImage);
            } catch (er) {
                console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch background image data. ', er);
                // NEW: In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    bgImageData = {
                        url: 'https://picsum.photos/1920/1080',
                        attributes: {
                            alt: 'Sample background image',
                            width: 1920,
                            height: 1080
                        }
                    };
                } else {
                    return `<!-- Error occurred in the Horizontal Video Testimonials component: Failed to fetch background image data. ${er.message} -->`;
                }
            }
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
                    try {
                        internalLink = await basicAssetUri(fnsCtx, internalStoryUrl);
                    } catch (er) {
                        console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch internal story link. ', er);
                        // NEW: In edit mode, provide mock data instead of returning error
                        if (squizEdit) {
                            internalLink = {
                                url: 'https://example.com'
                            };
                        } else {
                            return `<!-- Error occurred in the Horizontal Video Testimonials component: Failed to fetch internal story link. ${er.message} -->`;
                        }
                    }
                }
                const internalStoryLink = internalLink?.url;

                let videoImageData = null;
                if (videoImage) {
                    try {
                        videoImageData = await basicAssetUri(fnsCtx, videoImage);
                    } catch (er) {
                        console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch video image data. ', er);
                        // NEW: In edit mode, provide mock data instead of returning error
                        if (squizEdit) {
                            videoImageData = {
                                url: 'https://picsum.photos/600/400',
                                attributes: {
                                    alt: heading || 'Sample video preview',
                                    width: 600,
                                    height: 400
                                }
                            };
                        } else {
                            return `<!-- Error occurred in the Horizontal Video Testimonials component: Failed to fetch video image data. ${er.message} -->`;
                        }
                    }
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
                    videoImageAlt: videoImageData?.attributes?.alt || heading,
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

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(horizontalVideoTestimonialsTemplate(componentData), squizEditTargets, args);
        }

        return horizontalVideoTestimonialsTemplate(componentData);
    }
};

