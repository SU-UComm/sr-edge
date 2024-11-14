import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// Globals 
export const IMAGE_GALLERY_SELECTOR = 'section[data-component="image-gallery-modal"]';
export const IMAGE_GALLERY_BTN = 'button[data-click="open-gallery-modal"]';
export const IMAGE_GALLERY_MODAL = 'div[data-modal="modal"]';
export const IMAGE_GALLERY_CLOSE_BTN = 'button[data-dismiss="modal"]';
export const IMAGE_GALLERY_HIDDEN_CLASS = 'su-hidden';
export let swiper; 

// open modal by id
export function openModal(modal) {
    modal.classList.remove(IMAGE_GALLERY_HIDDEN_CLASS);
}

// close currently open modal
export function closeModal(modal) {
    modal.classList.add(IMAGE_GALLERY_HIDDEN_CLASS);
}

// Slider init config
export function initSlider() {
    swiper = new Swiper(`${IMAGE_GALLERY_SELECTOR} .swiper`,  {
        slidesPerView: 1,
        variantClassName: "component-slider-imagegallery",
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
            el: `.component-slider-pagination-`,
            clickable: true,
            bulletElement: "button",
            renderBullet: function (index, className) {
                return `<button ${index === 0 ? 'aria-current="true"' : ""} class="${className}"><span class="sr-only">Slide ${index + 1}</span></button>`;
            },
        },
        watchSlidesProgress: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: false,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: false,
            },
            992: {
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: false,
            },
        }
    });
}

/**
 * Modal Init function for image gallery instance
 * @param {HTMLElement} section - The image gallery section DOM Element
 */
export function _modalInit(section) {
    const modal = section.querySelector(IMAGE_GALLERY_MODAL);
    const toggleBtn = section.querySelector(IMAGE_GALLERY_BTN);
    const closeBtn = section.querySelector(IMAGE_GALLERY_CLOSE_BTN);
    
    toggleBtn && toggleBtn.addEventListener('click', function() {
        openModal(modal)
        initSlider()
    });

    closeBtn && closeBtn.addEventListener('click', function() {
        closeModal(modal);
        swiper.destroy();
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal(modal);
            swiper.destroy();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(IMAGE_GALLERY_SELECTOR).forEach(section => {
        _modalInit(section);
    });
});
