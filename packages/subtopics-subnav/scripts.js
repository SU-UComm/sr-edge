/**
 * Globals variables 
 * @constant {string} SUBTOPIC_SUBNAV_SELECTOR - Selector for subtopic subnav elements.
 * @constant {string} SUBTOPIC_SUBNAV_LIST_SELECTOR - Selector for subtopic subnav list container.
 */

export const SUBTOPIC_SUBNAV_SELECTOR = 'section[data-component="subtopic-subnav-component"]';
export const SUBTOPIC_SUBNAV_LIST_SELECTOR = 'div[data-list="subnav"]';


/**
 * Removes duplicate topics from an array based on the `taxonomyFeaturedUnitText` property.
 *
 * @param {Array<Object>} arr - The array of topic objects to deduplicate.
 * @returns {Array<Object>} A new array with duplicates removed.
 */
export function removeDuplicates(arr) {
    return arr.filter(
        (obj, index) =>
            index ===
            arr.findIndex(
            (topic) =>
                topic.taxonomyFeaturedUnitText?.[0] ===
                obj.taxonomyFeaturedUnitText?.[0]
            )
    );
  }

/**
 * Formats an array of topic objects into a simplified navigation structure.
 *
 * @param {Array<Object>} topics - An array of topic objects to format.
 * @returns {Promise<Array<{ asset_name: string, asset_url: string }>|null>} 
 * A promise that resolves to an array of formatted navigation items, or null if input is empty.
 */
export const topicFormatter = async (topics) => {
    if (!topics || topics.length === 0) {
        return null;
    }
    // Remove all duplicates
    const uniqueTopics = removeDuplicates(topics);
    const formatted = [];
    
    uniqueTopics.forEach((obj) => {
        const dataset = obj;
        if (dataset && dataset.taxonomyFeaturedUnitText?.[0]) {
            formatted.push({
                asset_name: dataset.taxonomyFeaturedUnitText?.[0],
                asset_url: dataset.taxonomyFeaturedUnitLandingPageUrl?.[0] || "",
            });
        }
    });

    return formatted;
};

/**
 * Generates HTML markup for a subnavigation bar based on a list of navigation items.
 *
 * @param {Object} params - Parameters for the subnav component.
 * @param {Array<{ asset_name: string, asset_url: string }>} params.navigation - An array of navigation link items.
 * @returns {string} - HTML string representing the subnavigation structure.
 */
export function Subnav({ navigation }) {
    let liClass =
      "scrollable-list__item su-mb-0 su-relative after:su-h-22 after:su-w-[1px] after:su-bg-black-60 after:su-mx-12 lg:after:su-mx-18";
    const aClass =
      "su-text-inherit su-text-black su-font-semi-bold su-text-16 lg:su-text-18 lg:su-leading-[21.6px] su-no-underline hover:su-underline dark:su-text-white hover:su-text-digital-red dark:hover:su-text-dark-mode-red";
    
    return `
        <div className="scrollable-list su-w-full md:su-justify-center su-flex su-nowrap su-mt-15 md:su-mt-26 lg:su-mt-19">
            <ul className="scrollable-list__items su-w-[calc(100%+40px)] md:su-w-auto su-flex md:su-justify-center su-mb-0 su-whitespace-nowrap su-flex-nowrap md:su-flex-wrap su-overflow-x-scroll md:su-overflow-visible su-list-none su-mx-[-20px] md:su-mr-0 su-px-20 su-mb-0 su-pb-12 lg:su-pb-0">
            ${navigation.map((item, i, row) => {
                const title = item.asset_name;
    
                if (i + 1 === row.length) {
                    // Last one.
                    liClass = "su-relative su-mb-0";
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
 * Initializes the subtopic subnavigation component by setting up an event listener
 * that responds to the "topicLoader" event and renders the subnav.
 *
 * @param {HTMLElement} section - The section element containing the subnav list wrapper.
 */
export function _init(section) {
    const listWrapper = section.querySelector(SUBTOPIC_SUBNAV_LIST_SELECTOR);

    if (!listWrapper) {
        return;
    }

    document.addEventListener(
        "topicLoader",
        async (evt) => {
            // set topic state
            if (evt.detail) {
                const newTopics = await topicFormatter(evt.detail.cards);    

                listWrapper.innerHTML = Subnav({ navigation: newTopics });
            }
        },
        false
    );
}


/**
 * Initializes all subtopic subnav components on DOMContentLoaded by selecting
 * all matching elements and running `_init` on each.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(SUBTOPIC_SUBNAV_SELECTOR).forEach(section => {
        _init(section);
    });
});
