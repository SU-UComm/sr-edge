import { postMessageToVimeo, setControlLabel } from '../../global/js/helpers/VideoUtils';

/**
 * Globals variables 
 * @constant {string} SINGLE_IMAGE_VIDEO_SELECTOR - Selector for vertical video panel elements.
 * @constant {string} SINGLE_IMAGE_VIDEO_VIDEO_PLAYER_FRAME - Selector for video iframe container.
 * @constant {string} SINGLE_IMAGE_VIDEO_VIDEO_CONTROL_BTN - Selector for the button that control the video.
 * @constant {string} SINGLE_IMAGE_VIDEO_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} SINGLE_IMAGE_VIDEO_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} SINGLE_IMAGE_VIDEO_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} SINGLE_IMAGE_VIDEO_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} SINGLE_IMAGE_VIDEO_MODAL_IFRAME - Selector for iframe container.
 */
export const SINGLE_IMAGE_VIDEO_SELECTOR = 'section[data-component="single-image-video"]';
export const SINGLE_IMAGE_VIDEO_VIDEO_PLAYER_FRAME = 'iframe[data-role="video-player"]';
export const SINGLE_IMAGE_VIDEO_VIDEO_CONTROL_BTN = 'button[data-role="video-control"]';
export const SINGLE_IMAGE_VIDEO_HIDDEN_CLASS = 'su-hidden';
export const SINGLE_IMAGE_VIDEO_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const SINGLE_IMAGE_VIDEO_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const SINGLE_IMAGE_VIDEO_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const SINGLE_IMAGE_VIDEO_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(SINGLE_IMAGE_VIDEO_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(SINGLE_IMAGE_VIDEO_HIDDEN_CLASS);
    modal.hidden = false;
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(SINGLE_IMAGE_VIDEO_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(SINGLE_IMAGE_VIDEO_HIDDEN_CLASS);
    modal.hidden = true;
}

/**
 * Modal Init function 
 * @param {HTMLElement} section - The section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(SINGLE_IMAGE_VIDEO_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(SINGLE_IMAGE_VIDEO_CLOSE_MODAL_BTN);
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
  }
  
/**
 * Video Init function
 * @param {HTMLElement} section - The section DOM Element
 */

export function _videoInit(section) {
    const videoPlayer = section.querySelector(SINGLE_IMAGE_VIDEO_VIDEO_PLAYER_FRAME);
    const videoPlayerControl = section.querySelector(SINGLE_IMAGE_VIDEO_VIDEO_CONTROL_BTN);
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
 * This function selects all elements matching the `SINGLE_IMAGE_VIDEO_SELECTOR` selector
 * applies the `_modalInit` function to each of them
 * applies the `_videoInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(SINGLE_IMAGE_VIDEO_SELECTOR).forEach(section => {
        _modalInit(section);
        _videoInit(section);
    });    
});
