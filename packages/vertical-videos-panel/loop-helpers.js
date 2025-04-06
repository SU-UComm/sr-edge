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