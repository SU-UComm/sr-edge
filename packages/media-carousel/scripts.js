import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { ensureLoopConditions, paginationUpdater, updateAccessibility } from '../../global/js/helpers/swiperHelpers';

/**
 * Globals variables 
 * @constant {string} MEDIA_CAROUSEL_SELECTOR - Selector for media carousel elements.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const MEDIA_CAROUSEL_SELECTOR = 'section[data-component="media-carousel"]';

/**
 * Carousel Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
*/
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;
    
    const swiper = new Swiper(`section[data-unique-id="${uniqueClass}"] .swiper`, {
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
                return `<button ${index === 0 ? 'aria-current="true"' : ""} class="${className} ${index === 0 ? "swiper-pagination-bullet-active" : ""}"><span class="sr-only">Slide ${index + 1}</span></button>`;
            },
        },
        on: {
            init: swiper => {
                ensureLoopConditions(swiper);
                updateAccessibility(swiper, '', false);
                if(swiper.activeIndex === 1) {
                    swiper.slidePrev();
                }
            },
            resize: swiper => {
                ensureLoopConditions(swiper);
            },
            paginationUpdate: swiper => {
                paginationUpdater(swiper);
            }
        },
    });
    
    const totalSlides = swiper.slides.length;
    const duplicateSlidesCount = swiper.slides.filter(slide => slide.classList.contains('swiper-slide-duplicate')).length;
    const originalSlides = Math.floor(totalSlides - duplicateSlidesCount);

    if (originalSlides > 1) {
        // Add slide change event handler with accessibility management
        let isFocusable = false;

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

        swiper.on('slideChange', function() {
            setTimeout(() => { 
            if (isFocusable) {
                    updateAccessibility(swiper, 'h2 a, h3 a, button', true);
                } else {
                    updateAccessibility(swiper, '', false);
                }
            }, 100);
        });
        /* v8 ignore stop */
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
