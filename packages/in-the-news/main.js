import { basicAssetUri, cardDataAdapter, matrixCardService, linkedHeadingService } from '../../global/js/utils';
import inTheNewsTemplate from './in-the-news.hbs';

/**
 * In the news component that renders a formatted content card with associated metadata and SVG icons.
 *
 * @module InTheNews
 */

export default {
    /**
     * Renders the In the news component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.headingConfiguration - The header configuration for the component.
     * @param {string} [args.headingConfiguration.title] - The text for the heading (optional).
     * @param {string} [args.headingConfiguration.ctaUrl] - The assetid for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaManualUrl] - The URL for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaText] - The text for the CTA link (optional).
     * @param {string} [args.headingConfiguration.ctaNewWindow] - Flag to open CTA link in new window (optional).
     * @param {Object} args.featuredContent - The feature content section.
     * @param {string} args.featuredContent.featuredTeaser - The assetid for the feature teaser(optional).
     * @param {string} [args.featuredContent.personHeadshot] - The assetid for the persion image (optional).
     * @param {string} [args.featuredContent.featuredCtaText] - The CTA link tekst for fature teaser (optional).
     * @param {string} [args.featuredContent.featuredTeaserDescription] - The description for feature teaser (optional).
     * @param {string} [args.featuredContent.featuredQuote] - The feature qoute (optional).
     * @param {Object} args.supplementaryTeaserOne - The supplementary teaseer one.
     * @param {string} args.supplementaryTeaserOne.teaserOne - The assetid for the supplementary teaser one (optional).
     * @param {string} [args.supplementaryTeaserOne.teaserOneDescription] - The description to be replaced for the supplementary teaser one (optional).
     * @param {Object} args.supplementaryTeaserTwo - The supplementary teaseer two.
     * @param {string} args.supplementaryTeaserTwo.teaserTwo - The assetid for the supplementary teaser two (optional).
     * @param {string} [args.supplementaryTeaserTwo.teaserTwoDescription] - The description to be replaced for the supplementary teaser two (optional).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
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
                    `The "ctaManualUrl" field must be a string type. The ${JSON.stringify(ctaManualUrl)} was received.`
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

        // Getting data
        const cards = []
        featuredTeaser && cards.push({ cardAsset: featuredTeaser })
        teaserOne && cards.push({ cardAsset: teaserOne });
        teaserTwo && cards.push({ cardAsset: teaserTwo });
   
        if (cards && cards.length) {
            try {
                data = await adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the In the news component: Failed to fetch event data. ', er);
                return `<!-- Error occurred in the In the news component: Failed to fetch event data. ${er.message} -->`;
            }
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            args.headingConfiguration
        );

        let imageData = null;
        if (personHeadshot) {
            try {
                imageData = await basicAssetUri(fnsCtx, personHeadshot);
                // Check required properties
                if (!imageData || typeof imageData !== 'object') {
                    throw new Error('basicAssetUri did not return an object');
                }
                if (typeof imageData.url !== 'string' || imageData.url.trim() === '') {
                    throw new Error('data.url must be a non-empty string');
                }
                if (typeof imageData.attributes !== 'object' || imageData.attributes === null) {
                    throw new Error('data.attributes must be a non-null object');
                }
            } catch (er) {
                console.error('Error occurred in the In the news component: Failed to fetch image data. ', er);
                return `<!-- Error occurred in the In the news component: Failed to fetch image data. ${er.message} -->`;
            }
        }

        const cardData = [];

        // Prepare feature data
        data && data[0] && cardData.push({
            ...data[0],
            quote: featuredQuote,
            description: featuredTeaserDescription ? featuredTeaserDescription : '',
            ctaText: featuredCtaText || "Read the story",
            imageURL: imageData?.url,
            imageAlt: imageData?.alt
        });

        // Prepare teaser one data
        data && data[1] && cardData.push({
            ...data[1],
            description: teaserOneDescription && teaserOneDescription !== "" ? teaserOneDescription : data[1].description,
            isCustomDescription: teaserOneDescription && teaserOneDescription !== "" ? true : false
        });
        
        // Prepare teaser two data
        data && data[2] && cardData.push({
            ...data[2],
            description: teaserTwoDescription && teaserTwoDescription !== "" ? teaserTwoDescription : data[2].description,
            isCustomDescription: teaserTwoDescription && teaserTwoDescription !== "" ? true : false
        });


        try {
            if (typeof cardData !== 'object' || cardData.length < 1) {
                throw new Error(
                    `The "data" cannot be undefined or null. The ${JSON.stringify(cardData)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the In the news component: ', er);
            return `<!-- Error occurred in the In the news component: ${er.message} -->`;
        }
        
        // Prepare component data for template rendering
        const componentData = {
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            featuredGridItems: cardData,
        };

        return inTheNewsTemplate(componentData);
    }
};

