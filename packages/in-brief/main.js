import xss from "xss";
import inBriefTemplate from "./in-brief.hbs";

/**
 * A module for rendering an in breif with bullet items.
 * @module InBrief
 */
export default {
    /**
     * Renders the In breif component.
     *
     * @async
     * @function
     * @param {Object} args - The arguments for the component.
     * @param {Object} args.points - The bullet points items.
     * @param {Object} info - Context information for the component.
     * @param {Object} info.fns - Functions available in the execution context.
     * @param {Function} info.fns.resolveUri - Function to resolve URIs.
     * @returns {Promise<string>} The rendered campaign CTA HTML or an error message.
    */
    async main(args, info) {
        // Extracting functions from provided info
        const fnsCtx = info?.fns || info?.ctx || {};
        
        // Extracting configuration data from arguments
        const { points } = args || {};
        
        // setting the limit of items
        const numberOfItems = 5;

        try {
            if (typeof fnsCtx !== 'object' || typeof fnsCtx.resolveUri === 'undefined') {
                throw new Error(
                `The "info.fns" cannot be undefined or null. The ${JSON.stringify(fnsCtx)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the In Brief component: ', er);
            return `<!-- Error occurred in the In Brief component: ${er.message} -->`;
        }

        // Validate required fields and ensure correct data types
        try {
            if (!Array.isArray(points) || points.length < 1) {
                throw new Error(
                    `The "points" field must be an array and cannot be empty. The ${JSON.stringify(points)} was received.`
                );
            }
        } catch (er) {
            console.error('Error occurred in the In Brief component: ', er);
            return `<!-- Error occurred in the In Brief component: ${er.message} -->`;
        }

        const items = points.map(item => xss(item)).slice(0, numberOfItems);

        const componentData = {
            points: items,
            width: "narrow"
        };

        return inBriefTemplate(componentData);
    }
}