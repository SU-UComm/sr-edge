import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/**
 * Globals variables 
 * @constant {string} STORIES_CAROUSEL_SELECTOR - Selector for stories carousel elements.
 * @constant {string} STORIES_CAROUSEL_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} STORIES_CAROUSEL_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} STORIES_CAROUSEL_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} STORIES_CAROUSEL_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} STORIES_CAROUSEL_MODAL_IFRAME - Selector for iframe container.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const STORIES_CAROUSEL_SELECTOR = 'section[data-component="stories-carousel"]';
export const STORIES_CAROUSEL_HIDDEN_CLASS = 'su-hidden';
export const STORIES_CAROUSEL_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const STORIES_CAROUSEL_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const STORIES_CAROUSEL_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const STORIES_CAROUSEL_MODAL_IFRAME = 'iframe[data-modal="iframe"]';

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(STORIES_CAROUSEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(STORIES_CAROUSEL_HIDDEN_CLASS);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(STORIES_CAROUSEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(STORIES_CAROUSEL_HIDDEN_CLASS);
    modal.hidden = true;
    document.body.style.overflow = '';
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(STORIES_CAROUSEL_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(STORIES_CAROUSEL_CLOSE_MODAL_BTN);
    let currentModal = null;

    openModalBtn && openModalBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            const uniqueId = btn.dataset.modalId;

            // Set current modal
            currentModal = section.querySelector(`div[data-modal-id="${uniqueId}"]`);

            if (!currentModal) return;

            const modalContent = currentModal.querySelector('.su-modal-content');
            
            if (!currentModal.dataset.listenerAdded) {
                modalContent && currentModal.addEventListener('click', (event) => {
                    if (!modalContent.contains(event.target)) {
                        closeModal(currentModal);
                    }
                });

                currentModal.dataset.listenerAdded = 'true';
            }

            openModal(currentModal);
        });
    });

    closeBtn && closeBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            currentModal && closeModal(currentModal);
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            currentModal && closeModal(currentModal);
        }
    });
};
let useFocus = false;
// const handleClick = (e) => {
//     e.preventDefault();
//     if (e.detail) {
//         useFocus = false;
//     } else {
//         useFocus = true;
//     }
//   };

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
let sliderInit = false;
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;
    const swiperSelector = `section[data-unique-id="${uniqueClass}"] .swiper`;
    new Swiper(swiperSelector, {
        breakpoints: {
            0: {
                slidesPerView: 1.5,
                spaceBetween: 40,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 72,
                centeredSlides: false,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 102,
                centeredSlides: false,
            },
        },
        slidesPerView: 1.5,
        spaceBetween: 40,
        variantClassName: "component-slider-cards component-slider-peek",
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
        watchSlidesProgress: true,
        on: {
            init: function () {
                setTimeout(() => {
                    sliderInit = true;
                    useFocus = true;
                }, 500);
            },
            slideChange: function(swiper){
                const thisSwiper = document.querySelector(swiperSelector);
                /*
                * Focus on first active slide
                */
                // Remove tabindex from old current
                const oldSlide = thisSwiper.querySelector(
                    ".swiper-slide-active"
                );
                if (oldSlide) {
                    oldSlide.removeAttribute("tabindex");
                }
                // Set focus on new current
                if (sliderInit) {
                    setTimeout(() => {
                        const slide = thisSwiper.querySelector(
                            ".swiper-slide-active"
                        );
                        const slideTarget = slide.querySelector("h2 a, h3 a, button")
                            ? slide.querySelector("h2 a, h3 a, button")
                            : (() => {
                                slide.setAttribute("tabindex", "-1");
                                return slide;
                            })();
                        if (useFocus) {
                            slideTarget.focus();
                        }
                    }, 300);
                }
                // sliderInit = true;
                // useFocus = true;
                // Prevent tab focus on out of view slides
                swiper.slides.forEach((slide) => {
                    if (slide.classList.contains("swiper-slide-visible")) {
                    slide.removeAttribute("aria-hidden");
                    slide.removeAttribute("inert");
                    } else {
                    slide.setAttribute("aria-hidden", "true");
                    slide.setAttribute("inert", "true");
                    }
                });

                if (swiper.pagination.bullets.length > 0) {
                    swiper.pagination.bullets.forEach((bullet) => {
                    if (
                        bullet.classList.contains("swiper-pagination-bullet-active")
                    ) {
                        bullet.setAttribute("aria-current", "true");
                    } else {
                        bullet.removeAttribute("aria-current");
                    }
                    });
                }
            }
        }
    });
    
};

/**
 * Initializes modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `STORIES_CAROUSEL_SELECTOR` selector
 * applies the `_carouselInit` and the `_modalInit` functions to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(STORIES_CAROUSEL_SELECTOR).forEach(section => {
        _carouselInit(section)
        _modalInit(section);
    });    
});


