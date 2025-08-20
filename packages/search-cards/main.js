
import xss from "xss";
import { cardDataAdapter, funnelbackCardService, uuid, formatNewsDate, isRealExternalLink } from "../../global/js/utils";
import { Card } from "../../global/js/helpers";
import { processEditor } from "../../global/js/utils/processEditor";
import searchCardsTemplate from "./search-cards.hbs";

/**
 * @module SearchCards
 * @description A module for rendering search cards in a vertical grid layout from Funnelback search results.
 */

/**
 * Creates a responsive grid layout for search cards
 * @param {Array} items - Array of card markup strings
 * @returns {string} HTML string for the grid layout
 */
function searchCardsGrid(items) {
    if (!items || items.length === 0) return '';
    
    const totalCards = Math.min(items.length, 3); // Maximum 3 cards for optimal layout
    const gapClasses = totalCards === 2 
        ? "su-gap-34 md:su-gap-72 lg:su-gap-[160px]" 
        : "su-gap-34 md:su-gap-72 lg:su-gap-[160px]";
    
    const basisClass = totalCards === 2 ? "md:su-basis-1/2" : "md:su-basis-1/3";
    
    return `
    <div class="su-w-full su-component-search-cards">
        <div class="su-relative su-flex su-flex-wrap md:su-flex-nowrap su-flex-1 su-place-content-between ${gapClasses}">
            ${items.slice(0, 3).map((item, i) => `
                <div data-test="search-card-${i}" data-controller-subscribe="stanford-search" data-controller-subscribe-id="cards-${i}" class="su-relative su-grow ${basisClass} ${
                    i !== 0 ? 'before:md:su-w-1 before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-1 before:md:su-h-full before:su-left-0 before:su-top-[-34px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]' : ''
                }">
                    ${item}
                    <div hidden data-sq-field="contentConfiguration.cards[${i}].id" data-sq-controller="cards-${i}">{{id}}</div>
                </div>
            `).join('')}
        </div>
    </div>`;
}



export default {
    /**
     * Renders the Search Cards component.
     * 
     * @async
     * @function main
     * @param {Object} args - Configuration arguments for the component.
     * @param {Object} args.contentConfiguration - The content configuration for the component.
     * @param {Array<Object>} [args.contentConfiguration.cards] - An array of card configurations with IDs to fetch.
     * @param {Object} args.displayConfiguration - The display configuration for the component.
     * @param {string} [args.displayConfiguration.searchQuery] - The Funnelback search query to use for fetching cards.
     * @param {Object} info - Contextual information including environment variables.
     * @param {Object} [info.env] - Environment variables (preferred source).
     * @param {string} [info.env.FB_JSON_URL] - The base URL for the Funnelback JSON API.
     * @param {Object} [info.fns] - Functions available in the execution context.
     * @param {Function} [info.fns.resolveUri] - Function to resolve URIs.
     * @param {Object} [info.ctx] - Component context including editor state.
     * @param {boolean} [info.ctx.editor] - Whether component is being edited.
     * @returns {Promise<string>} The rendered HTML string from the searchCardsTemplate, or an error comment if processing fails.
     * @throws {Error} If FB_JSON_URL or query is invalid or if the fetch operation fails.
     */
    async main(args, info) {
        // Extracting environment variables and functions from provided info
        const { FB_JSON_URL } = info?.env || {};
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {};

        // Extracting configuration data from arguments
        let { cards } = args?.contentConfiguration || {};
        let { searchQuery } = args?.displayConfiguration || {};

        // Detect edit mode
        const squizEdit = componentContext?.editor || false;

        if (squizEdit) {
            // Provide default configurations for edit mode
            searchQuery = searchQuery || '?profile=stanford-report-push-search&collection=sug~sp-stanford-report-search&sort=date&log=false';
            cards = cards || [{ id: '171710' }, { id: '174814' }];
        }

        // Validate required fields for non-edit mode
        if (!squizEdit) {
            try {
                if (!cards || !Array.isArray(cards) || cards.length === 0) {
                    throw new Error(
                        `The "cards" field must be a non-empty array. The ${JSON.stringify(cards)} was received.`
                    );
                }
                if (typeof searchQuery !== 'string' || searchQuery === '' || searchQuery === '?') {
                    throw new Error(
                        `The "searchQuery" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(searchQuery)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Search Cards component: ', er);
                return `<!-- Error occurred in the Search Cards component: ${er.message} -->`;
            }
        }

        // Create adapter and service for Funnelback
        const adapter = new cardDataAdapter();
        let data = null;
        const modalData = [];

        // Build search query that includes all card IDs
        const cardIds = cards.map(card => card.id).filter(id => id);
        if (cardIds.length > 0) {
            const idQuery = cardIds.map(id => `id:${id}`).join(' ');
            const fullQuery = `${searchQuery}&query=[${idQuery}]`;
            
            // Create Funnelback service
            const service = new funnelbackCardService({ FB_JSON_URL, query: fullQuery });
            adapter.setCardService(service);

            // Get the result data
            try {
                data = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Search Cards component: Error parsing Funnelback JSON response: ', er);
                if (squizEdit) {
                    data = [];
                } else {
                    return `<!-- Error occurred in the Search Cards component: ${er.message} -->`;
                }
            }
        } else {
            data = [];
        }

        // Process card data and generate cards markup
        const cardsMarkup = [];
        
        data?.forEach((card) => {
            const uniqueId = uuid();
            const cardData = {
                uniqueID: uniqueId,
                type: card.type,
                iconType: card.type.toLowerCase(),
                title: xss(card.title),
                description: xss(card.description),
                date: formatNewsDate(card.date),
                liveUrl: card.liveUrl,
                isRealExternalLink: isRealExternalLink(card?.liveUrl),
                imageUrl: card.imageUrl,
                imageAlt: card.imageAlt,
                taxonomy: xss(card.taxonomy),
                taxonomyUrl: card.taxonomyUrl,
                videoUrl: card.videoUrl
            };

            // Generate vertical card markup
            cardsMarkup.push(
                Card({
                    data: cardData, 
                    cardSize: "small", 
                    displayDescription: true, 
                    displayThumbnail: true, 
                    headingLvl: 3,
                    uniqueId
                })
            );

            // Generate modal data for video cards
            if (card.type === 'Video' || card.videoUrl) {
                modalData.push({
                    isVertical: card.size === "vertical-video",
                    videoId: card.videoUrl,
                    title: `Watch ${card.title}`,
                    noAutoPlay: true,
                    uniqueID: uniqueId,
                    titleID: 'card-modal'
                });
            }
        });

        // Prepare component data for template rendering
        const componentData = {
            width: "large",
            searchCardsGrid: searchCardsGrid(cardsMarkup),
            modalData
        };

        // Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(searchCardsTemplate(componentData), {}, args);
        }

        return searchCardsTemplate(componentData);
    }
};
