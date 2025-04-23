import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import ModalManager from '../../global/js/utils/modal/modal.js';
// Globals
const SECTION_SELECTOR = 'section[data-component="basic-story-hero"]';

/**
 * Calculate reading time for text content
 * @param {string} text - The text content to analyze
 * @returns {number} - Estimated reading time in minutes
 */
function readingTime(text) {
    if (!text) return 0;

    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
}


/**
 * Basic Story Hero carousel
 * @param {HTMLElement} section - Basic Story Hero carousel section DOM Element
 */
function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;

    new Swiper(`${SECTION_SELECTOR} .swiper`, {
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
            nextEl: ".component-slider-next",
            prevEl: ".component-slider-prev",
        },
        pagination: {
            el: `.component-slider-pagination-${uniqueClass}`,
            clickable: true,
            bulletElement: "button",
            renderBullet: function (index, className) {
                return `<button ${index === 0 ? 'aria-current="true"' : ""} class="${className}"><span class="sr-only">Slide ${index + 1}</span></button>`;
            },
        },
        loopAdditionalSlides: 0
    });
};

/**
 * Initialize the component
 */
function _init() {
    const content = document.querySelector(".su-page-content");
    const readingTimeEl = document.querySelector(".su-reading-time");

    if (content && readingTimeEl) {
        const time = readingTime(content.innerText);
        readingTimeEl.textContent = ` ${time} min read`;
    }

    document.querySelectorAll(SECTION_SELECTOR).forEach(section => {
        // load when a modal is present
        if(section.querySelectorAll('[data-modal-id]').length > 0){
            new ModalManager(section);
        }
        // load when a carousel is present
        if(section.querySelectorAll('.component-slider').length > 0){
            _carouselInit(section);
        }
    });
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', _init);