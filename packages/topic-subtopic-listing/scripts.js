// import { formatCardDataFunnelback } from "../../global/js/utils/formatCardDataFunnelback";
// import { pagination } from "../../global/js/helpers/pagination";
// import { Card } from "../../global/js/helpers/Card/horizontalCard";

export const TOPICS_SUBTOPICS_SELECTOR = 'section[data-component="topic-subtopic-listing"]';
export const TOPICS_LIST_SELECTOR = '[data-element="topics-list"]';
export const PAGINATION_SELECTOR = '[data-element="topics-pagination"]';
export const TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS = 'su-hidden';
export const TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const TOPICS_SUBTOPICS_LISTING_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const TOPICS_SUBTOPICS_LISTING_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const TOPICS_SUBTOPICS_LISTING_MODAL_IFRAME = 'iframe[data-modal="iframe"]';


/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(TOPICS_SUBTOPICS_LISTING_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS);
    modal.hidden = false;
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(TOPICS_SUBTOPICS_LISTING_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS);
    modal.hidden = true;
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(TOPICS_SUBTOPICS_LISTING_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(TOPICS_SUBTOPICS_LISTING_CLOSE_MODAL_BTN);
    let currentModal = null;

    openModalBtn && openModalBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            const uniqueId = btn.dataset.modalId;

            // Set current modal
            currentModal = section.querySelector(`div[data-modal-id="${uniqueId}"]`);

            currentModal && openModal(currentModal);
        });
    });

    closeBtn && closeBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            closeModal(currentModal);
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            currentModal && closeModal(currentModal);
        }
    });
};

/**
 * Fetches topic data from a Funnelback endpoint.
 * @async
 * @param {Object} args - The arguments for the fetch request.
 * @param {number} args.offset - The starting rank for pagination.
 * @param {string} args.query - The query string for the Funnelback search.
 * @param {string} args.endpoint - The base URL of the Funnelback API endpoint.
 * @returns {Promise<Object>} The JSON response from the Funnelback API.
 * @throws {Error} If the fetch request fails.
 */
async function fetchTopicData(args) {
    const {
        offset,
        query,
        endpoint,
    } = args;

    const fbQuery = endpoint + query + `&start_rank=${offset}`;
    // const fbQuery = "https://dxp-us-search.funnelback.squiz.cloud/s/search.json" + query + `&start_rank=${offset}`;
    const res = await fetch(fbQuery).catch((err) => {
        throw new Error(err);
    });

    const fbData = await res.json();
    return fbData;
}

/**
 * Updates the DOM with rendered cards and pagination, then reinitializes the section.
 * @param {HTMLElement} section - The topic-subtopic section element.
 * @param {string[]} cards - Array of rendered card HTML strings.
 * @param {string} pagination - Rendered pagination HTML string.
 */
function updateState(section, cards, pagination) {
    document.querySelector(TOPICS_LIST_SELECTOR).innerHTML = cards;
    document.querySelector(PAGINATION_SELECTOR).innerHTML = pagination;
    window.scrollTo({ top: 0, behavior: "smooth" });
    _topicsInit(section);
}

/**
 * Handles button click events by fetching data and updating the UI.
 * @async
 * @param {Object} args - The arguments for handling the button click.
 * @param {string} args.offset - The pagination offset (as a string).
 * @param {string} args.query - The query string for the Funnelback search.
 * @param {string} args.endpoint - The base URL of the Funnelback API endpoint.
 * @param {string} args.display - The display configuration for card rendering.
 * @param {HTMLElement} args.section - The topic-subtopic section element.
 * @returns {Promise<void>}
 */
async function handleButtonClick(args) {
    const {
        offset,
        query,
        endpoint,
        display,
        section
    } = args;
    const fbData = await fetchTopicData({ offset, query, endpoint });

    const resultsSummary =
        fbData.response.resultPacket && fbData.response.resultPacket.resultsSummary
            ? fbData.response.resultPacket.resultsSummary
            : null;

    const cards = [];

    fbData?.response?.resultPacket?.results?.forEach((card) => {
        const cardData = formatCardDataFunnelback(card);
        if(["Press Center", "Leadership Messages", "University Updates", "Announcements", "In the News"].includes(display)) {
            cardData.displayConfiguration = display;
            // cards.push(Card({ data: cardData, cardType: "narrowhorizontal" }));
        } else {
            // cards.push(Card({ data: cardData, cardType: "horizontal", cardSize: "large" }));
        }
    });

    const pager = pagination({
        pageNumber: Number(offset),
        allResults: resultsSummary.totalMatching,
        resultsPerPage: resultsSummary.numRanks,
        paginationRange: 5,
        currentPage: Number(offset)
    });

    updateState(section, cards, pager);
}

/**
 * Initializes the topic-subtopic section by attaching event listeners to pagination buttons.
 * @param {HTMLElement} section - The topic-subtopic DOM element.
 */
function _topicsInit(section) {
    const { query, endpoint, display } = section.dataset;
    const paginationContainer = section.querySelector(PAGINATION_SELECTOR);

    if (!paginationContainer) return;

    const buttons = paginationContainer.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.disabled) return; // Ignore clicks on disabled buttons
            const offset = button.getAttribute("data-offset");
            handleButtonClick({
                offset,
                query,
                endpoint,
                display,
                section
            });
        });
    });
}

/**
 * Initializes fetch and modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `TOPICS_SUBTOPICS_SELECTOR` selector
 * and applies the `_modalInit` function to each of them.
 * and applies the `_topicsInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(TOPICS_SUBTOPICS_SELECTOR).forEach(section => {
        _modalInit(section);
        _topicsInit(section);
    });
});