/**
 * Checks if the provided context indicates an editor preview mode by inspecting the URL for the `SQ_ACTION=preview` or `_matrixAssetId` query parameters.
 * Returns `false` if any issues are encountered, such as missing context, invalid URL, or parsing errors.
 *
 * @param {Object} ctx - The context object containing the URL to check.
 * @param {string} [ctx.url] - The URL to parse for query parameters.
 * @returns {boolean} Returns `true` if the URL contains `SQ_ACTION=preview` or `_matrixAssetId` as a query parameter, otherwise `false`.
 * @example
 * const ctx = { url: "https://example.com?SQ_ACTION=preview" };
 * console.log(isEditor(ctx)); // true
 *
 * const ctx2 = { url: "https://example.com?_matrixAssetId=12345" };
 * console.log(isEditor(ctx2)); // true
 *
 * const ctx3 = { url: "invalid-url" };
 * console.log(isEditor(ctx3)); // false
 *
 * const ctx4 = {};
 * console.log(isEditor(ctx4)); // false
 */
export function isEditor(ctx) {
    const { url } = ctx;
    if (!url || typeof url !== "string") return false;

    try {
        const urlParams = new URLSearchParams(new URL(url).search);
        const editMode = urlParams.get("SQ_ACTION") === "preview" || urlParams.has("_matrixAssetId");
        return editMode;
    } catch (error) {
        return false;
    }
}

/**
 * Generates a tag string based on the specified type and value.
 * Supports predefined tag types such as empty tags, field attributes, comments, or test attributes.
 * Returns an empty string if any issues are encountered, such as invalid or unsupported inputs.
 *
 * @param {string} type - The type of tag to generate. Must be one of: 'empty', 'field', 'comment', 'test'.
 * @param {string} value - The value to include in the generated tag or attribute.
 * @returns {string} The generated tag or attribute string for valid inputs, or an empty string if any issues occur.
 * @example
 * console.log(editTag('empty', 'div')); // '<div></div>'
 * console.log(editTag('field', 'username')); // ' data-sq-field="username" '
 * console.log(editTag('test', 'button')); // ' data-test="button" '
 * console.log(editTag('invalid', 'div')); // ''
 * console.log(editTag('field', '')); // ''
 * console.log(editTag(123, 'div')); // ''
 */
export function editTag(type, value) {
    // Validate input types
    if (typeof type !== 'string' || typeof value !== 'string') {
        return '';
    }

    // Define supported tag types
    const types = {
        empty: `<${value}></${value}>`,
        field: ` data-sq-field="${value}" `,
        comment: ` data-sq-comment="${value}" `,
        test: ` data-test="${value}" `
    };

    // Validate type
    if (!Object.keys(types).includes(type)) {
        return '';
    }

    // Validate value for non-empty requirement (excluding 'empty' type)
    if (type !== 'empty' && value.trim() === '') {
        return '';
    }

    return types[type];
}
