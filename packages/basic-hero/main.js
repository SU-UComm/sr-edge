import xss from 'xss';
import { basicHeroDataAdapter, matrixBasicHeroService } from '../../global/js/utils';

import basicHeroTemplate from './basic-hero.hbs';

/**
 * @module BasicHero
 * @description A module for rendering a Basic hero form cotexto of the page,
 */
export default {
    /**
     * Fetches and processes current page data, rendering them as Basic hero.
     * 
     * @async
     * @function main
     * @param {Object} args - Configuration arguments for the listing.
     * @param {Object} info - Contextual information including environment variables.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {string} info.fns.assetId - Function to resolve URIs.
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
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};
       
        const currentAssetId = fnsCtx?.assetId
        // const currentAssetId = '162603';

        // Validate required environment variables
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(
                    `The "info.fns.assetId" must be a non-empty string. The ${JSON.stringify(currentAssetId)} was received.`
                );
            }

        } catch (er) {
            console.error('Error occurred in the Basic Hero component: ', er);
            return `<!-- Error occurred in the Basic Hero component: ${er.message} -->`;
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
            console.error('Error occurred in the Basic Hero component: Error parsing hero data JSON response: ', er);
            return `<!-- Error occurred in the Basic Hero component: Error parsing hero data JSON response: ${er.message} -->`;
        }

        const { title, titleAlignment, summary, updatesPage, backgroundColor, relation, parentData } = heroData;

        // Validate fetched data
        try {
            if (typeof title !== 'string' || title.trim() === '') {
                throw new Error(
                    `The "title" must be non-empty string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (titleAlignment && !['center', 'left' ].includes(titleAlignment)) {
                throw new Error(
                    `The "titleAlignment" must be one of ["center", "left"]. The ${JSON.stringify(titleAlignment)} was received.`
                );
            }
            if (summary && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" must be a string. The ${JSON.stringify(summary)} was received.`
                );
            }
            if (updatesPage && typeof updatesPage !== 'string') {
                throw new Error(
                    `The "updatesPage" must be a string. The ${JSON.stringify(updatesPage)} was received.`
                );
            }
            if (backgroundColor && typeof backgroundColor !== 'string') {
                throw new Error(
                    `The "backgroundColor" must be a string. The ${JSON.stringify(backgroundColor)} was received.`
                );
            }
            if (relation && typeof relation !== 'string') {
                throw new Error(
                    `The "relation" must be a string. The ${JSON.stringify(relation)} was received.`
                );
            }
            if (parentData && typeof parentData !== 'object') {
                throw new Error(
                    `The "parentData" must be an object. The ${JSON.stringify(parentData)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Basic Hero component: ', er);
            return `<!-- Error occurred in the Basic Hero component: ${er.message} -->`;
        }

        let heroSummary = "";

        if (parentData && parentData.parentSummary && summary && relation === "child") {
            heroSummary = parentData.parentSummary;
        } else {
            heroSummary = summary;
        }

        // Prepare component data for template rendering
        const componentData = {
            title: xss(title),
            titleAlignment: titleAlignment?.toLowerCase(),
            summary: xss(heroSummary),
            updatesPage,
            backgroundColor,
            relation,
            parentData: {
                ...parentData,
                parentTitle: xss(parentData?.parentTitle),
                parentSummary: xss(parentData?.parentSummary),
            }
        };

        return basicHeroTemplate(componentData);
    }
};