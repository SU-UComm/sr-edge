import { processEditor } from '../../global/js/utils/processEditor';
import acknowledgement from './acknowledgement.hbs';


/**
 * Acknowledgement component that renders a formatted acknowledgment message.
 */
export default {
    /**
     * Renders the Acknowledgement component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {string} args.title - The title of the acknowledgment.
     * @param {string} args.content - The content of the acknowledgment.
     * @returns {Promise<string>} The rendered acknowledgment HTML or an error message.
     */
    async main( args, info ) {
        // Extracting configuration data from arguments

        // CHANGE:change const to let so we can modify later for squizEdit default values
        let { title, content } = args || {};

        // NEW: squizEdit is a boolean that indicates if the component is being edited in Squiz Editor Must fallback to false, 
        // use true to mock the editor
        const squizEdit = info?.ctx?.editor || false;
        // NEW: squizEditTargets is an object that contains the targets for the squizEdit DOM augmentation
        let squizEditTargets = null;
        // NEW: add a default if squizEdit is true
        if (squizEdit) {
            // add default values if content is not provided
            content = content || '<p>Add content</p>';

            // add the targets for the squizEdit DOM augmentation
            // used in processSquizEdit to modify the output to add edit markup
            // top level keys match the data-se attributes found in the template eg data-se="title"
            // the field values are the component data fields eg data-sq-field="title"
            // this method allows us to target shared utilities in the template as they will have different sq-field values
            squizEditTargets = {
                "title": {
                    "field": "title"
                },
                "ct": {
                    "field": "content"
                },
                "couldbeArray": {
                    "field": "card",
                    "array": true,
                    "property": "title"
                }
            };
        }
        // NEW: remove overly stringent validation where it makes sense
        // if it is to remain, wrap it in a !squizEdit check

        // Original code - do not modify.
        // Prepare component data for template rendering
        const componentData = {
            title,
            content,
            width: "narrow"
        };

        // return original front end code when squizEdit is false, without modification
        if (!squizEdit) return acknowledgement(componentData);

        // NEW: process the output to be editable in Squiz Editor
        return processEditor(acknowledgement(componentData), squizEditTargets);
    },
};