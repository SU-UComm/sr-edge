import { basicAssetUri, isRealExternalLink } from "../../global/js/utils";
import ctaCardsBlockTemplate from './cta-cards-block.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

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
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // CHANGE: change const to let for mutability
        let { cards } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            squizEditTargets = {
                "eyebrow": {
                    "field": "cards",
                    "array": true,
                    "property": "eyebrow"
                },
                "title": {
                    "field": "cards",
                    "array": true,
                    "property": "title"
                },
                "description": {
                    "field": "cards",
                    "array": true,
                    "property": "description"
                }
            };
            
            // NEW: Provide default values for edit mode
            cards = cards && cards.length > 0 ? cards : [];
        }

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

        // Validating fields - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Get the cards data
        const data = await Promise.all(
            cards.map(async (card) => {
                let { eyebrow, title, description, linkDetails } = card;
                const { internalUrl, externalUrl, isNewWindow } = linkDetails || {};
                if(squizEdit) {
                    title = title || 'Title text';
                    eyebrow = eyebrow || 'Eyebrow text';
                    description = description || 'Add content';
                }
                let linkData = null;
            
                if (internalUrl) {
                    
                    try {
                        linkData = await basicAssetUri(info.fns, internalUrl);
                    } catch (er) {
                        console.error('Error occurred in the cta cards component: Failed to fetch link data. ', er);
                        if (squizEdit) {
                            linkData = {
                                url: "https://news.stanford.edu",
                                text: "add link"
                            };
                        }
                    }
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

        // Validating data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Prepare component data for template rendering
        const componentData = {
            cards: data
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(ctaCardsBlockTemplate(componentData), squizEditTargets, args);
        }

        return ctaCardsBlockTemplate(componentData);
    }
}