import { basicAssetUri, linkedHeadingService } from "../../global/js/utils";
import verticalVideosPanelTemplate from "./vertical-videos-panel.hbs";

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
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
    
        // Extract configuration data
        const { videos } = args || {};
        const { title, ctaText, ctaUrl, ctaManualUrl, bgImage, marginTop, marginBottom } = args?.sectionConfiguration || {};

        // Validate required environment variables
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Vertical video panel component: ', er);
            return `<!-- Error occurred in the Vertical video panel component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (ctaText && typeof ctaText !== 'string') {
                throw new Error(
                    `The "ctaText" field must be a string. The ${JSON.stringify(ctaText)} was received.`
                );
            }
            if (ctaUrl && typeof ctaUrl !== 'string') {
                throw new Error(
                    `The "ctaUrl" field must be a string. The ${JSON.stringify(ctaUrl)} was received.`
                );
            }
            if (ctaManualUrl && typeof ctaManualUrl !== 'string') {
                throw new Error(
                    `The "ctaManualUrl" field must be a string. The ${JSON.stringify(ctaManualUrl)} was received.`
                );
            }
            if (bgImage && typeof bgImage !== 'string') {
                throw new Error(
                    `The "bgImage" field must be a string. The ${JSON.stringify(bgImage)} was received.`
                );
            }
            if (marginTop && !['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(marginTop) ) {
                throw new Error(
                    `The "marginTop" field cannot be undefined and must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The ${JSON.stringify(marginTop)} was received.`
                );
            }
            if (marginBottom && !['default', 'base', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(marginBottom) ) {
                throw new Error(
                    `The "marginBottom" field cannot be undefined and must be one of ["default", "base", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]. The ${JSON.stringify(marginBottom)} was received.`
                );
            }
            if (!Array.isArray(videos)) {
                throw new Error(
                    `The "videos" field must be an array. The ${JSON.stringify(videos)} was received.`
                );
            }
            if (videos.length < 1) {
                throw new Error(
                    `The "videos" array cannot have less than 1 element. The ${JSON.stringify(videos.length)} elements were received.`
                );
            }
            if (videos.length > 3) {
                throw new Error(
                    `The "videos" array cannot have more than 3 elements. The ${JSON.stringify(videos.length)} elements were received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Vertical video panel component: ', er);
            return `<!-- Error occurred in the Vertical video panel component: ${er.message} -->`;
        }



        const videosData = await Promise.all(
            videos.map(async (video) => {
                const { heading, subheading, videoImage, youtubeId } = video;

                // Get video image data
                let imageData = null;
                if (videoImage) {
                    imageData = await basicAssetUri(fnsCtx, videoImage);
                }
                
                return {
                    heading,
                    subheading,
                    youtubeId,
                    imageUrl: imageData?.url,
                    imageAlt: imageData?.attributes?.alt || "",
                }
            })
        );


        // Resolve the URI for the section link
        const sectionData = await linkedHeadingService(
            fnsCtx,
            args.sectionConfiguration
        );

        // Get background image data
        let bgImageData = null;
        if(bgImage) {
            bgImageData = await basicAssetUri(fnsCtx, bgImage);
        }


        const componentData = {
            sectionTitle: sectionData?.title,
            sectionCtaText: sectionData?.ctaText,
            sectionCtaLink: sectionData?.ctaLink,
            sectionBgImageUrl: bgImageData?.url,
            sectionBgImageAlt: bgImageData?.alt,
            sectionCustomClasses: "2xl:su-px-[17rem] su-rs-mb-5",
            videosData,
            videosDataLength: videosData.length,
            isSingleVideo: videosData.length === 1,
            width: "full",
            paddingY: bgImageData?.url ? "10" : "",
            paddingX: false,
            marginTop: marginTop,
            marginBottom: marginBottom,
            customClasses: "su-relative su-break-words"
        };

        return verticalVideosPanelTemplate(componentData);

    }
};
