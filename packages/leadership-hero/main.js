import xss from 'xss';
import { basicHeroDataAdapter, matrixBasicHeroService } from '../../global/js/utils';
import leadershipHeroTemplate from './leadership-hero.hbs';

/**
 * @module LeadershipHero
 * @description A module for rendering the Leadership Hero component.
 */
export default {
    /**
     * Renders the Leadership Hero.
     *
     * @async
     * @function main
     * @param {Object} args - Configuration arguments for the listing.
     * @param {Object} info - Contextual information including environment variables.
     * @returns {Promise<string>} Rendered HTML from the Handlebars template.
     */
    async main(_args, info) {
        const fnsCtx = info?.fns || info?.ctx || {};
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        const currentAssetId = fnsCtx?.assetId;
        // const currentAssetId = '162603';

        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(`The "BASE_DOMAIN" variable cannot be undefined and must be a non-empty string. Received: ${JSON.stringify(BASE_DOMAIN)}`);
            }
            if (typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(`The "assetId" must be a non-empty string. Received: ${JSON.stringify(currentAssetId)}`);
            }
        } catch (er) {
            console.error('Error occurred in the Leadership Hero component:', er);
            return `<!-- Error occurred in the Leadership Hero component: ${er.message} -->`;
        }

        const adapter = new basicHeroDataAdapter();
        const service = new matrixBasicHeroService({ BASE_DOMAIN });
        adapter.setBasicHeroService(service);

        let heroData;
        try {
            heroData = await adapter.getBasicHeroData(currentAssetId);
        
            if (!heroData || typeof heroData !== 'object') {
                throw new Error('Invalid API response: heroData is missing or not an object.');
            }
        } catch (error) {
            console.error('Failed to fetch Leadership Hero data:', error);
            return `<!-- Failed to fetch Leadership Hero data: ${error.message} -->`;
        }

        const { title, pubDateFormatted, topic } = heroData;

        try {
            if (typeof title !== 'string' || title.trim() === '') {
                throw new Error(`The "title" must be a non-empty string. Received: ${JSON.stringify(title)}`);
            }
            if (pubDateFormatted && typeof pubDateFormatted !== 'string') {
                throw new Error(`The "pubDateFormatted" must be a string. Received: ${JSON.stringify(pubDateFormatted)}`);
            }
            if (topic && typeof topic !== 'object') {
                throw new Error(`The "topic" must be an object. Received: ${JSON.stringify(topic)}`);
            }
        } catch (error) {
            console.error('Error occurred in the Leadership Hero component:', error);
            return `<!-- Error occurred in the Leadership Hero component: ${error.message} -->`;
        }

        const componentData = {
            title: xss(title),
            pubDateFormatted,
            topic: {
                asset_url: topic?.asset_url,
                asset_name: xss(topic?.asset_name),
            }
        };

        return leadershipHeroTemplate(componentData);
    }
};
