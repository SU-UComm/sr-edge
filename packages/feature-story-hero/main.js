import xss from 'xss';
import { basicHeroDataAdapter, matrixBasicHeroService, readingTime } from '../../global/js/utils';

import featureStoryHeroTemplate from './feature-story-hero.hbs';

/**
 * @module FeatureStoryHero
 * @description A module for rendering a Feature Story Hero form cotexto of the page,
 */
export default {
    /**
     * Fetches and processes current page data, rendering them as Feature Story Hero.
     * 
     * @async
     * @function main
     * @param {Object} args - Configuration arguments for the listing.
     * @param {Object} info - Contextual information including environment variables.
     * @param {Object} info.ctx - Functions available in the execution context.
     * @param {string} [info.ctx.assetId] - The current asset id based on context.
     * @param {Object} [info.env] - Environment variables (preferred source).
     * @param {string} [info.env.BASE_DOMAIN] - The base URL for the Matrix API.
     * @param {Object} [info.set] - Alternative source for environment variables.
     * @param {Object} [info.set.environment] - Nested environment variables.
     * @param {string} [info.set.environment.BASE_DOMAIN] - Alternative base URL for the Matrix API.
     * @returns {Promise<string>} The rendered HTML string from the topicListingTemplate, or an error comment if processing fails.
     * @throws {Error} If FB_JSON_URL or query is invalid or if the fetch operation fails.
     */
    async main( args, info ) {
        // Extracting functions from provided info
        const fnsCtx = info?.ctx || {};
        
        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};
       
        // Full story ID: 163377
        // Vertical story ID: ??
        // Horizontal story ID: 157163

        // const currentAssetId = '143665';
        const currentAssetId = fnsCtx?.assetId

        // Validate required environment variables
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(
                    `The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(currentAssetId)} was received.`
                );
            }

        } catch (er) {
            console.error('Error occurred in the Feature Story Hero component: ', er);
            return `<!-- Error occurred in the Feature Story Hero component: ${er.message} -->`;
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
            console.error('Error occurred in the Feature Story Hero component: Error parsing hero data JSON response: ', er);
            return `<!-- Error occurred in the Feature Story Hero component: Error parsing hero data JSON response: ${er.message} -->`;
        }

        const { orientation, title, summary, media, pubDateFormatted } = heroData;

        // Validate fetched data
        try {
            if (typeof title !== 'string' || title.trim() === '') {
                throw new Error(
                    `The "title" must be non-empty string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (orientation && !['vertical', 'full', 'horizontal'].includes(orientation)) {
                throw new Error(
                    `The "orientation" must be one of ["vertical", "full", "horizontal"]. The ${JSON.stringify(orientation)} was received.`
                );
            }
            if (summary && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" must be a string. The ${JSON.stringify(summary)} was received.`
                );
            }
            if (media && typeof media !== 'object') {
                throw new Error(
                    `The "media" must be an object. The ${JSON.stringify(media)} was received.`
                );
            }
            if (pubDateFormatted && typeof pubDateFormatted !== 'string') {
                throw new Error(
                    `The "pubDateFormatted" must be a string. The ${JSON.stringify(pubDateFormatted)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Feature Story Hero component: ', er);
            return `<!-- Error occurred in the Feature Story Hero component: ${er.message} -->`;
        }

        // Prepare data
        const titleWordsCount = title.split(" ").length;
        const captionCredit = [media?.caption, media?.credit].filter(Boolean).join(' | ');

        // Prepare component data for template rendering
        const componentData = {
            orientation,
            title: xss(title),
            titleWordsCount,
            summary: xss(summary),
            media,
            captionCredit : xss(captionCredit),
            pubDateFormatted,
            readingTimeValue: readingTime(summary),
        };

        return featureStoryHeroTemplate(componentData);
    }
};