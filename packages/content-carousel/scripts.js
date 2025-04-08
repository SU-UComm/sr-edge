import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { ensureLoopConditions, paginationUpdater, updateAccessibility } from '../../global/js/helpers/swiperHelpers';

export const CONTENT_CAROUSEL_SELECTOR = 'section[data-component="content-carousel"]';
export let swiper; 

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
                updateAccessibility(swiper, 'a, button', true);
            }, 300);
            /* v8 ignore stop */
        });

        // Initial accessibility setup
        updateAccessibility(swiper, '', false);
    }
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
