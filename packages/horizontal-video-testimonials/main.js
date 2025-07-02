import xss from 'xss';
import horizontalVideoTestimonialsTemplate from './horizontal-video-testimonials.hbs';
import { basicAssetUri, isRealExternalLink, uuid } from "../../global/js/utils";
import { processEditor } from '../../global/js/utils/processEditor';

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
        let { title, ctaText, ctaUrl, ctaManualUrl, bgImage, marginTop, marginBottom, alwaysDark } = sectionConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            title = title || 'Heading text';
            ctaText = ctaText || 'Link text';
            ctaUrl = ctaUrl || null;
            
            // Ensure each testimonial has default values
            testimonials = testimonials.map(testimonial => ({
                ...testimonial,
                heading: testimonial.heading || 'Heading text',
                description: testimonial.description || 'Enter the description text'
            }));
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "sectionConfiguration.title" },
                "headingCtaText": { "field": "sectionConfiguration.ctaText" },
                "hcardheading": {
                    "field": "testimonials",
                    "array": true,
                    "property": "heading"
                },
                "hcarddescription": {
                    "field": "testimonials",
                    "array": true,
                    "property": "description"
                }
            };
        }

        const modalData = [];
        
        // Prepare all promises to run in parallel for better performance
        const promises = [];
        
        // Add link data promise
        const linkDataPromise = (async () => {
            if (ctaUrl) {
                try {
                    return await basicAssetUri(fnsCtx, ctaUrl);
                } catch (er) {
                    console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch link data. ', er);
                    if (squizEdit) {
                        return {
                            url: "https://news.stanford.edu"
                        };
                    }
                    return null;
                }
            }
            return null;
        })();
        promises.push(linkDataPromise);
        
        // Add background image promise
        const bgImagePromise = (async () => {
            if (bgImage) {
                try {
                    return await basicAssetUri(fnsCtx, bgImage);
                } catch (er) {
                    console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch background image data. ', er);
                    if (squizEdit) {
                        return {
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
                    return null;
                }
            }
            return null;
        })();
        promises.push(bgImagePromise);
        
        // Add testimonial data promises
        const testimonialPromises = testimonials.map(async (testimonial) => {
            const {
                heading,
                description,
                videoImage,
                youtubeId,
                internalStoryUrl,
                manualStoryUrl,
            } = testimonial;

            const uniqueID = uuid();
            
            // Prepare testimonial-specific promises
            const testimonialPromises = [];
            
            // Add internal link promise
            const internalLinkPromise = (async () => {
                if (internalStoryUrl) {
                    try {
                        return await basicAssetUri(fnsCtx, internalStoryUrl);
                    } catch (er) {
                        console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch internal story link. ', er);
                        if (squizEdit) {
                            return {
                                url: "https://news.stanford.edu"
                            };
                        }
                        return null;
                    }
                }
                return null;
            })();
            testimonialPromises.push(internalLinkPromise);
            
            // Add video image promise
            const videoImagePromise = (async () => {
                if (videoImage) {
                    try {
                        return await basicAssetUri(fnsCtx, videoImage);
                    } catch (er) {
                        console.error('Error occurred in the Horizontal Video Testimonials component: Failed to fetch video image data. ', er);
                        if (squizEdit) {
                            return {
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
                        return null;
                    }
                }
                return null;
            })();
            testimonialPromises.push(videoImagePromise);
            
            // Wait for testimonial promises to resolve
            const testimonialResults = await Promise.all(testimonialPromises);
            const internalLink = testimonialResults[0];
            const videoImageData = testimonialResults[1];
            
            const internalStoryLink = internalLink?.url;

            modalData.push(
                {
                    isVertical: true, 
                    videoId: youtubeId, 
                    title: `Watch ${heading}`, 
                    noAutoPlay: true,
                    uniqueID, 
                    titleID: 'video-modal' 
                }
            );

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
        });
        
        // Add testimonial promises to main promises array
        promises.push(...testimonialPromises);
        
        // Wait for all promises to resolve in parallel
        const results = await Promise.all(promises);
        
        // Extract results
        const linkData = results[0];
        const bgImageData = results[1];
        const testimonialsArray = results.slice(2);
        
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
            alwaysDark,
            paddingY: bgImageData?.url  ? "10" : "base",
            customClasses: `su-relative su-overflow-hidden su-bg-black dark:su-bg-black-true ${alwaysDark ? "su-bg-black-true" : ""}`
        };

        // NEW: Early return pattern for edit mode
        if (!squizEdit) {
            return horizontalVideoTestimonialsTemplate(componentData);
        }

        return processEditor(horizontalVideoTestimonialsTemplate(componentData), squizEditTargets);
    }
};

