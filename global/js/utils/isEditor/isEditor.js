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
export function isEditor(url) {
    const hasSqActionPreview = /\bSQ_ACTION=preview\b/.test(url);
    const hasMatrixAssetId = /\b_matrixAssetId=/.test(url);
    return hasSqActionPreview || hasMatrixAssetId;
}

/**
 * Processes the output to be editable in Squiz Editor.
 *
 * @param {string} output - The HTML output to be processed.
 * @param {Object} squizEditTargets - The targets to be processed for Squiz Editor.
 * @returns {string} The processed HTML output with Squiz Editor attributes.
 * @example
 * const output = "<div data-se='card'>Card Content</div>";
 * const squizEditTargets = {
 *     card: {
 *         field: "card",
 *         array: true,
 *         property: "title"
 *     }
 * };
 * const processedOutput = await processSquizEdit(output, squizEditTargets);
 * console.log(processedOutput); // "<div data-se='card' data-sq-field='card[0].title'>Card Content</div>"
 */
export async function processSquizEdit(output, squizEditTargets) {
    for (const target in squizEditTargets) {
        const targetConfig = squizEditTargets[target];
        const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        if (targetConfig.array) {
            // Handle array types with automatic indexing using square brackets
            const regex = new RegExp(
                `(data-se\\s*=\\s*["']${escapedTarget}["'])(?!\\s+data-sq-field)`, 
                'gi'
            );
            
            let index = 0;
            output = output.replace(regex, (match, capturedGroup) => {
                // Build field name with optional property
                const fieldName = targetConfig.property 
                    ? `${targetConfig.field}[${index}].${targetConfig.property}`
                    : `${targetConfig.field}[${index}]`;
                
                const result = `${capturedGroup} data-sq-field="${fieldName}"`;
                index++;
                return result;
            });
        } else {
            // Handle regular single fields
            const regex = new RegExp(
                `(data-se\\s*=\\s*["']${escapedTarget}["'])(?!\\s+data-sq-field)`, 
                'gi'
            );
            
            output = output.replace(
                regex, 
                `$1 data-sq-field="${targetConfig.field}"`
            );
        }
    }
    return output;
}
