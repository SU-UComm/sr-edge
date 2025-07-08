import campaignHeroTemplate from './campaign-hero.hbs';
import { basicAssetUri } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Campaign Hero component that renders a hero section with background image/video and optional quote
 */
export default {
    /**
     * Renders the Campaign Hero component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.bkgConfig - The background configuration.
     * @param {string} args.bkgConfig.type - The type of background (Image or Video).
     * @param {string} [args.bkgConfig.bkgImage] - The background image asset URI (required if type is Image).
     * @param {string} [args.bkgConfig.bkgVideo] - The background video URL (required if type is Video).
     * @param {Object} args.textConfig - The text configuration.
     * @param {string} args.textConfig.title - The heading text.
     * @param {string} [args.textConfig.intro] - The introduction text.
     * @param {string} [args.youtubeId] - The YouTube video ID for modal playback.
     * @param {Object} [args.quoteConfig] - The quote configuration.
     * @param {boolean} args.quoteConfig.include - Whether to include a quote.
     * @param {string} [args.quoteConfig.quote] - The quote text (required if include is true).
     * @param {string} [args.quoteConfig.name] - The name of the quotee (required if include is true).
     * @param {string} [args.quoteConfig.extra] - Extra text after the name.
     * @param {string} [args.quoteConfig.quoteInternalUrl] - Internal link for quote attribution.
     * @param {string} [args.quoteConfig.quoteManualUrl] - Manual/external link for quote attribution.
     * @param {string} [args.quoteConfig.image] - Image asset URI for quote.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign hero HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Destructure args with defaults
        const { bkgConfig, textConfig, youtubeId, quoteConfig } = args || {};
        const { type: bkgType, bkgImage, bkgVideo } = bkgConfig || {};
        let { title, intro } = textConfig || {};
        const { include: hasQuote, quote, name, extra, quoteInternalUrl, quoteManualUrl, image: quoteImage } = quoteConfig || {};

        // NEW: Detect edit mode
        const squizEdit = componentContext?.editor || false;
        let squizEditTargets = null;

        if (squizEdit) {
            // Provide default configurations
            title = title || 'Heading text';
            intro = intro || 'Introduction text';

            // Configure edit targets
            squizEditTargets = {
                "title": { "field": "textConfig.title" },
                "intro": { "field": "textConfig.intro" }
            };

            if (hasQuote) {
                squizEditTargets["quote"] = { "field": "quoteConfig.quote" };
                squizEditTargets["name"] = { "field": "quoteConfig.name" };
                squizEditTargets["extra"] = { "field": "quoteConfig.extra" };
            }
        }

        // Validate required fields and ensure correct data types
        if (!squizEdit) {
            try {
                if (!bkgConfig || !textConfig) {
                    throw new Error('The "bkgConfig" and "textConfig" fields are required.');
                }

                if (!bkgType || !['Image', 'Video'].includes(bkgType)) {
                    throw new Error('The "bkgConfig.type" field must be either "Image" or "Video".');
                }

                if (bkgType === 'Image' && !bkgImage) {
                    throw new Error('The "bkgConfig.bkgImage" field is required when type is "Image".');
                }

                if (bkgType === 'Video' && !bkgVideo) {
                    throw new Error('The "bkgConfig.bkgVideo" field is required when type is "Video".');
                }

                if (!title || typeof title !== 'string') {
                    throw new Error('The "textConfig.title" field is required and must be a string.');
                }

                if (intro && typeof intro !== 'string') {
                    throw new Error('The "textConfig.intro" field must be a string if provided.');
                }

                if (youtubeId && typeof youtubeId !== 'string') {
                    throw new Error('The "youtubeId" field must be a string if provided.');
                }

                if (hasQuote) {
                    if (!quote || typeof quote !== 'string') {
                        throw new Error('The "quoteConfig.quote" field is required and must be a string when quote is included.');
                    }

                    if (!name || typeof name !== 'string') {
                        throw new Error('The "quoteConfig.name" field is required and must be a string when quote is included.');
                    }

                    if (extra && typeof extra !== 'string') {
                        throw new Error('The "quoteConfig.extra" field must be a string if provided.');
                    }

                    if (quoteInternalUrl && typeof quoteInternalUrl !== 'string') {
                        throw new Error('The "quoteConfig.quoteInternalUrl" field must be a string if provided.');
                    }

                    if (quoteManualUrl && typeof quoteManualUrl !== 'string') {
                        throw new Error('The "quoteConfig.quoteManualUrl" field must be a string if provided.');
                    }

                    if (quoteImage && typeof quoteImage !== 'string') {
                        throw new Error('The "quoteConfig.image" field must be a string if provided.');
                    }
                }
            } catch (er) {
                console.error('Error occurred in the Campaign Hero component: ', er);
                return `<!-- Error occurred in the Campaign Hero component: ${er.message} -->`;
            }
        }

        // Process background image if present
        let bkgImageData = null;
        if (bkgType === 'Image' && bkgImage) {
            try {
                bkgImageData = await basicAssetUri(fnsCtx, bkgImage);
            } catch (er) {
                console.error('Error fetching background image: ', er);
                if (!squizEdit) {
                    return `<!-- Error occurred in the Campaign Hero component: Failed to fetch background image. ${er.message} -->`;
                }
            }
        }

        // Process quote image if present
        let quoteImageData = null;
        if (hasQuote && quoteImage) {
            try {
                quoteImageData = await basicAssetUri(fnsCtx, quoteImage);
            } catch (er) {
                console.error('Error fetching quote image: ', er);
                if (!squizEdit) {
                    return `<!-- Error occurred in the Campaign Hero component: Failed to fetch quote image. ${er.message} -->`;
                }
            }
        }

        // Process quote internal link if present
        let quoteInternalLinkUrl = null;
        if (hasQuote && quoteInternalUrl) {
            try {
                const quoteLinkData = await basicAssetUri(fnsCtx, quoteInternalUrl);
                quoteInternalLinkUrl = quoteLinkData?.url;
            } catch (er) {
                console.error('Error fetching quote link: ', er);
                if (!squizEdit) {
                    return `<!-- Error occurred in the Campaign Hero component: Failed to fetch quote link. ${er.message} -->`;
                }
            }
        }

        // Conditionals for template logic
        const isBgVideo = bkgType === 'Video' && bkgVideo;
        const hasIntro = !!intro;
        const isIntroPulledLeft = !hasQuote && bkgType === 'Image' && !youtubeId;
        const isBgVideoNoQuote = isBgVideo && !hasQuote;

        // Prepare component data for template rendering
        const componentData = {
            isBgVideo,
            bkgVideo,
            bkgImageUrl: bkgImageData?.url,
            bkgImageAlt: bkgImageData?.attributes?.alt || '',
            title,
            intro,
            hasIntro,
            isIntroPulledLeft,
            isBgVideoNoQuote,
            youtubeId,
            hasQuote,
            quote,
            name,
            extra,
            quoteLink: quoteInternalLinkUrl || quoteManualUrl,
            quoteImageUrl: quoteImageData?.url,
            quoteImageAlt: quoteImageData?.attributes?.alt || '',
            width: 'full'
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(campaignHeroTemplate(componentData), squizEditTargets, args);
        }

        return campaignHeroTemplate(componentData);
    }
}; 