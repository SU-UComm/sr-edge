import { basicAssetUri, cardDataAdapter, matrixCardService, linkedHeadingService } from '../../global/js/utils';
import inTheNewsTemplate from './in-the-news.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

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
        // TODO: tech debt - imageURL and imageUrl are mixed in the templates that render this component
    
        // Extracting environment variables from provided info
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {};
        
        // CHANGE: change const to let for mutability
        let { title, ctaText, ctaUrl, ctaManualUrl, ctaNewWindow } = args?.headingConfiguration || {};
        let { featuredTeaser, personHeadshot, featuredCtaText, featuredTeaserDescription, featuredQuote } = args?.featuredContent || {};
        let { teaserOne, teaserOneDescription } = args?.supplementaryTeaserOne || {};
        let { teaserTwo, teaserTwoDescription } = args?.supplementaryTeaserTwo || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        // const squizEdit = true; 
        let squizEditTargets = null;
        

        if (squizEdit) {
            // if we are in edit mode 
            // Provide default values for inline editable fields
            title = title || 'Heading text';
            ctaText = ctaText || 'Link text';
            ctaUrl = ctaUrl || null;
            featuredQuote = featuredQuote || 'Add content';
            featuredTeaserDescription = featuredTeaserDescription || 'Scholar Name';
            featuredCtaText = featuredCtaText || 'Read the story';
            teaserOneDescription = teaserOneDescription || 'Scholar Name';
            teaserTwoDescription = teaserTwoDescription || 'Scholar Name';
            
            // Provide default asset IDs for edit mode
            featuredTeaser = featuredTeaser || 'matrix-asset://api-identifier/sample-featured-teaser';
            personHeadshot = personHeadshot || 'matrix-asset://api-identifier/sample-headshot';
            teaserOne = teaserOne || 'matrix-asset://api-identifier/sample-teaser-one';
            teaserTwo = teaserTwo || 'matrix-asset://api-identifier/sample-teaser-two';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "headingTitle": { "field": "headingConfiguration.title" },
                "headingCtaText": { "field": "headingConfiguration.ctaText" },
                "featuredQuote": { "field": "featuredContent.featuredQuote" },
                "featuredTeaserDescription": { "field": "featuredContent.featuredTeaserDescription" },
                "ctaText": { "field": "featuredContent.featuredCtaText" },
                "teaserDescription": [
                    { "field": "supplementaryTeaserOne.teaserOneDescription" },
                    { "field": "supplementaryTeaserTwo.teaserTwoDescription" }
                ]
            };
        }

        // Validate required variables - CHANGE: wrap in !squizEdit check
        // if we are in edit mode, we don't need to validate because values may be blank while editing 
        if (!squizEdit) { 
            const validateString = (value, fieldName) => {
                if (value && (typeof value !== 'string' || value === '')) {
                    throw new Error(
                        `The "${fieldName}" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(value)} was received.`
                    );
                }
            }

            try {
                if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                    throw new Error(
                        `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                    );
                }
                validateString(API_IDENTIFIER, 'API_IDENTIFIER');
                validateString(BASE_DOMAIN, 'BASE_DOMAIN')
                validateString(title, 'title')
                validateString(ctaUrl, 'ctaUrl')
                validateString(ctaManualUrl, 'ctaManualUrl')
                validateString(ctaText, 'ctaText')
                validateString(ctaNewWindow, 'ctaNewWindow')
                validateString(featuredTeaser, 'featuredTeaser')
                validateString(personHeadshot, 'personHeadshot')
                validateString(featuredQuote, 'featuredQuote')
                validateString(featuredTeaserDescription, 'featuredTeaserDescription')
                validateString(featuredCtaText, 'featuredCtaText')
                validateString(teaserOne, 'teaserOne')
                validateString(teaserOneDescription, 'teaserOneDescription')
                validateString(teaserTwo, 'teaserTwo')
                validateString(teaserTwoDescription, 'teaserTwoDescription')
            } catch (er) {
                console.error('Error occurred in the In the news component: ', er);
                return `<!-- Error occurred in the In the news component: ${er.message} -->`;
            }
        }


        const adapter = new cardDataAdapter();
        let data = null;
        
        // Compose and fetch the FB search results
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
        adapter.setCardService(service);

        // Add component data to the cards 
        const cards = []
        featuredTeaser && cards.push({ cardAsset: featuredTeaser })
        teaserOne && cards.push({ cardAsset: teaserOne });
        teaserTwo && cards.push({ cardAsset: teaserTwo });
   
        // if we found cards fetch the data from matrix
        if (cards?.length) {
            try {
                data = await adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the In the news component: Failed to fetch event data. ', er);
                // edit mode will be handled below 
                if(!squizEdit)  {
                    return `<!-- Error occurred in the In the news component: Failed to fetch event data. ${er.message} -->`;
                }
            }
        }

        if (squizEdit && data?.length === 0) {
            // NEW: In edit mode, provide mock data instead of returning error
            data = cards.map((card, index) => ({
                title: `Sample News Article ${index + 1}`,
                description: `This is a sample description for news article ${index + 1}`,
                liveUrl: '#',
                source: `Sample Source ${index + 1}`,
                // credit: `Sample Credit ${index + 1}`,
                // authorName: `Sample Author ${index + 1}`
            }));
        }
        
        // Resolve the URI for the section heading link
        let headingData = null;
        try {
            
            headingData = await linkedHeadingService(
                fnsCtx,
                args.headingConfiguration
            );
        } catch (er) {
            console.error('Error occurred in the In the news component: Failed to resolve heading link. ', er);
            // NEW: In edit mode, provide mock heading data
            if (squizEdit) {
                headingData = {
                    title: title,
                    ctaText: ctaText,
                    ctaLink: '#',
                    ctaNewWindow: ctaNewWindow || false
                };
            } else {
                return `<!-- Error occurred in the In the news component: Failed to resolve heading link. ${er.message} -->`;
            }
        }

        let imageData = null;
        if (personHeadshot) {
            try {
                
                imageData = await basicAssetUri(fnsCtx, personHeadshot);
                // Check required properties - CHANGE: wrap in !squizEdit check
                if (!squizEdit) {
                    if (!imageData || typeof imageData !== 'object') {
                        throw new Error('basicAssetUri did not return an object');
                    }
                    if (typeof imageData.url !== 'string' || imageData.url.trim() === '') {
                        throw new Error('data.url must be a non-empty string');
                    }
                    if (typeof imageData.attributes !== 'object' || imageData.attributes === null) {
                        throw new Error('data.attributes must be a non-null object');
                    }
                }
            } catch (er) {
                console.error('Error occurred in the In the news component: Failed to fetch image data. ', er);
                // NEW: In edit mode, provide mock image data
                if (squizEdit) {
                    imageData = {
                        url: "https://news.stanford.edu/_designs/component-service/editorial/placeholder.png",
                        attributes: {
                            "allow_unrestricted": false,
                            "size": 1858005,
                            "height": 960,
                            "width": 1440,
                            "title": "placeholder.png",
                            "name": "placeholder.png",
                            "caption": "",
                            "alt": "This is a placeholder"
                        }
                    };
                } else {
                    return `<!-- Error occurred in the In the news component: Failed to fetch image data. ${er.message} -->`;
                }
            }
        }

        const cardData = [];
        
        // Prepare feature data
        if (data) {
            
             data[0] && cardData.push({
                ...data[0],
                quote: featuredQuote,
                description: featuredTeaserDescription ? featuredTeaserDescription : '',
                ctaText: featuredCtaText || "Read the story",
                imageURL: imageData?.url,
                imageAlt: imageData?.alt
            });
    
            // Prepare teaser one data
            data[1] && cardData.push({
                ...data[1],
                description: teaserOneDescription && teaserOneDescription !== "" ? teaserOneDescription : data[1].description,
                isCustomDescription: teaserOneDescription && teaserOneDescription !== "" ? true : false
            });
            
            // Prepare teaser two data
             data[2] && cardData.push({
                ...data[2],
                description: teaserTwoDescription && teaserTwoDescription !== "" ? teaserTwoDescription : data[2].description,
                isCustomDescription: teaserTwoDescription && teaserTwoDescription !== "" ? true : false
            });
    
        }

        // Data validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }
        
        // Prepare component data for template rendering
        const componentData = {
            headingTitle: headingData?.title,
            headingIsAlwaysLight: false,
            headingCtaLink: headingData?.ctaLink,
            headingCtaNewWindow: headingData?.ctaNewWindow,
            headingCtaText: headingData?.ctaText,
            featuredGridItems: cardData,
            squizEdit: squizEdit 
        }; 
        
        // NEW: Early return pattern for edit mode
        if (squizEdit) {
             return processEditor(inTheNewsTemplate(componentData), squizEditTargets, args);
        }

        return inTheNewsTemplate(componentData);
    }
};

