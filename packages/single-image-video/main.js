import xss from "xss";
import { basicAssetUri, uuid } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';

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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;

        let { image, caption, credit, width, marginTop, marginBottom } = args || {};
        let { title, summary, summaryAlign } = args?.section || {}
        let { heading, vimeoid, youtubeid } = args?.video || {}

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Heading text';
            summary = summary || 'Add content';
            caption = `<span data-se="caption">${caption}</span>` || `<span data-se="caption">Caption text</span>`;
            credit = `<span data-se="credit">${credit}</span>` || `<span data-se="credit">Credit text</span>`;
            heading = heading || 'Video heading text';
            
            image = image || 'matrix-asset://StanfordNews/172387';
            vimeoid = vimeoid || '';
            youtubeid = youtubeid || '';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": { "field": "section.title" },
                "summary": { "field": "section.summary" },
                "caption": { "field": "caption" },
                "credit": { "field": "credit" },
                "videoHeading": { "field": "video.heading" }
            };
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
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
            } catch (er) {
                console.error('Error occurred in the Single Image or Video component: ', er);
                return `<!-- Error occurred in the Single Image or Video component: ${er.message} -->`;
            }
        }
        
        // Fetch image data with error handling
        let imageData = null;
        if (image) {
            try {
                imageData = await basicAssetUri(componentFunctions, image);
            } catch (er) {
                console.error('Error occurred in the Single Image or Video component: Failed to fetch image data. ', er);
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

        // Prepare checks and unique id
        let headerSection = !!(title || summary);  
        let showComponent = !!(vimeoid || youtubeid || image);
        if(squizEdit) {
            showComponent = true;
            headerSection = true;
        }
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
            captionCredit: captionCredit,
            modalData,
            uniqueID
        };

        // NEW: Early return pattern
        if (!squizEdit) return singleImageVideoTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(singleImageVideoTemplate(componentData), squizEditTargets);
    }
};
