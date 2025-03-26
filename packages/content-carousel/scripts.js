import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

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
        }
    });

    
    // Add accessibility management function
    const updateAccessibility = () => {
        // Manage slides visibility and interactivity
        swiper.slides.forEach((slide) => {
            if (slide.classList.contains("swiper-slide-visible")) {
                slide.removeAttribute("aria-hidden");
                slide.removeAttribute("inert");
            } else {
                slide.setAttribute("aria-hidden", "true");
                slide.setAttribute("inert", "true");
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

    // Add slide change event handler with accessibility management
    swiper.on('slideChange', function() {
        updateAccessibility();

        // Remove tabindex from previous active slide
        const oldWrapper = swiper.$wrapperEl?.[0];
        if (oldWrapper) {
            const oldSlide = oldWrapper.querySelector(".swiper-slide-active");
            if (oldSlide) {
                oldSlide.removeAttribute("tabindex");
            }
        }

        // Focus on new current slide after animation
        setTimeout(() => {
            const wrapper = swiper.$wrapperEl?.[0];
            if (!wrapper) {
                console.warn('Swiper wrapper not found');
                return;
            }

            const slide = wrapper.querySelector(".swiper-slide-active");
            if (!slide) {
                console.warn('Active slide not found');
                return;
            }

            // Find focusable element or make slide itself focusable
            const focusableElements = slide.querySelectorAll('h2 a, h3 a, button');
            let slideTarget = null;

            if (focusableElements.length > 0) {
                // Prefer the first focusable element
                slideTarget = focusableElements[0];
            } else {
                // Make slide itself focusable
                slide.setAttribute("tabindex", "-1");
                slideTarget = slide;
            }

            if (slideTarget) {
                try {
                    slideTarget.focus();
                } catch (error) {
                    console.error('Failed to focus element:', error);
                }
            }
        }, 300);
    });

    // Initial accessibility setup
    updateAccessibility();
};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(CONTENT_CAROUSEL_SELECTOR).forEach(section => {
        _carouselInit(section)
    });    
});
