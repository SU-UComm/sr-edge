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
        let { title, content } = args || {};

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        if (squizEdit) {
            // add default values if content is not provided
            content = content || '<p>Add content</p>';

            squizEditTargets = {
                "title": {
                    "field": "title"
                },
                "content": {
                    "field": "content"
                }
            };
        }

        const componentData = {
            title,
            content,
            width: "narrow"
        };

        // return frontend code
        if (!squizEdit) return acknowledgement(componentData);

        // return edit code
        return processEditor(acknowledgement(componentData), squizEditTargets);
    },
};