import xss from 'xss';
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
     * @param {string} [args.contentConfiguration.actionLink] - The URL for an action link.
     * @param {string} [args.contentConfiguration.title] - The title of the content.
     * @param {string} [args.contentConfiguration.summary] - A summary or description of the content.
     * @returns {Promise<string>} The rendered HTML string from the content template.
     * @throws {Error} If args or contentConfiguration is invalid, or if template rendering fails.
     */
    async main(args) {
        const { actionLink, title, summary } = args?.contentConfiguration || {};

        try {
            if (typeof actionLink !== 'string' || actionLink === "") {
                throw new Error(
                    `The "actionLink" field must be a non empty string. The ${JSON.stringify(actionLink)} was received.`
                );
            }

            if (typeof title !== 'string' || title === "") {
                throw new Error(
                    `The "title" field must be a non empty string. The ${JSON.stringify(title)} was received.`
                );
            }

            if (summary !== undefined && typeof summary !== 'string') {
                throw new Error(
                    `The "summary" field must be a string. The ${JSON.stringify(summary)} was received.`
                );
            }
        } catch (err) {
            return `<!-- Error rendering content: ${err.message} -->`;
        }

        const componentData = {
            actionLink,
            title: xss(title),
            summary: xss(summary)
        };

        return contentTemplate(componentData);
    }
};