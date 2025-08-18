import featuredContentVVTemplate from './featured-content-vv.hbs';
import { cardDataAdapter, matrixCardService, linkedHeadingService, basicAssetUri, uuid } from '../../global/js/utils';
import { Card } from '../../global/js/helpers';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Featured content with vertical video component
 */
export default {
    /**
     * Renders the Featured content with vertical video component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.headingConfiguration - The header configuration for the component.
     * @param {boolean} args.headingConfiguration.includeSectionHeading - Whether to include a section heading.
     * @param {string} [args.headingConfiguration.title] - The text for the heading (required if includeSectionHeading is true).
     * @param {string} [args.headingConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaNewWindow] - Flag to open CTA link in new window (optional).
     * @param {Object} args.contentConfiguration - The content configuration for the component.
     * @param {string} [args.contentConfiguration.featuredStory] - The featured story asset URI.
     * @param {string} [args.contentConfiguration.featuredDescriptionOverride] - Override description for featured story.
     * @param {string} [args.contentConfiguration.videoImage] - The video preview image asset URI.
     * @param {string} [args.contentConfiguration.youtubeId] - The YouTube video ID.
     * @param {string} [args.contentConfiguration.relatedStory] - The related story asset URI.
     * @param {string} [args.contentConfiguration.relatedDescriptionOverride] - Override description for related story.
     * @param {Object} args.displayConfiguration - The display configuration for the component.
     * @param {string} [args.displayConfiguration.alignment] - The alignment of featured card (left or right).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered featured content HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Extracting environment variables from provided info
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // Destructure args with defaults
        const { headingConfiguration, contentConfiguration, displayConfiguration } = args || {};
        const { includeSectionHeading, title, ctaUrl, ctaManualUrl, ctaText, ctaNewWindow } = headingConfiguration || {};
        const { featuredStory, featuredDescriptionOverride, videoImage, youtubeId, relatedStory, relatedDescriptionOverride } = contentConfiguration || {};
        const { alignment = 'left' } = displayConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = true || componentContext?.editor || false;
        let squizEditTargets = null;

        if (squizEdit) {
            // Configure edit targets
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" },
                "featDesc": [
                    { "field": "contentConfiguration.featuredDescriptionOverride"},
                    { "field": "contentConfiguration.relatedDescriptionOverride"}
                ]
            };
        }

        // Validate required fields and ensure correct data types
        if (!squizEdit) {
            try {
                if (includeSectionHeading && typeof includeSectionHeading === 'boolean') {
                    if (!title || typeof title !== 'string') {
                        throw new Error('The "headingConfiguration.title" field is required and must be a string when includeSectionHeading is true.');
                    }

                    if (ctaUrl && typeof ctaUrl !== 'string') {
                        throw new Error('The "headingConfiguration.ctaUrl" field must be a string if provided.');
                    }

                    if (ctaManualUrl && typeof ctaManualUrl !== 'string') {
                        throw new Error('The "headingConfiguration.ctaManualUrl" field must be a string if provided.');
                    }

                    if (ctaText && typeof ctaText !== 'string') {
                        throw new Error('The "headingConfiguration.ctaText" field must be a string if provided.');
                    }

                    if (typeof ctaNewWindow !== 'boolean') {
                        throw new Error('The "headingConfiguration.ctaNewWindow" field must be a boolean.');
                    }
                }

                if (!featuredStory || typeof featuredStory !== 'string') {
                    throw new Error('The "contentConfiguration.featuredStory" field is required and must be a string.');
                }

                if (featuredDescriptionOverride && typeof featuredDescriptionOverride !== 'string') {
                    throw new Error('The "contentConfiguration.featuredDescriptionOverride" field must be a string if provided.');
                }

                if (!videoImage || typeof videoImage !== 'string') {
                    throw new Error('The "contentConfiguration.videoImage" field is required and must be a string.');
                }

                if (!youtubeId || typeof youtubeId !== 'string') {
                    throw new Error('The "contentConfiguration.youtubeId" field is required and must be a string.');
                }

                if (!relatedStory || typeof relatedStory !== 'string') {
                    throw new Error('The "contentConfiguration.relatedStory" field is required and must be a string.');
                }

                if (relatedDescriptionOverride && typeof relatedDescriptionOverride !== 'string') {
                    throw new Error('The "contentConfiguration.relatedDescriptionOverride" field must be a string if provided.');
                }

                if (!['left', 'right'].includes(alignment)) {
                    throw new Error('The "displayConfiguration.alignment" field must be either "left" or "right".');
                }
            } catch (er) {
                console.error('Error occurred in the Featured content with vertical video component: ', er);
                return `<!-- Error occurred in the Featured content with vertical video component: ${er.message} -->`;
            }
        }

        // Process video preview image
        let videoImageData = null;
        if (videoImage) {
            try {
                videoImageData = await basicAssetUri(fnsCtx, videoImage);
            } catch (er) {
                console.error('Error fetching video preview image: ', er);
                if (!squizEdit) {
                    return `<!-- Error occurred in the Featured content with vertical video component: Failed to fetch video preview image. ${er.message} -->`;
                }
            }
        }

        const uniqueID = uuid();

        // Process card data
        const adapter = new cardDataAdapter();
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
        adapter.setCardService(service);

        let data = null;
        try {
            data = await adapter.getCards([
                { cardAsset: featuredStory },
                { cardAsset: relatedStory }
            ]);
        } catch (er) {
            console.error('Error fetching card data: ', er);
            if (!squizEdit) {
                return `<!-- Error occurred in the Featured content with vertical video component: Failed to fetch card data. ${er.message} -->`;
            }
            data = [];

            // Add defaults so it doesn't just error
            if (squizEdit) {
                data = [{
                    "title": "Featured Story",
                    description: 'Featured Story Description',
                    imageUrl: 'https://news.stanford.edu/_designs/component-service/editorial/placeholder.png',
                    liveUrl: '#'
                }, {
                    title: 'Related Story',
                    description: 'Related Story Description',
                    imageUrl: 'https://news.stanford.edu/_designs/component-service/editorial/placeholder.png',
                    liveUrl: '#'
                }];
            }
        }

        // Process heading data
        const headingData = await linkedHeadingService(fnsCtx, {
            title,
            ctaUrl,
            ctaManualUrl,
            ctaText,
            ctaNewWindow
        });

        // Extract and process card data
        const featuredCardData = data && data[0];
        const relatedCardData = data && data[1];

        if (featuredDescriptionOverride && featuredDescriptionOverride !== '') {
            featuredCardData.description = featuredDescriptionOverride;
        }

        if (relatedDescriptionOverride && relatedDescriptionOverride !== '') {
            relatedCardData.description = relatedDescriptionOverride;
        }

        const videoModal = {
            isVertical: true,
            videoId: youtubeId,
            title: `Watch ${relatedCardData?.title}`,
            noAutoPlay: true,
            uniqueID,
            titleID: 'video-modal'
        };

        // Prepare component data for template rendering
        const componentData = {
            headingConfiguration: {
                includeSectionHeading
            },
            headingData,
            alignment,
            cardsGrowClasses: alignment === 'right' ? 'md:su-order-2' : '',
            cardsAlignmentClasses: alignment === 'right' ? 'md:su-order-1' : '',
            featuredCard: Card({
                data: featuredCardData,
                cardSize: 'featured',
                headingLvl: headingData.title ? 3 : 2
            }),
            videoImageUrl: videoImageData?.url,
            videoImageAlt: videoImageData?.attributes?.alt || '',
            youtubeId,
            uniqueID: uniqueID,
            videoModal,
            relatedCard: Card({
                data: relatedCardData,
                displayThumbnail: false,
                cardSize: 'small',
                headingLvl: headingData.title ? 3 : 2
            })
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(featuredContentVVTemplate(componentData), squizEditTargets, args);
        }

        return featuredContentVVTemplate(componentData);
    }
}; 