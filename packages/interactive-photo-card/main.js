import interactivePhotoCard from './interactive-photo-card.hbs';
import { basicAssetUri } from '../../global/js/utils';
import { processEditor } from '../../global/js/utils/processEditor';

/**
 * Interactive photo card component that renders a image and content side by side.
 */
export default {
    /**
     * Renders the Interactive photo card component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {string} args.title - The title text for card.
     * @param {string} args.content - The content text for card .
     * @param {string} args.image - The image to display aside card.
     * @param {string} args.imageAlignment - The flag specifying image alignment.
     * @param {string} [args.eyebrow] - The text to display above card title (optional).
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
     */
    async main(args, info) {
        // Extracting functions from provided info
        const componentFunctions = info?.fns || null;
        const componentContext = info?.ctx || null;
        const fnsCtx = componentFunctions || componentContext || {}; // for backward compatibility

        // CHANGE: change const to let for mutability
        let { title, eyebrow, content, image, imageAlignment, alwaysDark } =
            args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;

        if (squizEdit) {
            // Provide default values for inline editable fields
            title = title || 'Title text';
            eyebrow = eyebrow || 'Eyebrow text';
            content = content || 'Add content';

            // Provide default image for edit mode
            image = image || 'matrix-asset://StanfordNews/172387';

            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                title: { field: 'title' },
                eyebrow: { field: 'eyebrow' },
                content: { field: 'content' },
            };
        }

        // Validate required functions - CHANGE: wrap in !squizEdit check
        try {
            if (
                !squizEdit &&
                (typeof fnsCtx !== 'object' ||
                    typeof fnsCtx.resolveUri === 'undefined')
            ) {
                throw new Error(
                    `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`,
                );
            }
        } catch (er) {
            console.error(
                'Error occurred in the Interactive photo card component: ',
                er,
            );
            return `<!-- Error occurred in the Interactive photo card component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
            try {
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
                if (typeof image !== 'string' || image === '') {
                    throw new Error(
                        `The "image" field cannot be undefined and must be a non-empty string. The ${JSON.stringify(image)} was received.`,
                    );
                }
                if (eyebrow && typeof eyebrow !== 'string') {
                    throw new Error(
                        `The "eyebrow" field must be a string. The ${JSON.stringify(eyebrow)} was received.`,
                    );
                }
                if (
                    imageAlignment &&
                    !['left', 'right'].includes(imageAlignment)
                ) {
                    throw new Error(
                        `The "imageAlignment" field cannot be undefined and must be one of ["left", "right"]. The ${JSON.stringify(imageAlignment)} was received.`,
                    );
                }
            } catch (er) {
                console.error(
                    'Error occurred in the Interactive photo card component: ',
                    er,
                );
                return `<!-- Error occurred in the Interactive photo card component: ${er.message} -->`;
            }
        }

        // Getting image data
        let imageData = null;
        try {
            imageData = await basicAssetUri(info.fns, image);
        } catch (er) {
            console.error(
                'Error occurred in the Interactive photo card component: Failed to fetch image data. ',
                er,
            );
            // NEW: In edit mode, provide mock image data
            if (squizEdit) {
                imageData = {
                    url: 'https://news.stanford.edu/_designs/component-service/editorial/placeholder.png',
                    attributes: {
                        allow_unrestricted: false,
                        size: 1858005,
                        height: 960,
                        width: 1440,
                        title: 'placeholder.png',
                        name: 'placeholder.png',
                        caption: '',
                        alt: 'This is a placeholder',
                    },
                };
            } else {
                return `<!-- Error occurred in the Interactive photo card component: Failed to fetch image data. ${er.message} -->`;
            }
        }

        // Prepare component data for template rendering
        const componentData = {
            title: title,
            eyebrow: eyebrow,
            content: content,
            imageUrl: imageData?.url,
            contentAlignmentClass:
                imageAlignment === 'left' ? 'xl:su-order-2' : '',
            imageAlignmentClass:
                imageAlignment === 'left' ? 'xl:su-order-first' : '',
            iconPlusClasses: `su-size-30 md:su-size-50 su-fill-none group-hover:su-scale-110 group-focus-within:su-scale-110 su-transition-transform ${alwaysDark ? '[&_path]:su-fill-black-true' : 'su-fill-none'}`,
            iconArrowClasses:
                'su-size-30 lg:su-size-36 su-fill-none aria-hidden:invisible group-hocus:su-rotate-45 su-transition-transform',
            alwaysDark: alwaysDark,
            squizEdit: squizEdit
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processEditor(
                interactivePhotoCard(componentData),
                squizEditTargets,
                args,
            );
        }

        return interactivePhotoCard(componentData);
    },
};
