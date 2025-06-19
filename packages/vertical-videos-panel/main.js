import { basicAssetUri, linkedHeadingService, uuid } from "../../global/js/utils";
import verticalVideosPanelTemplate from "./vertical-videos-panel.hbs";
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Vertical Video Panel component that renders video blocks with images and description
 * @module VerticalVideosPanel
 */
export default {
    /**
     * Renders the Vertical Video Panel component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {Object} [args.sectionConfiguration] - Configuration settings for the section, including heading, background image, and spacing.
     * @param {string} [args.sectionConfiguration.title] - The heading for the section, appearing above the video cards. If empty, the heading and CTA link will be hidden.
     * @param {string} [args.sectionConfiguration.ctaText] - The text for the call-to-action (CTA) link displayed in the section header.
     * @param {string} [args.sectionConfiguration.ctaUrl] - The URL of a Matrix asset/page to link to in the CTA.
     * @param {string} [args.sectionConfiguration.ctaManualUrl] - A manually entered external URL for the CTA. If provided, this overrides `ctaUrl`.
     * @param {string} [args.sectionConfiguration.bgImage] - The Matrix asset URI of a background image for the section. A dark overlay is applied.
     * @param {string} [args.sectionConfiguration.marginTop] - The top margin spacing for the section. Options range from "base" (smallest) to "10" (largest) or "default" for site-wide spacing.
     * @param {string} [args.sectionConfiguration.marginBottom] - The bottom margin spacing for the section. Options range from "base" (smallest) to "10" (largest) or "default" for site-wide spacing.
     * @param {Array<Object>} [args.videos] - An array of video card configurations (1-3 items).
     * @param {string} [args.videos[].heading] - The main heading for the video card.
     * @param {string} [args.videos[].subheading] - A smaller text displayed below the video card heading.
     * @param {string} [args.videos[].videoImage] - The Matrix asset URI of an image used as the video preview (9x16 aspect ratio).
     * @param {string} [args.videos[].youtubeId] - The YouTube video ID for embedding the video.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered two column text callout HTML or an error message.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
    
        // Extract configuration data
        let { videos } = args || {};
        let { title, ctaText, ctaUrl, ctaManualUrl, bgImage, marginTop, marginBottom } = args?.sectionConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default configurations for section
            title = title || 'Heading text';
            ctaText = ctaText || 'Link text';
            ctaUrl = ctaUrl || 'matrix-asset://StanfordNews/29389';
            ctaManualUrl = ctaManualUrl || 'https://news.stanford.edu';
            bgImage = bgImage || 'matrix-asset://StanfordNews/172387';
            videos = videos || [];
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "sectionConfiguration.title" },
                "headingCtaText": { "field": "sectionConfiguration.ctaText" },
                "videoHeading": { "field": "videos", "type": "array",  "property": "heading" },
                "videoSubheading": { "field": "videos", "type": "array", "property": "subheading" }
            };
        }

        const videoModal = [];
        
        // Prepare all promises to run in parallel for better performance
        const promises = [];
        
        // Add video image promises
        const videoImagePromises = videos.map(async (video) => {
            const { videoImage } = video;
            if (videoImage) {
                try {
                    return await basicAssetUri(fnsCtx, videoImage);
                } catch (er) {
                    console.error('Error occurred in the Vertical video panel component: Failed to fetch video image data. ', er);
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
        });
        promises.push(...videoImagePromises);
        
        // Add section data promise
        const sectionDataPromise = (async () => {
            try {
                return await linkedHeadingService(fnsCtx, args.sectionConfiguration);
            } catch (er) {
                console.error('Error occurred in the Vertical video panel component: Failed to fetch section data. ', er);
                if (squizEdit) {
                    return {
                        title: title,
                        ctaText: ctaText,
                        ctaLink: ctaManualUrl || ctaUrl || "https://news.stanford.edu"
                    };
                }
                return null;
            }
        })();
        promises.push(sectionDataPromise);
        
        // Add background image promise
        const bgImagePromise = (async () => {
            if (bgImage) {
                try {
                    return await basicAssetUri(fnsCtx, bgImage);
                } catch (er) {
                    console.error('Error occurred in the Vertical video panel component: Failed to fetch background image data. ', er);
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
        
        // Wait for all promises to resolve in parallel
        const results = await Promise.all(promises);
        
        // Extract results
        const videoImageResults = results.slice(0, videos.length);
        const sectionData = results[videos.length];
        const bgImageData = results[videos.length + 1];
        
        // Process video data with resolved image results
        const videosData = videos.map((video, index) => {
            const { heading, subheading, youtubeId } = video;
            const uniqueID = uuid();
            const imageData = videoImageResults[index];

            videoModal.push(
                {
                    isVertical: true, 
                    videoId: video.youtubeId, 
                    title: `Watch ${video.heading}`, 
                    noAutoPlay: true,
                    uniqueID, 
                    titleID: 'video-modal' 
                }
            );
            
            return {
                heading,
                subheading,
                youtubeId,
                imageUrl: imageData?.url,
                imageAlt: imageData?.attributes?.alt || "",
                uniqueID
            }
        });

        const componentData = {
            sectionTitle: sectionData?.title,
            sectionCtaText: sectionData?.ctaText,
            sectionCtaLink: sectionData?.ctaLink,
            sectionIsAlwaysLight: bgImageData?.url ? true : false,
            sectionBgImageUrl: bgImageData?.url,
            sectionBgImageAlt: bgImageData?.alt,
            sectionCustomClasses: "2xl:su-px-[17rem] su-rs-mb-5",
            carouselID: uuid(),
            isDarkCarousel: bgImageData?.url ? true : false,
            videosData,
            videosDataLength: `${videosData.length}`,
            width: "full",
            paddingY: bgImageData?.url ? "10" : "",
            paddingX: false,
            marginTop: marginTop,
            marginBottom: marginBottom,
            customClasses: "su-relative su-break-words",
            videoModal: videoModal
        };

        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) {
            return verticalVideosPanelTemplate(componentData);
        }

        // Process and return template with inline editing support
        return processEditor(verticalVideosPanelTemplate(componentData), squizEditTargets);
    }
};
