import linkListTemplate from './link-list.hbs';

/**
 * A module for rendering a link list component using Handlebars and front end js
 * @module LinkList
 * @param {Object} args - Configuration data for the link list component.
 * @param {string} [args.title] - The title of the link list (passed to SidebarHeading).
 */

export default {
     /**
     * Renders the Link list component.
     * 
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.dataUrl - The data source for link list
     * @param {Object} args.title - The title of the component to display above list
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args) {
         // Extracting configuration data from arguments
         const { dataUrl, title } = args || {};

        // Validate required fields and ensure correct data types
        try {
            if (typeof dataUrl !== 'string' || dataUrl === '' || dataUrl === '?') {
                throw new Error(
                    `The "dataUrl" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(dataUrl)} was received.`
                );
            }
            if (typeof title !== 'string' || title === '') {
                throw new Error(
                    `The "title" field cannot be undefined and must be a string. The ${JSON.stringify(title)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the Link List component: ', er);
            return `<!-- Error occurred in the Link List component: ${er.message} -->`;
        }

        // Prepare component data for template rendering
        const componentData = {
            dataUrl,
            title
        };

        return linkListTemplate(componentData);
    }
};
