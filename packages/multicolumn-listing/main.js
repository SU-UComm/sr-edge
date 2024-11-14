import hash from "object-hash";
import { CardDataAdapter, FunnelbackCardService, MatrixCardService, linkedHeadingService, multicolumnGrid, containerClasses } from "../../global/js/utils";
import {Card, Modal, EmbedVideo, LinkedHeading } from '../../global/js/helpers';

export default {
    async main(args, info) {
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // Check for environment vars
        try {
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `Error occurred in the multicolumn content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "${FB_JSON_URL}" was received.`
                );
            }
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `Error occurred in the multicolumn content component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "${API_IDENTIFIER}" was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `Error occurred in the multicolumn content component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "${BASE_DOMAIN}" was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `Error occurred in the multicolumn content component, info.fns cannot be undefined or null. The "${fnsCtx}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        const { headingConfiguration={}, contentConfiguration: { source, searchQuery, searchMaxCards }={}, displayConfiguration: { displayThumbnails, displayDescriptions }={} } = args || {}

        // Check manifest fields
        try {
            if (!args.contentConfiguration) {
                throw new Error(
                    `Error occurred in the multicolumn content component, contentConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (!args.headingConfiguration) {
                throw new Error(
                    `Error occurred in the multicolumn content component, headingConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (!args.displayConfiguration) {
                throw new Error(
                    `Error occurred in the multicolumn content component, displayConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (args.headingConfiguration.title && typeof args.headingConfiguration.title !== 'string') {
                throw new Error(
                    `Error occurred in the multicolumn content component, title field must be a string. The "${args.headingConfiguration.title}" was received.`
                );
            }
            if (args.headingConfiguration.ctaUrl && typeof args.headingConfiguration.ctaUrl !== 'string') {
                throw new Error(
                    `Error occurred in the multicolumn content component, ctaUrl field must be a string. The "${args.headingConfiguration.ctaUrl}" was received.`
                );
            }
            if (args.headingConfiguration.ctaManualUrl && typeof args.headingConfiguration.ctaManualUrl !== 'string') {
                throw new Error(
                    `Error occurred in the multicolumn content component, ctaManualUrl field must be a string. The "${args.headingConfiguration.ctaManualUrl}" was received.`
                );
            }
            if (args.headingConfiguration.ctaText && typeof args.headingConfiguration.ctaText !== 'string') {
                throw new Error(
                    `Error occurred in the multicolumn content component, ctaText field must be a string. The "${args.headingConfiguration.ctaText}" was received.`
                );
            }
            if (typeof args.headingConfiguration.ctaNewWindow !== 'boolean') {
                throw new Error(
                    `Error occurred in the multicolumn content component, ctaNewWindow field must be a boolean. The "${args.headingConfiguration.ctaNewWindow}" was received.`
                );
            }
            if (!args.contentConfiguration.source) {
                throw new Error(
                    `Error occurred in the multicolumn content component, source field cannot be undefined and must be one of ['Search', 'Select'] value, "${args.contentConfiguration.source}" was received`
                );
            }   
            if (typeof args.contentConfiguration.source !== 'string' || !['Search', 'Select'].includes(args.contentConfiguration.source)) {
                throw new Error(
                    `Error occurred in the multicolumn content component, source field cannot be undefined and must be one of ['Search', 'Select'] value, "${args.contentConfiguration.source}" was received`
                );
            }
            if (typeof args.displayConfiguration.displayDescriptions !== 'boolean') {
                throw new Error(
                    `Error occurred in the multicolumn content component, displayDescriptions field must be a boolean. The "${args.displayConfiguration.displayDescriptions}" was received.`
                );
            }
            if (typeof args.displayConfiguration.displayThumbnails !== 'boolean') {
                throw new Error(
                    `Error occurred in the multicolumn content component, displayThumbnails field must be a boolean. The "${args.displayConfiguration.displayThumbnails}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }


        const adapter = new CardDataAdapter();
        let data = null;

        if (source.toLowerCase() === "search") {
            // compose and fetch the FB search results
            const query = searchQuery;
            const service = new FunnelbackCardService({ FB_JSON_URL, query });

            adapter.setCardService(service);

            data = await adapter.getCards();
        }

        // When Select, use Matix Content API
        else {
            // Get our card URI's from the args object
            const { cards } = args.contentConfiguration;

            // Create our service
            const service = new MatrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            // Set our card service
            adapter.setCardService(service);

            // get the cards data
            data = await adapter.getCards(cards);
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            headingConfiguration
        );


        const cardsMarkup = [];

        const maxNumberOfCards =
            source === "Search"
                ? searchMaxCards
                : 3;
        const numberOfCards = data.length > maxNumberOfCards ? maxNumberOfCards : data.length;
        const cardSizeMap = new Map();
        cardSizeMap.set(3, "small");
        cardSizeMap.set(2, "medium");

        const cardModal = [];
        data.forEach((cardData, i) => {
            if (i < maxNumberOfCards) {
                if (source === "Search") {
                    cardsMarkup.push(
                        Card({data: cardData, displayDescription: displayDescriptions, displayThumbnail: displayThumbnails, cardSize: cardSizeMap.get(searchMaxCards)}))
                }
                else {
                    cardsMarkup.push(
                        Card({data: cardData, displayDescription: displayDescriptions, displayThumbnail: displayThumbnails, cardSize: cardSizeMap.get(numberOfCards)}))
                }
                if (cardData.type === 'Video') {
                    const uniqueId = hash.MD5(
                        JSON.stringify(cardData.videoUrl) + hash.MD5(JSON.stringify(cardData.title))
                    );
                    cardModal.push(
                        Modal({content: EmbedVideo({ isVertical: cardData.size === "vertical-video", videoId: cardData.videoUrl, title: `Watch ${cardData.title}`, noAutoPlay: true }), uniqueId, describedby: 'card-modal' })
                    );
                }
            }
        });

        const componentTitleStateClass = headingData.title
            ? "has-title"
            : "has-no-title";


        return `
        <section data-component="multicolumn-listing">
            <div class="component-multicolumn-listing ${componentTitleStateClass}">
                <div class="${containerClasses({width: "large"})}">    
                    ${LinkedHeading(headingData)}
                    ${multicolumnGrid(cardsMarkup, true)}
                </div>
            </div>
            ${cardModal.join('')}
        </section>
        `
    }
};
