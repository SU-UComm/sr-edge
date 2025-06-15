import multicolumnFactPanelTemplate from './multicolumn-fact-panel.hbs';
import { processEditor } from '../../global/js/utils/processEditor';

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
     * @param {Array} [args.facts] - The array of facts to display.
     * @param {string} [args.paddingY] - The value of padding abouve and below the component.
     * @returns {Promise<string>} The rendered HTML string from the topicListingTemplate, or an error comment if processing fails.
     * @throws {Error} If FB_JSON_URL or query is invalid or if the fetch operation fails.
     */
    async main(args, info) {
        // Extract configuration data from arguments
        let { title, eyebrow, facts, paddingY } = args;

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor
        // Must fallback to false, use true to mock the editor
        const squizEdit = info?.ctx?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;

        // NEW: add a default if squizEdit is true
        if (squizEdit) {
            // Add default values if content is not provided
            eyebrow = eyebrow || 'Eyebrow';
            title = title || 'Lorem ipsum dolor';
            facts = facts && facts.length > 0 ? facts : [
                {
                    icon: 'heart',
                    iconSet: 'regular',
                    content: '<p>Almost half of all our undergrads receive need-based financial aid.</p>'
                },
                {
                    icon: 'calculator', 
                    iconSet: 'solid',
                    content: '<p>Families earning less than $100,000 with typical assets pay no tuition or room and board.</p>'
                },
                {
                    icon: 'hippo',
                    iconSet: 'solid', 
                    content: '<p>Families earning less than $150,000 with typical assets pay no tuition.</p>'
                }
            ];

            // Ensure each fact has default content
            facts = facts.map(fact => ({
                ...fact,
                content: fact.content || '<p>Add fact content</p>'
            }));

            // Add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            // top level keys match the data-se attributes found in the template eg data-se="eyebrow"
            // the field values are the component data fields eg data-sq-field="eyebrow"
            squizEditTargets = {
                "eyebrow": {
                    "field": "eyebrow"
                },
                "title": {
                    "field": "title"
                },
                "content": {
                    "field": "facts",
                    "array": true,
                    "property": "content"
                }
            };
        }

        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check
        if (!squizEdit) {
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
        }

        // Prepare component data for template rendering
        const componentData = {
            title,
            eyebrow,
            facts,
            paddingY,
        }

        // Return original front end code when squizEdit is false, without modification
        if (!squizEdit) return multicolumnFactPanelTemplate(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processEditor(multicolumnFactPanelTemplate(componentData), squizEditTargets);
    }
};
