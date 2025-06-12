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
