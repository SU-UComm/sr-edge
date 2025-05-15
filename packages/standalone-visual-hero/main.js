import xss from 'xss';
import {
    basicHeroDataAdapter,
    matrixBasicHeroService,
    uuid,
} from '../../global/js/utils';
import { isEditor } from "../../global/js/utils/isEditor";
import standaloneVisualHeroTemplate from './standalone-visual-hero.hbs';

/**
 * Standalone Visual Hero component that renders a hero banner with video
 * @module StandaloneVisualHero
 */
export default {
    /**
     * Renders the Standalone Visual Hero component
     *
     * @async
     * @function
     * @param {Object} args - Input arguments
     * @param {Object} info - Context/environment information
     * @returns {Promise<string>} Rendered HTML
     */
    async main(_args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.ctx || {};
        const { ctx } = info;

        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // const currentAssetId = '167010';
        const currentAssetId = fnsCtx?.assetId;
        const editMode = isEditor(ctx.url);

        // Validate environment
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN.trim() === '') {
                throw new Error(
                    `BASE_DOMAIN is required. Received: ${JSON.stringify(BASE_DOMAIN)}`,
                );
            }
            if (
                typeof currentAssetId !== 'string' ||
                currentAssetId.trim() === ''
            ) {
                throw new Error(
                    `AssetId is required. Received: ${JSON.stringify(currentAssetId)}`,
                );
            }
        } catch (error) {
            console.error('Failed to fetch Standalone Visual Hero data:', error);
            return `<!-- Failed to fetch Standalone Visual Hero data: ${error.message} -->`;
        }

        const adapter = new basicHeroDataAdapter();
        const service = new matrixBasicHeroService({ BASE_DOMAIN });
        adapter.setBasicHeroService(service);

        let heroData;
        try {
            heroData = await adapter.getBasicHeroData(currentAssetId);
            if (!heroData || typeof heroData !== 'object') {
                throw new Error(
                    `The "heroData" must be a non-null object. The ${JSON.stringify(heroData)} was received.`
                );
            }
        } catch (error) {
            console.error('Error occurred in the Standalone Visual Hero component: ', error);
            return `<!-- Error occurred in the Standalone Visual Hero component: ${error.message} -->`;
        }

        const { title, pubDateFormatted, summary, topic, media } = heroData;

        // Define media type
        let mediaType = 'text';
        if (media?.featureVideo?.id) {
            mediaType = 'video';
        } else if (media?.featureImage?.url) {
            mediaType = 'image';
        }

        const uniqueID = uuid();

        const componentData = {
            pubDateFormatted,
            title: xss(title),
            summary: summary ? xss(summary) : '',
            topicName: xss(topic?.asset_name),
            topicUrl: topic?.asset_url,
            hasTopicText: !!topic?.asset_name,
            hasTopicLink: !!topic?.asset_url,
            mediaType,
            uniqueID,
            imageData: {
                url: media?.featureImage?.url,
                alt: media?.featureImage?.alt,
            },
            videoData: {
                imageUrl: media?.featureImage?.url,
                imageAlt: media?.featureImage?.alt,
                videoID: media?.featureVideo?.id,
                isVertical: false,
                noAutoPlay: true,
                title: `Watch ${title}`,
                class: 'su-absolute su-top-0 su-left-0 su-w-full su-h-full',
            },
            modalData: media?.featureVideo?.id
                ? {
                      title: `Watch ${title}`,
                      titleID: 'video-modal',
                  }
                : null,
            captionCredit: [media?.caption, media?.credit]
                .filter(Boolean)
                .join(' | '),
            editMode
        };

        return standaloneVisualHeroTemplate(componentData);
    },
};
