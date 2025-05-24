import { readingTime } from '../../global/js/utils/readingTime/readingTime.js';

/**
 * Globals variables 
 * @constant {string} FEATURE_STORY_HERO_SELECTOR - Selector for basic story hero elements.
 * @constant {string} FEATURE_STORY_HERO_READING_TIME_SELECTOR - Selector for basic story hero reading time element.
 * @type {import('swiper').Swiper | undefined} swiper - Instance of Swiper for handling gallery interactions.
 */

export const FEATURE_STORY_HERO_SELECTOR = 'section[data-component="feature-story-hero"]';
export const FEATURE_STORY_HERO_READING_TIME_SELECTOR = 'span[data-reading="true"]';

/**
 * Updates the reading time text inside the provided section based on the page content.
 *
 * It calculates the estimated reading time from the text content of the `.su-page-content` element
 * and displays the result in the element matched by `FEATURE_STORY_HERO_READING_TIME_SELECTOR` inside the given section.
 *
 * @param {HTMLElement} section - The section element containing the reading time placeholder to update.
 *
 */
export function _readingTimeUpdate(section) {
    const content = document.querySelector(".su-page-content");
    const readingTimeEl = section.querySelector(FEATURE_STORY_HERO_READING_TIME_SELECTOR);

    if (content && readingTimeEl) {
        const time = readingTime(content.innerText);
        readingTimeEl.textContent = time;
    }

}

/**
 * Initializes reading Time Update and modal when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `FEATURE_STORY_HERO_SELECTOR` selector
 * applies the `_readingTimeUpdate` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(FEATURE_STORY_HERO_SELECTOR).forEach(section => {
        _readingTimeUpdate(section);
    });    
});
