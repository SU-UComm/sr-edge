import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import ctaCardsBlockTemplate from './cta-cards-block.hbs';

/**
 * Cta cards block component that prepares and renders Cta cards block  content.
 * @module CtaCardsBlock
 */
export default {
    /**
     * Main function to process card-related operations.
     *
     * @async
     * @function
     * @param {Object} args - Arguments containing card information.
     * @param {Object} args.cards - Card objects to process.
     * @param {Object} info - Context information for the operation.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Object} [info.ctx] - Alternative context object.
     * @returns {Promise<void>} Resolves when processing is complete.
     */
  async main(args, info) {
        // Extracting environment function from provided info
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extract configuration data
        const { cards } = args || {};

        // Check for environment vars
        try {
            if ( typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`,
                );
            }
        } catch (er) {
            console.error('Error occurred in the Cta cards block component: ', er);
            return `<!-- Error occurred in the Cta cards block component: ${er.message} -->`;
        }

        // Validating fields
        try {
            if (!Array.isArray(cards)) {
                throw new Error(
                    `The cards cannot be undefined or null. The ${JSON.stringify(cards)} was received.`
                );
            }
            if (cards.length < 1) {
                throw new Error(
                    `The "cards" array cannot have less than 1 element. The ${JSON.stringify(cards.length)} elements were received.`
                );
            }
            if (cards.length > 3) {
                throw new Error(
                    `The "cards" array cannot have more than 3 elements. The ${JSON.stringify(cards.length)} elements were received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Cta cards block component: ', er);
            return `<!-- Error occurred in the Cta cards block component: ${er.message} -->`;
        }

        // Get the cards data
        const data = await Promise.all(
            cards.map(async (card) => {
                const { eyebrow, title, description, linkDetails } = card;
                const { internalUrl, externalUrl, isNewWindow } = linkDetails || {};

                let linkData = null;
            
                if (internalUrl) {
                    linkData = await basicAssetUri(info.fns, internalUrl);
                }
                
                return {
                    title: title,
                    eyebrow: eyebrow,
                    description: description,
                    link: linkData?.url || externalUrl,
                    isRealExternalLink: !linkData?.url && externalUrl ? isRealExternalLink(externalUrl) : false,
                    isNewWindow: isNewWindow
                }
            })
        );

        // Validating data 
        try {
            if (typeof data !== 'object' || data.length < 1) {
                throw new Error(
                    `The "data" cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the CTA cards block component: ', er);
            return `<!-- Error occurred in the CTA cards block component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            cards: data
        };

        return ctaCardsBlockTemplate(componentData);
    }
}