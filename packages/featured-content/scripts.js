/**
 * Globals variables 
 * @constant {string} FEATURED_CONTENT_SELECTOR - Selector for the featured content section.
 * @constant {string} FEATURED_CONTENT_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} FEATURED_CONTENT_MODAL_SELECTOR - Selector for the modal container.
 * @constant {string} FEATURED_CONTENT_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} FEATURED_CONTENT_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} FEATURED_CONTENT_MODAL_IFRAME - Selector for the modal iframe.
 */
export const FEATURED_CONTENT_SELECTOR = 'section[data-component="featured-content"]';
export const FEATURED_CONTENT_HIDDEN_CLASS = 'su-hidden';
export const FEATURED_CONTENT_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const FEATURED_CONTENT_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const FEATURED_CONTENT_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const FEATURED_CONTENT_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(FEATURED_CONTENT_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(FEATURED_CONTENT_HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(FEATURED_CONTENT_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(FEATURED_CONTENT_HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Initializes modal functionality for a given section.
 * @param {HTMLElement} section - The featured content section element.
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(FEATURED_CONTENT_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(FEATURED_CONTENT_CLOSE_MODAL_BTN);
    let currentModal = null;

    openModalBtn && openModalBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            const uniqueId = btn.dataset.modalId;

            // Set current modal
            currentModal = section.querySelector(`div[data-modal-id="${uniqueId}"]`);

            if (!currentModal) return;

            const modalContent = currentModal.querySelector('.su-modal-content');
            
            if (!currentModal.dataset.listenerAdded) {
                modalContent && currentModal.addEventListener('click', (event) => {
                    if (!modalContent.contains(event.target)) {
                        closeModal(currentModal);
                    }
                });

                currentModal.dataset.listenerAdded = 'true';
            }

            openModal(currentModal);
        });
    });

    closeBtn && closeBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            currentModal && closeModal(currentModal);
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
 * This function selects all elements matching the `FEATURED_CONTENT_SELECTOR` selector
 * and applies the `_modalInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(FEATURED_CONTENT_SELECTOR).forEach(section => {
        _modalInit(section);
    });    
});
