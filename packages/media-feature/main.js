import { basicAssetUri } from "../../global/js/utils";
import { SidebarHeading } from "../../global/js/helpers";
import mediaFeatureTemplate from './media-feature.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Media Fateure Component - A Handlebars template component that renders a media feature
 * @module mediaFeature
 */
export default {
    /**
     * Renders the Media Feature component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.contentConfiguration - The display configuration for the component.
     * @param {string} [args.contentConfiguration.backgroundImage] - The background image of component (optional).
     * @param {string} [args.contentConfiguration.image] - The image of component (optional).
     * @param {string} [args.contentConfiguration.title] - The title text for the CTA (optional).
     * @param {string} [args.contentConfiguration.teaserText] - The description text for the CTA (optional).
     * @param {string} [args.contentConfiguration.mediaType] - The type of media that defineds the component (optional).
     * @param {string} [args.contentConfiguration.linkUrl] - The URL for CTA link (optional).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered Media feature HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility
                
        // CHANGE: change const to let for mutability
        let { backgroundImage, image, title, teaserText, mediaType, linkUrl } = args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            title = title || 'Title text';
            teaserText = teaserText || 'Add content';
            // Provide default image if none exists
            image = image || 'matrix-asset://StanfordNews/172387';
            // Provide default bcakground image if none exists
            backgroundImage = backgroundImage || 'matrix-asset://StanfordNews/172387';
            
            // Set up inline editing targets for nested object fields
            squizEditTargets = {
                "title": {
                    "field": "contentConfiguration.title"
                },
                "teaserText": {
                    "field": "contentConfiguration.teaserText"
                }
            };
        }

        // Early return for edit mode
        if (!squizEdit) {
            // Validate required functions
            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media feature component: ', er);
                return `<!-- Error occurred in the Media feature component: ${er.message} -->`;
            }
            // Validate required fields and ensure correct data types
            try {
                if (backgroundImage && typeof backgroundImage !== 'string') {
                    throw new Error(
                        `The "backgroundImage" field must be a string type. The ${JSON.stringify(backgroundImage)} was received.`
                    );
                }
                if (image && typeof image !== 'string') {
                    throw new Error(
                        `The "image" field must be a string type. The ${JSON.stringify(image)} was received.`
                    );
                }
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`,
                    );
                }
                if (teaserText && typeof teaserText !== 'string') {
                    throw new Error(
                        `The "teaserText" field must be a string type. The ${JSON.stringify(teaserText)} was received.`,
                    );
                }
                if (!['Podcast', 'Book', 'Magazine'].includes(mediaType) ) {
                    throw new Error(
                        `The "mediaType" field must be one of ["Podcast", "Book", "Magazine"]. The ${JSON.stringify(mediaType)} was received.`
                    );
                }
                if (linkUrl && typeof linkUrl !== 'string') {
                    throw new Error(
                        `The "linkUrl" field must be a string type. The ${JSON.stringify(linkUrl)} was received.`,
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Media feature component: ', er);
                return `<!-- Error occurred in the Media feature component: ${er.message} -->`;
            }
        }

        let bgImageData = null;
        let imageData = null;

        // Getting background image data 
        if (backgroundImage) {
            try {
                bgImageData = await basicAssetUri(fnsCtx, backgroundImage);
            } catch (er) {
                // In edit mode, provide mock data instead of returning error
                if (squizEdit) {
                    bgImageData = {
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
                    }
                }
            }
        }

         // Getting image data 
        if (image) {
            try {
                imageData = await basicAssetUri(fnsCtx, image);
            } catch (er) {
                // In edit mode, provide mock data instead of returning error
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

        let iconName;
        let iconTestId;          

        // Setting the icon  
        if (mediaType === "Book") {
            iconName = "book-open-cover";
            iconTestId = "svg-book-open-cover";
        } else if (mediaType === "Podcast") {
            iconName = "microphone";
            iconTestId = "svg-microphone";
        } else if (mediaType === "Magazine") {
            iconName = "book-open";
            iconTestId = "svg-book-open";
        }

        let heading;

        // Setting the heading 
        switch (mediaType) {
            case "Podcast":
                heading = SidebarHeading({ icon: "Featured audio", title: "Featured audio" });
                break;
            case "Magazine":
                heading = SidebarHeading({ icon: "Featured reading", title: "Featured reading" });
                break;
            default:
                heading = SidebarHeading({ icon: "Featured reading", title: "Featured book" });
        }

        // Prepare component data for template rendering
        const componentData = {
            bgImageData,
            imageData,
            title,
            teaserText,
            mediaType,
            linkUrl,
            isPodcast: mediaType === "Podcast",
            heading,
            width: 'full',
            paddingX: false,
            iconName,
            iconTestId,
        };

        // NEW: Early return pattern for front-end
        if (!squizEdit) return mediaFeatureTemplate(componentData);

        // NEW: Process for edit mode
        return processEditor(mediaFeatureTemplate(componentData), squizEditTargets);
    }
};