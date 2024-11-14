// Globals 
export const MULTICOLUMN_LISTING_SELECTOR = 'section[data-component="multicolumn-listing"]';
export const MULTICOLUMN_LISTING_HIDDEN_CLASS = 'su-hidden';
export const MULTICOLUMN_LISTING_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const MULTICOLUMN_LISTING_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const MULTICOLUMN_LISTING_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const MULTICOLUMN_LISTING_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

// open modal by id
export function openModal(modal) {
    const iframe =  modal.querySelector(MULTICOLUMN_LISTING_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(MULTICOLUMN_LISTING_HIDDEN_CLASS);
}

// close currently open modal
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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(MULTICOLUMN_LISTING_SELECTOR).forEach(section => {
        _modalInit(section);
    });    
});
