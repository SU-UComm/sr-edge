/**
 * Checks if the provided context indicates an editor preview mode by inspecting the URL for the `SQ_ACTION=preview` query parameter.
 *
 * @param {Object} ctx - The context object containing the URL to check.
 * @param {string} [ctx.url] - The URL to parse for query parameters.
 * @returns {boolean} Returns `true` if the URL contains `SQ_ACTION=preview`, otherwise `false`.
 * @throws {TypeError} If the `url` is provided but is not a valid URL string.
 * @example
 * const ctx = { url: "https://example.com?SQ_ACTION=preview" };
 * console.log(isEditor(ctx)); // true
 *
 * const ctx2 = { url: "https://example.com?SQ_ACTION=other" };
 * console.log(isEditor(ctx2)); // false
 *
 * const ctx3 = {};
 * console.log(isEditor(ctx3)); // false
 */
export function isEditor(ctx) {
    const { url } = ctx;
    if(!url) return false;

    const urlParams = new URLSearchParams(new URL(url).search);
    const editMode = urlParams.get("SQ_ACTION") === "preview" || urlParams.has("_matrixAssetId")
    // or when _matrixAssetId= is in the url

    return editMode;
}

export function editTag(type, value) {
    // types = field
    const types = {
        "empty": `<${value}></${value}>`,
        "field": ` data-sq-field="${value}" `,
        "comment": ` data-sq-comment="${value}" `
    }

    return types[type];
}
