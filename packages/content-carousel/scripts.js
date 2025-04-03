import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export const CONTENT_CAROUSEL_SELECTOR = 'section[data-component="content-carousel"]';
export let swiper; 

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
