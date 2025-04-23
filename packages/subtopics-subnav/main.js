import subtopicsSubnavTemplate from './subtopics-subnav.hbs';

/**
 * A module for rendering a subtopics subnav component using Handlebars and front end js
 * @module SubtopicsSubnav
 * @param {Object} args - Configuration data for the Subtopics Subnav component.
 * @param {string} [args.title] - The title of the Subtopics Subnav.
 * @param {string} [args.parent] - The parent asset of the Subtopics Subnav.
 */

export default {
     /**
     * Renders the Subtopics Subnav component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {string} args.title - The title of the component to display above list
     * @param {object} args.parent - The parent asset for the component header
     * @param {boolean} args.isTopLevel - The flag to show top level
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args) {
        // Extracting configuration data from arguments
        const { title, parent, isTopLevel } = args || {};

        // Validate required fields and ensure correct data types
        try {
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
            if (parent && typeof parent !== 'object') {
                throw new Error(
                    `The "parent" field must be an object. The ${JSON.stringify(parent)} was received.`
                );
            }
            if (isTopLevel && typeof isTopLevel !== 'boolean') {
                throw new Error(
                    `The "isTopLevel" field must be a boolean. The ${JSON.stringify(isTopLevel)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Subtopics Subnav component: ', er);
            return `<!-- Error occurred in the Subtopics Subnav component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            width: 'large',
            title,
            parent,
            isTopLevel: `${isTopLevel}`,
            showTopLevel: isTopLevel !== null && isTopLevel !== undefined
        };

        return subtopicsSubnavTemplate(componentData);
    }
};
