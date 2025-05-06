import subtopicsSubnavTemplate from './subtopics-subnav.hbs';

/**
 * Generates HTML markup for a subnavigation bar based on a list of navigation items.
 *
 * @param {Object} params - Parameters for the subnav component.
 * @param {Array<{ asset_name: string, asset_url: string }>} params.navigation - An array of navigation link items.
 * @returns {string} - HTML string representing the subnavigation structure.
 */
function Subnav({ navigation }) {
    let liClass =
      "scrollable-list__item su-mb-0 su-relative after:su-h-22 after:su-w-[1px] after:su-bg-black-60 after:su-mx-12 lg:after:su-mx-18";
    const aClass =
      "su-text-inherit su-text-black su-font-semi-bold su-text-16 lg:su-text-18 lg:su-leading-[21.6px] su-no-underline hover:su-underline dark:su-text-white hover:su-text-digital-red dark:hover:su-text-dark-mode-red";
    if(!navigation || navigation.length === 0){
        return null;
    }
    const cleanedNavigation = navigation.filter(item => item.asset_url !== "");

    return `
        <div class="scrollable-list su-w-full md:su-justify-center su-flex su-nowrap su-mt-15 md:su-mt-26 lg:su-mt-19">
            <ul class="scrollable-list__items su-w-[calc(100%+40px)] md:su-w-auto su-flex md:su-justify-center su-mb-0 su-whitespace-nowrap su-flex-nowrap md:su-flex-wrap su-overflow-x-scroll md:su-overflow-visible su-list-none su-mx-[-20px] md:su-mr-0 su-px-20 su-mb-0 su-pb-12 lg:su-pb-0">
            ${cleanedNavigation.map((item, i, row) => {
                const title = item.asset_name;
    
                if (i + 1 === row.length) {
                    // Last one.
                    liClass = "su-relative su-mb-0";
                }
                if(item.asset_url === ""){
                    return "";
                }
                return `
                <li class="${liClass}">
                    <a class="${aClass}" href="${item.asset_url}">
                    ${title}
                    </a>
                </li>
                `;
            }).join("")}
            </ul>
        </div>
    `;
}

/**
 * A module for rendering a subtopics subnav component using Handlebars and front end js
 * @module SubtopicsSubnav
 * @param {Object} args - Configuration data for the Subtopics Subnav component.
 * @param {string} [args.title] - The title of the Subtopics Subnav.
 * @param {string} [args.parent] - The parent asset of the Subtopics Subnav.
 */

export default {
    /**
     * Main function to render the Subtopics Subnav component.
     *
     * @async
     * @function
     * @param {Object} args - Unused arguments object (reserved for future use).
     * @param {Object} info - Contextual and environmental data for rendering.
     * @param {Object} [info.ctx] - Context data, typically containing asset-related identifiers.
     * @param {string} [info.ctx.assetId] - The current asset ID used to fetch subnavigation data.
     * @param {Object} [info.env] - Environment configuration, typically containing base URLs and other globals.
     * @param {string} [info.env.BASE_DOMAIN] - The base domain used to construct the fetch URL.
     * @param {Object} [info.set.environment] - Fallback environment configuration if `info.env` is missing.
     * @returns {Promise<string>} The rendered HTML string for the subtopics subnav or an HTML comment on error.
     */
    async main(args, info) {
        const fnsCtx = info?.ctx ||  {};
        // Extracting environment variables from provided info
        const { BASE_DOMAIN } = info?.env || info?.set?.environment || {};

        //const currentAssetId = fnsCtx?.assetId || "169719";
        const currentAssetId = fnsCtx?.assetId;

        // Validate required fields and ensure correct data types
        try {
            if (typeof BASE_DOMAIN !== 'string' || BASE_DOMAIN === '') {
                throw new Error(
                    `The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The ${JSON.stringify(BASE_DOMAIN)} was received.`
                );
            }
            if (typeof fnsCtx !== 'object' || typeof currentAssetId !== 'string' || currentAssetId.trim() === '') {
                throw new Error(
                    `The "info.fns.assetId" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(currentAssetId)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Subtopics Subnav component: ', er);
            return `<!-- Error occurred in the Subtopics Subnav component: ${er.message} -->`;
        }

        const res = await fetch(`${BASE_DOMAIN}_api/mx/subtopicsubnav?edge=true&topic=${currentAssetId}&gfbg=gbg`);
        const subnavData = await res.json();

        if (!subnavData || typeof subnavData !== 'object') {
            return `<!-- Asset ${currentAssetId} is not a topic page -->`;
        }

        const { title = null, parent = null, isTopLevel = false, topicId, children = null} = subnavData;

        // Prepare component data for template rendering
        const componentData = {
            width: 'large',
            title,
            parent,
            topicId,
            subNav: Subnav({ navigation: children }),
            isTopLevel: `${isTopLevel}`,
            showTopLevel: isTopLevel !== null && isTopLevel !== undefined
        };

        return subtopicsSubnavTemplate(componentData);
    }
};
