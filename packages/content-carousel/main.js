import xss from "xss";
import contentCarousel from './content-carousel.hbs';
import { uuid } from "../../global/js/utils";

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
    async main(args) {
        // Extracting configuration data from arguments
        const { title, slides } = args || {};

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

        return contentCarousel(componentData);
    }
};