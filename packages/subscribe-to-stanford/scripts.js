// Globals 
/**
 * CSS selector for the subscription component section.
 * Used to find all instances of the component on the page.
 * @constant {string}
 */
export const CONTENT_SELECTOR = 'section[data-component="subscribe-to-stanford-report"]';

/**
 * Initializes subscription form functionality within a given section.
 * Handles validation and submission behavior for email input.
 * 
 * @param {HTMLElement} section - The section element containing the subscription form.
 */
export function _subscribeInit(section) {
    const subscribeForm = section.querySelector('form');
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    const errorContainer = subscribeForm.querySelector('#error-container');

    subscribeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let subscriptionError = "";
        const emailVal = emailInput.value;
        if (!emailVal || !emailVal.match(/\w+@\w+\.\w+/)) {
            subscriptionError = `<span id="subscription-error" class="su-block su-text-16 su-font-normal su-text-digital-red-light">Please enter a valid email address.</span>`;
            errorContainer.innerHTML = subscriptionError;
            emailInput.setAttribute('aria-describedby', 'subscription-error');
            return;
        }
        errorContainer.innerHTML = "";
        emailInput.removeAttribute('aria-describedby');
        event.target.submit();
    });

    emailInput.addEventListener('keyup', function() {
        const emailVal = emailInput.value;
        const errorContainer = subscribeForm.querySelector('#error-container');
        if(emailVal.match(/\w+@\w+\.\w+/)){
            errorContainer.innerHTML = "";
            emailInput.removeAttribute('aria-describedby');
        }
    });

};

/**
 * Finds and initializes all subscribe-to-stanford-report components on the page.
 */
export function initSubscribeScripts() {
    document.querySelectorAll(CONTENT_SELECTOR).forEach(elem => {
        _subscribeInit(elem);
    });
}

// Auto-initialize in browser
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initSubscribeScripts);
}

