import { getCookie } from "../../global/js/utils/getCookie";

/**
 * Globals variables 
 * @constant {string} FOOTER_HIDDEN_CLASS - CSS class to hide elements.
 * 
 */
export const FOOTER_HIDDEN_CLASS = 'su-hidden';

export function _manageAudience(audience) {
    const audienceElements = {
        external: document.querySelectorAll('[data-audience="external"]'),
        faculty: document.querySelectorAll('[data-audience="faculty"]'),
        student: document.querySelectorAll('[data-audience="student"]'),
    };

    // Ensure all elements are hidden initially
    Object.values(audienceElements).forEach((element) => {
        element?.forEach((el) => {
            el.classList.add(FOOTER_HIDDEN_CLASS);
        });
    });
  
    // Show the element corresponding to the selected audience
    if (audienceElements[audience]) {
        audienceElements[audience].forEach((el) => {
            el.classList.remove(FOOTER_HIDDEN_CLASS);
        });
    }
}

/**
 * Initializes footer audience data when the DOM content is fully loaded.
 *
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    const audienceData = getCookie("preferences_personalisation");

    audienceData === "null" || !audienceData ? _manageAudience("external") : _manageAudience(audienceData);
});