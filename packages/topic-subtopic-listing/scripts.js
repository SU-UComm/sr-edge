import { uuid } from "../../global/js/utils/uuid";
import { formatCardDataFunnelback } from "../../global/js/utils/formatCardDataFunnelback";
import { pagination } from "../../global/js/helpers/pagination";
import { HorizontalCard } from "../../global/js/helpers/Card/horizontalCard";
import { NarrowHorizontalCard } from "../../global/js/helpers/Card/narrowHorizontalCard";
import { EmbedVideo } from "../../global/js/helpers/EmbedVideo";

export const TOPICS_SUBTOPICS_SELECTOR = 'section[data-component="topic-subtopic-listing"]';
export const TOPICS_LIST_SELECTOR = '[data-element="topics-list"]';
export const PAGINATION_SELECTOR = '[data-element="topics-pagination"]';
export const TOPICS_SUBTOPICS_LISTING_HIDDEN_CLASS = 'su-hidden';
export const TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR = 'section[data-element="modal-wrapper"]';
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
export async function fetchTopicData(args) {
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
export function updateState(section, cards, pagination, modal) {
    section.querySelector(TOPICS_LIST_SELECTOR).innerHTML = `<div class="su-w-full su-component-horizontal-card-grid" data-test="orientation-topiclisting"><div class="su-relative su-grid su-grid-cols-1 su-gap-30 md:su-gap-48 lg:su-gap-61">${cards}</div></div>`;
    section.querySelector(PAGINATION_SELECTOR).innerHTML = pagination;
    section.querySelector(TOPICS_SUBTOPICS_LISTING_MODAL_SELECTOR).innerHTML = modal;
    /* v8 ignore start */
    window.scrollTo({ top: 0, behavior: "smooth" });
    /* v8 ignore stop */
    _modalInit(section);
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
export async function handleButtonClick(args) {
    const {
        offset,
        query,
        endpoint,
        display,
        section
    } = args;
    const fbData = await fetchTopicData({ offset, query, endpoint });

    const resultsSummary = fbData?.response?.resultPacket?.resultsSummary;

    if (!resultsSummary) {
        console.warn("Missing resultsSummary from API response");
        return;
    }
    

    const cards = [];
    const modalData = [];

    fbData?.response?.resultPacket?.results?.forEach((card) => {
        const uniqueID = uuid();
        const cardData = formatCardDataFunnelback(card);
        cardData.uniqueID = uniqueID;
        
        if(["Press Center", "Leadership Messages", "University Updates", "Announcements", "In the News"].includes(display)) {
            cardData.displayConfiguration = display;
            cards.push(`<div class="su-relative su-grow">${NarrowHorizontalCard({ data: cardData, cardType: "narrowhorizontal" })}</div>`);
        } else {
            cards.push(`<div class="su-relative su-grow">${HorizontalCard({ data: cardData, cardType: "horizontal", cardSize: "large" })}</div>`);
        }
        if(cardData.type === 'Video' || cardData.videoUrl) {
            modalData.push({
                isVertical: cardData.size === "vertical-video",
                videoId: cardData.videoUrl,
                title: `Watch ${cardData.title}`, 
                noAutoPlay: true,
                uniqueID: cardData.uniqueID,
                titleID: 'card-modal'
            })
        }
    });

    const pager = pagination({
        pageNumber: Number(offset),
        allResults: resultsSummary.totalMatching,
        resultsPerPage: resultsSummary.numRanks,
        paginationRange: 5,
        currentPage: Number(offset)
    });
    
    const modals = modalData.map((item) => {
        return `
        <div hidden="true" aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="${item.uniqueID}"><span data-focus-scope-start="true" hidden="true"></span><div aria-describedby="${item.titleID}" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true"><div class="su-modal-content">
        ${EmbedVideo({ videoId: item.videoId, title: item.title, noAutoPlay: item.noAutoPlay, isVertical: item.isVertical})}
        </div></div><button type="button" class="su-component-close su-text-center" data-dismiss="modal"> <svg class="su-fill-currentcolor" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.5607 6.43934C22.9749 5.85355 22.0251 5.85355 21.4393 6.43934L15 12.8787L8.56066 6.43934C7.97487 5.85355 7.02513 5.85355 6.43934 6.43934C5.85355 7.02513 5.85355 7.97487 6.43934 8.56066L12.8787 15L6.43934 21.4393C5.85355 22.0251 5.85355 22.9749 6.43934 23.5607C7.02513 24.1464 7.97487 24.1464 8.56066 23.5607L15 17.1213L21.4393 23.5607C22.0251 24.1464 22.9749 24.1464 23.5607 23.5607C24.1464 22.9749 24.1464 22.0251 23.5607 21.4393L17.1213 15L23.5607 8.56066C24.1464 7.97487 24.1464 7.02513 23.5607 6.43934Z"></path></svg><span>Close</span></button><span data-focus-scope-end="true" hidden="true"></span></div>
        `
    }).join('')

    updateState(section, cards.join(''), pager, modals);
}

/**
 * Initializes the topic-subtopic section by attaching event listeners to pagination buttons.
 * @param {HTMLElement} section - The topic-subtopic DOM element.
 */
export function _topicsInit(section) {
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