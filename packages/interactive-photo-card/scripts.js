/**
 * Interactive Photo Card Component
 * =============================
 * A module providing functionality for creating interactive photo cards that can flip on click.
 *
 * @module InteractivePhotoCard
 */

/**
 * Globals variables 
 * @constant {string} INTERACTIVE_PHOTO_CARD - Selector for interactive photo card elements
 * @constant {string} CARD_INNER - Selector for card inner elements within photo cards
 */
export const INTERACTIVE_PHOTO_CARD = '[data-component="interactive-photo-card"]';
export const CARD_INNER = '[data-card-inner]';

/**
 * Handles the flip animation of a photo card
 *
 * @function handleFlip
 * @param {HTMLElement} cardInner - The inner element of the photo card
 * @returns {void}
 */
export function handleFlip(cardInner) {
    const currentRotation = cardInner.style.transform ?
        parseInt(cardInner.style.transform.match(/rotateY\((\d+)deg\)/)?.[1]) || 0 :
        0;
    const newRotation = (currentRotation + 180) % 360;
    
    cardInner.style.transform = `rotateY(${newRotation}deg)`;
}

/**
 * Initializes an interactive photo card component
 *
 * @function initInteractivePhotoCard
 * @param {HTMLElement} cardElement - The photo card element to initialize
 * @throws {Error} If card inner element is not found
 * @returns {void}
 */
export function _interactivePhotoCardInit(cardElement) {
    const cardInner = cardElement.querySelector(CARD_INNER);
    
    if (!cardInner) {
        console.error('Could not find card inner element for component');
        return;
    }
    
    cardInner.addEventListener('click', () => handleFlip(cardInner));
}

/**
 * Initializes interactive photo cards when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `INTERACTIVE_PHOTO_CARD` selector
 * and applies the `_interactivePhotoCardInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(INTERACTIVE_PHOTO_CARD).forEach(card => {
        _interactivePhotoCardInit(card);
    });
});