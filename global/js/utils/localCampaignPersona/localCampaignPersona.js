const MANUAL_PERSONAS = ["student", "faculty"];

/**
 * Normalizes preferences_personalisation cookie values (quotes, encoding, "null").
 *
 * @param {string|null|undefined} cookieValue
 * @returns {string|null}
 */
export function normalizePersonaCookieValue(cookieValue) {
    if (cookieValue == null || cookieValue === "") {
        return null;
    }

    let value = cookieValue;

    try {
        value = decodeURIComponent(value);
    } catch {
        value = cookieValue;
    }

    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        value = value.slice(1, -1);
    }

    if (value === "null") {
        return null;
    }

    return value;
}

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

    const persona = normalizePersonaCookieValue(cookieValue);

    if (persona === "local") {
        return false;
    }

    if (persona && MANUAL_PERSONAS.includes(persona)) {
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
    const persona = normalizePersonaCookieValue(cookieValue);

    if (!persona) {
        return "external";
    }

    if (persona === "local") {
        return "external";
    }

    return persona;
}