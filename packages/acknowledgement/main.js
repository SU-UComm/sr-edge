import { isEditor } from "../../global/js/utils/isEditor";
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
        const { ctx } = info;
        const editMode = isEditor(ctx);

        // Extracting configuration data from arguments
        const { title, content } = args || {};

        // Validate required fields and ensure correct data types
        try {
            if(!editMode){
                if (typeof title !== 'string' || title === '') {
                    throw new Error(
                        `The "title" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(title)} was received.`,
                    );
                }
                if (typeof content !== 'string' || content === '') {
                    throw new Error(
                        `The "content" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(content)} was received.`,
                    );
                }
            }
        } catch (er) {
            console.error('Error occurred in the Acknowledgement component: ', er);
            return `<!-- Error occurred in the Acknowledgement component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            title,
            content,
            width: "narrow"
        };

        return acknowledgement(componentData);
    },
};