import fbFetcher from "./scripts/fbFetcher";
import { getCookie } from "../../global/js/utils/getCookie";

/**
 * Constants for DOM selectors.
 * @constant {Object} SELECTORS
 */
const SELECTORS = {
    WRAPPER: '[data-role="link-list-wrapper"]',
    TOGGLE: '[data-role="link-drawer-toggle"]',
    DRAWER: '[data-role="link-drawer"]',
};

/**
 * Constants for CSS class names.
 * @constant {Object} CLASS_NAMES
 */
const CLASS_NAMES = {
    ACTIVE: "su-rotate-90",
    INACTIVE: "su-rotate-[-90deg]",
    OPEN: "su-h-auto",
    CLOSED: "su-h-0",
    VISIBLE: "su-opacity-[1]",
    HIDDEN: "su-opacity-[0]",
    NO_STORIES: "su-link-list-no-stories",
};

/**
 * Toggles the link list drawer visibility.
 */
export function toggleDrawer(linkListToggle, linkList) {
    const isActive = linkListToggle?.dataset?.active === "true";
    if (!isActive) {
        linkListToggle.dataset.active = true;
        linkListToggle.classList.remove(CLASS_NAMES.INACTIVE);
        linkListToggle.classList.add(CLASS_NAMES.ACTIVE);
        linkList.classList.remove(CLASS_NAMES.CLOSED);
        linkList.classList.add(CLASS_NAMES.OPEN);
        return;
    }

    linkListToggle.dataset.active = false;
    linkListToggle.classList.add(CLASS_NAMES.INACTIVE);
    linkListToggle.classList.remove(CLASS_NAMES.ACTIVE);
    linkList.classList.add(CLASS_NAMES.CLOSED);
    linkList.classList.remove(CLASS_NAMES.OPEN);

}

/**
 * Handles the scroll event to show or hide the link list wrapper.
 */
export function handleScroll(linkListWrapper) {
    const bodyHeight = document.body.getBoundingClientRect().height;
    const scrollHeight = window.scrollY + window.innerHeight;

    if (
        window.scrollY >= Math.round((30 / 100) * document.body.clientHeight) &&
        scrollHeight <= bodyHeight - 700
    ) {
        linkListWrapper.classList.remove(CLASS_NAMES.HIDDEN);
        linkListWrapper.classList.remove("su-bottom-[-100px]");
        linkListWrapper.classList.add(CLASS_NAMES.VISIBLE);
        linkListWrapper.classList.add("su-bottom-0");
        return;
    }

    linkListWrapper.classList.remove(CLASS_NAMES.VISIBLE);
    linkListWrapper.classList.add("su-bottom-[-100px]");
    linkListWrapper.classList.add(CLASS_NAMES.HIDDEN);
    linkListWrapper.classList.remove("su-bottom-0");

}

/**
 * Creates a link item as an HTML string.
 * @param {string} title - The title of the link.
 * @param {string} url - The URL of the link.
 * @returns {string} HTML string representing the link item.
 */
export function createLinkItem(title, url) {
    return `
        <a href="${url}" class="su-no-underline hocus:su-underline">
            <h3 class="su-text-16 su-font-bold su-m-0 lg:su-text-24 lg:su-leading-[28.8px]">
                ${title}
            </h3>
        </a>
    `;
}

/**
 * Renders the link items in the UI.
 * @param {string[]} linkItems - Array of link item HTML strings.
 */
export function renderContent(linkItems, linkListWrapper, linkList) {
    if (!linkItems.length) {
        linkListWrapper.classList.add(CLASS_NAMES.NO_STORIES);
        return;
    }

    const [first, second, third] = linkItems;

    linkList.innerHTML = `
        ${first ? `<article class="su-border-b su-border-b-black-20 dark:su-border-b-black-70 su-pb-15 su-mt-[23.65px] lg:su-pb-36">${first}</article>` : ''}
        ${second ? `<article class="su-border-b dark:su-border-b-black-70 su-border-b-black-20 su-py-15 lg:su-py-36">${second}</article>` : ''}
        ${third ? `<article class="su-pt-15 lg:su-pt-36">${third}</article>` : ''}
    `;

    linkListWrapper.classList.remove(CLASS_NAMES.NO_STORIES);
}

/**
 * Fetches and renders link data from the Funnelback API.
 * @param {Object} pageData - Page data from the window object.
 * @param {Object|null} behaviouralData - Behavioural data from topics query.
 */
export async function fetchAndRenderLinks(pageData, behaviouralData, linkListWrapper, linkListToggle, linkList, audienceCookie) {
    const fbData = await fbFetcher(pageData, audienceCookie, behaviouralData);
    const linkItems = fbData.map(({ title, indexUrl }) => createLinkItem(title, indexUrl));

    renderContent(linkItems, linkListWrapper, linkList);
    attachEventListeners(linkListWrapper, linkListToggle, linkList);
}

/**
 * Attaches event listeners for link list interactions.
 */
export function attachEventListeners(linkListWrapper, linkListToggle, linkList) {
    linkListToggle.addEventListener("click", function() {
        toggleDrawer(linkListToggle, linkList)
    });
    window.addEventListener("scroll", function() {
        handleScroll(linkListWrapper)
    });
}

/**
 * Initializes the link list functionality when the DOM is loaded.
 */
export function _initialize(linkListWrapper, linkListToggle, linkList, audienceCookie) {
    if (!linkListWrapper || !window.pageController) return;

    const pageData = window.pageController;
    const behaviouralData = pageData.topicsQuery ? pageData.topicsQuery() : null;

    fetchAndRenderLinks(pageData, behaviouralData, linkListWrapper, linkListToggle, linkList, audienceCookie);
}

/**
 * Initializes Link list when the DOM content is fully loaded.
 *
 * @listens DOMContentLoaded
 */

document.addEventListener('DOMContentLoaded', function () {
    const linkListWrapper = document.querySelector(SELECTORS.WRAPPER);
    const linkListToggle = document.querySelector(SELECTORS.TOGGLE);
    const linkList = document.querySelector(SELECTORS.DRAWER);
    const audienceCookie = getCookie("preferences_personalisation");

    _initialize(linkListWrapper, linkListToggle, linkList, audienceCookie);
});
