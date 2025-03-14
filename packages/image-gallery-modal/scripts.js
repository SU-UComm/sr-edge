import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/**
 * Globals variables 
 * @constant {string} IMAGE_GALLERY_SELECTOR - Selector for image gallery elements.
 * @constant {string} IMAGE_GALLERY_BTN - Selector for the button that opens the modal.
 * @constant {string} IMAGE_GALLERY_MODAL - Selector for modal container.
 * @constant {string} IMAGE_GALLERY_CLOSE_BTN - Selector for the button that closes the modal.
 * @constant {string} IMAGE_GALLERY_HIDDEN_CLASS - CSS class to hide elements.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const IMAGE_GALLERY_SELECTOR = 'section[data-component="image-gallery-modal"]';
export const IMAGE_GALLERY_BTN = 'button[data-click="open-gallery-modal"]';
export const IMAGE_GALLERY_MODAL = 'div[data-modal="modal"]';
export const IMAGE_GALLERY_CLOSE_BTN = 'button[data-dismiss="modal"]';
export const IMAGE_GALLERY_HIDDEN_CLASS = 'su-hidden';
export let swiper; 


export const focusTrap = (event, dialog) => {
    const focusableSelectors =
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
        dialog?.querySelectorAll(focusableSelectors),
    )?.filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
    );

    if (focusableElements.length === 0 || event?.key !== 'Tab') {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Move to the last focusable element if we are on the first one and Shift + Tab is pressed
    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    }
    // Move to the first focusable element if we are on the last one and Shift is pressed
    else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
};

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    modal.classList.remove(IMAGE_GALLERY_HIDDEN_CLASS);
    modal.hidden = false;

    //Focus trap for drawers
    document.addEventListener('keydown', (event) => {
        if (modal) {
            focusTrap(event, modal);
        }
    });
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    modal.classList.add(IMAGE_GALLERY_HIDDEN_CLASS);
    modal.hidden = true;
}

/**
 * Initializes slider functionality for each modal.
 */
export function initSlider(modal) {
    const uniqueID = modal.dataset.modalId;

    swiper = new Swiper(`div[data-modal-id="${uniqueID}"] .swiper`,  {
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
            nextEl: `div[data-modal-id="${uniqueID}"] .component-slider-next`,
            prevEl: `div[data-modal-id="${uniqueID}"] .component-slider-prev`,
        },
        pagination: {
            el: `.component-slider-pagination-${uniqueID}`,
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
        initSlider(modal)
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

/**
 * Initializes modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `IMAGE_GALLERY_SELECTOR` selector
 * and applies the `_modalInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(IMAGE_GALLERY_SELECTOR).forEach(section => {
        _modalInit(section);
    });
});
