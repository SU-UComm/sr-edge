import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { ensureLoopConditions, paginationUpdater, updateAccessibility } from '../../global/js/helpers';

/**
 * Globals variables 
 * @constant {string} MEDIA_CAROUSEL_SELECTOR - Selector for media carousel elements.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const MEDIA_CAROUSEL_SELECTOR = 'section[data-component="media-carousel"]';
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
        loopAdditionalSlides: 0,
        slidesPerGroup: 1,
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
        },
        on: {
            init: swiper => {
                ensureLoopConditions(swiper);
            },
            resize: swiper => {
                ensureLoopConditions(swiper);
            },
            paginationUpdate: swiper => {
                paginationUpdater(swiper);
            },
        }
    });
    
    const totalSlides = swiper.slides.length;
    const duplicateSlidesCount = swiper.slides.filter(slide => slide.classList.contains('swiper-slide-duplicate')).length;
    const originalSlides = Math.floor(totalSlides - duplicateSlidesCount);

    if (originalSlides > 1) {
        // Add slide change event handler with accessibility management
        swiper.on('slideChange', function() {
            /* v8 ignore start */
            setTimeout(() => { 
                updateAccessibility(swiper, 'h2 a, h3 a, button', true);
            }, 100);
            /* v8 ignore stop */
        });
        // Initial accessibility setup
        updateAccessibility(swiper, '', false);
    }
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
