import multicolumnFactPanelTemplate from './multicolumn-fact-panel.hbs';

/**
 * @module multicolumnFactPanelTemplate
 * @description A module for rendering a Multicolumn Fact Panel,
 */

export default {
    /**
     * Rendering Multicolumn Fact Panel.
     * 
     * @async
     * @function main
     * @param {Object} args - Configuration arguments for the listing.
     * @param {string} [args.eyebrow] - The text for the superheading above the title.
     * @param {string} [args.title] - The text for the title.
     * @param {string} [args.facts] - The array of facts to display.
     * @param {string} [args.paddingY] - The value of padding abouve and below the component.
     * @returns {Promise<string>} The rendered HTML string from the topicListingTemplate, or an error comment if processing fails.
     * @throws {Error} If FB_JSON_URL or query is invalid or if the fetch operation fails.
     */
    async main(args) {
        // Extract configuration data from arguments
        const { title, eyebrow, facts, paddingY } = args;

        // Validate required fields and ensure correct data types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (eyebrow && typeof eyebrow !== 'string') {
                throw new Error(
                    `The "eyebrow" field must be a string. The ${JSON.stringify(eyebrow)} was received.`
                );
            }
            if (facts && !Array.isArray(facts)) {
                throw new Error(
                    `The "facts" field must be an array. The ${JSON.stringify(facts)} was received.`
                );
            }
            if (paddingY && typeof paddingY !== 'string') {
                throw new Error(
                    `The "paddingY" field must be a string. The ${JSON.stringify(paddingY)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Multicolumn Fact Panel component: ', er);
            return `<!-- Error occurred in the Multicolumn Fact Panel component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            title,
            eyebrow,
            facts,
            paddingY,
        }

        return multicolumnFactPanelTemplate(componentData)
    }
};
