import xss from 'xss';
import { containerClasses } from '../../global/js/utils';
import singleTextBlockTemplate from './single-text-block.hbs';

/**
 * A module for rendering a Single Text Block section with a title, eyebrow, and description.
 * @module SingleTextBlock
 */
export default {
    /**
     * Renders a Single Text Block component with the provided arguments.
     *
     * @async
     * @function
     * @param {Object} [args] - The arguments for rendering the component
     * @param {string} [args.title=""] - The main title of the text block
     * @param {string} [args.eyebrow=""] - The eyebrow text displayed above the title
     * @param {string} [args.description=""] - The description content of the text block
     * @param {string} [args.paddingY="10"] - The vertical padding value (in rem units)
     * @returns {Promise<string>} The rendered HTML string or an error message
     */
    async main(args) {
        const {
            title = '',
            eyebrow = '',
            description = '',
            paddingY = '10',
        } = args || {};

        try {
            // Basic validation
            if (title && typeof title !== 'string') {
                throw new Error(
                    `The "title" field must be a string. The ${JSON.stringify(title)} was received.`,
                );
            }

            if (eyebrow && typeof eyebrow !== 'string') {
                throw new Error(
                    `The "eyebrow" field must be a string. The ${JSON.stringify(eyebrow)} was received.`,
                );
            }

            if (description && typeof description !== 'string') {
                throw new Error(
                    `The "description" field must be a string. The ${JSON.stringify(description)} was received.`,
                );
            }

            if (paddingY && typeof paddingY !== 'string') {
                throw new Error(
                    `The "paddingY" field must be a string. The ${JSON.stringify(paddingY)} was received.`,
                );
            }
        } catch (er) {
            console.error(
                'Error occurred in the Single Text Block component: ',
                er,
            );
            return `<!-- Error occurred in the Single Text Block component: ${er.message} -->`;
        }

        const componentData = {
            containerClass: containerClasses({ width: 'cc', paddingY }),
            eyebrow,
            title,
            description: xss(description),
        };

        return singleTextBlockTemplate(componentData);
    },
};
