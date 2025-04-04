import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/**
 * Globals variables 
 * @constant {string} VERTICAL_VIDEO_PANEL_SELECTOR - Selector for vertical video panel elements.
 * @constant {string} VERTICAL_VIDEO_PANEL_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} VERTICAL_VIDEO_PANEL_MODAL_SELECTOR - Selector for modal container.
 * @constant {string} VERTICAL_VIDEO_PANEL_OPEN_MODAL_BTN - Selector for the button that opens the modal.
 * @constant {string} VERTICAL_VIDEO_PANEL_CLOSE_MODAL_BTN - Selector for the button that closes the modal.
 * @constant {string} VERTICAL_VIDEO_PANEL_MODAL_IFRAME - Selector for iframe container.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */
export const VERTICAL_VIDEO_PANEL_SELECTOR = 'section[data-component="vertical-video-panel"]';
export const VERTICAL_VIDEO_PANEL_HIDDEN_CLASS = 'su-hidden';
export const VERTICAL_VIDEO_PANEL_MODAL_SELECTOR = 'div[data-modal="modal"]';
export const VERTICAL_VIDEO_PANEL_OPEN_MODAL_BTN = 'button[data-click="open-modal"]';
export const VERTICAL_VIDEO_PANEL_CLOSE_MODAL_BTN = 'button[data-dismiss="modal"]';
export const VERTICAL_VIDEO_PANEL_MODAL_IFRAME = 'iframe[data-modal="iframe"]';
export let swiper; 

/**
 * Opens a modal by modifying the iframe's autoplay parameter and removing the hidden class.
 * @param {HTMLElement} modal - The modal element to open.
 */
export function openModal(modal) {
    const iframe =  modal.querySelector(VERTICAL_VIDEO_PANEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=0','autoplay=1');

    iframe.setAttribute('src', newSrc);
    modal.classList.remove(VERTICAL_VIDEO_PANEL_HIDDEN_CLASS);
    modal.hidden = false;
}

/**
 * Closes a modal by modifying the iframe's autoplay parameter and adding the hidden class.
 * @param {HTMLElement} modal - The modal element to close.
 */
export function closeModal(modal) {
    const iframe =  modal.querySelector(VERTICAL_VIDEO_PANEL_MODAL_IFRAME);
    const currentSrc = iframe.getAttribute('src');
    const newSrc = currentSrc.replace('autoplay=1','autoplay=0');

    iframe.setAttribute('src', newSrc);
    modal.classList.add(VERTICAL_VIDEO_PANEL_HIDDEN_CLASS);
    modal.hidden = true;
}

/**
 * Modal Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _modalInit(section) {
    const openModalBtn = section.querySelectorAll(VERTICAL_VIDEO_PANEL_OPEN_MODAL_BTN);
    const closeBtn = section.querySelectorAll(VERTICAL_VIDEO_PANEL_CLOSE_MODAL_BTN);
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
 * Ensure that the Swiper instance meets the necessary conditions for looping. This function checks if there are enough
 * slides for looping and adds duplicates if needed.
 *
 * @param {Swiper} swiper - The Swiper instance.
 * @param {Function} [callback=() => {}] - Optional callback function to execute after duplicating slides. Default is
 *   `() => {}`
 */
export function ensureLoopConditions(swiper, callback = () => {}) {
    const totalSlides = swiper.slides.length;
  
    if (totalSlides === 1 ) {
        document.querySelector('.component-slider-controls').remove();
    } else {
        duplicateSlides(swiper, totalSlides, callback);
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
export function duplicateSlides(swiper, totalSlides, callback = () => {}) {
    let prependHtml = [];
    let slideHtml = [];
    let appendHtml = [];
    swiper.slides.forEach((slide, idx) => {
        if (idx < 2 && !slide.classList.contains('swiper-slide-duplicate')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = slide.outerHTML;
            tempDiv.firstChild.classList.add("swiper-slide-duplicate");
            prependHtml.push(tempDiv.firstChild.outerHTML);
        } else if ((idx === totalSlides - 1 || idx === totalSlides - 2 ) && !slide.classList.contains('swiper-slide-duplicate')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = slide.outerHTML;
            tempDiv.firstChild.classList.add("swiper-slide-duplicate");
            appendHtml.push(tempDiv.firstChild.outerHTML);
        } 
        slideHtml.push(slide.outerHTML);
    });

    const allSlides = [...slideHtml, ...appendHtml];

    
    console.log(allSlides)

    swiper.wrapperEl.innerHTML=allSlides.join('');
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
 * Carousel Init function for card
 * @param {HTMLElement} section - The card carousel section DOM Element
 */
export function _carouselInit(section) {
    const uniqueClass = section.dataset.uniqueId;

    swiper = new Swiper(`section[data-unique-id="${uniqueClass}"] .swiper`, {
        breakpoints: {
            0: {
                slidesPerView: 1.4,
                spaceBetween: 20,
                centeredSlides: true,
                initialSlide: 0,
            },
            576: {
                slidesPerView: 1.6,
                spaceBetween: 20,
                centeredSlides: true,
                initialSlide: 0,
            },
            768: {
                slidesPerView: 1.9,
                spaceBetween: 50,
                centeredSlides: true,
                initialSlide: 0,
            },
        },
        slidesPerView: 1,
        watchSlidesProgress: true,
        loop: true,
        loopAdditionalSlides: 0,
        slidesPerGroup: 1,
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
                // if(swiper.activeIndex === 1) {
                //     swiper.slidePrev();
                // }
            },
            resize: swiper => {
                ensureLoopConditions(swiper);
            },
            paginationUpdate: swiper => {
                paginationUpdater(swiper);
            }
        }
    });
};

/**
 * Initializes carousel and modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `VERTICAL_VIDEO_PANEL_SELECTOR` selector
 * applies the `_carouselInit` function to each of them
 * applies the `_modalInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(VERTICAL_VIDEO_PANEL_SELECTOR).forEach(section => {
        _carouselInit(section);
        _modalInit(section);
    });    
});
