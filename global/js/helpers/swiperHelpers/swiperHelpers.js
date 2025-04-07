/**
 * Duplicate slides in the Swiper instance to meet the minimum slide requirements.
 *
 * @param {Swiper} swiper - The Swiper instance.
 * @param {number} minSlides - The minimum number of slides required.
 * @param {number} slidesPerGroup - The number of slides per group.
 * @param {Function} [callback=() => {}] - Optional callback after duplicating.
 */
export function duplicateSlides(swiper, minSlides, slidesPerGroup, callback = () => {}) {
    const totalSlides = swiper.slides.length;
    let slidesToAdd = minSlides - totalSlides + 1;

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
 * Ensures Swiper loop behavior by checking number of slides and duplicating if needed.
 *
 * @param {Swiper} swiper - The Swiper instance.
 * @param {Function} [callback=() => {}] - Optional callback.
 */
export function ensureLoopConditions(swiper, callback = () => {}) {
    const { slidesPerView, slidesPerGroup } = swiper.params;
    const totalSlides = swiper.slides.length;
    const minSlides = Math.ceil(slidesPerView + slidesPerGroup);

    if (totalSlides === 1) {
        document.querySelector('.component-slider-controls')?.remove();
    }

    if (totalSlides - 1 < minSlides || totalSlides % slidesPerGroup !== 0) {
        duplicateSlides(swiper, minSlides, slidesPerGroup, callback);
    }
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
export const updateAccessibility = (swiper, focusItems = "a, button", isFocus) => {
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

        if (focusItems) {
            const slideTarget = slide.querySelector(focusItems)
            ? slide.querySelector(focusItems)
            : null;

            if(isFocus) {
                slideTarget && slideTarget.focus();
            }
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