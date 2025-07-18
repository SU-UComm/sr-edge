import xss from "xss";
import { basicAssetUri, uuid } from '../../global/js/utils';

import verticalVideoStories from './vertical-video-stories.hbs';

/**
 * Single Image or Video component that renders image or video block with description and caption
 * @module VerticalVideoStories
 */

export default {
    /**
     * Renders the Single Image or Video component.
     *
     * @async
     * @function
     * @param {Object} args - Configuration options for the media section.
     * @param {string} [args.videoImage] - The Matrix asset URI of the preview image to display.
     * @param {string} [args.youtubeId] - The ID of the YouTube video to play when preview image is clicked/tapped.
     * @param {string} [args.videoPosition] - Left or right position of the video, defaults to left.
     * @param {string} [args.heading] - Heading text displayed next to the video.
     * @param {string} [args.description] - A short description of the video, for context.
     * @param {string} [args.credit] - Credit information for the video.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
    */
    async main(args, info) {
        // Extracting environment varibales and function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // Extracting configuration data from arguments
        const { videoImage, youtubeId, videoPosition, heading, description, credit } = args || {};

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
            console.error('Error occurred in the Vertical Video Stories component: ', er);
            return `<!-- Error occurred in the Vertical Video Stories component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (videoImage && typeof videoImage !== 'string') {
                throw new Error(
                    `The "videoImage" field must be a string. The ${JSON.stringify(videoImage)} was received.`
                );
            }
            if (youtubeId && typeof youtubeId !== 'string') {
                throw new Error(
                    `The "youtubeId" field must be a string. The ${JSON.stringify(youtubeId)} was received.`
                );
            }
            if (videoPosition && !['left', 'right'].includes(videoPosition) ) {
                throw new Error(
                    `The "videoPosition" field must be one of ["left", "right"]. The ${JSON.stringify(videoPosition)} was received.`
                );
            }
            if (heading && typeof heading !== 'string') {
                throw new Error(
                    `The "heading" field must be a string. The ${JSON.stringify(heading)} was received.`
                );
            }
            if (description && typeof description !== 'string') {
                throw new Error(
                    `The "description" field must be a string. The ${JSON.stringify(description)} was received.`
                );
            }
            if (credit && typeof credit !== 'string') {
                throw new Error(
                    `The "credit" field must be a string. The ${JSON.stringify(credit)} was received.`
                );
            }

        } catch (er) {
            console.error('Error occurred in the Vertical Video Stories component: ', er);
            return `<!-- Error occurred in the Vertical Video Stories component: ${er.message} -->`;
        }

        // Fetch image data
        let videoImageData = null;
        if (videoImage) {
            try {
                videoImageData = await basicAssetUri(fnsCtx, videoImage);

                // Check required properties
                if (!videoImageData || typeof videoImageData !== 'object') {
                    throw new Error('basicAssetUri did not return an object');
                }
                if (typeof videoImageData.url !== 'string' || videoImageData.url.trim() === '') {
                    throw new Error('data.url must be a non-empty string');
                }
                if (typeof videoImageData.attributes !== 'object' || videoImageData.attributes === null) {
                    throw new Error('data.attributes must be a non-null object');
                }
            } catch (er) {
                console.error('Error occurred in the Vertical Video Stories component: Failed to fetch video image data. ', er);
                return `<!-- Error occurred in the Vertical Video Stories component: Failed to fetch video image data. ${er.message} -->`;
            }
        }

        // Prepare checks and unique id
        const showComponent = !!(youtubeId || videoImage);
        const uniqueID = uuid();

        // Prepare modal data
        let modalData = null

        if (youtubeId) {
            modalData = {
                isVertical: true,
                videoId:  youtubeId,
                title:  `Watch ${heading ? heading : ""}`,
                noAutoPlay:  true,
                uniqueID: uniqueID,
                titleID:  'video-modal'
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            videoImageData,
            youtubeId,
            videoPosition,
            heading: xss(heading),
            description: xss(description),
            credit: xss(credit),
            videoTitle: heading ? `Watch ${heading}` : "",
            modalData,
            showComponent,
            uniqueID
        };

        return verticalVideoStories(componentData);
    }
};
