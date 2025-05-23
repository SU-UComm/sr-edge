import { cardDataAdapter, funnelbackCardService, matrixCardService, eventCardService, linkedHeadingService, basicAssetUri, uuid, isRealExternalLink } from "../../global/js/utils";
import { EventStartEndDate } from '../../global/js/helpers';
import combinedContentGridTemplate from './combined-content-grid.hbs';

/**
 * Combined Content Grid component that renders Stories, Events and Announcements within the grid
 * @module CombinedContentGrid
 */
export default {
    /**
     * Renders the Combined Content Grid component.
     * 
     * @async
     * @function
     * @param {Object} args - Configuration options for the section.
     * @param {Object} [args.sectionConfiguration] - Configuration settings for the section, including heading, background image, and spacing.
     * @param {string} [args.sectionConfiguration.title] - The heading for the section, appearing above the video cards. If empty, the heading and CTA link will be hidden.
     * @param {string} [args.sectionConfiguration.ctaText] - The text for the call-to-action (CTA) link displayed in the section header.
     * @param {string} [args.sectionConfiguration.ctaUrl] - The URL of a Matrix asset/page to link to in the CTA.
     * @param {string} [args.sectionConfiguration.ctaManualUrl] - A manually entered external URL for the CTA. If provided, this overrides `ctaUrl`.
     * @param {string} [args.sectionConfiguration.bgImage] - The Matrix asset URI of a background image for the section. A dark overlay is applied.
     * @param {string} [args.sectionConfiguration.marginTop] - The top margin spacing for the section. Options range from "base" (smallest) to "10" (largest) or "default" for site-wide spacing.
     * @param {string} [args.sectionConfiguration.marginBottom] - The bottom margin spacing for the section. Options range from "base" (smallest) to "10" (largest) or "default" for site-wide spacing.
     * @param {Array<Object>} [args.videos] - An array of video card configurations (1-3 items).
     * @param {string} [args.videos[].heading] - The main heading for the video card.
     * @param {string} [args.videos[].subheading] - A smaller text displayed below the video card heading.
     * @param {string} [args.videos[].videoImage] - The Matrix asset URI of an image used as the video preview (9x16 aspect ratio).
     * @param {string} [args.videos[].youtubeId] - The YouTube video ID for embedding the video.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @param {Object} info.env - Environment variables in the execution context.
     * @param {string} [info.env.FB_JSON_URL] - Funnelback JSON API URL.
     * @param {string} [info.env.API_IDENTIFIER] - API indentifier.
     * @param {string} [info.env.BASE_DOMAIN] - Base domain.
     * @returns {Promise<string>} The rendered two column text callout HTML or an error message.
    */
    async main(args, info) {
        // Extracting environment variables and functions from provided info
        const { FB_JSON_URL, API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};
        const fnsCtx = info?.fns || info?.ctx || {};

        // Extracting configuration data from arguments
        const { source, searchQuery, cards, featuredDescription } = args?.contentConfiguration || {};
        const { displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};
        const { headingConfiguration, eventsConfiguration, announcementsConfiguration } = args || {};

        // Validate required environment variables
        try {
            if (typeof FB_JSON_URL !== 'string' || FB_JSON_URL === '') {
                throw new Error(
                    `The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(FB_JSON_URL)} was received.`
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
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Combined Content Grid component: ', er);
            return `<!-- Error occurred in the Combined Content Grid component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (!['Search', 'Select'].includes(source) ) {
                throw new Error(
                    `The "source" field cannot be undefined and must be one of ["Search", "Select"]. The ${JSON.stringify(source)} was received.`
                );
            }
            if (source === 'Search' && (typeof searchQuery !== 'string' || searchQuery === '' || searchQuery === '?')) {
                throw new Error(
                    `The "searchQuery" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(searchQuery)} was received.`
                );
            }
            if (source === 'Select' && typeof cards !== 'object') {
                throw new Error(
                    `The "cards" field must be an array. The ${JSON.stringify(cards)} was received.`
                );
            }
            if (source === 'Select' && featuredDescription && typeof featuredDescription !== 'string') {
                throw new Error(
                    `The "featuredDescription" field must be a string. The ${JSON.stringify(featuredDescription)} was received.`
                );
            }
            if (displayThumbnails && typeof displayThumbnails !== 'boolean') {
                throw new Error(
                    `The "displayThumbnails" field must be a boolean. The ${JSON.stringify(displayThumbnails)} was received.`
                );
            }
            if (displayDescriptions && typeof displayDescriptions !== 'boolean') {
                throw new Error(
                    `The "displayDescriptions" field must be a boolean. The ${JSON.stringify(displayDescriptions)} was received.`
                );
            }
            if (headingConfiguration?.title && typeof headingConfiguration.title !== 'string') {
                throw new Error(
                    `The "headingConfiguration.title" field must be a string. The ${JSON.stringify(headingConfiguration.title)} was received.`
                );
            }
            if (headingConfiguration?.ctaUrl && typeof headingConfiguration.ctaUrl !== 'string') {
                throw new Error(
                    `The "headingConfiguration.ctaUrl" field must be a string. The ${JSON.stringify(headingConfiguration.ctaUrl)} was received.`
                );
            }
            if (headingConfiguration?.ctaManualUrl && typeof headingConfiguration.ctaManualUrl !== 'string') {
                throw new Error(
                    `The "headingConfiguration.ctaManualUrl" field must be a string. The ${JSON.stringify(headingConfiguration.ctaManualUrl)} was received.`
                );
            }
            if (headingConfiguration?.ctaText && typeof headingConfiguration.ctaText !== 'string') {
                throw new Error(
                    `The "headingConfiguration.ctaText" field must be a string. The ${JSON.stringify(headingConfiguration.ctaText)} was received.`
                );
            }
            if (headingConfiguration?.ctaNewWindow && typeof headingConfiguration.ctaNewWindow !== 'boolean') {
                throw new Error(
                    `The "headingConfiguration.ctaNewWindow" field must be a boolean. The ${JSON.stringify(headingConfiguration.ctaNewWindow)} was received.`
                );
            }
            if (eventsConfiguration?.heading && typeof eventsConfiguration.heading !== 'string') {
                throw new Error(
                    `The "eventsConfiguration.heading" field must be a string. The ${JSON.stringify(eventsConfiguration.heading)} was received.`
                );
            }
            if (eventsConfiguration?.endPoint && typeof eventsConfiguration.endPoint !== 'string') {
                throw new Error(
                    `The "eventsConfiguration.endPoint" field must be a string. The ${JSON.stringify(eventsConfiguration.endPoint)} was received.`
                );
            }
            if (eventsConfiguration?.numberOfItems && typeof eventsConfiguration.numberOfItems !== 'number' || ![3, 4, 5, 6].includes(eventsConfiguration.numberOfItems)) {
                throw new Error(
                    `The "eventsConfiguration.numberOfItems" field cannot be undefined and must be a number one of [3, 4, 5, 6]. The ${JSON.stringify(eventsConfiguration.numberOfItems)} was received.`
                );
            }
            if (eventsConfiguration?.linkUrl && typeof eventsConfiguration.linkUrl !== 'string') {
                throw new Error(
                    `The "eventsConfiguration.linkUrl" field must be a string. The ${JSON.stringify(eventsConfiguration.linkUrl)} was received.`
                );
            }
            if (announcementsConfiguration?.heading && typeof announcementsConfiguration.heading !== 'string') {
                throw new Error(
                    `The "announcementsConfiguration.heading" field must be a string. The ${JSON.stringify(announcementsConfiguration.heading)} was received.`
                );
            }
            if (announcementsConfiguration?.endPoint && typeof announcementsConfiguration.endPoint !== 'string') {
                throw new Error(
                    `The "announcementsConfiguration.endPoint" field must be a string. The ${JSON.stringify(announcementsConfiguration.endPoint)} was received.`
                );
            }
            if (announcementsConfiguration?.numberOfItems && typeof announcementsConfiguration.numberOfItems !== 'number' || ![3, 4, 5, 6].includes(announcementsConfiguration.numberOfItems)) {
                throw new Error(
                    `The "announcementsConfiguration.numberOfItems" field cannot be undefined and must be a number one of [3, 4, 5, 6]. The ${JSON.stringify(announcementsConfiguration.numberOfItems)} was received.`
                );
            }
            if (announcementsConfiguration?.linkUrl && typeof announcementsConfiguration.linkUrl !== 'string') {
                throw new Error(
                    `The "announcementsConfiguration.linkUrl" field must be a string. The ${JSON.stringify(announcementsConfiguration.linkUrl)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Combined Content Grid component: ', er);
            return `<!-- Error occurred in the Combined Content Grid component: ${er.message} -->`;
        }

        const adapter = new cardDataAdapter();

        let data = null;
        let eventData = null;
        let announcementData = null;
        const modalData = [];

        // Determine data source: "Search" (fetching from Funnelback) or "Select" (Matrix API)
        if (source.toLowerCase() === "search") {
            // Compose and fetch the FB search results
            const service = new funnelbackCardService({ FB_JSON_URL, query: searchQuery });

            // Set our card service
            adapter.setCardService(service);

            // Get the cards data
            try {
                data = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch FB cards data. ', er);
                return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch FB cards data. ${er.message} -->`;
            }
        } else if (source.toLowerCase() === "select") {
            // Create our service
            const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });

            // Set our card service
            adapter.setCardService(service);

            // Get the cards data
            try {
                data = await adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch Matrix cards data. ', er);
                return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch Matrix cards data. ${er.message} -->`;
            }
        }

        // Resolve the URI for the section heading link
        const headingData = await linkedHeadingService(
            fnsCtx,
            headingConfiguration
        );

        if (eventsConfiguration?.endPoint) {
            let events = null

            // Create our service
            const service = new eventCardService({ api: eventsConfiguration.endPoint });

            // Set our card service
            adapter.setCardService(service);

            // Get the event cards data
            try {
                events = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch event cards data. ', er);
                return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch event cards data. ${er.message} -->`;
            }

            const eventsCards = events.map((item) => {
                const uniqueID = uuid();

                item.isRealExternalLink = isRealExternalLink(item.liveUrl);
                item.eventStartEndDate = EventStartEndDate({start: item.date, end: item.endDate});
                item.uniqueID = uniqueID;
                item.imageAlt = item.videoUrl ? `Open video ${item.imageAlt} in a modal` : item.imageAlt;
                item.iconType = item.type?.toLowerCase();


                if (item.type === 'Video' || item.videoUrl) {
                    modalData.push(
                        {
                            isVertical: item.size === "vertical-video",
                            videoId: item.videoUrl,
                            title: `Watch ${item.title}`, 
                            noAutoPlay: true,
                            classes: '',
                            uniqueID: uniqueID,
                            titleID: 'card-modal'
                        }
                    );
                }

                return item;
            }).slice(0, eventsConfiguration.numberOfItems);

            eventData = {
                title: eventsConfiguration.heading, 
                headingLvl: headingData?.title ? 'h3' : 'h2',
                ctaText: "See all events",
                ctaUrl: eventsConfiguration.linkUrl,
                ctaIcon: isRealExternalLink(eventsConfiguration.linkUrl) ? "external arrow" : "chevron right",
                icon: "eventscalendar",
                data: eventsCards,
                
            }  

        }

        if (announcementsConfiguration?.endPoint) {
            let announcements = null;
            // Create our service
            const service = new funnelbackCardService({ FB_JSON_URL, query: announcementsConfiguration.endPoint });

            // Set our card service
            adapter.setCardService(service);

             // Get the announcements cards data
             try {
                announcements = await adapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch announcements cards data. ', er);
                return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch announcements cards data. ${er.message} -->`;
            }

            const announcementsCards = announcements.map((item) => {
                item.isRealExternalLink = isRealExternalLink(item.liveUrl);
                return item;
            }).slice(0, announcementsConfiguration.numberOfItems);

            announcementData = {
                title: announcementsConfiguration.heading,
                ctaText: "See all announcements",
                headingLvl: headingData?.title ? 'h3' : 'h2',
                icon: "announcements",
                data: announcementsCards,
            }

            if (announcementsConfiguration.linkUrl && announcementsConfiguration.linkUrl !== "") {
                const announcementPageData = await basicAssetUri(
                    fnsCtx,
                    announcementsConfiguration.linkUrl
                );
    
                announcementData.ctaUrl = announcementPageData.url;
                announcementData.ctaIcon = isRealExternalLink(announcementPageData.url) ? "external arrow" : "chevron right";
            }
        }

        // Prepare supplementary cards
        const cardData = data.map((card, idx) => {
            const uniqueID = uuid();
            // Prepare common card data
            card.uniqueID = uniqueID;
            card.cardSize = idx === 0 ? "featured" : "small";
            card.iconType = card.type.toLowerCase();
            card.displayThumbnail = idx === 0 ? true : displayThumbnails;
            card.displayDescription = displayDescriptions;
            card.description = idx === 0 ? featuredDescription ? featuredDescription : card.description : card.description;
            card.headingLvl = headingData?.title ? 'h3' : 'h2';

            // Generate modals for video cards
            if (card.type === 'Video' || card.videoUrl) {
                modalData.push(
                    {
                        isVertical: card.size === "vertical-video",
                        videoId: card.videoUrl,
                        title: `Watch ${card.title}`, 
                        noAutoPlay: true,
                        classes: '',
                        uniqueID: uniqueID,
                        titleID: 'card-modal'
                    }
                );
            }

            return card
        }).slice(0, 3);

        // Prepare component data for template rendering
        const componentData = {
            headingData,
            cardData,
            modalData,
            eventData,
            announcementData,
        };

        return combinedContentGridTemplate(componentData);
    }
};
