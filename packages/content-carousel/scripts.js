import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import { ensureLoopConditions, paginationUpdater, updateAccessibility } from '../../global/js/helpers/swiperHelpers';

export const CONTENT_CAROUSEL_SELECTOR = 'section[data-component="content-carousel"]';

export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;
    const slidesLength = section.querySelectorAll('.swiper-slide').length;

    if (slidesLength > 1 ) {
        let isFocusable = false;
        const swiper = new Swiper(`section[data-unique-id="${uniqueClass}"] .swiper`, {
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
            watchSlidesProgress: true,
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
 * Initializes carousel when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `CONTENT_CAROUSEL_SELECTOR` selector
 * applies the `_carouselInit` function to each of them
 *

 */
function initializeContentCarousels() {

    console.log('initializeContentCarousels called');
    document.querySelectorAll(CONTENT_CAROUSEL_SELECTOR).forEach(section => {
        _carouselInit(section)
    });    
};

/*
* 
* @listens DOMContentLoaded & livePreviewUpdated (which occurs in editMode on the front end)
*/
document.addEventListener('DOMContentLoaded', initializeContentCarousels);
document.addEventListener('livePreviewUpdated', initializeContentCarousels);