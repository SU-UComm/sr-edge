import { uuid } from '../../utils';
import { svgIcons } from "../SVG-library";

/**
 * Creates a modal dialog (server-side only)
 * 
 * @param {string} uniqueId - unique ID modal container
 * @param {string} content - Modal content
 * @param {string} titleId - ID for aria-describedby
 * @param {string} title - Modal title
 * @returns {string} HTML string of the modal
 */
export function Modal({ uniqueId = "", content, title, titleId="image-gallery-modal" }) {
    let hashId = uniqueId || uuid();

    return `
    <div hidden aria-modal="true" role="dialog" data-overlay-container="true" class="su-modal su-hidden" data-modal="modal" data-modal-id="${hashId}">
        ${!titleId && title ? `<h2>${title}</h2>` : ''}
        <span data-focus-scope-start="true" hidden=""></span>
        <div aria-describedby="${titleId}" role="dialog" tabindex="-1" data-modal="modal-dialog" data-ismodal="true" aria-modal="true">
            <div class="su-modal-content">
            ${content}
            </div>
        </div>
        <button type="button" class="su-component-close su-text-center" data-dismiss="modal">
            ${svgIcons["close"]()}
            <span>Close</span>
        </button>
        <span data-focus-scope-end="true" hidden=""></span>
    </div>`;
};

export default Modal;