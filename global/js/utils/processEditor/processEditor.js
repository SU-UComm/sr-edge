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
 * 
 * @example
 * // Array mapping for multiple different fields
 * const squizEditTargets = {
 *     button: [
 *         { field: "colTwo.buttonConfiguration.buttonText" },
 *         { field: "colThree.buttonConfiguration.buttonText" }
 *     ]
 * };
 */

/**
 * Converts anchor tags with data-se attributes to span tags while preserving all attributes
 * @param {string} html - The HTML string to process
 * @returns {string} The processed HTML with anchor tags converted to spans
 */
function convertAnchorTagsToSpans(html) {
    // First convert opening tags
    const openingTagRegex = /<a\s+([^>]*?)(data-se\s*=\s*["'][^"']*["'][^>]*)>/gi;
    html = html.replace(openingTagRegex, (match, beforeDataSe, afterDataSe) => {
        // Combine the attributes before and after data-se
        const allAttributes = (beforeDataSe + ' ' + afterDataSe).trim();
        return `<span ${allAttributes}>`;
    });

    // Then convert closing tags
    const closingTagRegex = /<\/a>/gi;
    html = html.replace(closingTagRegex, '</span>');

    return html;
}

export async function processEditor(output, squizEditTargets) {
    // First convert any anchor tags with data-se to spans
    // output = convertAnchorTagsToSpans(output);

    for (const target in squizEditTargets) {
        const targetConfig = squizEditTargets[target];
        const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        if (Array.isArray(targetConfig)) {
            // Handle array mapping - multiple elements with same data-se mapped to different fields
            const regex = new RegExp(
                `(data-se\\s*=\\s*["']${escapedTarget}["'])(?!\\s+data-sq-field)`, 
                'gi'
            );
            
            let index = 0;
            output = output.replace(regex, (match, capturedGroup) => {
                // Use the field mapping for this index, or the last one if we run out
                const fieldMapping = targetConfig[index] || targetConfig[targetConfig.length - 1];
                const fieldName = fieldMapping.field;
                
                const result = `${capturedGroup} data-sq-field="${fieldName}"`;
                index++;
                return result;
            });
        } else if (targetConfig.array) {
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
