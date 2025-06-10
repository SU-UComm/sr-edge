/**
 * Globals variables 
 * @constant {string} METADATA_COPY_SELECTOR - Selector for metadata copy elements.
 */
export const METADATA_COPY_SELECTOR = 'button[data-role="copy-link"]';


/**
 * Copy Init function for card
 * @param {HTMLElement} btn - The copy button section DOM Element
 */
export function _copyInit(btn) {
    btn.addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const copyText = document.querySelector('[data-copy-text]');

            copyText.textContent = 'Copied';
            /* v8 ignore start */
            setTimeout(() => {
                copyText.textContent = 'Copy link';
            }, 3000);
            /* v8 ignore stop */
        });
    });
}

/**
 * Initializes copy listener when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `METADATA_COPY_SELECTOR` selector
 * applies the `_copyInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(METADATA_COPY_SELECTOR).forEach(btn => {
        _copyInit(btn)
    });    
});