/**
 * Processes the output to be editable in Page Builder.
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
 * 
 * @example
 * // Target-based filtering - only process elements with matching data-se-target
 * const squizEditTargets = {
 *     button: [
 *         { field: "colTwo.buttonConfiguration.buttonText", target: "infoTextButton" },
 *         { field: "colThree.buttonConfiguration.buttonText", target: "ctaButton" }
 *     ]
 * };
 * // HTML: <span data-se-target="infoTextButton" data-se="button"> will get data-sq-field="colTwo.buttonConfiguration.buttonText"
 * // HTML: <span data-se-target="ctaButton" data-se="button"> will get data-sq-field="colThree.buttonConfiguration.buttonText"
 * // HTML: <span data-se="button"> will not be processed if target is required
 */
export async function processEditor(output, squizEditTargets) {
    // First convert any anchor tags with data-se to spans
    // output = convertAnchorTagsToSpans(output);

    for (const target in squizEditTargets) {
        const targetConfig = squizEditTargets[target];
        const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Shared regex pattern for all cases
        const regex = new RegExp(
            `(data-se\\s*=\\s*["']${escapedTarget}["'])(?:\\s+data-se-target\\s*=\\s*["']([^"']*)["'])?(?!\\s+data-sq-field)`, 
            'gi'
        );
        
        if (Array.isArray(targetConfig)) {
            // Handle array mapping - each element gets sequential field mappings
            let elementIndex = 0;
            
            output = output.replace(regex, (match, capturedGroup, targetValue) => {
                // Get the field mapping for this element index
                const fieldMapping = targetConfig[elementIndex];
                
                // Check if target filtering is required and if target matches
                if (fieldMapping.target && targetValue !== fieldMapping.target) {
                    // Target doesn't match, return unchanged
                    return match;
                }
                
                const fieldName = fieldMapping.field;
                // Preserve the data-se-target attribute if it exists
                const targetAttr = targetValue ? ` data-se-target="${targetValue}"` : '';
                const result = `${capturedGroup}${targetAttr} data-sq-field="${fieldName}"`;
                
                elementIndex++; // Move to next field mapping for next element
                return result;
            });


        } else if (targetConfig.array) {
            // Handle array types with automatic indexing using square brackets
            let index = 0;
            output = output.replace(regex, (match, capturedGroup, targetValue) => {
                // Check if target filtering is required and if target matches
                if (targetConfig.target && targetValue !== targetConfig.target) {
                    // Target doesn't match, return unchanged
                    return match;
                }
                
                // Build field name with optional property
                const fieldName = targetConfig.property 
                    ? `${targetConfig.field}[${index}].${targetConfig.property}`
                    : `${targetConfig.field}[${index}]`;
                
                // Preserve the data-se-target attribute if it exists
                const targetAttr = targetValue ? ` data-se-target="${targetValue}"` : '';
                const result = `${capturedGroup}${targetAttr} data-sq-field="${fieldName}"`;
                index++;
                return result;
            });
        } else {
            // Handle regular single fields
            output = output.replace(regex, (match, capturedGroup, targetValue) => {
                // Check if target filtering is required and if target matches
                if (targetConfig.target && targetValue !== targetConfig.target) {
                    // Target doesn't match, return unchanged
                    return match;
                }
                
                // Preserve the data-se-target attribute if it exists
                const targetAttr = targetValue ? ` data-se-target="${targetValue}"` : '';
                return `${capturedGroup}${targetAttr} data-sq-field="${targetConfig.field}"`;
            });
        }
    }
    return output;
}
