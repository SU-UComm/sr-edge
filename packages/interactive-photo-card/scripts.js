/**
 * Globals variables 
 * @constant {string} INTERACTIVE_PHOTO_CARD - Selector for interactive photo card elements.
 * @constant {string} CARD_INNER - Selector for card inner elements within photo cards.
 * @constant {string} CARD_INNER_CONTENT - Selector for card inner content elements within photo cards.
 */
export const INTERACTIVE_PHOTO_CARD = '[data-component="interactive-photo-card"]';
export const CARD_INNER = '[data-card-inner]';
export const CARD_INNER_CONTENT = '[data-card-inner-content]';

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
 * Toggles the visibility of multiple cards by manipulating their aria-hidden attribute
 *
 * @function toggleCardsVisibility
 * @param {NodeListOf<HTMLElement>} cardsInnerContent - Collection of card elements to toggle
 * @returns {void}
 */
export const toggleCardsVisibility = (cardsInnerContent) => {
    cardsInnerContent.forEach(card => {
        const newHiddenState = card.getAttribute('aria-hidden') === 'true' ? 'false' : 'true';
        
        const button = card.querySelector('button');

        if (button) {
            button.tabIndex = newHiddenState === 'true' ? '-1' : '';
        }

        card.setAttribute('aria-hidden', newHiddenState);
    });
};

/**
 * Initializes interactive photo card content functionality
 * Sets up click handlers for all card inner content elements
 *
 * @function initInteractivePhotoCardContent
 * @param {HTMLElement} cardElement - Parent element containing card inner content elements
 * @throws {Error} If card inner content elements are not found
 * @returns {void}
 */
export const _interactivePhotoCardContentInit = (cardElement) => {
    const cardsInnerContent = cardElement.querySelectorAll(CARD_INNER_CONTENT);
    
    if (!cardsInnerContent.length) return;
    
    cardsInnerContent.forEach(card => 
        card.addEventListener('click', () => toggleCardsVisibility(cardsInnerContent))
    );
};

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
        _interactivePhotoCardContentInit(card);

    });
});