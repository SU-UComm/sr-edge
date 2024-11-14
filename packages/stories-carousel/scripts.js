import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// Globals 
export const STORIES_CAROUSEL_SELECTOR = 'section[data-component="stories-carousel"]';
export const STORIES_CAROUSEL_HIDDEN_CLASS = 'su-hidden';
export const STORIES_CAROUSEL_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const STORIES_CAROUSEL_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const STORIES_CAROUSEL_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const STORIES_CAROUSEL_MODAL_IFRAME = 'iframe[data-modal="iframe"]';
export let swiper; 

// open modal by id
export function openModal(modal) {
    const iframe =  modal.querySelector(STORIES_CAROUSEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(STORIES_CAROUSEL_HIDDEN_CLASS);
}

// close currently open modal
export function closeModal(modal) {
    const iframe =  modal.querySelector(STORIES_CAROUSEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(STORIES_CAROUSEL_HIDDEN_CLASS);
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

            currentModal && openModal(currentModal);
        });
    });

    closeBtn && closeBtn.forEach(btn => {
        btn && btn.addEventListener('click', function() {
            closeModal(currentModal);
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            currentModal && closeModal(currentModal);
        }
    });
};

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;

    swiper = new Swiper(`${STORIES_CAROUSEL_SELECTOR} .swiper`, {
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
            nextEl: `.component-slider-next`,
            prevEl: `.component-slider-prev`,
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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(STORIES_CAROUSEL_SELECTOR).forEach(section => {
        _carouselInit(section)
        _modalInit(section);
    });    
});
