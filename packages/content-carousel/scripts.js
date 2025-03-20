import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/**
 * Globals variables 
 * @constant {string} CONTENT_CAROUSEL_SELECTOR - Selector for content carousel elements.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */

export const CONTENT_CAROUSEL_SELECTOR = 'section[data-component="content-carousel"]';
export let swiper; 

/**
 * Carousel Init function for card
 * @param {HTMLElement} section - The content carousel section DOM Element
 */
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;

    swiper = new Swiper(`section[data-unique-id="${uniqueClass}"] .swiper`, {
        breakpoints: {
            0: { 
                slidesPerView: 1, 
                centeredSlides: false 
            },
            768: { 
                slidesPerView: 1, 
                centeredSlides: false 
            },
            992: { 
                slidesPerView: 1, 
                centeredSlides: false 
            },
        },
        slidesPerView: 1,
        variantClassName: "component-slider-single",
        loop: true,
        spaceBetween: 40,
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
 * This function selects all elements matching the `CONTENT_CAROUSEL_SELECTOR` selector
 * applies the `_carouselInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(CONTENT_CAROUSEL_SELECTOR).forEach(section => {
        _carouselInit(section)
    });    
});
