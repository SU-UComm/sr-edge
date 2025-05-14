import factCalloutTemplate from './fact-callout.hbs';

/**
 * Fact callout Component - A Handlebars template component that renders a fact callout
 * @module factCallout
 */
export default {
    /**
     * Renders the Fact Callout component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.displayConfiguration - The display configuration for the component.
     * @param {string} [args.displayConfiguration.icon] - The icon type the "pie chart" or the "bar graph" to choose (optional).
     * @param {string} [args.displayConfiguration.factText] - The description of a fact (optional).
     * @param {string} [args.displayConfiguration.indicatorPosition] - The position of indicator "top" or "bottom" (optional).
     * @param {string} [args.displayConfiguration.width] - The width of component "wide" or "narrow" (optional).
     * @returns {Promise<string>} The rendered Fact callout HTML or an error message.
     */
    async main(args) { 
        // Extracting configuration data from arguments
        const { icon, factText, indicatorPosition, width } = args?.displayConfiguration || {};

        // Validate required fields and ensure correct data types
        try {
            if (!['pie chart', 'bar graph'].includes(icon) ) {
                throw new Error(
                    `The "icon" field must be one of ["pie chart", "bar graph"]. The ${JSON.stringify(icon)} was received.`
                );
            }
            if (factText && typeof factText !== 'string') {
                throw new Error(`The "factText" field must be a string type. The ${JSON.stringify(factText)} was received.`);
            }
            if (!['top', 'bottom'].includes(indicatorPosition) ) {
                throw new Error(
                    `The "indicatorPosition" field must be one of ["top", "bottom"]. The ${JSON.stringify(indicatorPosition)} was received.`
                );
            }
            if (!['Wide', 'Narrow'].includes(width) ) {
                throw new Error(
                    `The "width" field must be one of ["Wide", "Narrow"]. The ${JSON.stringify(width)} was received.`
                );
            }
        } catch (err) {
            console.error('Error occurred in the Fact callout component:', err);
            return `<!-- Error occurred in the Fact callout component: ${err.message} -->`;
        }
        
        // Prepare component data for template rendering
        const props = {
            indicatorPosition,
            width: width.toLowerCase(),
            factText,
            icon,
        };

        return factCalloutTemplate(props);
    }
};
