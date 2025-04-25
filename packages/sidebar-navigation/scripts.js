
/**
 * Globals variables 
 * @constant {string} SIDEBAR_NAV_SELECTOR - Selector for sidebar nav elements.
 * @constant {string} SIDEBAR_NAV_MENU_SELECTOR - Selector for menu element.
 * @constant {string} SIDEBAR_NAV_HIDDEN_CLASS - CSS class to hide elements.
 * @constant {string} SIDEBAR_NAV_TOGGLE_BTN - Selector for the button that toggle the mobile menu.
 */

export const SIDEBAR_NAV_SELECTOR = 'section[data-component="sidebar-navigation"]';
export const SIDEBAR_NAV_MENU_SELECTOR = 'nav[data-nav="nav"]';
export const SIDEBAR_NAV_HIDDEN_CLASS = 'su-hidden';
export const SIDEBAR_NAV_TOGGLE_BTN = 'button[data-click="toggle-nav"]';
export const SIDEBAR_NAV_TOGGLE_BTN_CLASS = 'su-bg-digital-red su-text-white dark:su-bg-dark-mode-red dark:aria-expanded:su-text-black-true';
export const SIDEBAR_NAV_TOGGLE_LABEL_SELECTOR = 'span[data-label="button"]';


/**
 * Updates the sidebar navigation toggle button based on its open/closed state.
 *
 * This function sets the `aria-expanded` attribute, toggles classes,
 * shows/hides icons, and updates the label text accordingly.
 *
 * @param {HTMLElement} btn - The toggle button element.
 * @param {boolean} isOpen - The current state of the sidebar (true if open, false if closed).
 *
 */
export function changeStageToggleBtn(btn, isOpen) {    
    const label = btn.querySelector(SIDEBAR_NAV_TOGGLE_LABEL_SELECTOR);
    const barIcon = btn.querySelector('svg[data-icon="bars"]');
    const xmarkIcon = btn.querySelector('svg[data-icon="xmark"]');

    btn.setAttribute('aria-expanded', isOpen.toString());
    SIDEBAR_NAV_TOGGLE_BTN_CLASS.split(' ').forEach(className => {
        btn.classList.toggle(className, isOpen);
    });

    if (barIcon) {
        barIcon.classList.toggle(`!${SIDEBAR_NAV_HIDDEN_CLASS}`, isOpen);
        barIcon.hidden = isOpen;
    }
    
    if (xmarkIcon) {
        xmarkIcon.classList.toggle(`!${SIDEBAR_NAV_HIDDEN_CLASS}`, !isOpen);
        xmarkIcon.hidden = !isOpen;
    }
        
    if (label) {
        label.innerHTML = isOpen ? label.getAttribute('data-label-close') : label.getAttribute('data-label-open');  
    }
}

/**
 * Opens a menu by removing the hidden class.
 * @param {HTMLElement} menu - The menu element to open.
 * @param {HTMLElement} btn - The toggle button element.
 */
export function openMenu(menu, btn) {
    menu.classList.remove(SIDEBAR_NAV_HIDDEN_CLASS);
    menu.hidden = false;
    changeStageToggleBtn(btn, true);
}

/**
 * Closes a menu by adding the hidden class.
 * @param {HTMLElement} menu - The menu element to close.
 * @param {HTMLElement} btn - The toggle button element.
 */
export function closeMenu(menu, btn) {   
    menu.classList.add(SIDEBAR_NAV_HIDDEN_CLASS);
    menu.hidden = true;
    changeStageToggleBtn(btn, false);
}

/**
 * menu Init function
 * @param {HTMLElement} section - The sidebar nav section DOM Element
 */
export function _menuInit(section) {
    const toggleMenuBtn = section.querySelector(SIDEBAR_NAV_TOGGLE_BTN);
    const menu = section.querySelector(SIDEBAR_NAV_MENU_SELECTOR);
    let resizeTimeout;

    toggleMenuBtn && toggleMenuBtn.addEventListener('click', function() {    
        const isExpanded = toggleMenuBtn.getAttribute('aria-expanded') === 'true';

        // Add the outside click listener only once
        if (!menu.dataset.listenerAdded) {
            document.addEventListener('click', (event) => {
                const isClickInsideMenu = menu.contains(event.target);
                const isClickOnToggleBtn = toggleMenuBtn.contains(event.target);

                if (!isClickInsideMenu && !isClickOnToggleBtn) {
                    closeMenu(menu, toggleMenuBtn);
                }
            });

            menu.dataset.listenerAdded = 'true';
        }

        if (isExpanded) {
            closeMenu(menu, toggleMenuBtn);
        } else {
            openMenu(menu, toggleMenuBtn);
        }
    });

    // Add event listener for excape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            menu && toggleMenuBtn && closeMenu(menu, toggleMenuBtn);
        }
    });

    // Add event listener for window resize
    /* v8 ignore start */
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 991) {
                menu && toggleMenuBtn && openMenu(menu, toggleMenuBtn);
            } else {
                menu && toggleMenuBtn && closeMenu(menu, toggleMenuBtn);
            }
        }, 10);
    });
    /* v8 ignore end */
};

/**
 * Initializes menu and menu when the DOM content is fully loaded.
 *
 * This function selects all elements matching the `SIDEBAR_NAV_SELECTOR` selector
 * applies the `_menuInit` function to each of them
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll(SIDEBAR_NAV_SELECTOR).forEach(section => {
        _menuInit(section);
    });    
});
