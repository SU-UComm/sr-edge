import contentTemplate from './subscribe-to-stanford.hbs';

/**
 * A module for rendering a content component using a Handlebars template.
 * @module ContentComponent
 */
export default {
    /**
     * Renders content based on provided configuration data.
     * @async
     * @param {Object} args - Arguments containing content configuration.
     * @param {Object} args.contentConfiguration - Configuration for the content component.
     * @param {string} [args.contentConfiguration.actionLink=""] - The URL for an action link.
     * @param {string} [args.contentConfiguration.title=""] - The title of the content.
     * @param {string} [args.contentConfiguration.summary=""] - A summary or description of the content.
     * @returns {Promise<string>} The rendered HTML string from the content template.
     * @throws {Error} If args or contentConfiguration is invalid, or if template rendering fails.
     */
    async main(args) {
        try {
            // Validate args
            if (typeof args !== 'object' || args === null) {
                throw new Error('args must be an object');
            }

            // Validate contentConfiguration
            if (!args.contentConfiguration || typeof args.contentConfiguration !== 'object') {
                throw new Error('contentConfiguration must be an object');
            }

            const { 
                actionLink,
                title, 
                summary = ""
            } = args.contentConfiguration;

            // Type checks for destructured properties
            if (typeof actionLink !== 'string' || !actionLink) {
                throw new Error('actionLink must be a string');
            }
            if (typeof title !== 'string') {
                throw new Error('title must be a string');
            }

            const componentData = {
                actionLink,
                title,
                summary
            };

            // Render the template
            return contentTemplate(componentData);
        } catch (err) {
            return `<!-- Error rendering content: ${err.message} -->`;
        }
    }
};