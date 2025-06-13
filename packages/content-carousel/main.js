import xss from "xss";
import contentCarousel from './content-carousel.hbs';
import { uuid } from "../../global/js/utils";
import { processSquizEdit } from '../../global/js/utils/isEditor';

/**
 * Content Carousel component that displays a series of slides with proper sanitization and error handling.
 * @module ContentCarousel
 */
export default {
    /**
     * Main entry point for the Content Carousel component.
     *
     * @async
     * @function
     * @param {Object} args - Component arguments
     * @param {string} [args.title] - The title for the carousel
     * @param {Array} [args.slides] - Array of slide objects
     * @param {string} args.slides[].content - Content for each slide
     * @returns {Promise<string>} Rendered carousel HTML or error message
     */
    async main(args, info) {
        // CHANGE: change const to let for mutability
        let { title, slides } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Add default values if not provided
            title = title || 'Content Carousel';
            slides = slides && slides.length > 0 ? slides : [
                { content: '<p>First slide content goes here.</p>' },
                { content: '<p>Second slide content goes here.</p>' }
            ];
            
            // Ensure each slide has default content
            slides = slides.map(slide => ({
                ...slide,
                content: slide.content || '<p>Add your content here.</p>'
            }));
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "title": {
                    "field": "title"
                },
                "content": {
                    "field": "slides",
                    "array": true,
                    "property": "content"
                }
            };
        }

        // NEW: Wrap validation in !squizEdit check
        if (!squizEdit) {
            // Validate required fields and ensure correct data types
            try {
                if (title && typeof title !== 'string') {
                    throw new Error(
                        `The "title" field must be a string. Received: ${JSON.stringify(title)}`
                    );
                }
                if (!Array.isArray(slides) || slides.length < 1) {
                    throw new Error(
                        `The "slides" array must have at least one item. Received length: ${slides.length}`
                    );
                }
            } catch (err) {
                console.error('Error occurred in the Content Carousel component:', err);
                return `<!-- Error occurred in the Content Carousel component: ${err.message} -->`;
            }
        }

        // Prepare data for slides
        slides.map(item => {
            item.content = xss(item.content);

            return item;
        });

        // Prepare component data for template rendering
        const componentData = {
            id: uuid(),
            title,
            slides,
            width: "narrow"
        };

        // NEW: Early return pattern
        if (!squizEdit) return contentCarousel(componentData);

        // NEW: Process for edit mode
        return processSquizEdit(contentCarousel(componentData), squizEditTargets);
    }
};