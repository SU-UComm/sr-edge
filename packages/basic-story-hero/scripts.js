import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { readingTime } from '../../global/js/utils/readingTime/readingTime.js';
import { ensureLoopConditions, paginationUpdater, updateAccessibility } from '../../global/js/helpers/swiperHelpers';

/**
 * Globals variables 
 * @constant {string} BASIC_STORY_HERO_SELECTOR - Selector for basic story hero elements.
 * @constant {string} BASIC_STORY_HERO_SELECTOR - Selector for basic story hero reading time element.
 * @constant {string} BASIC_STORY_HERO_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} BASIC_STORY_HERO_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} BASIC_STORY_HERO_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} BASIC_STORY_HERO_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} BASIC_STORY_HERO_MODAL_IFRAME - Selector for iframe container.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */

export const BASIC_STORY_HERO_SELECTOR = 'section[data-component="basic-story-hero"]';
export const BASIC_STORY_HERO_READING_TIME_SELECTOR = 'span[data-reading="true"]';
export const BASIC_STORY_HERO_HIDDEN_CLASS = 'su-hidden';
export const BASIC_STORY_HERO_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const BASIC_STORY_HERO_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const BASIC_STORY_HERO_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const BASIC_STORY_HERO_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(BASIC_STORY_HERO_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(BASIC_STORY_HERO_HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(BASIC_STORY_HERO_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(BASIC_STORY_HERO_HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(BASIC_STORY_HERO_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(BASIC_STORY_HERO_CLOSE_MODAL_BTN);
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
                    slidesPerView: 1,
                    spaceBetween: 0,
                    centeredSlides: false,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    centeredSlides: false,
                },
                992: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    centeredSlides: false,
                },
            },
            slidesPerView: 1,
            loop: true,
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
            loopAdditionalSlides: 0,
            watchSlidesProgress: true,
            on: {
                init: swiper => {
                    ensureLoopConditions(swiper);
                    updateAccessibility(swiper, '', false);
                },
                resize: swiper => {
                    ensureLoopConditions(swiper);
                },
                paginationUpdate: swiper => {
                    paginationUpdater(swiper);
                }
            }
        });
        /* v8 ignore start */
        document.addEventListener('keydown', function() {
            isFocusable = true
        });
        
        // Detect non-keyboard interaction
        document.addEventListener('mousedown', () => {
            isFocusable = false;
        });
        
        document.addEventListener('touchstart', () => {
            isFocusable = false;
        });
        
        // Optional: handle pointer events if you're in a modern environment
        document.addEventListener('pointerdown', () => {
            isFocusable = false;
        });

        // Add slide change event handler with accessibility management
        swiper.on('slideChange', function() {
            setTimeout(() => { 
            if (isFocusable) {
                    updateAccessibility(swiper, 'slide', true);
                } else {
                    updateAccessibility(swiper, '', false);
                }
            }, 100);
        });
        /* v8 ignore stop */
    } else {
        section.querySelector('.component-slider-controls')?.remove();
    }
};

/**
 * Updates the reading time text inside the provided section based on the page content.
 *
 * It calculates the estimated reading time from the text content of the `.su-page-content` element
 * and displays the result in the element matched by `BASIC_STORY_HERO_READING_TIME_SELECTOR` inside the given section.
 *
 * @param {HTMLElement} section - The section element containing the reading time placeholder to update.
 *
 */
export function _readingTimeUpdate(section) {
    const content = document.querySelector(".su-page-content");
    const readingTimeEl = section.querySelector(BASIC_STORY_HERO_READING_TIME_SELECTOR);

    if (content && readingTimeEl) {
        const time = readingTime(content.innerText);
        readingTimeEl.textContent = time;
    }

}

/**
 * Initializes carousel and modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `BASIC_STORY_HERO_SELECTOR` selector
 * applies the `_carouselInit` function to each of them
 * applies the `_modalInit` function to each of them
 * applies the `_readingTimeUpdate` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(BASIC_STORY_HERO_SELECTOR).forEach(section => {
        _carouselInit(section);
        _modalInit(section);
        _readingTimeUpdate(section);
    });    
});
