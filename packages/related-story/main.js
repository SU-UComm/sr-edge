import relatedStory from './related-story.hbs';
import { cardDataAdapter, matrixCardService } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Related story component that fetches and renders related story content.
 */
export default {
    /**
     * Main function to render the related story component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.contentConfiguration - Content configuration object.
     * @param {string} args.contentConfiguration.story - The story identifier.
     * @param {string} [args.contentConfiguration.descriptionOverride] - Optional override for description.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.env - Environment settings.
     * @param {string} info.env.API_IDENTIFIER - API identifier for requests.
     * @param {string} info.env.BASE_DOMAIN - Base domain URL.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered story HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // Extracting environment variables
        const { API_IDENTIFIER, BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        // CHANGE: change const to let for mutability
        let { story, descriptionOverride } = args && args?.contentConfiguration || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values for inline editable fields
            descriptionOverride = descriptionOverride || '';
            
            // Provide default values for other required fields
            story = story || 'matrix-asset://api-identifier/163459';
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "description": { "field": "contentConfiguration.descriptionOverride" }
            };
        }

        // Validate required functions and environment - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
                console.error('Error occurred in the Related story component: ', er);
                return `<!-- Error occurred in the Related story component: ${er.message} -->`;
            }
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof story !== 'string' || story === '') {
                    throw new Error(
                        `The "story" field must be a string. The ${JSON.stringify(story)} was received.`,
                    );

                }
                if (descriptionOverride && typeof descriptionOverride !== 'string') {
                    throw new Error(
                        `The "descriptionOverride" field must be a string. The ${JSON.stringify(descriptionOverride)} was received.`,
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Related story component: ', er);
                return `<!-- Error occurred in the Related story component: ${er.message} -->`;
            }
        }

        // Initialize card adapter and service
        const adapter = new cardDataAdapter();
        let data = null;

        // Set our card service
        const service = new matrixCardService({ BASE_DOMAIN, API_IDENTIFIER });
        adapter.setCardService(service);

        // Fetch story data with error handling
        try {
            data = await adapter.getCards([{ cardAsset: story }]);
        } catch (er) {
            // NEW: In edit mode, provide mock data instead of returning error
            if (squizEdit) {
                data = [{
                    title: 'Sample Related Story Title',
                    description: 'This is a sample description from the API that would normally be fetched.',
                    liveUrl: 'https://example.com',
                    imageUrl: 'https://picsum.photos/200/200',
                    imageAlt: 'Sample related story image'
                }];
            } 
        }

        // Validate fetched data - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
                if (typeof data !== 'object' || data === null) {
                    throw new Error(
                        `The data cannot be undefined or null. The ${JSON.stringify(data)} was received.`
                    );
                }
            } catch (er) {
                console.error('Error occurred in the Related story content component: ', er);
                return `<!-- Error occurred in the Related story content component: ${er.message} -->`;
            }
        }
        
        let { title, description, liveUrl, imageUrl, imageAlt } = data[0]

        // Prepare template data
        const componentData = {
            width: "narrow",
            liveUrl,
            imageUrl,
            imageAlt,
            title,
            description: descriptionOverride ? descriptionOverride : description || "",
        };

        // NEW: Early return pattern
        if (!squizEdit) return relatedStory(componentData);

        // NEW: Process for edit mode
        return processEditor(relatedStory(componentData), squizEditTargets);
    }
};