import { cardDataAdapter, funnelbackCardService, matrixCardService, eventCardService, linkedHeadingService, basicAssetUri, uuid, isRealExternalLink } from "../../global/js/utils";
import { EventStartEndDate } from '../../global/js/helpers';
import { processEditor } from '../../global/js/utils/processEditor';
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
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {};

        // CHANGE: change const to let so we can modify later for squizEdit default values
        let { source, searchQuery, cards, featuredDescription } = args?.contentConfiguration || {};
        let { displayThumbnails, displayDescriptions } = args?.displayConfiguration || {};
        let { headingConfiguration, eventsConfiguration, announcementsConfiguration } = args || {};

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = true || componentContext?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;
        
        // NEW: add defaults if squizEdit is true
        if (squizEdit) {
            // Provide default configurations if not present
            headingConfiguration = headingConfiguration || {};
            eventsConfiguration = eventsConfiguration || {};
            announcementsConfiguration = announcementsConfiguration || {};
            cards = cards || [];
            // Add default values for inline editable fields
            headingConfiguration.title = headingConfiguration.title || 'Featured Content';
            headingConfiguration.ctaText = headingConfiguration.ctaText || 'View all';
            headingConfiguration.ctaUrl = headingConfiguration.ctaUrl || 'matrix-asset://StanfordNews/29389';
            headingConfiguration.ctaNewWindow = headingConfiguration.ctaNewWindow || false;

            eventsConfiguration.heading = eventsConfiguration.heading || 'Upcoming events';
            announcementsConfiguration.heading = announcementsConfiguration.heading || 'Announcements';
            announcementsConfiguration.linkUrl = announcementsConfiguration.linkUrl || 'matrix-asset://StanfordNews/29389';
            // Add default for featured description if using Select mode
            if (source === 'Select') {
                featuredDescription = featuredDescription || 'Featured content description goes here.';
            }
            
            // Provide default content configuration
            source = source || 'Search';
            searchQuery = searchQuery || '?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!null&sort=date&meta_isTeaser_not=true';
            
            // Provide default display configuration
            displayThumbnails = displayThumbnails !== undefined ? displayThumbnails : true;
            displayDescriptions = displayDescriptions !== undefined ? displayDescriptions : false;
            
            // Provide default events and announcements configuration
            eventsConfiguration.endPoint = eventsConfiguration.endPoint || 'https://events.stanford.edu/api/2/events?days=365&sponsored=true';
            eventsConfiguration.numberOfItems = eventsConfiguration.numberOfItems || 3;
            eventsConfiguration.linkUrl = eventsConfiguration.linkUrl || 'https://events.stanford.edu';
            
            announcementsConfiguration.endPoint = announcementsConfiguration.endPoint || '?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!null&sort=date&meta_taxonomyAudienceText=External&meta_taxonomyContentTypeText=Announcement&num_ranks=3';
            announcementsConfiguration.numberOfItems = announcementsConfiguration.numberOfItems || 3;
            
            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            squizEditTargets = {
                "headingTitle": {
                    "field": "headingConfiguration.title"
                },
                "headingCtaText": {
                    "field": "headingConfiguration.ctaText"
                },
                "sidebarTitle-events": {
                    "field": "eventsConfiguration.heading"
                },
                "sidebarTitle-announcements": {
                    "field": "announcementsConfiguration.heading"
                }
            };
            
            // Add featured description target if using Select mode
            if (source === 'Select') {
                squizEditTargets["description"] = {
                    "field": "contentConfiguration.featuredDescription"
                };
            }
        }

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

        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check
        if (!squizEdit) {
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
        }

        const adapter = new cardDataAdapter();

        let dataPromise = null;
        let eventDataPromise = null;
        let announcementDataPromise = null;
        let announcementPageDataPromise = null;
        const modalData = [];

        // Determine data source: "Search" (fetching from Funnelback) or "Select" (Matrix API)
        if (source.toLowerCase() === "search") {
            // Compose and fetch the FB search results
            const service = new funnelbackCardService({ FB_JSON_URL, query: searchQuery });

            // Set our card service
            adapter.setCardService(service);

            // Get the cards data
            try {
                dataPromise = adapter.getCards();
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
                dataPromise = adapter.getCards(cards);
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch Matrix cards data. ', er);
                return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch Matrix cards data. ${er.message} -->`;
            }
        }

        // Start heading service promise
        const headingDataPromise = linkedHeadingService(
            fnsCtx,
            headingConfiguration
        );

        // Start events data fetching if configured
        if (eventsConfiguration?.endPoint) {
            // Create our service
            const eventService = new eventCardService({ api: eventsConfiguration.endPoint });
            const eventAdapter = new cardDataAdapter();

            // Set our card service
            eventAdapter.setCardService(eventService);

            // Get the event cards data
            try {
                eventDataPromise = eventAdapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch event cards data. ', er);
                if (!squizEdit) {
                    return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch event cards data. ${er.message} -->`;
                }
                eventDataPromise = Promise.resolve([]);
            }
        }

        // Start announcements data fetching if configured
        if (announcementsConfiguration?.endPoint) {
            // Create our service
            const announcementService = new funnelbackCardService({ FB_JSON_URL, query: announcementsConfiguration.endPoint });
            const announcementAdapter = new cardDataAdapter();

            // Set our card service
            announcementAdapter.setCardService(announcementService);

             // Get the announcements cards data
             try {
                announcementDataPromise = announcementAdapter.getCards();
            } catch (er) {
                console.error('Error occurred in the Combined Content Grid component: Failed to fetch announcements cards data. ', er);
                return `<!-- Error occurred in the Combined Content Grid component: Failed to fetch announcements cards data. ${er.message} -->`;
            }

            // Start announcements page data fetching if configured
            if (announcementsConfiguration.linkUrl && announcementsConfiguration.linkUrl !== "") {
                announcementPageDataPromise = basicAssetUri(
                    fnsCtx,
                    announcementsConfiguration.linkUrl
                );
            }
        }

        // Wait for all promises to resolve in parallel
        const promises = [dataPromise, headingDataPromise];
        if (eventDataPromise) promises.push(eventDataPromise);
        if (announcementDataPromise) promises.push(announcementDataPromise);
        if (announcementPageDataPromise) promises.push(announcementPageDataPromise);

        const results = await Promise.all(promises);

        // if ( results ) return JSON.stringify(results[2]);

        // Extract results
        const data = results[0];
        const headingData = results[1];
        let events = null;
        let announcements = null;
        let announcementPageData = null;
        
        let resultIndex = 2;
        if (eventDataPromise) {
            events = results[resultIndex++];
        }
        if (announcementDataPromise) {
            announcements = results[resultIndex++];
        }
        if (announcementPageDataPromise) {
            announcementPageData = results[resultIndex++];
        }

        // Process events data
        let eventData = null;
        if (eventsConfiguration?.endPoint && events) {
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

        // Process announcements data
        let announcementData = null;
        if (announcementsConfiguration?.endPoint && announcements) {
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

            if (announcementPageData) {
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

        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) return combinedContentGridTemplate(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processEditor(combinedContentGridTemplate(componentData), squizEditTargets);
    }
};
