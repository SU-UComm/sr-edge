import { setCookie } from "../../global/js/utils/setCookie";
import { getCookie } from "../../global/js/utils/getCookie";
import { cdpSetPersona } from "../../global/js/utils/cdpSetPersona";
import { cdpSetConsent } from "../../global/js/utils/cdpSetConsent";
import { _preferencesSettings } from './scripts/preferenceSettings';
import { ReportHeader } from './scripts/reportHeader';
import relatedStoryData from './scripts/relatedStory';
import { updateStoryHeadline } from './scripts/updateStoryHeadline.js';

/**
 * Globals variables 
 * @constant {string} HEADER_SELECTOR - Selector for header elements.
 * @constant {string} HEADER_COOKIE_CONSENT_BANNER_SELECTOR - Selector for cookie consent banner elements.
 * @constant {string} HEADER_COOKIE_CONSENT_BANNER_HIDDEN_CLASS - CSS class to hide elements.
 * 
 */

export const HEADER_SELECTOR = 'header[data-component="header-component"]';
export const HEADER_COOKIE_CONSENT_BANNER_SELECTOR = 'section[data-subcomponent="header-cookie-consent-banner"]';
export const HEADER_HIDDEN_CLASS = 'su-hidden';

export let consent = false;

export function _hideConsentBanner() {
    const content = document.querySelector(HEADER_COOKIE_CONSENT_BANNER_SELECTOR);
    
    content && content.classList.add(HEADER_HIDDEN_CLASS);
    content && content.classList.remove('active');
}
export function _showConsentBanner() {
    const content = document.querySelector(HEADER_COOKIE_CONSENT_BANNER_SELECTOR);
    content && content.classList.remove(HEADER_HIDDEN_CLASS);
    content && content.classList.add('active');
}

export function _manageAudience(audience) {
    const audienceElements = {
        external: document.querySelectorAll('[data-audience="external"]'),
        faculty: document.querySelectorAll('[data-audience="faculty"]'),
        student: document.querySelectorAll('[data-audience="student"]'),
    };
    const preferenceInfo = {
        student: document.querySelector('button[data-click="student-persona"]'),
        faculty:  document.querySelector('button[data-click="faculty-persona"]'),
    }

    // Ensure all elements are hidden or falsed initially
    Object.values(audienceElements).forEach((element) => {
        element?.forEach((el) => {
            el.classList.add(HEADER_HIDDEN_CLASS);
        });
    });
    Object.values(preferenceInfo).forEach((element) => {
        if(element){
            element.setAttribute('aria-pressed', 'false');
        }
    });
  
    // Show or set atrybut to true the element corresponding to the selected audience
    if (audienceElements[audience]) {
        audienceElements[audience].forEach((el) => {
            el.classList.remove(HEADER_HIDDEN_CLASS);
        });
    }
    if (preferenceInfo[audience]) {
        preferenceInfo[audience].setAttribute('aria-pressed', 'true');
    }
}

export const handlePersona = async (personaVal, audienceData, removeConsent = false) => {
    // check if we have consent first, if not, we need to set it
    let persona = null;
    if (!consent && removeConsent === false) {
        // if no consent previously given
        await cdpSetConsent(1);
        consent = true;
        _hideConsentBanner();
    }
    if (personaVal) {
        if (audienceData === personaVal) {
            // if we've selected the same option again, we need to un-check it
            // so, force into external
            persona = "external";
        } else {
            persona = personaVal;
        }
    }
    await cdpSetPersona("persona-selector", persona);
    // Remove consent if clearing all personalization
    if (removeConsent === true) {
        await cdpSetConsent(0);
        consent = false;
    }

    setCookie("preferences_personalisation", persona, true, 130);
    
    audienceData = persona;

    _manageAudience(audienceData); 

    document.dispatchEvent(document.personaChangeEvent);
   
    window.location.reload();
};


export const handleConsent = async (value) => {
    if (value === true) {
        await cdpSetConsent(1);
        consent = true;
        _hideConsentBanner();
    } else {
        await cdpSetConsent(0);
        consent = false;
        _hideConsentBanner();
    }
};


/**
 * Initializes menu, search and preferences trace when the DOM content is fully loaded.
 *
 * applies the `_menuInit`
 * applies the `ReportHeader`
 * applies the `_preferencesSettings`
 *
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {    
    const studentPersona = document.querySelector(`button[data-click="student-persona"]`)
    const facultyPersona = document.querySelector(`button[data-click="faculty-persona"]`)

    const pageController = typeof window.pageController !== "undefined" ? window.pageController : null;
    const links = document.querySelectorAll('a[data-menu="main-nav"]');
    const storyHeadline = document.querySelector('[data-current-story="headline"]');

    // This is legacy code, however, it works
    const headerDom = document.querySelector(HEADER_SELECTOR);
    // eslint-disable-next-line no-unused-vars
    const reportHeaderInit = headerDom && new ReportHeader(headerDom);
    
    let relatedStory = null;

    const cdpConsentCookie = JSON.parse(getCookie("squiz.cdp.consent"));
    // do we have consent data
    const consentData = cdpConsentCookie?.CDPConsent;
    const clearPreferences = document.querySelector('button[data-click="clear-preferences"]');

    const props = {};
    props.pageData = pageController;
    // do we have consent data
    props.consentData = cdpConsentCookie?.CDPConsent;

    props.audienceData = getCookie("preferences_personalisation");;
    if (props.audienceData === "null" || !props.audienceData) {
        props.audienceData = "external";
    }
    // set the props we need, to a window variable
    window.suHeaderProps = props;

    _preferencesSettings();

   
    pageController && links && links.forEach((link) => {
        if (pageController?.id === link.dataset.id) {
            link.classList.remove('su-border-transparent');
            link.classList.add('!su-text-digital-red su-border-digital-red dark:su-border-dark-mode-red dark:!su-text-dark-mode-red')
        }
    })
    if (pageController?.isStory) {
        headerDom.classList.add('report-header--story');
        const fetchRelatedStoryData = async () => {
            const fbStoryData = await relatedStoryData(
                props.pageData,
                props.audienceData
            );
            relatedStory = fbStoryData;
            updateStoryHeadline(relatedStory, pageController, storyHeadline, HEADER_HIDDEN_CLASS);
        };
        fetchRelatedStoryData();
    }
    
    if(!consentData){
        _showConsentBanner();
    }
    if (consentData) {
        _hideConsentBanner();
        
        if (clearPreferences) {
            clearPreferences.removeAttribute('disabled');
            clearPreferences.setAttribute("aria-pressed", "false");
            clearPreferences.classList.add('su-text-digital-blue');
            clearPreferences.classList.add('dark:su-text-digital-blue-vivid');
            clearPreferences.addEventListener('click', async function() {
                await handlePersona(null, null, true);
            });
        }
    } 

    const acceptCookieConsent = document.querySelector('button[data-click="accept-consent"]');
    const rejectCookieConsent = document.querySelector('button[data-click="reject-consent"]');

    acceptCookieConsent && acceptCookieConsent.addEventListener('click', function() {
        handleConsent(true);
    });

    rejectCookieConsent && rejectCookieConsent.addEventListener('click', function() {
        handleConsent(false);
    });

    const audienceData = getCookie("preferences_personalisation");

    audienceData === "null" || !audienceData ? _manageAudience("external") : _manageAudience(audienceData);

    studentPersona && studentPersona.addEventListener('click', function() {
        handlePersona("student", audienceData);
    });

    facultyPersona && facultyPersona.addEventListener('click', function() {
        handlePersona("faculty", audienceData);
    });
});
