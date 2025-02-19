/**
 * Globals variables 
 * @constant {string} MULTICOLUMN_LISTING_SELECTOR - Selector for multicolumn elements.
 * @constant {string} MULTICOLUMN_LISTING_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} MULTICOLUMN_LISTING_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} MULTICOLUMN_LISTING_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} MULTICOLUMN_LISTING_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} MULTICOLUMN_LISTING_MODAL_IFRAME - Selector for iframe container.
 */
export const MULTICOLUMN_LISTING_SELECTOR = 'section[data-component="multicolumn-listing"]';
export const MULTICOLUMN_LISTING_HIDDEN_CLASS = 'su-hidden';
export const MULTICOLUMN_LISTING_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const MULTICOLUMN_LISTING_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const MULTICOLUMN_LISTING_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const MULTICOLUMN_LISTING_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(MULTICOLUMN_LISTING_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(MULTICOLUMN_LISTING_HIDDEN_CLASS);
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(MULTICOLUMN_LISTING_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(MULTICOLUMN_LISTING_HIDDEN_CLASS);
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(MULTICOLUMN_LISTING_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(MULTICOLUMN_LISTING_CLOSE_MODAL_BTN);
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
 * Initializes modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `MULTICOLUMN_LISTING_SELECTOR` selector
 * and applies the `_modalInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(MULTICOLUMN_LISTING_SELECTOR).forEach(section => {
        _modalInit(section);
    });    
});
