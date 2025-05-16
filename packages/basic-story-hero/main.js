import xss from 'xss';
import { basicHeroDataAdapter, matrixBasicHeroService, readingTime, uuid } from '../../global/js/utils';
import basicStoryHeroTemplate from './basic-story-hero.hbs';

/**
 * Basic Story Hero component that renders hero banner for stories
 * @module basicStoryHero
 */
export default {
    /**
     * Renders the Basic Story Hero component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {Object} info.ctx - Functions available in the execution context.
     * @param {string} [info.ctx.assetId] - The current asset id based on the context.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {string} [info.env.BASE_DOMAIN] - Base domain.
     * @param {Object} [info.set] - Alternative source for environment variables.
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @param {string} [info.set.environment.BASE_DOMAIN] - Alternative base URL for the Matrix API.
     * @returns {Promise<string>} The rendered Basic Story Hero HTML or an error message.
     * @throws {Error} If basic hero data fetch operation fails.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.ctx || {};

        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // VIDEO story ID: 167010
        // Basic story ID: 165577
        // carousel story ID: 157287

        // const currentAssetId = '169707';
        const currentAssetId = fnsCtx?.assetId;


        // Validate required environment variables
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(
                    `The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(currentAssetId)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Basic Story Hero component: ', er);
            return `<!-- Error occurred in the Basic Story Hero component: ${er.message} -->`;
        }
        
        const adapter = new basicHeroDataAdapter();
        let heroData = null

        // Create our service
        const service = new matrixBasicHeroService({ BASE_DOMAIN });

        // Set our card service
        adapter.setBasicHeroService(service);

        // Get the result data
        try {
            heroData = await adapter.getBasicHeroData(currentAssetId);

            if (!heroData || typeof heroData !== 'object') {
                throw new Error("Invalid API response: heroData is missing or not an object.");
            }
        } catch (er) {
            console.error('Error occurred in the Basic Story Hero component: Error parsing hero data JSON response: ', er);
            return `<!-- Error occurred in the Basic Story Hero component: Error parsing hero data JSON response: ${er.message} -->`;
        }

        const { title, media, summary, pubDateFormatted, topic, mediaType } = heroData;
        
        // Validate fetched data
        try {
            if (typeof title !== 'string' || title.trim() === '') {
                throw new Error(
                    `The "title" must be non-empty string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (media && typeof media !== 'object') {
                throw new Error(
                    `The "media" must be an object. The ${JSON.stringify(media)} was received.`
                );
            }
            if (summary && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" must be a string. The ${JSON.stringify(summary)} was received.`
                );
            }
            if (pubDateFormatted && typeof pubDateFormatted !== 'string') {
                throw new Error(
                    `The "pubDateFormatted" must be a string. The ${JSON.stringify(pubDateFormatted)} was received.`
                );
            }
            if (topic && typeof topic !== 'object') {
                throw new Error(
                    `The "topic" must be an object. The ${JSON.stringify(topic)} was received.`
                );
            }
            if (mediaType && !['image', 'video', 'carousel'].includes(mediaType)) {
                throw new Error(
                    `The "mediaType" must be one of ["image", "video", "carousel"]. The ${JSON.stringify(mediaType)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Basic Story Hero component: ', er);
            return `<!-- Error occurred in the Basic Story Hero component: ${er.message} -->`;
        }
        
        // Prepare data
        const uniqueID = uuid();
        const mediaFeature = media.featureImage?.id || media.featureVideo?.id || media.carousel;
        const captionCredit = [media?.caption, media?.credit].filter(Boolean).join(' | ');
        const imageData = {
            url: media.featureImage?.url,
            alt: media.featureImage?.alt,
        };
        let videoData = {
            imageUrl: media.featureImage?.url,
            imageAlt: media.featureImage?.alt,
            videoID: media.featureVideo?.id,
            isVertical: false,
            noAutoPlay: true,
            title: `Watch ${title}`,
            class: "su-absolute su-top-0 su-left-0 su-w-full su-h-full",
            uniqueID,
            
        };
        let modalData =  null;
        modalData = mediaType === "video" && {
            title: `Watch ${title}`,
            titleID: "video-modal",
        };
        const carouselData = [];
        media.carousel?.forEach((slide, i) => {
            const captionCredit = [media.captions[i].caption, media.captions[i].credit].filter(Boolean).join(' | ');

            carouselData.push({
                imageUrl: slide.asset_url,
                imageAlt: slide.asset_attribute_alt,
                captionCredit,
            });
        });

        // Prepare component data for template rendering
        const componentData = {
            pubDateFormatted,
            topic,
            title: xss(title),
            summary: xss(summary),
            readingTimeValue: readingTime(summary),
            mediaFeature,
            mediaType,
            imageData,
            videoData,
            modalData,
            carouselData,
            captionCredit,
            uniqueID,
            peek: false
        };
        return basicStoryHeroTemplate(componentData);
    }
};