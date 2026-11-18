const MANUAL_PERSONAS = ["student", "faculty"];

/**
 * Returns "local" when URL search params match the local email campaign.
 *
 * @param {URLSearchParams} searchParams
 * @returns {"local"|null}
 */
export function getLocalPersonaFromSearchParams(searchParams) {
    if (!searchParams) {
        return null;
    }

    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");

    if (medium === "email" && campaign === "local") {
        return "local";
    }

    return null;
}

/**
 * Whether the local campaign should set preferences_personalisation to local.
 * Does not override student, faculty, or an existing local cookie.
 *
 * @param {string|null|undefined} cookieValue Current preferences_personalisation value.
 * @param {URLSearchParams} searchParams Page URL search params.
 * @returns {boolean}
 */
export function shouldApplyLocalPersona(cookieValue, searchParams) {
    if (getLocalPersonaFromSearchParams(searchParams) !== "local") {
        return false;
    }

    if (cookieValue === "local") {
        return false;
    }

    if (MANUAL_PERSONAS.includes(cookieValue)) {
        return false;
    }

    return true;
}

/**
 * Maps stored personalisation cookie values to data-audience keys used in the UI.
 *
 * @param {string|null|undefined} cookieValue
 * @returns {string}
 */
export function audienceForUi(cookieValue) {
    if (cookieValue === "null" || !cookieValue) {
        return "external";
    }

    if (cookieValue === "local") {
        return "external";
    }

    return cookieValue;
}