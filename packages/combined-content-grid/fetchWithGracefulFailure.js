const COMPONENT_ERROR_PREFIX = 'Error occurred in the Combined Content Grid component';

export function formatComponentErrorComment(detail) {
    return `<!-- ${COMPONENT_ERROR_PREFIX}: ${detail} -->`;
}

/**
 * Resolves a data fetch without rejecting; returns a diagnostic HTML comment on failure.
 *
 * @param {Promise<*>} promise
 * @param {string} detail Short context prefix (e.g. "Failed to fetch event cards data")
 * @returns {Promise<{ value: *, errorComment: string|null }>}
 */
export async function fetchWithGracefulFailure(promise, detail) {
    try {
        const value = await promise;
        return { value, errorComment: null };
    } catch (er) {
        const message = er?.message || String(er);
        console.error(`${COMPONENT_ERROR_PREFIX}: ${detail}`, er);
        return {
            value: null,
            errorComment: formatComponentErrorComment(`${detail}. ${message}`),
        };
    }
}

/**
 * @param {string[]} errorComments
 * @param {string} html
 * @returns {string}
 */
export function prependErrorComments(errorComments, html) {
    if (!errorComments.length) {
        return html;
    }
    return `${errorComments.join('')}${html}`;
}