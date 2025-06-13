import xss from "xss";
import inBriefTemplate from "./in-brief.hbs";
import { processSquizEdit } from '../../global/js/utils/isEditor';

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
        
        // CHANGE: change const to let for mutability
        let { points } = args || {};

        // NEW: Detect edit mode
        const squizEdit = info?.ctx?.editor || false;
        let squizEditTargets = null;
        
        if (squizEdit) {
            // Provide default values for inline editable fields
            points = points && points.length > 0 ? points : [
                'This is the first sample summary point that can be edited inline',
                'This is the second sample summary point demonstrating the functionality',
                'This is the third sample summary point showing array-based inline editing'
            ];
            
            // Configure edit targets - maps static data-se attributes to component fields
            squizEditTargets = {
                "point": {
                    "field": "points",
                    "array": true
                }
            };
        }
        
        // setting the limit of items
        const numberOfItems = 5;

        // Environment validation - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        // Validate required fields and ensure correct data types - CHANGE: wrap in !squizEdit check
        if (!squizEdit) {
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
        }

        const items = points.map(item => xss(item)).slice(0, numberOfItems);

        const componentData = {
            points: items,
            width: "narrow"
        };

        // NEW: Early return pattern for edit mode
        if (squizEdit) {
            return processSquizEdit(inBriefTemplate(componentData), squizEditTargets, args);
        }

        return inBriefTemplate(componentData);
    }
}