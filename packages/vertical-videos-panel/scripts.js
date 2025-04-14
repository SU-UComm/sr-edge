import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { ensureLoopConditions, paginationUpdater, updateAccessibility } from '../../global/js/helpers/swiperHelpers';

/**
 * Globals variables 
 * @constant {string} VERTICAL_VIDEO_PANEL_SELECTOR - Selector for vertical video panel elements.
 * @constant {string} VERTICAL_VIDEO_PANEL_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} VERTICAL_VIDEO_PANEL_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} VERTICAL_VIDEO_PANEL_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} VERTICAL_VIDEO_PANEL_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} VERTICAL_VIDEO_PANEL_MODAL_IFRAME - Selector for iframe container.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const VERTICAL_VIDEO_PANEL_SELECTOR = 'section[data-component="vertical-video-panel"]';
export const VERTICAL_VIDEO_PANEL_HIDDEN_CLASS = 'su-hidden';
export const VERTICAL_VIDEO_PANEL_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const VERTICAL_VIDEO_PANEL_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const VERTICAL_VIDEO_PANEL_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const VERTICAL_VIDEO_PANEL_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(VERTICAL_VIDEO_PANEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(VERTICAL_VIDEO_PANEL_HIDDEN_CLASS);
    modal.hidden = false;
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(VERTICAL_VIDEO_PANEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(VERTICAL_VIDEO_PANEL_HIDDEN_CLASS);
    modal.hidden = true;
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(VERTICAL_VIDEO_PANEL_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(VERTICAL_VIDEO_PANEL_CLOSE_MODAL_BTN);
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
 * Carousel Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;
    const slidesLength = section.querySelectorAll('.swiper-slide').length;
    
    if (slidesLength > 1 ) {
        let isFocusable = false;
        const swiper = new Swiper(`section[data-unique-id="${uniqueClass}"] .swiper`, {
            breakpoints: {
                0: {
                    slidesPerView: 1.4,
                    spaceBetween: 20,
                    centeredSlides: true,
                    initialSlide: 0,
                },
                576: {
                    slidesPerView: 1.6,
                    spaceBetween: 20,
                    centeredSlides: true,
                    initialSlide: 0,
                },
                768: {
                    slidesPerView: 1.9,
                    spaceBetween: 50,
                    centeredSlides: true,
                    initialSlide: 0,
                },
            },
            slidesPerView: 1,
            watchSlidesProgress: true,
            loop: true,
            loopAdditionalSlides: 0,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
            },
            navigation: {
                nextEl: `section[data-unique-id="${uniqueClass}"] .component-slider-next`,
                prevEl: `section[data-unique-id="${uniqueClass}"] .component-slider-prev`,
            },
            pagination: {
                el: `.component-slider-pagination-${uniqueClass}`,
                clickable: true,
                bulletElement: "button",
                renderBullet: function (index, className) {
                    return `<button ${index === 0 ? 'aria-current="true"' : ""} class="${className}"><span class="sr-only">Slide ${index + 1}</span></button>`;
                },
            },
            on: {
                init: swiper => {
                    ensureLoopConditions(swiper);
                      /* v8 ignore start */
                      setTimeout(() => {
                        isFocusable = true
                    }, 100)
                    /* v8 ignore stop */
                },
                resize: swiper => {
                    ensureLoopConditions(swiper);
                },
                paginationUpdate: swiper => {
                    paginationUpdater(swiper);
                }
            }
        });

        // Add slide change event handler with accessibility management
        swiper.on('slideChange', function() {
            /* v8 ignore start */
            if (isFocusable) {
                setTimeout(() => { 
                    updateAccessibility(swiper, 'h2 a, h3 a, button', true);
                }, 100);
            }
            /* v8 ignore stop */
        });
    } else {
        section.querySelector('.component-slider-controls')?.remove();
    }
};

/**
 * Initializes carousel and modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `VERTICAL_VIDEO_PANEL_SELECTOR` selector
 * applies the `_carouselInit` function to each of them
 * applies the `_modalInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(VERTICAL_VIDEO_PANEL_SELECTOR).forEach(section => {
        _carouselInit(section);
        _modalInit(section);
    });    
});
