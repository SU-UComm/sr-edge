import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/**
 * Globals variables 
 * @constant {string} MEDIA_CAROUSEL_SELECTOR - Selector for media carousel elements.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const MEDIA_CAROUSEL_SELECTOR = 'section[data-component="media-carousel"]';
export let swiper; 

/**
 * Ensure that the Swiper instance meets the necessary conditions for looping. This function checks if there are enough
 * slides for looping and adds duplicates if needed.
 *
 * @param {Swiper} swiper - The Swiper instance.
 * @param {Function} [callback=() => {}] - Optional callback function to execute after duplicating slides. Default is
 *   `() => {}`
 */
export function ensureLoopConditions(swiper, callback = () => {}) {
    const currentParams = swiper.params;
    const { slidesPerView, slidesPerGroup } = currentParams;
    const totalSlides = swiper.slides.length;
  
    const minSlides = Math.ceil(slidesPerView + slidesPerGroup);
  
    if (totalSlides === 1 ) {
        document.querySelector('.component-slider-controls').remove();
    }

    if (totalSlides < minSlides || totalSlides % slidesPerGroup !== 0) {
        duplicateSlides(swiper, minSlides, slidesPerGroup, callback);
    }
}
  
/**
 * Duplicate slides in the Swiper instance to meet the minimum slide requirements.
 *
 * @param {Swiper} swiper - The Swiper instance.
 * @param {number} minSlides - The minimum number of slides required.
 * @param {number} slidesPerGroup - The number of slides per group.
 * @param {Function} [callback=() => {}] - Optional callback function to execute after duplicating slides. Default is
 *   `() => {}`
 */
export function duplicateSlides(swiper, minSlides, slidesPerGroup, callback = () => {}) {
    const totalSlides = swiper.slides.length;
    let slidesToAdd = minSlides - totalSlides;

    if (totalSlides % slidesPerGroup !== 0) {
        slidesToAdd += slidesPerGroup - (totalSlides % slidesPerGroup);
    }

    const fragment = document.createDocumentFragment();
    const slidesHTML = swiper.slides.map(slide => slide.outerHTML).join('');
    
    for (let i = 0; i < slidesToAdd; i++) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = slidesHTML;

        while (tempDiv.firstChild) {
            tempDiv.firstChild.classList.add("swiper-slide-duplicate");
            fragment.appendChild(tempDiv.firstChild);
        }
    }
  
    swiper.wrapperEl.appendChild(fragment);
    swiper.update();
    callback();
}

/**
 * Updates the pagination to ensure it matches the number of non-duplicate slides.
 * Removes excess pagination bullets if duplicate slides affect the count.
 *
 * @param {Swiper} swiper - The Swiper instance.
 */
export function paginationUpdater(swiper) {
    const duplicateSlidesCount = swiper.slides.filter(slide => slide.classList.contains('swiper-slide-duplicate')).length;
    
    if (duplicateSlidesCount) {
        let bulletsDiff = swiper.pagination.bullets.length - swiper.slides.length + duplicateSlidesCount;
        
        while (bulletsDiff > 0) {
            const lastBullet = swiper.pagination.bullets.pop();
            if (lastBullet) lastBullet.remove();
            bulletsDiff--;
        }
    }
}

/**
 * Updates accessibility attributes for a Swiper instance.
 *
 * This function manages slide visibility and interactivity by setting 
 * `aria-hidden`, `inert`, and `tabindex` attributes appropriately. It also 
 * ensures that interactive elements within active slides receive focus.
 * Additionally, it updates the `aria-current` attribute on pagination bullets 
 * to reflect the current active slide.
 *
 * @param {object} swiper - The Swiper instance.
 * @param {HTMLElement[]} swiper.slides - The array of slide elements.
 * @param {object} swiper.pagination - The pagination object.
 * @param {HTMLElement[]} swiper.pagination.bullets - The array of pagination bullet elements.
 */
export const updateAccessibility = (swiper, isFocus) => {
    // Manage slides visibility and interactivity
    swiper.slides.forEach((slide) => {
        if (slide.classList.contains("swiper-slide-active")) {
            slide.removeAttribute("aria-hidden");
            slide.removeAttribute("inert");
            slide.setAttribute("tabindex","-1");
        } else {
            slide.setAttribute("aria-hidden", "true");
            slide.setAttribute("inert", "true");
            slide.removeAttribute("tabindex");
        }
        const slideTarget = slide.querySelector("h2 a, h3 a, button")
            ? slide.querySelector("h2 a, h3 a, button")
            : null;

            if(isFocus) {
                slideTarget && slideTarget.focus();
            }
    });

    // Update pagination bullets aria-current state
    if (swiper.pagination.bullets.length > 0) {
        swiper.pagination.bullets.forEach((bullet) => {
            if (bullet.classList.contains("swiper-pagination-bullet-active")) {
                bullet.setAttribute("aria-current", "true");
            } else {
                bullet.removeAttribute("aria-current");
            }
        });
    }
};

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
                return `<button ${index === 0 ? 'aria-current="true"' : ""} class="${className} ${index === 0 ? "swiper-pagination-bullet-active" : ""}"><span class="sr-only">Slide ${index + 1}</span></button>`;
            },
        },
        on: {
            init: swiper => {
                ensureLoopConditions(swiper);
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
    
    // Add slide change event handler with accessibility management
    swiper.on('slideChange', function() {
        /* v8 ignore start */
        setTimeout(() => { 
            updateAccessibility(swiper, true);
        }, 100);
        /* v8 ignore stop */
    });

    // Initial accessibility setup
    updateAccessibility(swiper, false);
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
