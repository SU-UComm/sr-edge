import { basicAssetUri, cardDataAdapter, matrixCardService, linkedHeadingService } from '../../global/js/utils';
import inTheNewsTemplate from './in-the-news.hbs';

/**
 * In the news component that renders a formatted content card with associated metadata and SVG icons.
 *
 * @module InTheNews
 */

export default {
    async main(args, info) {
        // Extracting environment variables from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        
        // Extract configuration data from arguments
        const { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow } = args?.headingConfiguration || {};
        const { featuredTeaser, personHeadshot, featuredCtaText, featuredTeaserDescription, featuredQuote } = args?.featuredContent || {};
        const { teaserOne, teaserOneDescription } = args?.supplementaryTeaserOne || {};
        const { teaserTwo, teaserTwoDescription } = args?.supplementaryTeaserTwo || {};

        // Validate required environment variables
        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
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

        } catch (er) {
            console.error('Error occurred in the In the news component: ', er);
            return `<!-- Error occurred in the In the news component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string type. The ${JSON.stringify(title)} was received.`
                );
            }
            if (ctaUrl && typeof ctaUrl !== 'string') {
                throw new Error(
                    `The "ctaUrl" field must be a string type. The ${JSON.stringify(ctaUrl)} was received.`
                );
            }
            if (ctaManualUrl && typeof ctaManualUrl !== 'string') {
                throw new Error(
                    `The "ctaManualUrl" field must be a string type. The ${JSON.stringify(ctaUrl)} was received.`
                );
            }
            if (ctaText && typeof ctaText !== 'string') {
                throw new Error(
                    `The "ctaText" field must be a string type. The ${JSON.stringify(ctaText)} was received.`
                );
            }
            if (ctaNewWindow && typeof ctaNewWindow !== 'boolean') {
                throw new Error(
                    `The "ctaNewWindow" field must be a boolean. The ${JSON.stringify(ctaNewWindow)} was received.`
                );
            }
            if (featuredTeaser && typeof featuredTeaser !== 'string') {
                throw new Error(
                    `The "featuredTeaser" field must be a string type. The ${JSON.stringify(featuredTeaser)} was received.`
                );
            }
            if (personHeadshot && typeof personHeadshot !== 'string') {
                throw new Error(
                    `The "personHeadshot" field must be a string type. The ${JSON.stringify(personHeadshot)} was received.`
                );
            }
            if (featuredQuote && typeof featuredQuote !== 'string') {
                throw new Error(
                    `The "featuredQuote" field must be a string type. The ${JSON.stringify(featuredQuote)} was received.`
                );
            }
            if (featuredTeaserDescription && typeof featuredTeaserDescription !== 'string') {
                throw new Error(
                    `The "featuredTeaserDescription" field must be a string type. The ${JSON.stringify(featuredTeaserDescription)} was received.`
                );
            }
            if (featuredCtaText && typeof featuredCtaText !== 'string') {
                throw new Error(
                    `The "featuredCtaText" field must be a string type. The ${JSON.stringify(featuredCtaText)} was received.`
                );
            }
            if (teaserOne && typeof teaserOne !== 'string') {
                throw new Error(
                    `The "teaserOne" field must be a string type. The ${JSON.stringify(teaserOne)} was received.`
                );
            }
            if (teaserOneDescription && typeof teaserOneDescription !== 'string') {
                throw new Error(
                    `The "teaserOneDescription" field must be a string type. The ${JSON.stringify(teaserOneDescription)} was received.`
                );
            }
            if (teaserTwo && typeof teaserTwo !== 'string') {
                throw new Error(
                    `The "teaserTwo" field must be a string type. The ${JSON.stringify(teaserTwo)} was received.`
                );
            }
            if (teaserTwoDescription && typeof teaserTwoDescription !== 'string') {
                throw new Error(
                    `The "teaserTwoDescription" field must be a string type. The ${JSON.stringify(teaserTwoDescription)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the In the news component: ', er);
            return `<!-- Error occurred in the In the news component: ${er.message} -->`;
        }


        const adapter = new cardDataAdapter();
        let data = null;
        
        // Compose and fetch the FB search results
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

        adapter.setCardService(service);

        data = await adapter.getCards([
            { cardAsset: featuredTeaser }, 
            { cardAsset: teaserOne }, 
            { cardAsset: teaserTwo }
        ]);

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            args.headingConfiguration
        );

        let imageData = null;
        imageData = await basicAssetUri(fnsCtx, personHeadshot);

        const dataFeatured = data && data[0] && {
            ...data[0],
            quote: featuredQuote,
            description: featuredTeaserDescription ? featuredTeaserDescription : '',
            ctaText: featuredCtaText,
            imageURL: imageData.url,
            imageAlt: imageData.alt
        };

        const dataOne = data && data[1] && {
            ...data[1],
            description: teaserOneDescription && teaserOneDescription !== "" ? teaserOneDescription : data[1].description,
            isCustomDescription: teaserOneDescription && teaserOneDescription !== "" ? true : false
        };
        
        const dataTwo = data && data[2] && {
            ...data[2],
            description: teaserTwoDescription && teaserTwoDescription !== "" ? teaserTwoDescription : data[2].description,
            isCustomDescription: teaserTwoDescription && teaserTwoDescription !== "" ? true : false
        }

        const cardData = dataFeatured && dataOne && dataTwo && [dataFeatured, dataOne, dataTwo];

        try {
            if (typeof dataFeatured !== 'object' || dataFeatured === null) {
                throw new Error(
                    `The data cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                );
            }
            if (typeof cardData !== 'object' || JSON.stringify(cardData) === JSON.stringify([null, null]) || cardData.length < 2) {
                throw new Error(
                    `The data cannot have less then 3 elements. The ${JSON.stringify(data)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the In the news content component: ', er);
            return `<!-- Error occurred in the In the news content component: ${er.message} -->`;
        }
        
        const componentData = {
            headingTitle: headingData.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData.ctaLink,
            headingCtaNewWindow: headingData.ctaNewWindow,
            headingCtaText: headingData.ctaText,
            featuredGridItems: cardData,
        };

        return inTheNewsTemplate(componentData);
    }
};

