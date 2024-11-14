import hash from "object-hash";
import { CardDataAdapter, FunnelbackCardService, linkedHeadingService, containerClasses } from "../../global/js/utils";
import { Carousel, LinkedHeading, Card, Modal, EmbedVideo } from "../../global/js/helpers";

export default {
    async main(args, info) {
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN, BASE_PATH, NEWS_ARCHIVE_PATH } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // Check for environment vars
        try {
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `Error occurred in the stories carousel component, FB_JSON_URL variable cannot be undefined and must be non-empty string. The "${FB_JSON_URL}" was received.`
                );
            }
            if (typeof API_IDENTIFIER !== 'string' || API_IDENTIFIER === '') {
                throw new Error(
                    `Error occurred in the stories carousel component, API_IDENTIFIER variable cannot be undefined and must be non-empty string. The "${API_IDENTIFIER}" was received.`
                );
            }
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `Error occurred in the stories carousel component, BASE_DOMAIN variable cannot be undefined and must be non-empty string. The "${BASE_DOMAIN}" was received.`
                );
            }
            if (typeof BASE_PATH !== 'string' || BASE_PATH === '') {
                throw new Error(
                    `Error occurred in the stories carousel component, BASE_PATH variable cannot be undefined and must be non-empty string. The "${BASE_PATH}" was received.`
                );
            }
            if (typeof NEWS_ARCHIVE_PATH !== 'string' || NEWS_ARCHIVE_PATH === '') {
                throw new Error(
                    `Error occurred in the stories carousel component, NEWS_ARCHIVE_PATH variable cannot be undefined and must be non-empty string. The "${NEWS_ARCHIVE_PATH}" was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `Error occurred in the stories carousel component, info.fns cannot be undefined or null. The "${fnsCtx}" was received.`
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
                    `Error occurred in the stories carousel component, contentConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (!args.headingConfiguration) {
                throw new Error(
                    `Error occurred in the stories carousel component, headingConfiguration prop cannot be undefined. The "${args}" was received.`
                );
            }
            if (typeof args.contentConfiguration.searchQuery !== 'string' || args.contentConfiguration.searchQuery === '' || args.contentConfiguration.searchQuery === '?') {
                throw new Error(
                    `Error occurred in the stories carousel component, searchQuery field cannot be undefined and must be a non-empty string. The "${args.contentConfiguration.searchQuery}" was received.`
                );
            }
            if (args.headingConfiguration.title && typeof args.headingConfiguration.title !== 'string') {
                throw new Error(
                    `Error occurred in the stories carousel component, title field must be a string. The "${args.headingConfiguration.title}" was received.`
                );
            }
            if (args.headingConfiguration.ctaUrl && typeof args.headingConfiguration.ctaUrl !== 'string') {
                throw new Error(
                    `Error occurred in the stories carousel component, ctaUrl field must be a string. The "${args.headingConfiguration.ctaUrl}" was received.`
                );
            }
            if (args.headingConfiguration.ctaManualUrl && typeof args.headingConfiguration.ctaManualUrl !== 'string') {
                throw new Error(
                    `Error occurred in the stories carousel component, ctaManualUrl field must be a string. The "${args.headingConfiguration.ctaManualUrl}" was received.`
                );
            }
            if (args.headingConfiguration.ctaText && typeof args.headingConfiguration.ctaText !== 'string') {
                throw new Error(
                    `Error occurred in the stories carousel component, ctaText field must be a string. The "${args.headingConfiguration.ctaText}" was received.`
                );
            }
            if (typeof args.headingConfiguration.ctaNewWindow !== 'boolean') {
                throw new Error(
                    `Error occurred in the stories carousel component, ctaNewWindow field must be a boolean. The "${args.headingConfiguration.ctaNewWindow}" was received.`
                );
            }
            
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        const adapter = new CardDataAdapter();
        let data = null;

        // compose and fetch the FB search results
        const query = args.contentConfiguration.searchQuery;
        const service = new FunnelbackCardService({ FB_JSON_URL, query });

        adapter.setCardService(service);

        data = await adapter.getCards();

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            args.headingConfiguration
        );
        
        if (headingData && !headingData.ctaLink) {
            headingData.ctaLink = `${BASE_DOMAIN}${BASE_PATH}${NEWS_ARCHIVE_PATH}`;
        }

        const cardData = [];
        const cardModal = [];
        let uniqueClass = ""
        
        if (data !== null && data !== undefined) {
            uniqueClass = hash.MD5(JSON.stringify(data));
            
            data.forEach((card) => {
                cardData.push(
                    `<div class="swiper-slide">
                        ${Card({data: card, displayDescription: false})}
                    </div>`
                );

                if (card.type === 'Video') {
                    const uniqueId = hash.MD5(
                        JSON.stringify(card.videoUrl) + hash.MD5(JSON.stringify(card.title))
                    );
                    cardModal.push(
                        Modal({content: EmbedVideo({ isVertical: card.size === "vertical-video", videoId: card.videoUrl, title: `Watch ${card.title}`, noAutoPlay: true }), uniqueId, describedby: 'card-modal' })
                    );
                }
            });
        }

        // Validating data 
        try {
            if (typeof cardData !== 'object' || cardData.length < 1) {
                throw new Error(
                    `Error occurred in the stories carousel component, data cannot be undefined or null. The "${cardData}" was received.`
                );
            }
        } catch (er) {
            console.error(er);
            return `<!-- ${er} -->`;
        }

        return `
        <section data-component="stories-carousel" data-unique-id="${uniqueClass}">
            <div class="${containerClasses({width: 'large'})}">
                ${headingData ? 
                LinkedHeading(headingData)
                : '' }
                ${Carousel({ variant:"cards", slides: cardData.join(''), uniqueClass: uniqueClass })}
            </div>
            ${cardModal.join('')}
        </section>
        `;
    }
};