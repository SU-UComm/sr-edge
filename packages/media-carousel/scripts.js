import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/**
 * Globals variables 
 * @constant {string} MEDIA_CAROUSEL_SELECTOR - Selector for media carousel elements.
 * @constant {string} MEDIA_CAROUSEL_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} MEDIA_CAROUSEL_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} MEDIA_CAROUSEL_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} MEDIA_CAROUSEL_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} MEDIA_CAROUSEL_MODAL_IFRAME - Selector for iframe container.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const MEDIA_CAROUSEL_SELECTOR = 'section[data-component="media-carousel"]';
export const MEDIA_CAROUSEL_HIDDEN_CLASS = 'su-hidden';
export let swiper; 

/**
 * Carousel Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;

    swiper = new Swiper(`section[data-unique-id="${uniqueClass}"] .swiper`, {
        breakpoints: {
            0: {
                slidesPerView: 1.4,
                spaceBetween: 0,
                centeredSlides: true,
                initialSlide: 0,
            },
            768: {
                slidesPerView: 1.1,
                spaceBetween: 0,
                centeredSlides: true,
                initialSlide: 0,
            },
            992: {
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: false,
                initialSlide: 0,
            },
        },
        slidesPerView: 1,
        variantClassName: "component-slider-single component-slider-peek",
        watchSlidesProgress: true,
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
        }
    });
};

/**
 * Initializes carousel when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `MEDIA_CAROUSEL_SELECTOR` selector
 * applies the `_carouselInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(MEDIA_CAROUSEL_SELECTOR).forEach(section => {
        _carouselInit(section)
    });    
});
