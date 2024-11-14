// Globals 
export const FEATURED_CONTENT_SELECTOR = 'section[data-component="featured-content"]';
export const FEATURED_CONTENT_HIDDEN_CLASS = 'su-hidden';
export const FEATURED_CONTENT_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const FEATURED_CONTENT_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const FEATURED_CONTENT_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const FEATURED_CONTENT_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

// open modal by id
export function openModal(modal) {
    const iframe =  modal.querySelector(FEATURED_CONTENT_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(FEATURED_CONTENT_HIDDEN_CLASS);
}

// close currently open modal
export function closeModal(modal) {
    const iframe =  modal.querySelector(FEATURED_CONTENT_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(FEATURED_CONTENT_HIDDEN_CLASS);
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(FEATURED_CONTENT_SELECTOR).forEach(section => {
        _modalInit(section);
    });    
});
