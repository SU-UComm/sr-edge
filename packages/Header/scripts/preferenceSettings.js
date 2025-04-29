import { getCookie } from "../../../global/js/utils/getCookie";
import { setCookie } from "../../../global/js/utils/setCookie";

export function _preferencesSettings() {
    /**
     * Banner wrapper selector.
     * @const {string}
     */
    const LIGHT_TOGGLE_SELECTOR = '[id="light-theme"]';
    const DARK_TOGGLE_SELECTOR = '[id="dark-theme"]';
    const PREFERENCES_DARKMODE_ACTIVE = `[data-role="su-darkmode-icon-active"]`;
    const PREFERENCES_DARKMODE_NONACTIVE = `[data-role="su-darkmode-icon-nonactive"]`;

    /**
     * How many days dismissal will be stored in cookie.
     * @const {number}
     */
    // const DAYS_TO_EXPIRY = 7;

    const lightToggle = document.querySelector(LIGHT_TOGGLE_SELECTOR);
    const darkToggle = document.querySelector(DARK_TOGGLE_SELECTOR);
    const darkmodeActiveIcon = document.querySelector(
        PREFERENCES_DARKMODE_ACTIVE
    );
    const darkmodeNonActiveIcon = document.querySelector(
        PREFERENCES_DARKMODE_NONACTIVE
    );

    const htmlTag = document.querySelector("html");
    if (lightToggle && darkToggle) {
        // Theme preferences
        const theme = getCookie("preferences_theme");
        
        if (
            theme === "dark" ||
            (["", null, undefined, false].includes(theme) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            htmlTag.classList.add("su-dark");
            darkmodeActiveIcon.classList.remove("su-hidden");
            darkmodeNonActiveIcon.classList.add("su-hidden");
            darkToggle.checked = true;
            lightToggle.checked = false;
        } else {
            darkmodeActiveIcon.classList.add("su-hidden");
            darkmodeNonActiveIcon.classList.remove("su-hidden");
            htmlTag.classList.add("su-light");
            lightToggle.checked = true;
            darkToggle.checked = false;
        }

        lightToggle.addEventListener("keyup", ({ key }) => {
            if ([" ", "Enter"].includes(key)) {
            document.querySelector(`[data-theme="dark-theme"]`).click();
            }
        });

        darkToggle.addEventListener("keyup", ({ key }) => {
            if ([" ", "Enter"].includes(key)) {
            document.querySelector(`[data-theme="light-theme"]`).click();
            }
        });

        /* Set as light theme preference */
        lightToggle.addEventListener("click", () => {
            htmlTag.classList.remove("su-dark");
            htmlTag.classList.add("su-light");
            darkmodeActiveIcon.classList.add("su-hidden");
            darkmodeNonActiveIcon.classList.remove("su-hidden");

            setCookie(
                "preferences_theme",
                "light",
                true,
                130
            );
        });

        /* Set as dark theme preference */
        darkToggle.addEventListener("click", () => {
            htmlTag.classList.remove("su-light");
            htmlTag.classList.add("su-dark");
            darkmodeActiveIcon.classList.remove("su-hidden");
            darkmodeNonActiveIcon.classList.add("su-hidden");

            setCookie(
                "preferences_theme",
                "dark",
                true,
                130
            );
        });

      // custom event for state updates
      document.personaChangeEvent = new Event("personaChange");
    }
}

export default _preferencesSettings;