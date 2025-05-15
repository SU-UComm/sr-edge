import xss from "xss";
import { basicAssetUri, uuid } from '../../global/js/utils';
import { isEditor } from "../../global/js/utils/isEditor";
import singleImageVideoTemplate from './single-image-video.hbs';

/**
 * Single Image or Video component that renders image or video block with description and caption 
 * @module SingleImageVideo
 */

export default {
    /**
     * Renders the Single Image or Video component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the media section.
     * @param {Object} [args.section] - Title and summary settings for section pages.
     * @param {string} [args.section.title] - Heading text displayed at the top of the section.
     * @param {string} [args.section.summary] - Summary text displayed under the heading. Supports multi-line input.
     * @param {string} [args.section.summaryAlign="left"] - Alignment of the summary text. Options: "left" or "center".
     * @param {string} [args.image] - The Matrix asset URI of the image to display. Will be overridden if a video is provided.
     * @param {string} [args.caption] - Caption text shown below the image or video.
     * @param {string} [args.credit] - Credit text for the image or video.
     * @param {string} [args.width="Wide"] - Layout width of the media section. Options: "Wide" or "Narrow".
     * @param {Object} [args.video] - Video configuration. If provided, it overrides the image.
     * @param {string} [args.video.heading] - Accessible video heading used by screen readers (not visually displayed).
     * @param {string} [args.video.vimeoid] - Vimeo autoplay video ID for muted, looped display.
     * @param {string} [args.video.youtubeid] - YouTube video ID for the modal player.
     * @param {string} [args.marginTop="default"] - Top margin spacing. Options: "base", "1" to "10", or "default".
     * @param {string} [args.marginBottom="default"] - Bottom margin spacing. Options: "base", "1" to "10", or "default".
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered two column text callout HTML or an error message.
    */
    async main(args, info) {
        // Extracting environment varibales and function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        const { ctx } = info;
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const editMode = isEditor(ctx.url);

        // Extracting configuration data from arguments
        const { image, caption, credit, width, marginTop, marginBottom } = args || {};
        const { title, summary, summaryAlign } = args?.section || {}
        const { heading, vimeoid, youtubeid } = args?.video || {}

        // Validate required environment variables
        try {
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(API_IDENTIFIER)} was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Single Image or Video component: ', er);
            return `<!-- Error occurred in the Single Image or Video component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (summary && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" field must be a string. The ${JSON.stringify(summary)} was received.`
                );
            }
            if (summaryAlign && !['left', 'center'].includes(summaryAlign) ) {
                throw new Error(
                    `The "summaryAlign" field must be one of ["left", "center"]. The ${JSON.stringify(summaryAlign)} was received.`
                );
            }
            if (image && typeof image !== 'string') {
                throw new Error(
                    `The "image" field must be a string. The ${JSON.stringify(image)} was received.`
                );
            }
            if (caption && typeof caption !== 'string') {
                throw new Error(
                    `The "caption" field must be a string. The ${JSON.stringify(caption)} was received.`
                );
            }
            if (credit && typeof credit !== 'string') {
                throw new Error(
                    `The "credit" field must be a string. The ${JSON.stringify(credit)} was received.`
                );
            }
            if (width && !['Wide', 'Narrow'].includes(width) ) {
                throw new Error(
                    `The "width" field must be one of ["Wide", "Narrow"]. The ${JSON.stringify(width)} was received.`
                );
            }
            if (heading && typeof heading !== 'string') {
                throw new Error(
                    `The "heading" field must be a string. The ${JSON.stringify(heading)} was received.`
                );
            }
            if (vimeoid && typeof vimeoid !== 'string') {
                throw new Error(
                    `The "vimeoid" field must be a string. The ${JSON.stringify(vimeoid)} was received.`
                );
            }
            if (youtubeid && typeof youtubeid !== 'string') {
                throw new Error(
                    `The "youtubeid" field must be a string. The ${JSON.stringify(youtubeid)} was received.`
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
        } catch (er) {
            console.error('Error occurred in the Single Image or Video component: ', er);
            return `<!-- Error occurred in the Single Image or Video component: ${er.message} -->`;
        }
        
        // Fetch image data
        let imageData = null;
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
    
                // Check required properties
                if (!imageData || typeof imageData !== 'object') {
                    throw new Error('basicAssetUri did not return an object');
                }
                if (typeof imageData.url !== 'string' || imageData.url.trim() === '') {
                    throw new Error('data.url must be a non-empty string');
                }
                if (typeof imageData.attributes !== 'object' || imageData.attributes === null) {
                    throw new Error('data.attributes must be a non-null object');
                }
            } catch (er) {
                console.error('Error occurred in the Single Image or Video component: Failed to fetch image data. ', er);
                return `<!-- Error occurred in the Single Image or Video component: Failed to fetch image data. ${er.message} -->`;
            }
        }

        // Prepare checks and unique id
        const headerSection = !!(title || summary);  
        const showComponent = !!(vimeoid || youtubeid || image);
        const uniqueID = uuid();
        
        // Prepare caption-credit data
        const captionCredit = [caption, credit].filter(Boolean).join(' | ');
        
        // Prepare modal data 
        let modalData = null

        if (youtubeid) {
            modalData = {
                isVertical: true, 
                videoId:  youtubeid, 
                title:  `Watch ${heading ? heading : ""}`, 
                noAutoPlay:  true,
                uniqueID: uniqueID, 
                titleID:  'video-modal'
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            width: width?.toLocaleLowerCase() || "wide",
            marginTop: marginTop || "default",
            marginBottom: marginBottom || "default",
            showComponent,
            headerSection,
            title,
            summary: xss(summary),
            summaryAlign,
            imageData,
            vimeoid,
            youtubeid,
            videoTitle: heading ? `Watch ${heading}` : "",
            captionCredit: xss(captionCredit),
            modalData,
            uniqueID,
            editMode
        };

        return singleImageVideoTemplate(componentData);
    }
};
