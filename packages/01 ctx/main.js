import { isEditor } from "../../global/js/utils/isEditor";

/**
 * A module that generates HTML output displaying context information, including asset ID, URL, and editor preview mode status.
 *
 * @module CtxTestComponent
 * @returns {Object} An object containing the main function for rendering the component.
 */
export default {
    /**
     * Asynchronously generates HTML output based on the provided context, including asset ID, URL, and whether the editor preview mode is active.
     *
     * @async
     * @function main
     * @param {Object} args - Arguments passed to the component (not used in this implementation).
     * @param {Object} info - Information object containing the context.
     * @param {Object} info.ctx - The context object containing asset ID and URL.
     * @param {string} [info.ctx.assetId] - The ID of the asset.
     * @param {string} [info.ctx.url] - The URL to check for editor preview mode.
     * @returns {Promise<string>} A promise that resolves to an HTML string containing context details or an error message if an error occurs.
     * @throws {Error} If an error occurs while processing the context or generating the output.
     * @example
     * const args = {};
     * const info = {
     *   ctx: {
     *     assetId: "170047",
     *     url: "https://example.com?SQ_ACTION=preview"
     *   }
     * };
     */
    async main( args, info ) {
        try {
            const { ctx } = info;
            const editMode = isEditor(ctx);

            const output = `
                <div>
                    <ul>
                        <li>AssetId: ${ctx.assetId}</li>
                        <li>URL: ${ctx.url}</li>
                        <li>Edit Mode: ${editMode}</li>
                    </ul>
                </div>
            `;

            return output
        } catch (error) {
            return `<!-- An error occured in ctx-test component: ${error.message} -->`;
        }

    }
};