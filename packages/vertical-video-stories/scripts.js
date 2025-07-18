import { postMessageToVimeo, setControlLabel } from '../../global/js/helpers/VideoUtils';

/**
 * Globals variables
 * @constant {string} VERTICAL_VIDEO_STORIES_SELECTOR - Selector for vertical video panel elements.
 * @constant {string} VERTICAL_VIDEO_STORIES_VIDEO_PLAYER_FRAME - Selector for video iframe container.
 * @constant {string} VERTICAL_VIDEO_STORIES_VIDEO_CONTROL_BTN - Selector for the button that control the video.
 * @constant {string} VERTICAL_VIDEO_STORIES_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} VERTICAL_VIDEO_STORIES_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} VERTICAL_VIDEO_STORIES_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} VERTICAL_VIDEO_STORIES_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} VERTICAL_VIDEO_STORIES_MODAL_IFRAME - Selector for iframe container.
 */
export const VERTICAL_VIDEO_STORIES_SELECTOR = 'section[data-component="vertical-video-stories"]';
export const VERTICAL_VIDEO_STORIES_VIDEO_PLAYER_FRAME = 'iframe[data-role="video-player"]';
export const VERTICAL_VIDEO_STORIES_VIDEO_CONTROL_BTN = 'button[data-role="video-control"]';
export const VERTICAL_VIDEO_STORIES_HIDDEN_CLASS = 'su-hidden';
export const VERTICAL_VIDEO_STORIES_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const VERTICAL_VIDEO_STORIES_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const VERTICAL_VIDEO_STORIES_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const VERTICAL_VIDEO_STORIES_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Traps focus within a given modal element when the Tab key is pressed.
 * Prevents focus from moving outside the modal by looping it from the last
 * to the first focusable element and vice versa when Shift + Tab is used.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered by user input.
 * @param {HTMLElement} modal - The modal element within which focus should be trapped.
 */
export const focusTrap = (event, modal) => {
    const focusableSelectors =
        '[data-focus-scope-start="true"], [data-focus-scope-end="true"], a, button, input, textarea, select, details, iframe, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
        modal?.querySelectorAll(focusableSelectors),
    )?.filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
    );

    if (focusableElements.length === 0 || event?.key !== 'Tab') {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Move to the last focusable element if we are on the first one and Shift + Tab is pressed
    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    }
    // Move to the first focusable element if we are on the last one and Shift is pressed
    else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
};

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(VERTICAL_VIDEO_STORIES_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(VERTICAL_VIDEO_STORIES_HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('[data-focus-scope-start="true"]').focus();

    ///Focus trap for modal
    document.addEventListener('keydown', (event) => {
        if (modal) {
            focusTrap(event, modal);
        }
    });
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(VERTICAL_VIDEO_STORIES_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(VERTICAL_VIDEO_STORIES_HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Modal Init function 
 * @param {HTMLElement} section - The section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(VERTICAL_VIDEO_STORIES_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(VERTICAL_VIDEO_STORIES_CLOSE_MODAL_BTN);
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
 * Video Init function
 * @param {HTMLElement} section - The section DOM Element
 */

export function _videoInit(section) {
    const videoPlayer = section.querySelector(VERTICAL_VIDEO_STORIES_VIDEO_PLAYER_FRAME);
    const videoPlayerControl = section.querySelector(VERTICAL_VIDEO_STORIES_VIDEO_CONTROL_BTN);
    let isManuallyPaused = false;

    if (!videoPlayer || !videoPlayerControl) return;

    // Handle scroll-based autoplay
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isManuallyPaused) {
                postMessageToVimeo(videoPlayer, 'play');
                setControlLabel(videoPlayerControl, false);
            } else if (!entry.isIntersecting) {
                postMessageToVimeo(videoPlayer, 'pause');
                setControlLabel(videoPlayerControl, true);
                }
            });
        },
        { threshold: 0.5 }
    );

    observer.observe(videoPlayer);

    videoPlayerControl.addEventListener('click', () => {
        if (videoPlayerControl.getAttribute('aria-pressed') === 'true') {
            postMessageToVimeo(videoPlayer,'pause');
            setControlLabel(videoPlayerControl, true);
            isManuallyPaused = true;
        } else {
            postMessageToVimeo(videoPlayer, 'play');
            setControlLabel(videoPlayerControl, false);
            isManuallyPaused = false;
        }
    });
};

/**
 * Initializes carousel when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `VERTICAL_VIDEO_STORIES_SELECTOR` selector
 * applies the `_modalInit` function to each of them
 * applies the `_videoInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(VERTICAL_VIDEO_STORIES_SELECTOR).forEach(section => {
        _modalInit(section);
        _videoInit(section);
    });
});
