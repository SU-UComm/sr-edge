import xss from 'xss';
import { processEditor } from '../../global/js/utils/processEditor';
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
     * @param {Object} info - Context information for the component.
     * @returns {Promise<string>} The rendered HTML string or an error message
     */
    async main(args, info) {
        let {
            title = '',
            eyebrow = '',
            description = '',
            paddingY = '10',
        } = args || {};

        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            title = title || 'Sample Title';
            description = description || '<p>This is a sample description that can be edited inline to provide content for the text block.</p>';
            
            eyebrow = eyebrow || 'Sample Eyebrow';
            paddingY = paddingY || '10';
            
            squizEditTargets = {
                "title": { "field": "title" },
                "description": { "field": "description" }
            };
        }

        if (!squizEdit) {
            try {
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
        }

        const componentData = {
            paddingY,
            eyebrow,
            title,
            description: xss(description),
        };

        if (!squizEdit) return singleTextBlockTemplate(componentData);

        return processEditor(singleTextBlockTemplate(componentData), squizEditTargets);
    },
};
