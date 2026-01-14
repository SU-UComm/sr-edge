/**
 * Single Featured Content - Modal functionality
 * Handles opening/closing video modals when clicking on video thumbnails
 */

export const SINGLE_FEATURED_CONTENT_SELECTOR = 'section[data-component="single-featured-content"]';
export const HIDDEN_CLASS = 'su-hidden';
export const MODAL_SELECTOR = 'div[data-modal="modal"]';
export const OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe = modal.querySelector(MODAL_IFRAME);
    if (iframe) {
        const currentSrc = iframe.getAttribute('src');
        const newSrc = currentSrc.replace('autoplay=0', 'autoplay=1');
        iframe.setAttribute('src', newSrc);
    }
    modal.classList.remove(HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe = modal.querySelector(MODAL_IFRAME);
    if (iframe) {
        const currentSrc = iframe.getAttribute('src');
        const newSrc = currentSrc.replace('autoplay=1', 'autoplay=0');
        iframe.setAttribute('src', newSrc);
    }
    modal.classList.add(HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Initializes modal functionality for a given section.
 * @param {HTMLElement} section - The single featured content section element.
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(CLOSE_MODAL_BTN);
    let currentModal = null;

    openModalBtn && openModalBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            const uniqueId = btn.dataset.modalId;

            // Find the modal with matching ID
            currentModal = section.querySelector(`div[data-modal-id="${uniqueId}"]`);

            if (!currentModal) return;

            const modalContent = currentModal.querySelector('.su-modal-content');
            
            // Add click-outside-to-close listener (only once)
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

    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            currentModal && closeModal(currentModal);
        }
    });
}

/**
 * Initializes modal when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(SINGLE_FEATURED_CONTENT_SELECTOR).forEach(section => {
        _modalInit(section);
    });    
});

