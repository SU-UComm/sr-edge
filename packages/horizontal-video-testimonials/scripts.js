/**
 * Globals variables 
 * @constant {string} HORIZONTAL_VIDEO_TESTIMONIALS_SELECTOR - Selector for horizontal video testimonials elements.
 * @constant {string} HORIZONTAL_VIDEO_TESTIMONIALS_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} HORIZONTAL_VIDEO_TESTIMONIALS_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} HORIZONTAL_VIDEO_TESTIMONIALS_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} HORIZONTAL_VIDEO_TESTIMONIALS_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} HORIZONTAL_VIDEO_TESTIMONIALS_MODAL_IFRAME - Selector for iframe container.
 */
export const HORIZONTAL_VIDEO_TESTIMONIALS_SELECTOR = 'section[data-component="horizontal-video-testimonials"]';
export const HORIZONTAL_VIDEO_TESTIMONIALS_HIDDEN_CLASS = 'su-hidden';
export const HORIZONTAL_VIDEO_TESTIMONIALS_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const HORIZONTAL_VIDEO_TESTIMONIALS_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const HORIZONTAL_VIDEO_TESTIMONIALS_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const HORIZONTAL_VIDEO_TESTIMONIALS_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

// open modal by id
export function openModal(modal) {
    const iframe = modal.querySelector(HORIZONTAL_VIDEO_TESTIMONIALS_MODAL_IFRAME);

    if(iframe) {
        const currentSrc = iframe.getAttribute('src');
        const newSrc = currentSrc && currentSrc.replace('autoplay=0','autoplay=1');
    
        iframe.setAttribute('src', newSrc);
    }

    modal.classList.remove(HORIZONTAL_VIDEO_TESTIMONIALS_HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

// close currently open modal
export function closeModal(modal) {
    const iframe = modal.querySelector(HORIZONTAL_VIDEO_TESTIMONIALS_MODAL_IFRAME);
    
    if(iframe) {
        const currentSrc = iframe.getAttribute('src');
        const newSrc = currentSrc && currentSrc.replace('autoplay=1','autoplay=0');
    
        iframe.setAttribute('src', newSrc);
    }
 
    modal.classList.add(HORIZONTAL_VIDEO_TESTIMONIALS_HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(HORIZONTAL_VIDEO_TESTIMONIALS_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(HORIZONTAL_VIDEO_TESTIMONIALS_CLOSE_MODAL_BTN);
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
}

/**
 * Initializes modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `HORIZONTAL_VIDEO_TESTIMONIALS_SELECTOR` selector
 * applies the `_modalInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(HORIZONTAL_VIDEO_TESTIMONIALS_SELECTOR).forEach(section => {
        _modalInit(section);
    });    
});
