import hash from "object-hash";
import { CardDataAdapter, FunnelbackCardService, linkedHeadingService, MatrixCardService, containerClasses } from "../../global/js/utils";
import { LinkedHeading, Card, Modal, EmbedVideo } from "../../global/js/helpers";
 
export default {
    async main(args, info) {
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // Check for environment vars
        try {
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `Error occurred in the feature content component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "${FB_JSON_URL}" was received.`
                );
            }
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `Error occurred in the feature content component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "${API_IDENTIFIER}" was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `Error occurred in the feature content component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "${BASE_DOMAIN}" was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `Error occurred in the feature content component, info.fns cannot be undefined or null. The "${fnsCtx}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        // Validating fields
        try {
            if (!args.contentConfiguration) {
                throw new Error(
                    `Error occurred in the feature content component, contentConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (!args.headingConfiguration) {
                throw new Error(
                    `Error occurred in the feature content component, headingConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (!args.displayConfiguration) {
                throw new Error(
                    `Error occurred in the feature content component, displayConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (typeof args.contentConfiguration.source !== 'string' || !['Search', 'Select'].includes(args.contentConfiguration.source) ) {
                throw new Error(
                    `Error occurred in the feature content component, source field cannot be undefined and must be one of ["Search", "Select"]. The "${args.contentConfiguration.source}" was received.`
                );
            }
            if (args.contentConfiguration.source === 'Search' && (typeof args.contentConfiguration.searchQuery !== 'string' || args.contentConfiguration.searchQuery === '' || args.contentConfiguration.searchQuery === '?')) {
                throw new Error(
                    `Error occurred in the feature content component, searchQuery field cannot be undefined and must be a non-empty string. The "${args.contentConfiguration.searchQuery}" was received.`
                );
            }
            if (args.contentConfiguration.source === 'Select' && typeof args.contentConfiguration.cards !== 'object') {
                throw new Error(
                    `Error occurred in the feature content component, cards field must be an array. The "${args.contentConfiguration.cards}" was received.`
                );
            }
            if (args.contentConfiguration.source === 'Select' && args.contentConfiguration.featuredDescription && typeof args.contentConfiguration.featuredDescription !== 'string') {
                throw new Error(
                    `Error occurred in the feature content component, featuredDescription field must be a string. The "${args.contentConfiguration.featuredDescription}" was received.`
                );
            }
            if (args.headingConfiguration.title && typeof args.headingConfiguration.title !== 'string') {
                throw new Error(
                    `Error occurred in the feature content component, title field must be a string. The "${args.headingConfiguration.title}" was received.`
                );
            }
            if (args.headingConfiguration.ctaUrl && typeof args.headingConfiguration.ctaUrl !== 'string') {
                throw new Error(
                    `Error occurred in the feature content component, ctaUrl field must be a string. The "${args.headingConfiguration.ctaUrl}" was received.`
                );
            }
            if (args.headingConfiguration.ctaManualUrl && typeof args.headingConfiguration.ctaManualUrl !== 'string') {
                throw new Error(
                    `Error occurred in the feature content component, ctaManualUrl field must be a string. The "${args.headingConfiguration.ctaManualUrl}" was received.`
                );
            }
            if (args.headingConfiguration.ctaText && typeof args.headingConfiguration.ctaText !== 'string') {
                throw new Error(
                    `Error occurred in the feature content component, ctaText field must be a string. The "${args.headingConfiguration.ctaText}" was received.`
                );
            }
            if (typeof args.headingConfiguration.ctaNewWindow !== 'boolean') {
                throw new Error(
                    `Error occurred in the feature content component, ctaNewWindow field must be a boolean. The "${args.headingConfiguration.ctaNewWindow}" was received.`
                );
            }
            if (typeof args.displayConfiguration.alignment !== 'string' || !['left', 'right'].includes(args.displayConfiguration.alignment) ) {
                throw new Error(
                    `Error occurred in the feature content component, alignment field cannot be undefined and must be one of ["left", "right"]. The "${args.displayConfiguration.alignment}" was received.`
                );
            }
            if (typeof args.displayConfiguration.displayThumbnails !== 'boolean') {
                throw new Error(
                    `Error occurred in the feature content component, displayThumbnails field must be a boolean. The "${args.displayConfiguration.displayThumbnails}" was received.`
                );
            }
            if (typeof args.displayConfiguration.displayDescriptions !== 'boolean') {
                throw new Error(
                    `Error occurred in the feature content component, displayDescriptions field must be a boolean. The "${args.displayConfiguration.displayDescriptions}" was received.`
                );
            }
            
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        const adapter = new CardDataAdapter();
        let data = null;

        // Check what data source "Search" or "Select"
        if (args.contentConfiguration.source.toLowerCase() === "search") {
            // Compose and fetch the FB search results
            const query = args.contentConfiguration.searchQuery;
            const service = new FunnelbackCardService({ FB_JSON_URL, query });

            // Set our card service
            adapter.setCardService(service);

            // Get the cards data
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

            // Get the cards data
            data = await adapter.getCards(cards);
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            args.headingConfiguration
        );

        const featuredCardData = data && data[0];
        if (args.contentConfiguration.featuredDescription && args.contentConfiguration.featuredDescription !== "") {
            featuredCardData.description = args.contentConfiguration.featuredDescription;
        }

        const cardData = data && [data[1], data[2]];
        const cardModal = [];

        data && data.forEach((card) => {
            if (card.type === 'Video') {
                const uniqueId = hash.MD5(
                    JSON.stringify(card.videoUrl) + hash.MD5(JSON.stringify(card.title))
                );
                cardModal.push(
                    Modal({content: EmbedVideo({ isVertical: card.size === "vertical-video", videoId: card.videoUrl, title: `Watch ${card.title}`, noAutoPlay: true }), uniqueId, describedby: 'card-modal' })
                );
            }
        });

        // Validating data 
        try {
            if (typeof featuredCardData !== 'object' || featuredCardData === null) {
                throw new Error(
                    `Error occurred in the feature content component, data cannot be undefined or null. The "${data}" was received.`
                );
            }
            if (typeof cardData !== 'object' || JSON.stringify(cardData) === JSON.stringify([null, null]) || cardData.length < 2) {
                throw new Error(
                    `Error occurred in the feature content component, data cannot have less then 3 elements. The "${data}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        const alignClasses = {
            'left': 'before:su-left-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-left-[-36px] before:lg:su-left-[-80px]',
            'right': 'before:su-right-0 before:su-top-[-35px] before:md:su-top-0 before:md:su-right-[-36px] before:lg:su-right-[-80px]',
        };

        return `
        <section data-component="featured-content">
            <div class="${containerClasses({width: "large"})}">
                ${headingData ? 
                LinkedHeading(headingData)
                : '' }
                <div class="su-w-full su-component-featured-grid">
                    <div class="su-flex su-flex-wrap su-gap-[68px] md:su-gap-72 md:su-flex-nowrap lg:su-gap-[160px]">
                        <div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow${args.displayConfiguration.alignment === 'right' ? ' md:su-order-2' : ''}">
                            ${Card({ data: featuredCardData, cardSize:"featured", headingLvl: headingData?.title ? 3 : 2 })}
                        </div>
                        <div class="su-relative su-flex su-flex-wrap su-grow before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black su-gap-80 md:su-gap-72 lg:su-gap-[76px] before:md:su-w-px before:su-h-px before:md:su-h-full md:su-basis-[39.5%] lg:su-basis-[30%] md:su-items-start md:su-content-start ${alignClasses[args.displayConfiguration.alignment]}">
                            ${cardData.map((card, idx) => `
                            ${idx === 0 ? `<div class="su-relative su-w-full">`: `<div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]">`}
                                ${Card({ data: card, cardSize: "small", displayThumbnail: args.displayConfiguration.displayThumbnails, displayDescription: args.displayConfiguration.displayDescriptions, headingLvl: headingData?.title ? 3 : 2 })}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            ${cardModal.join('')}
        </section>
        `
    }
};
