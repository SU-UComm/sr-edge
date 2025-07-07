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
    
    // Update accessibility states for both sides of the card
    const cardsInnerContent = cardInner.querySelectorAll(CARD_INNER_CONTENT);
    toggleCardsVisibility(cardsInnerContent);
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
    
    // Find both flip buttons (plus icon and rotate arrows icon)
    const flipButtons = cardInner.querySelectorAll('button[aria-label="See additional information"], button[aria-label="Dismiss content"]');
    
    if (!flipButtons.length) {
        console.error('Could not find flip buttons for component');
        return;
    }
    
    // Add click event to each flip button
    flipButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            handleFlip(cardInner);
        });
    });
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
 * Sets up initial accessibility states for card content elements
 *
 * @function initInteractivePhotoCardContent
 * @param {HTMLElement} cardElement - Parent element containing card inner content elements
 * @returns {void}
 */
export const _interactivePhotoCardContentInit = (cardElement) => {
    const cardsInnerContent = cardElement.querySelectorAll(CARD_INNER_CONTENT);
    
    if (!cardsInnerContent.length) return;
    
    // Set initial accessibility states without adding click events
    // Click events are now handled by the flip buttons only
    cardsInnerContent.forEach(card => {
        const button = card.querySelector('button');
        if (button) {
            const isHidden = card.getAttribute('aria-hidden') === 'true';
            button.tabIndex = isHidden ? '-1' : '';
        }
    });
};

function initializeInteractivePhotoCards() {
    document.querySelectorAll(INTERACTIVE_PHOTO_CARD).forEach(card => {
        _interactivePhotoCardInit(card);
        _interactivePhotoCardContentInit(card);
    });
}
/**
 * Initializes interactive photo cards when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `INTERACTIVE_PHOTO_CARD` selector
 * and applies the `_interactivePhotoCardInit` function to each of them.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', initializeInteractivePhotoCards);
document.addEventListener('livePreviewUpdated', initializeInteractivePhotoCards);